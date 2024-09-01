import { useState, useEffect, useContext } from "react";
import { CartContext } from "@/components/CartContext";
import Gallery from "@/components/Gallery";
import { connectToDB } from "@/lib/mongoose";
import { Product } from "@/models/Products";
import { MinusCircle, PlusCircle } from "lucide-react";
import Loader from "@/components/Loader";

// دالة مساعدة لتحويل اسم اللون إلى كود HEX
const getColorHex = (colorName) => {
  const colors = {
    red: "#FF0000",
    blue: "#020e77",
    green: "#00FF00",
    yellow: "#FFFF00",
    black: "#000000",
    white: "#FFFFFF",
    // يمكنك إضافة المزيد من الألوان هنا
  };
  return colors[colorName.toLowerCase()] || colorName;
};

export default function ProductPage({ product }) {
    const { addToCart } = useContext(CartContext);
    const [selectedProperties, setSelectedProperties] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (product.properties) {
            const initialSelected = {};
            Object.entries(product.properties).forEach(([name, values]) => {
                if (Array.isArray(values) && values.length > 0) {
                    initialSelected[name] = values[0];
                }
            });
            setSelectedProperties(initialSelected);
        }
        setLoading(false);
    }, [product.properties]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    const toggleProperty = (name, value) => {
        setSelectedProperties(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const hasProperties = product.properties && Object.values(product.properties).some(values => Array.isArray(values) && values.length > 0);

    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decreaseQuantity = () => {
        setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    };

    const handleAddToCart = () => {
        addToCart(product._id, selectedProperties, quantity);
    };

    const isColorProperty = (name) => name.toLowerCase() === "color" || name.toLowerCase() === "لون";

    return (
        <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 w-full md:w-1/2 flex items-center justify-center">
                <Gallery images={product.images} />
            </div>
            <div className="flex-grow md:w-1/2 flex flex-col gap-4">
                <div>
                    <h1 className="text-3xl font-semibold">{product.title}</h1>
                    <p className="text-xl font-semibold mt-2">$ {product.price}</p>
                </div>
                <p className="text-lg">{product.description}</p>

                {hasProperties && (
                    <div className="">
                        <div className="flex flex-wrap gap-4">
                            {Object.entries(product.properties).map(([name, values], index) => (
                                Array.isArray(values) && values.length > 0 && (
                                    <div key={index} className="w-full md:w-1/2">
                                        <p className="text-base font-semibold">{name} :</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {values.map((value, idx) => (
                                                isColorProperty(name) ? (
                                                    <button
                                                        type="button"
                                                        key={idx}
                                                        className={`w-7 h-7 rounded-full border border-black ${selectedProperties[name] === value ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                                                        style={{ backgroundColor: getColorHex(value) }}
                                                        onClick={() => toggleProperty(name, value)}
                                                        title={value}
                                                    />
                                                ) : (
                                                    <button
                                                        type="button"
                                                        key={idx}
                                                        className={`py-1 px-2 rounded-lg border border-black ${selectedProperties[name] === value ? 'bg-black text-white' : 'text-black'}`}
                                                        onClick={() => toggleProperty(name, value)}
                                                    >
                                                        {value}
                                                    </button>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center mt-4">
                    <MinusCircle
                        className="hover:text-red-700 cursor-pointer"
                        onClick={decreaseQuantity}
                    />
                    <span className="text-lg font-medium mx-3">{quantity}</span>
                    <PlusCircle
                        className="hover:text-red-700 cursor-pointer"
                        onClick={increaseQuantity}
                    />
                </div>

                <button
                    onClick={handleAddToCart}
                    className="bg-black font-medium text-xl text-white rounded-lg mt-4 py-2 flex items-center justify-center"
                >
                    Add To Cart
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 icon-white ml-3"
                        viewBox="0 0 576 512"
                    >
                        <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20l44 0 0 44c0 11 9 20 20 20s20-9 20-20l0-44 44 0c11 0 20-9 20-20s-9-20-20-20l-44 0 0-44c0-11-9-20-20-20s-20 9-20 20l0 44-44 0c-11 0-20 9-20 20z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    await connectToDB();
    const { id } = context.query;
    const product = await Product.findById(id);

    return {
        props: {
            product: JSON.parse(JSON.stringify(product)),
        },
    };
}
