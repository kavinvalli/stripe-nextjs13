import { CartItem, Product } from "@prisma/client";

export type CartItemWithProduct = CartItem & { product: Product };
