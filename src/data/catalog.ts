import { catalogSchema } from "./schemas";
import { products } from "./products";
import { collections } from "./collections";

// Единственная точка входа для страниц: повреждённый seed останавливает build/dev.
export const catalog = catalogSchema.parse({ products, collections });
