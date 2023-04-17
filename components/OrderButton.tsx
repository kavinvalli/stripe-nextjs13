"use client";

import { CartItemWithProduct } from "@/lib/types";
import { toast } from "react-hot-toast";

interface OrderButtonProps {
  cartItems: CartItemWithProduct[];
}

export default function OrderButton({ cartItems }: OrderButtonProps) {
  const order = async () => {
    const data = await fetch(`/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartItems,
      }),
    });

    if (!data.ok) {
      return toast.error("Failed to create order");
    }

    const { url } = await data.json();

    window.location.href = url;
  };

  return (
    <button
      className="py-3 px-4 text-white uppercase text-sm font-semibold rounded bg-slate-800 hover:bg-slate-900"
      onClick={order}
    >
      Order
    </button>
  );
}
