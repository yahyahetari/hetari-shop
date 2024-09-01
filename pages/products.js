import ProductsList from "@/components/ProductsList";
import { connectToDB } from "@/lib/mongoose";
import { Product } from "@/models/Products";
import { useState, useEffect } from "react";
import Loader from "@/components/Loader"; // تأكد من استيراد مكون Loader

export default function Products({ productsList }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // محاكاة تحميل البيانات
        setTimeout(() => {
            setLoading(false);
        }, 700);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl ml-20 m-2 font-semibold">Products</h1>
            <ProductsList products={productsList} />
        </div>
    );
}

export async function getServerSideProps() {
    await connectToDB()
    const productsList = await Product.find({}, null, { sort: { '_id': -1 } })
    return {
        props: {
            productsList: JSON.parse(JSON.stringify(productsList)),
        }
    }
}