import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Image from "next/image";
import AddToCart from "@/components/AddToCart";

const getProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) throw new Error("Product not found");

  return product;
};

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const [product, session] = await Promise.all([
    getProduct(id),
    getAuthSession(),
  ]);

  if (!session) {
    redirect("/");
  }

  return (
    <main className="w-full p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="w-full h-64 md:h-[calc(100vh-72px-48px-48px)] relative">
          <Image
            src={product.image}
            fill={true}
            className="rounded-lg object-cover md:object-contain"
            alt={`product ${product.name} image`}
          />
        </div>
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-slate-700 uppercase font-bold text-3xl md:text-5xl text-center md:text-left">
            {product.name}
          </h1>
          <p className="text-slate-500 my-3 text-center md:text-left">
            {product.description}
          </p>
          <hr />
          <h3 className="text-slate-600 mt-6 font-bold text-xl md:text-3xl text-center md:text-left">
            ${product.price}
          </h3>
          <AddToCart productId={product.id} />
        </div>
      </div>
    </main>
  );
}
