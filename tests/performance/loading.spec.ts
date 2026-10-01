import { expect, test } from "@playwright/test";

declare global {
  interface Window {
    releaseVitals: { lcp: number; candidate: string; cls: number; shifts: { time: number; value: number }[]; interactionDurations: number[] };
  }
}

for (const route of ["/", "/shop", "/shop/first-light"]) {
  test(`mobile lab ${route}`, async ({ page }, testInfo) => {
    await page.addInitScript(() => {
      window.releaseVitals = { lcp: 0, candidate: "", cls: 0, shifts: [], interactionDurations: [] };
      if (PerformanceObserver.supportedEntryTypes.includes("event")) {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as (PerformanceEntry & { interactionId?: number })[]) if (entry.interactionId) window.releaseVitals.interactionDurations.push(entry.duration);
        }).observe({ type: "event", buffered: true, durationThreshold: 16 } as PerformanceObserverInit);
      }
      new PerformanceObserver((list) => {
        const entry = list.getEntries().at(-1) as PerformanceEntry & { element?: Element };
        window.releaseVitals.lcp = entry.startTime;
        window.releaseVitals.candidate = entry.element instanceof HTMLImageElement ? entry.element.currentSrc : `${entry.element?.tagName}.${entry.element?.className}`;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as (PerformanceEntry & { hadRecentInput: boolean; value: number })[]) {
          if (!entry.hadRecentInput) window.releaseVitals.shifts.push({ time: entry.startTime, value: entry.value });
        }
        let start = 0, previous = 0, sum = 0, maximum = 0;
        for (const shift of window.releaseVitals.shifts) {
          if (shift.time - previous > 1000 || shift.time - start > 5000) { start = shift.time; sum = 0; }
          sum += shift.value;
          maximum = Math.max(maximum, sum);
          previous = shift.time;
        }
        window.releaseVitals.cls = maximum;
      }).observe({ type: "layout-shift", buffered: true });
    });
    const session = await page.context().newCDPSession(page);
    await session.send("Network.enable");
    await session.send("Network.setCacheDisabled", { cacheDisabled: true });
    await session.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 1_600_000 / 8, uploadThroughput: 750_000 / 8 });
    await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.goto(route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await expect.poll(() => page.evaluate(() => window.releaseVitals.lcp)).toBeGreaterThan(0);
    const metrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      const images = resources.filter((entry) => entry.name.includes("/images/") || entry.name.includes("/_next/image"));
      return {
        ...window.releaseVitals,
        transferBytes: resources.reduce((total, entry) => total + entry.transferSize, 0),
        imageBytes: images.reduce((total, entry) => total + entry.transferSize, 0),
        javascriptBytes: resources.filter((entry) => /\.js(?:\?|$)/.test(entry.name)).reduce((total, entry) => total + entry.transferSize, 0),
        fontBytes: resources.filter((entry) => /\.woff2(?:\?|$)/.test(entry.name)).reduce((total, entry) => total + entry.transferSize, 0),
        images: images.map((entry) => ({ url: new URL(entry.name).pathname + new URL(entry.name).search, bytes: entry.transferSize })),
      };
    });
    if (route === "/") await page.getByRole("link", { name: "Все букеты", exact: true }).click();
    else if (route === "/shop") {
      await page.getByRole("combobox", { name: "Сортировка", exact: true }).click();
      await page.getByRole("option", { name: "Цена по возрастанию", exact: true }).click();
    } else await page.getByRole("button", { name: "Следующее фото" }).click();
    await page.waitForLoadState("networkidle");
    const sampleInteractionMs = await page.evaluate(() => Math.max(0, ...window.releaseVitals.interactionDurations));
    const report = { route, profile: "390px/DPR2, cold browser cache, CPU×4, 1.6Mbps/150ms", ...metrics, sampleInteractionMs };
    console.log(JSON.stringify(report));
    await testInfo.attach("mobile-lab.json", { body: JSON.stringify(report, null, 2), contentType: "application/json" });
    expect(metrics.cls).toBeLessThan(.1);
    expect(metrics.imageBytes).toBeLessThan(1_500_000);
    // LCP is reported as lab evidence, not a flaky localhost release gate.
  });
}
