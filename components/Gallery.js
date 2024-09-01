import { useState } from 'react';
import Image from 'next/image';
import { useSwipeable } from 'react-swipeable';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // أو يمكنك استخدام مكتبة أخرى أو أيقونات SVG

export default function Gallery({ images }) {
  const [mainImage, setMainImage] = useState(images[0]);

  // التعامل مع السحب لتغيير الصورة
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      changeImage(1);
    },
    onSwipedRight: () => {
      changeImage(-1);
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // تغيير الصورة الرئيسية بناءً على الاتجاه
  const changeImage = (direction) => {
    const currentIndex = images.indexOf(mainImage);
    const newIndex = (currentIndex + direction + images.length) % images.length;
    setMainImage(images[newIndex]);
  };

  // حساب الرقم الحالي للصورة
  const currentIndex = images.indexOf(mainImage) + 1;

  return (
    <div className="relative flex flex-col gap-3 max-w-[500px] mx-auto">
      {/* الصورة الرئيسية */}
      <div {...handlers} className="relative w-full">
        <Image
          src={mainImage}
          width={500}
          height={400}
          alt="Main product image"
          className="rounded-lg shadow-xl object-cover w-full h-[400px]"
        />
        {/* الأسهم لتغيير الصورة */}
        <button
          onClick={() => changeImage(-1)}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-glass p-2 rounded-full"
          aria-label="Previous Image"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => changeImage(1)}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-glass p-2 rounded-full"
          aria-label="Next Image"
        >
          <ChevronRight size={24} />
        </button>
        {/* رقم الصورة */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 pr-2 pl-2 rounded-3xl">
          {images.length} / {currentIndex}
        </div>
      </div>

      {/* إخفاء الصور المصغرة على الشاشات الصغيرة */}
      <div className="hidden md:flex gap-2 overflow-auto">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            width={100}
            height={100}
            alt={`Thumbnail ${index}`}
            className={`w-20 h-20 rounded-lg object-cover cursor-pointer ${mainImage === image ? 'border-2 border-black' : ''}`}
            onClick={() => setMainImage(image)}
          />
        ))}
      </div>
    </div>
  );
}
