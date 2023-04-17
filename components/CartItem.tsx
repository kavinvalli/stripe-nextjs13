"use client";
import { CartItem } from "@prisma/client";
import Image from "next/image";
import { Icons } from "./Icons";
import { toast } from "react-hot-toast";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CartItemWithProduct } from "@/lib/types";

interface CartItemProps {
  cartItem: CartItemWithProduct;
}

export default function CartItem({ cartItem }: CartItemProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isMutating = isLoading || isPending;

  const deleteItemFromCart = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products/${cartItem.productId}/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      console.log("*****CART******");
      console.log(data);
      console.log("*****CART******");

      setIsLoading(false);

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className={
        "flex items-center justify-between shadow my-8 " +
        (isMutating ? "opacity-20" : "")
      }
    >
      <div className="flex items-center gap-4">
        <div className="w-36 h-40 rounded-lg relative">
          <Image
            src={cartItem.product.image}
            alt={cartItem.product.name}
            fill={true}
            className="object-contain"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-slate-700 font-bold text-lg">
              {cartItem.product.name}
            </h3>
            <div className="bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {cartItem.quantity}
            </div>
          </div>
          <p className="text-slate-500 text-sm">${cartItem.product.price}</p>
        </div>
      </div>
      <button
        onClick={deleteItemFromCart}
        disabled={isLoading}
        className={
          "text-white py-2 px-4 rounded-lg mr-4 " +
          (isLoading ? "bg-slate-600" : "bg-slate-800 hover:bg-slate-900")
        }
      >
        {isLoading ? (
          <span className="animate-spin">
            <Icons.loader />
          </span>
        ) : (
          <Icons.delete />
        )}
      </button>
    </div>
  );
}
