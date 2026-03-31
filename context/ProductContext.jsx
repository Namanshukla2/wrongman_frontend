import { createContext, useContext, useState, useEffect } from 'react';
import { productAPI } from '../utils/api';

const ProductContext = createContext(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};

const fallbackProducts = [
  {
    id: 1,
    name: "Rebel Oversized Tee",
    brand: "REPRESENT",
    category: "tshirts",
    subCategory: "Oversized",
    price: 1499,
    salePrice: 999,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop"],
    description: "Drop-shoulder oversized tee in heavyweight 240 GSM organic cotton.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Sage"],
    rating: 4.7, reviews: 120, stock: 40, featured: true,
  },
  {
    id: 2,
    name: "Graphic Street Tee",
    brand: "Stussy",
    category: "tshirts",
    subCategory: "Graphic",
    price: 1799,
    salePrice: null,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop"],
    description: "Front and back graphic print tee with a vintage washed finish.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Washed Black"],
    rating: 4.5, reviews: 95, stock: 55, featured: true,
  },
  {
    id: 3,
    name: "Everyday Essential Tee",
    brand: "Uniqlo",
    category: "tshirts",
    subCategory: "Basics",
    price: 799,
    salePrice: 599,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop"],
    description: "Supima cotton crewneck tee with a clean regular fit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Grey Melange", "White", "Navy"],
    rating: 4.3, reviews: 210, stock: 80, featured: false,
  },
  {
    id: 4,
    name: "Tactical Cargo Pants",
    brand: "H&M",
    category: "pants",
    subCategory: "Cargo",
    price: 2499,
    salePrice: 1999,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop"],
    description: "Relaxed-fit cargo pants with six utility pockets.",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Black", "Olive", "Khaki"],
    rating: 4.6, reviews: 110, stock: 35, featured: true,
  },
  {
    id: 5,
    name: "512 Slim Taper Jeans",
    brand: "Levi's",
    category: "pants",
    subCategory: "Jeans",
    price: 3999,
    salePrice: 2999,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop"],
    description: "Levi's 512 slim-taper in advanced stretch denim.",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Indigo", "Black", "Light Wash"],
    rating: 4.8, reviews: 245, stock: 45, featured: true,
  },
  {
    id: 6,
    name: "MA-1 Bomber Jacket",
    brand: "Alpha Industries",
    category: "jackets",
    subCategory: "Bomber",
    price: 5999,
    salePrice: 3999,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop"],
    description: "Iconic MA-1 flight bomber with satin shell.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Olive", "Navy"],
    rating: 4.8, reviews: 198, stock: 25, featured: true,
  },
  {
    id: 7,
    name: "Swoosh Pro Snapback",
    brand: "Nike",
    category: "caps",
    subCategory: "Snapback",
    price: 1499,
    salePrice: 999,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=500&fit=crop"],
    description: "Structured 6-panel snapback with flat brim.",
    sizes: ["One Size"],
    colors: ["Black", "White", "University Red"],
    rating: 4.7, reviews: 203, stock: 100, featured: true,
  },
];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productAPI.list();
        if (data && data.length > 0) {
          setProducts(data);
          setApiConnected(true);
        } else {
          setApiConnected(true);
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.warn('Backend not available, using local fallback products:', err.message);
        setApiConnected(false);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addProduct = async (product) => {
    const newProduct = { ...product, id: Date.now(), rating: 0, reviews: 0 };
    try {
      const saved = await productAPI.create(newProduct);
      setProducts(prev => [...prev, saved]);
      return saved;
    } catch (err) {
      console.warn('API save failed, saving locally:', err.message);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const updated = await productAPI.update(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    } catch (err) {
      console.warn('API update failed, updating locally:', err.message);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productAPI.remove(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.warn('API delete failed, deleting locally:', err.message);
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const resetToDefault = () => setProducts(fallbackProducts);

  const getProductById = (id) => products.find(p => p.id === parseInt(id));

  const getProductsByCategory = (category) => {
    if (!category || category === 'all') return products;
    return products.filter(p => p.category === category);
  };

  const getFeaturedProducts = () => products.filter(p => p.featured);

  return (
    <ProductContext.Provider
      value={{
        products, loading, apiConnected,
        addProduct, updateProduct, deleteProduct,
        getProductById, getProductsByCategory,
        getFeaturedProducts, resetToDefault,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};