import { getProducts } from "@/action/product-action";
import { CreateProductDialog } from "@/app/product/product-create";
import { Spinner } from "@/components/mini/spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import React from 'react';


async function Page() {
    const products = await getProducts()
    // const session = await getSessionCookies()
    // if (session) {
    //     return <Spinner/>
    // }
    // console.log(session?.user)
    return (
        <Card>
            <CardHeader className="flex justify-between">
                <div className="">
                    <CardTitle>Product Data</CardTitle>
                    <CardDescription>This show product </CardDescription>
                </div>
                <CreateProductDialog/>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">No</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead className="text-right">Expired</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { !products ? (
                                <TableRow><TableCell colSpan={ 4 }><Spinner/></TableCell></TableRow>
                            ) :
                            products.map((item, index) => (
                                <TableRow key={ item.id }>
                                    <TableCell className="font-medium">{ index + 1 }</TableCell>
                                    <TableCell>{ item.name }</TableCell>
                                    <TableCell>{ item.qty }</TableCell>
                                    <TableCell className="text-right">{ formatDateIndo(item.expired) }</TableCell>
                                </TableRow>
                            )) }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

    );
}


// Fungsi formatter tanggal
export function formatDateIndo(date: string | Date) {
    if (!date) return "-"; // jika tanggal null atau undefined
    return new Date(date).toLocaleDateString('id-ID', {
        weekday: 'long', // nama hari
        day: 'numeric',  // tanggal
        month: 'long',   // nama bulan
        year: 'numeric'  // tahun
    });
}


export default Page;
