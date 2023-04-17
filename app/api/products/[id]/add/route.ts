import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const { number } = z
      .object({
        number: z.number().gt(0).int(),
      })
      .parse(body);

    const session = await getAuthSession();

    if (!session)
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    if (!id)
      return NextResponse.json({ error: "No id provided" }, { status: 400 });

    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: id,
        },
      },
      update: {
        quantity: {
          increment: number,
        },
      },
      create: {
        product: {
          connect: {
            id: id,
          },
        },
        user: {
          connect: {
            id: session.user.id,
          },
        },
        quantity: number,
      },
    });

    return NextResponse.json(cartItem);
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
