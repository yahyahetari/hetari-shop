import ProductsList from "@/components/ProductsList";
import { connectToDB } from "@/lib/mongoose";
import { Product } from "@/models/Products";
import { useState, useEffect } from "react";
import Loader from "@/components/Loader";

export default function Home({productsList}) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
            <img src="/banner.png" className="hidden md:block w-full" alt="Banner"/>
            <img src="/banner1.png" className="block md:hidden w-full" alt="Banner 1"/>
            <div>
                <h1 className="text-3xl ml-20 m-2 font-semibold">New Arrivals</h1>
                <ProductsList products={productsList} />
            </div>
        </div>
    );
}

export async function getServerSideProps() {
  await connectToDB()
  const productsList = await Product.find({},null,{sort : {'_id':-1} })
  return {
    props: {
      productsList: JSON.parse(JSON.stringify(productsList)),
    }
  }
}
