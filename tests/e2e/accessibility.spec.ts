import { expect, test, type Locator, type Page } from "@playwright/test";

async function tabTo(page: Page, target: Locator) {
  for (let count = 0; count < 80; count++) {
    if (await target.evaluate((element) => element === document.activeElement)) {
      expect(await target.evaluate((element) => { const style = getComputedStyle(element); return style.outlineStyle !== "none" && parseFloat(style.outlineWidth) >= 2; })).toBe(true);
      return;
    }
    await page.keyboard.press("Tab");
  }
  throw new Error(`Контрол недоступен через Tab: ${await target.getAttribute("aria-label") ?? await target.textContent()}`);
}

test("M5: responsive, имена контролов, touch targets, контраст и reflow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Все размеры проверяются в одном проходе");
  test.setTimeout(60_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/cart");
  await page.evaluate(() => localStorage.setItem("season-cart:v1", JSON.stringify({ version: 1, items: [{ productId: "first-light", variantId: "first-light-s", quantity: 2, greetingCard: true }] })));
  const routes = ["/", "/shop", "/shop/first-light", "/shop/tulips-white", "/collections/morning-garden", "/cart", "/checkout", "/about", "/delivery-care"];
  const issues: string[] = [];
  const session = await page.context().newCDPSession(page);
  for (const width of [320, 390, 768, 1024, 1440, 720]) {
    await page.setViewportSize({ width, height: width === 720 ? 500 : 1000 });
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      if (route === "/checkout") await expect(page.getByRole("form")).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const findings = await page.evaluate(() => {
        const failures: string[] = [];
        const visible = (element: Element) => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden";
        if (document.documentElement.scrollWidth > innerWidth + 1) failures.push("горизонтальная прокрутка страницы");
        for (const element of document.querySelectorAll("button, input:not([type=hidden]), textarea, h1, h2, h3, p, label")) {
          if (!visible(element)) continue;
          const rect = element.getBoundingClientRect();
          if (rect.left < -1 || rect.right > innerWidth + 1) failures.push(`обрезан ${element.tagName}: ${element.textContent?.trim().slice(0, 70)}`);
          for (const attribute of ["aria-labelledby", "aria-describedby"]) {
            for (const id of (element.getAttribute(attribute) ?? "").split(/\s+/).filter(Boolean)) if (!document.getElementById(id)) failures.push(`не найден ${attribute}=${id}`);
          }
          if (element.matches("button, input:not([type=hidden])")) {
            const target = element.closest("label") ?? element;
            const bounds = target.getBoundingClientRect();
            if (bounds.width < 43.5 || bounds.height < 43.5) failures.push(`маленький target ${element.getAttribute("aria-label") ?? target.textContent?.trim().slice(0, 50)}: ${bounds.width}×${bounds.height}`);
          }
        }
        const luminance = (color: string) => {
          const values = color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
          if (!values || values.length !== 3) return 1;
          const linear = values.map((value) => { const channel = value / 255; return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4; });
          return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
        };
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const node = walker.currentNode;
          const element = node.parentElement;
          if (!element || !node.textContent?.trim() || !visible(element) || element.closest("script,style,[disabled],[aria-disabled=true],.skip-link")) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          if ([...range.getClientRects()].some((rect) => rect.left < -1 || rect.right > innerWidth + 1)) failures.push(`обрезан текст: ${node.textContent.trim().slice(0, 55)}`);
          const style = getComputedStyle(element);
          let background = "rgb(250, 249, 245)";
          for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement) {
            const color = getComputedStyle(ancestor).backgroundColor;
            if (color !== "rgba(0, 0, 0, 0)" && color !== "transparent") { background = color; break; }
          }
          const fg = luminance(style.color), bg = luminance(background);
          const ratio = (Math.max(fg, bg) + .05) / (Math.min(fg, bg) + .05);
          const size = parseFloat(style.fontSize);
          const minimum = size >= 24 || size >= 18.66 && parseInt(style.fontWeight) >= 700 ? 3 : 4.5;
          if (ratio + .01 < minimum) failures.push(`контраст ${ratio.toFixed(2)}: ${node.textContent.trim().slice(0, 55)}`);
        }
        return [...new Set(failures)];
      });
      issues.push(...findings.map((finding) => `${width} ${route}: ${finding}`));
      if (width === 390 || width === 1440) {
        const tree = await session.send("Accessibility.getFullAXTree");
        const unnamed = tree.nodes.filter((node) => !node.ignored && ["button", "link", "textbox", "combobox", "checkbox", "radio", "spinbutton"].includes(node.role?.value ?? "") && !node.name?.value);
        issues.push(...unnamed.map((node) => `${width} ${route}: нет доступного имени (${node.role?.value})`));
      }
      if ([390, 768, 1440].includes(width) && ["/", "/shop/first-light", "/checkout"].includes(route)) {
        await page.locator("main img").first().waitFor({ state: "visible" });
        await page.screenshot({ path: testInfo.outputPath(`${width}-${route === "/" ? "home" : route === "/checkout" ? "checkout" : "product"}.png`), fullPage: true });
      }
    }
  }
  expect(issues).toEqual([]);
  expect(errors).toEqual([]);
});

test("M5: весь путь товар → корзина → checkout только с клавиатуры", async ({ page }) => {
  await page.goto("/shop/first-light");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "К содержимому" })).toBeFocused();
  await page.keyboard.press("Enter");
  const nextPhoto = page.getByRole("button", { name: "Следующее фото" });
  await tabTo(page, nextPhoto);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status", { name: "Номер фотографии" })).toHaveText("2 / 3");
  const small = page.getByRole("radio", { name: /^S / });
  await tabTo(page, small);
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: /^M / })).toBeChecked();
  await expect(page.getByRole("button", { name: "В корзину", exact: true })).toBeDisabled();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: /^L / })).toBeChecked();
  await tabTo(page, page.getByRole("checkbox", { name: "Добавить открытку" }));
  await page.keyboard.press("Space");
  await tabTo(page, page.getByRole("button", { name: "В корзину", exact: true }));
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status", { name: "Добавление в корзину" })).toContainText("добавлен");
  await tabTo(page, page.getByRole("link", { name: "Перейти в корзину", exact: true }));
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/cart$/);
  const increase = page.getByRole("button", { name: /^Увеличить/ });
  await tabTo(page, increase);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status", { name: "Количество", exact: true })).toHaveText("2");
  await tabTo(page, page.getByRole("button", { name: /^Уменьшить/ }));
  await page.keyboard.press("Enter");
  await tabTo(page, page.getByRole("link", { name: "Демонстрационное оформление", exact: true }));
  await page.keyboard.press("Enter");
  const finish = page.getByRole("button", { name: "Завершить демонстрацию" });
  await tabTo(page, finish);
  await page.keyboard.press("Enter");
  const date = page.getByRole("combobox", { name: "Дата", exact: true });
  await expect(date).toBeFocused();
  const description = await date.getAttribute("aria-describedby");
  expect(description).toBeTruthy();
  await expect(page.locator(`[id="${description}"]`)).toContainText("дат");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("combobox", { name: "Интервал", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Имя получателя", { exact: true })).toBeFocused();
  await page.keyboard.type("Demo recipient");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Телефон", { exact: true })).toBeFocused();
  await page.keyboard.type("79991234567");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Адрес", { exact: true })).toBeFocused();
  await page.keyboard.type("Demo address 1");
  await tabTo(page, finish);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Демонстрация завершена" })).toBeFocused();
});

test("M5: mobile modal удерживает focus; reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/shop");
  for (const [triggerName, dialogName] of [["Открыть меню", "Навигация"], ["Фильтры", "Фильтры каталога"]]) {
    const trigger = page.getByRole("button", { name: triggerName, exact: true });
    await tabTo(page, trigger);
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: dialogName });
    await expect(dialog).toBeVisible();
    const count = await dialog.locator("a, button, input").count();
    for (let index = 0; index < count + 2; index++) {
      await page.keyboard.press("Tab");
      expect(await dialog.evaluate((element) => element.contains(document.activeElement)), `${dialogName}, Tab ${index + 1}: ${await page.evaluate(() => document.activeElement?.outerHTML.slice(0, 200))}`).toBe(true);
    }
    const first = dialog.getByRole("button", { name: `Закрыть: ${dialogName}` });
    await tabTo(page, first);
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.locator("a, button, input").last()).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(first).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  }
  const sort = page.getByRole("combobox", { name: "Сортировка", exact: true });
  await tabTo(page, sort);
  await page.keyboard.press("Enter");
  expect(await sort.locator("svg").evaluate((element) => getComputedStyle(element).transitionDuration)).toBe("0s");
  await page.keyboard.press("Escape");
});
