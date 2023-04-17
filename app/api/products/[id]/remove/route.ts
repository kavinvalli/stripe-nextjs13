import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session)
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    if (!id)
      return NextResponse.json({ error: "No id provided" }, { status: 400 });

    const deletedCartItem = await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: id,
        },
      },
    });

    return NextResponse.json(deletedCartItem);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
