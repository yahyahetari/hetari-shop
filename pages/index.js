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
        }, 5000);  // تم تغيير هذا من 1000 إلى 5000 لجعل اللودر يعمل لمدة 5 ثوانٍ
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
