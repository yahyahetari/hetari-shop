import ProductBox from "./ProductBox";

export default function ProductsList({ products }) {
    return (
        <div>
           
        <div className="flex flex-row flex-wrap gap-4 justify-center">
            {products?.length > 0 && products.map(product => (
                <ProductBox key={product._id} {...product} />
            ))}
        </div>
        </div>
    );
}
