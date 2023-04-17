"use client";
import { useState } from "react";
import { Icons } from "./Icons";
import { toast } from "react-hot-toast";
import { z } from "zod";

interface AddToCartProps {
  productId: string;
}

const AddToCart = ({ productId }: AddToCartProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [numberToBeAdded, setNumberToBeAdded] = useState(1);

  const addItemToCart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const number = z.number().gt(0).int().parse(numberToBeAdded);
      const res = await fetch(`/api/products/${productId}/add`, {
        method: "POST",
        body: JSON.stringify({
          number,
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      console.log("****DATA****");
      console.log(data);
      console.log("****DATA****");
      toast.success("Item added to cart");
    } catch (err) {
      if (err instanceof z.ZodError) {
        return toast.error(err.errors[0].message);
      }

      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex gap-2 items-center mt-6" onSubmit={addItemToCart}>
      <input
        type="number"
        className="bg-slate-200 py-3 px-4 w-20 rounded"
        placeholder="1"
        value={numberToBeAdded}
        onChange={(e) => setNumberToBeAdded(parseInt(e.target.value))}
      />
      <button
        type="submit"
        disabled={isLoading}
        className={
          "py-3 px-4 text-white uppercase text-sm font-semibold rounded flex items-center gap-2 " +
          (isLoading ? "bg-slate-600" : "bg-slate-800 hover:bg-slate-900")
        }
      >
        <span className="animate-spin">{isLoading && <Icons.loader />}</span>
        <Icons.cart />
        Add to cart
      </button>
    </form>
  );
};

export default AddToCart;
