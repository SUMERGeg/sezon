import { z } from "zod";

const deliverySchema = z.object({
  id: z.enum(["courier", "pickup"]),
  label: z.string().min(1),
  price: z.object({ amount: z.number().int().nonnegative(), currency: z.literal("RUB") }),
  requiresAddress: z.boolean(),
});
const slotSchema = z.object({ id: z.string().min(1), label: z.string().min(1), enabled: z.boolean() });

// Все тарифы и интервалы — примеры для концепта, реальная доставка отсутствует.
export const deliveryMethods = z.array(deliverySchema).parse([
  { id: "courier", label: "Доставка", price: { amount: 50000, currency: "RUB" }, requiresAddress: true },
  { id: "pickup", label: "Самовывоз", price: { amount: 0, currency: "RUB" }, requiresAddress: false },
]);
export const deliverySlots = z.array(slotSchema).parse([
  { id: "morning", label: "10:00–13:00", enabled: true },
  { id: "afternoon", label: "13:00–16:00", enabled: true },
  { id: "evening", label: "16:00–19:00", enabled: false },
]);
export type DeliveryMethodId = z.infer<typeof deliverySchema>["id"];
