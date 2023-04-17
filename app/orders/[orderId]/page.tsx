import { Icons } from "@/components/Icons";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { OrderStatus } from "@prisma/client";
import Image from "next/image";

const getSessionAndSetOrder = async (sessionId: string, orderId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session && session.status === "complete") {
    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
      data: {
        status: OrderStatus.PAID,
      },
    });

    return { session, order };
  }

  throw new Error("You should not be able to access this page");
};

export default async function OrderPage({
  params: { orderId },
  searchParams,
}: {
  params: { orderId: string };
  searchParams: { session_id: string; success?: boolean; cancelled?: boolean };
}) {
  if (searchParams.success) {
    const sessionId = searchParams.session_id;

    if (!sessionId) throw new Error("Incorrect callback URL");

    const { order, session } = await getSessionAndSetOrder(sessionId, orderId);

    return (
      <div className="w-full h-[calc(100vh-72px)] flex justify-center items-center">
        <div className="shadow w-full max-w-xl p-6">
          <div className="flex gap-4 items-center">
            <h1 className="text-3xl font-bold text-slate-800">Order Placed</h1>
            <Icons.tick className="w-10 h-10" />
          </div>
          <p className="text-slate-500 text-sm">
            Order ID: <strong>{orderId}</strong>
          </p>
          {order.products.map((product) => (
            <div
              className="flex items-center justify-between shadow mb-2"
              key={product.product.id}
            >
              <div className="flex items-center gap-4">
                <div className="w-24 h-28 rounded-lg relative">
                  <Image
                    src={product.product.image}
                    alt={product.product.name}
                    fill={true}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-slate-700 font-bold text-lg">
                      {product.product.name}
                    </h3>
                    <div className="bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {product.quantity}
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm">
                    ${product.product.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <p>Something went wrong</p>;
}
