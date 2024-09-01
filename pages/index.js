import ProductsList from "@/components/ProductsList";
import { connectToDB } from "@/lib/mongoose";
import { Product } from "@/models/Products";
import { useState, useEffect } from "react";
import Loader from "@/components/Loader"; // تأكد من استيراد مكون Loader

export default function Home({productsList}) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // محاكاة تحميل البيانات
        setTimeout(() => {
            setLoading(false);
        }, 1000);
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
            <img src="/banner.png"/>
            <div>
                <h1 className="text-3xl ml-20 m-2 font-semibold">New Arrivals</h1>
                <ProductsList products={productsList} />
            </div>
        </div>
    );
}

export async  function getServerSideProps() {
  await connectToDB()
  const productsList = await Product.find({},null,{sort : {'_id':-1} })
  return {
    props: {
      productsList: JSON.parse(JSON.stringify(productsList)),
      }
      }
}