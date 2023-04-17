import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db";

const getProducts = async () => {
  const products = await prisma.product.findMany();

  return products;
};

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="w-full h-[calc(100vh-72px)] p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </main>
  );
}
