# 07. Data model

Ниже — целевая логическая модель. Конкретные TypeScript interfaces могут немного отличаться, но семантика должна сохраняться.

## Money

```ts
type Money = {
  amount: number; // integer minor units, e.g. kopecks
  currency: 'RUB';
};
```

Не хранить деньги как float.

## Product

```ts
type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  collectionIds: string[];
  occasionTags: Occasion[];
  paletteTags: Palette[];
  shortDescription: string;
  description: string;
  seasonalNote?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  featured?: boolean;
};
```

## ProductVariant

```ts
type ProductVariant = {
  id: string;
  size: 'S' | 'M' | 'L' | 'ONE_SIZE';
  sizeLabel: string;
  approximateDiameterCm?: number;
  approximateHeightCm?: number;
  palette?: Palette;
  price: Money;
  demoStock: number;
};
```

`demoStock` существует для UI-состояний, а не как обещание реального наличия.

## ProductImage

```ts
type ProductImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  role: 'hero' | 'catalog' | 'detail' | 'scale' | 'context';
};
```

## Collection

```ts
type Collection = {
  id: string;
  slug: string;
  name: string;
  intro: string;
  description?: string;
  heroImage: ProductImage;
  productIds: string[];
};
```

## Cart item

Persisted minimum:

```ts
type PersistedCartItem = {
  productId: string;
  variantId: string;
  quantity: number;
  greetingCard: boolean;
};
```

Do not persist:
- price;
- product name;
- address;
- phone;
- email;
- recipient;
- greeting message.

Hydrated cart line is derived by joining IDs with catalog truth.

## Delivery method

```ts
type DeliveryMethod = {
  id: 'pickup' | 'courier';
  label: string;
  price: Money;
  requiresAddress: boolean;
};
```

## Delivery slot

```ts
type DeliverySlot = {
  id: string;
  label: string;
  enabled: boolean;
};
```

## Checkout form model

Ephemeral only:

```ts
type CheckoutDraft = {
  deliveryMethodId: string;
  date: string;
  slotId: string;
  recipientName: string;
  phone: string;
  email?: string;
  address?: string;
  greetingMessage?: string;
  comment?: string;
};
```

## Enumerations

Suggested categories:
- `AUTHOR_BOUQUET`
- `MONO_BOUQUET`
- `ARRANGEMENT`
- `SEASONAL_BUNCH`

Occasions:
- `BIRTHDAY`
- `DATE`
- `THANK_YOU`
- `HOME`
- `JUST_BECAUSE`

Palettes:
- `LIGHT`
- `PINK_WINE`
- `GREEN_WHITE`
- `WARM`
- `BRIGHT`

## Schema validation

Catalog data must be checked at startup/build with Zod or equivalent:
- unique product IDs/slugs;
- unique variant IDs within product;
- non-empty variants;
- non-negative integer stock;
- positive integer money amount;
- referenced collections/products exist;
- images include dimensions and alt policy.
