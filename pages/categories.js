import { useState, useEffect } from "react";
import { connectToDB } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { Product } from "@/models/Products";
import Loader from "@/components/Loader";
import ProductsList from "@/components/ProductsList";
import { motion, AnimatePresence } from "framer-motion";

export default function Categories({ categoriesWithProducts }) {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 700);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const category = categoriesWithProducts.find(cat => cat._id === selectedCategory);
      let products = [...category.products];

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          products = products.filter(product => 
            product.properties && product.properties[key] && product.properties[key].includes(value)
          );
        }
      });

      // Apply sorting
      switch (sortOption) {
        case 'priceAsc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'priceDesc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'oldest':
          products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
      }

      setFilteredProducts(products);
    }
  }, [selectedCategory, sortOption, filters, categoriesWithProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Loader />
      </div>
    );
  }

  const handleViewMore = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    setSortOption('');
    setFilters({});
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleFilterChange = (property, value) => {
    setFilters(prev => ({...prev, [property]: value}));
  };

  const getUniqueProperties = (products) => {
    const properties = {};
    products.forEach(product => {
      if (product.properties) {
        Object.entries(product.properties).forEach(([key, value]) => {
          if (!properties[key]) {
            properties[key] = new Set();
          }
          (Array.isArray(value) ? value : [value]).forEach(v => properties[key].add(v));
        });
      }
    });
    return Object.fromEntries(Object.entries(properties).map(([k, v]) => [k, Array.from(v)]));
  };

  return (
    <div className="min-h-screen bg-gray-200 ">
      <div className="max-w-full mx-auto">
        <AnimatePresence>
          {!selectedCategory && (
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-4xl font-bold text-center mb-5 pt-5 text-gray-800"
            >
              Product Categories
            </motion.h1>
          )}
        </AnimatePresence>
        
        {categoriesWithProducts.map((category) => (
          <AnimatePresence key={category._id}>
            {(selectedCategory === null || selectedCategory === category._id) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="mb-12 bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">{category.name}</h2>
                    
                    {selectedCategory === category._id && (
                      <div className="flex flex-wrap gap-2">
                        <select 
                          onChange={handleSortChange} 
                          value={sortOption}
                          className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Sort by</option>
                          <option value="priceAsc">Price: Low to High</option>
                          <option value="priceDesc">Price: High to Low</option>
                          <option value="newest">Newest</option>
                          <option value="oldest">Oldest</option>
                        </select>
                        
                        {Object.entries(getUniqueProperties(category.products)).map(([property, values]) => (
                          <select 
                            key={property}
                            onChange={(e) => handleFilterChange(property, e.target.value)}
                            value={filters[property] || ''}
                            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">{property}</option>
                            {values.map(value => (
                              <option key={value} value={value}>{value}</option>
                            ))}
                          </select>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <ProductsList 
                    products={selectedCategory === category._id ? filteredProducts : category.products.slice(0, 3)} 
                  />
                  
                  <div className="mt-6">
                    {selectedCategory !== category._id ? (
                      <button
                        onClick={() => handleViewMore(category._id)}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View More
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full font-semibold transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        Back to Categories
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
    </div>
  );
}


export async function getServerSideProps() {
  await connectToDB();
  const categories = await Category.find({});
  const categoriesWithProducts = await Promise.all(
    categories.map(async (category) => {
      const products = await Product.find({ category: category._id });
      return {
        ...category.toObject(),
        products,
      };
    })
  );

  return {
    props: {
      categoriesWithProducts: JSON.parse(JSON.stringify(categoriesWithProducts)),
    },
  };
}
