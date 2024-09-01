import { connectToDB } from "@/lib/mongoose"
import { Product } from "@/models/Products"

export default function ProductsCard(product) {
    return (
        <div>
            <h1>Products Card</h1>
        </div>
    )
}

export async function getServerSideProps(context){
    await connectToDB()
    console.log({query:context.query})
   // const product = await Product.findById()
    return {
        props: {
          //  product:product ,
        }
    }
}