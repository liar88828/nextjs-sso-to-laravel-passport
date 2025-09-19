'use client'
import { createProduct } from "@/action/product-action";
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "@/hooks/use-session";
import React, { useState, useTransition } from "react";
import { z } from "zod";

// Zod schema for creating a product
export const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    qty: z.number().int().nonnegative("Quantity must be a positive integer"),
    expired: z.string().refine(
        (date) => !isNaN(Date.parse(date)),
        "Expired must be a valid date"
    ),
    isAvailable: z.boolean(),
    userId: z.number(),
});

export type ProductSchema = z.infer<typeof productSchema>


interface ErrorState {
    message: string | null;
}


export function CreateProductDialog(
    // { user }: { user: SSOUser }
) {
    //
    const [ isPending, startTransition ] = useTransition()
    const [ message, setMessage ] = useState<string | null>()
    const { data, isLoading } = useSession()


    // console.log(data)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        startTransition(async () => {
            try {

                const formData = new FormData(e.currentTarget);
                const body = productSchema.parse({
                        name: formData.get("name"),
                        qty: Number(formData.get("qty")),
                        expired: formData.get("expired"),
                        isAvailable: formData.get("isAvailable") === "on",
                        userId: data?.user.id,
                    }
                )
                await createProduct(body)
                // Clear error if success
                setMessage(null);

            } catch (err: unknown) {
                if (err instanceof z.ZodError) {
                    // console.error(err.message)
                    const message = z.prettifyError(err)
                    console.error(message)
                    setMessage(message);
                } else if (err instanceof Error) {
                    // Handle generic errors
                    // console.error(err);
                    setMessage(err.message || "Failed to create product");
                } else {
                    // Fallback for unknown error types
                    setMessage("An unexpected error occurred");
                }
            }
        })

    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Add Product</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={ handleSubmit }>
                    <DialogHeader>
                        <DialogTitle>Create Product </DialogTitle>
                        <DialogDescription>Fill in product details. Click save when you&apos;re
                            done.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" required/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="qty">Quantity</Label>
                            <Input id="qty" name="qty" type="number" min="1" required/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="expired">Expired Date</Label>
                            <Input id="expired" name="expired" type="date" required/>
                        </div>
                        <div className=" flex gap-2">
                            <Checkbox id="isAvailable" name="isAvailable"/>
                            <Label htmlFor="isAvailable">Available</Label>
                        </div>
                        <div>

                            { message && (
                                <p className="text-red-600 mt-2">{ message }</p>
                            ) }
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={ isPending || isLoading }>
                            { isPending ? "Saving..." : "Save" }
                        </Button>

                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}