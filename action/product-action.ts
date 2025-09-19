'use server'

import { ProductSchema } from "@/app/product/product-create";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const getProducts = async () => await prisma.products.findMany();


export async function createProduct(data: ProductSchema) {
    const product = await prisma.products.create({
        data: {
            name: data.name,
            qty: data.qty,
            expired: new Date(data.expired),
            isAvailable: data.isAvailable,
            usersId: data.userId
        },
        // include: {
        //     Users: true, // return user info too
        // },
    });
    revalidatePath('/')
    return product
}