import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import CartItem from "@/components/CartItem";
import OrderButton from "@/components/OrderButton";

const getCartItems = async (userId: string) => {
  const cartItems = await prisma.cartItem.findMany({
    where: {
      userId,
    },
    include: {
      product: true,
    },
  });

  return cartItems;
};

const calculateTotal = (
  cartItems: Awaited<ReturnType<typeof getCartItems>>
) => {
  return cartItems.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);
};

export default async function CartPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/");
  }

  const cartItems = await getCartItems(session.user.id);

  return (
    <div className="p-12">
      <h1 className="text-4xl font-bold">Cart</h1>

      <div>
        {cartItems.map((cartItem) => (
          <CartItem key={cartItem.product.id} cartItem={cartItem} />
        ))}
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold">Total</h3>
          <p className="text-xl">${calculateTotal(cartItems)}</p>
        </div>
        <OrderButton cartItems={cartItems} />
      </div>
    </div>
  );
}
