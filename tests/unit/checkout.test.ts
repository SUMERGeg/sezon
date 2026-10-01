import { describe, expect, it } from "vitest";
import { getDemoDates, getCheckoutTotal, validateCheckout } from "../../src/domain/checkout/checkout";

const now = new Date(2026, 11, 30, 14);
const valid = { deliveryMethodId: "courier", date: "2026-12-31", slotId: "morning", recipientName: "Тестовый получатель", phone: "+7 (999) 123-45-67", email: "demo@example.com", address: "Пример адреса, дом 1", greetingMessage: "Тестовая открытка", comment: "Пример комментария" };

describe("demo checkout rules", () => {
  it("generates seven future local dates across a year boundary without mutating now", () => {
    expect(getDemoDates(now).map((date) => date.value)).toEqual(["2026-12-31", "2027-01-01", "2027-01-02", "2027-01-03", "2027-01-04", "2027-01-05", "2027-01-06"]);
    expect(now.getDate()).toBe(30);
  });

  it("adds current demo delivery cost with integer money", () => {
    expect(getCheckoutTotal({ amount: 490000, currency: "RUB" }, "courier")).toEqual({ amount: 540000, currency: "RUB" });
    expect(getCheckoutTotal({ amount: 490000, currency: "RUB" }, "pickup")).toEqual({ amount: 490000, currency: "RUB" });
    expect(getCheckoutTotal({ amount: 490000, currency: "RUB" }, "missing")).toBeNull();
  });

  it("accepts example contacts and normalizes phone/whitespace", () => {
    const result = validateCheckout({ ...valid, recipientName: "  Тестовый получатель  " }, { now, hasGreetingCard: true });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.recipientName).toBe("Тестовый получатель");
      expect(result.data.phone).toBe("79991234567");
    }
  });

  it("requires contacts and courier address with field-specific errors", () => {
    const result = validateCheckout({ ...valid, recipientName: "", phone: "123", email: "bad", address: "" }, { now, hasGreetingCard: true });
    expect(result.success).toBe(false);
    if (!result.success) expect(Object.keys(result.errors)).toEqual(["recipientName", "phone", "email", "address"]);
  });

  it("ignores hidden address/card fields for pickup without a card", () => {
    const result = validateCheckout({ ...valid, deliveryMethodId: "pickup", address: "x".repeat(1000), greetingMessage: "x".repeat(1000), email: "" }, { now, hasGreetingCard: false });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.address).toBe("");
      expect(result.data.greetingMessage).toBe("");
    }
  });

  it.each(["2026-12-29", "2026-12-30", "2027-01-07", "2026-13-31", ""])('rejects past/outside/invalid date "%s"', (date) => {
    const result = validateCheckout({ ...valid, date }, { now, hasGreetingCard: true });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.date).toBeTruthy();
  });

  it.each(["evening", "missing", ""])('rejects unavailable/unknown slot "%s"', (slotId) => {
    const result = validateCheckout({ ...valid, slotId }, { now, hasGreetingCard: true });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.slotId).toBeTruthy();
  });

  it("enforces option enums, plain-text lengths and phone format", () => {
    const result = validateCheckout({ ...valid, deliveryMethodId: "unknown", phone: "abc79991234567", greetingMessage: "x".repeat(181), comment: "x".repeat(501) }, { now, hasGreetingCard: true });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.deliveryMethodId).toBeTruthy();
      expect(result.errors.phone).toBeTruthy();
      expect(result.errors.greetingMessage).toBeTruthy();
      expect(result.errors.comment).toBeTruthy();
    }
  });
});
