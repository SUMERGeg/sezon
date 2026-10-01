import { z } from "zod";
import type { Money } from "../../data/schemas";
import { deliveryMethods, deliverySlots } from "../../data/delivery";

export function getDemoDates(now = new Date()) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + index + 1, 12);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return { value, label: new Intl.DateTimeFormat("ru-RU", { weekday: "short", day: "numeric", month: "long" }).format(date) };
  });
}

export function getCheckoutTotal(subtotal: Money, deliveryMethodId: string): Money | null {
  const method = deliveryMethods.find((method) => method.id === deliveryMethodId);
  return method ? { amount: subtotal.amount + method.price.amount, currency: "RUB" } : null;
}

const draftSchema = z.object({
  deliveryMethodId: z.string().refine((id) => deliveryMethods.some((method) => method.id === id), "Выберите способ получения."),
  date: z.string(),
  slotId: z.string().refine((id) => deliverySlots.some((slot) => slot.id === id && slot.enabled), "Выберите доступный интервал из примера."),
  recipientName: z.string().trim().min(2, "Укажите имя получателя — минимум 2 символа.").max(80, "Имя должно быть не длиннее 80 символов."),
  phone: z.string().trim().regex(/^[+\d\s()-]+$/, "Введите телефон в формате +7 (999) 123-45-67.").transform((value) => value.replace(/\D/g, "")).refine((value) => /^[78]\d{10}$/.test(value), "Введите 11 цифр телефона, начиная с +7 или 8."),
  email: z.string().trim().max(254, "Email слишком длинный.").refine((value) => value === "" || z.email().safeParse(value).success, "Проверьте формат email."),
  address: z.string().trim().max(200, "Адрес должен быть не длиннее 200 символов."),
  greetingMessage: z.string().trim().max(180, "Текст открытки должен быть не длиннее 180 символов."),
  comment: z.string().trim().max(500, "Комментарий должен быть не длиннее 500 символов."),
});

export type CheckoutField = keyof z.infer<typeof draftSchema>;
export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

export function validateCheckout(input: unknown, { now = new Date(), hasGreetingCard }: { now?: Date; hasGreetingCard: boolean }) {
  const value = typeof input === "object" && input !== null ? input as Record<string, unknown> : {};
  const schema = draftSchema.superRefine((draft, context) => {
    if (!getDemoDates(now).some((date) => date.value === draft.date)) context.addIssue({ code: "custom", path: ["date"], message: "Выберите будущую дату из примера." });
    if (draft.deliveryMethodId === "courier" && draft.address.length < 5) context.addIssue({ code: "custom", path: ["address"], message: "Укажите адрес для примера — минимум 5 символов." });
  });
  const result = schema.safeParse({ ...value, address: value.deliveryMethodId === "pickup" ? "" : value.address, greetingMessage: hasGreetingCard ? value.greetingMessage : "" });
  if (result.success) return { success: true as const, data: result.data };
  const errors: CheckoutErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as CheckoutField;
    if (!errors[field]) errors[field] = issue.message;
  }
  return { success: false as const, errors };
}
