
import { useContext } from "react";
import { CartContext } from "./CartContext";
import Link from "next/link";

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

// دالة للتحقق من الخصائص وتنسيق القيم
const formatPropertyValue = (key, value, hasColor) => {
  const isColor = key.toLowerCase() === "color" || key.toLowerCase() === "لون";
  
  if (isColor) {
    return (
      <span
        className="w-5 h-5 rounded-full inline-block border border-black"
        style={{ 
          backgroundColor: getColorHex(value),
          boxShadow: value.toLowerCase() === 'white' ? 'inset 0 0 0 1px #000' : 'none'
        }}
        title={value}
      ></span>
    );
  }
  
  // إذا كان هناك لون، لا نعرض الخصائص الأخرى
  if (hasColor && !isColor) {
    return null;
  }
  
  return value;
};

export default function ProductBox({ _id, title, description, images, price, category, properties, product }) {
  const { addToCart } = useContext(CartContext);

  // تحويل الخصائص إلى مصفوفة من الأزواج [مفتاح، قيمة]
  const propertyEntries = properties ? Object.entries(properties) : [];

  // التحقق مما إذا كان هناك لون
  const hasColor = propertyEntries.some(([key]) => 
    key.toLowerCase() === "color" || key.toLowerCase() === "لون"
  );

  // تحويل القيم إلى عناصر منسقة
  const displayedValues = propertyEntries.flatMap(([key, value]) => {
    const values = Array.isArray(value) ? value : [value];
    return values.map(v => formatPropertyValue(key, v.trim(), hasColor)).filter(Boolean);
  });

  // دالة لإضافة المنتج مع أول قيمة من كل خاصية إلى السلة
  const handleAddToCart = () => {
    const selectedProperties = {};
    if (properties) {
      Object.entries(properties).forEach(([key, value]) => {
        selectedProperties[key] = Array.isArray(value) ? [value[0]] : [value];
      });
    }
    addToCart(_id, selectedProperties);
  };

  return (
    <div className="flex flex-col gap-1 mt-3 mb-3 border border-slate-800 rounded-lg">
       <Link href={`/product/${_id}`}>
        <div className="relative overflow-hidden group">
          <img
            src={images[0]}
            alt="product"
            className={`${styles.productImage} rounded-md m-1.5 transition-transform duration-300 group-hover:scale-105 bg-white object-cover cursor-pointer`}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-95 transition-opacity duration-300">
            <span className="text-white text-lg font-semibold">View Details</span>
          </div>
        </div>
      </Link>
      <div className="pl-2 text-left flex-grow">
        <p className="text-md font-semibold">{title}</p>
        {/* عرض القيم المنسقة */}
        <div className="text-sm flex flex-wrap gap-0.5">
          {displayedValues.map((value, index) => (
            <span key={index}>{value}</span>
          ))}
        </div>
      </div>
      <div className="pl-2 flex justify-between items-center mt-auto">
        <p className="font-bold">$ {price}</p>
        <svg
          onClick={handleAddToCart}
          xmlns="http://www.w3.org/2000/svg"
          className="w-14 py-1 rounded-lg cursor-pointer p-4 border border-black mb-2 mr-2"
          viewBox="0 0 576 512"
        >
          <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 182.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20l44 0 0 44c0 11 9 20 20 20s20-9 20-20l0-44 44 0c11 0 20-9 20-20s-9-20-20-20l-44 0 0-44c0-11-9-20-20-20s-20 9-20 20l0 44-44 0c-11 0-20 9-20 20z" />
        </svg>
      </div>
    </div>
  );
}
