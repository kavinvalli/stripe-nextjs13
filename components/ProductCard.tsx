import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="bg-white rounded-lg shadow-md p-4"
    >
      <div className="w-full h-64 relative">
        <Image
          src={image}
          fill={true}
          className="rounded-lg object-cover"
          alt={`product ${name} image`}
        />
      </div>
      <div className="mt-4">
        <h3 className="text-slate-700 uppercase font-bold">{name}</h3>
        <span className="text-slate-500 mt-3">${price}</span>
      </div>
    </Link>
  );
}
