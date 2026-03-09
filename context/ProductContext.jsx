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

// LOCAL FALLBACK PRODUCTS (used when backend is empty or unavailable)
const fallbackProducts = [
  // ───────────────────── T-SHIRTS ─────────────────────
  {
    id: 1,
    name: "Rebel Oversized Tee",
    brand: "REPRESENT",
    category: "tshirts",
    subCategory: "Oversized",
    price: 1499,
    salePrice: 999,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=500&fit=crop",
    ],
    description:
      "Drop-shoulder oversized tee in heavyweight 240 GSM organic cotton. Ribbed crew neck, raw-edge hem, and a boxy silhouette built for layering or standalone street style.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Sage"],
    rating: 4.7,
    reviews: 120,
    stock: 40,
    featured: true,
  },
  {
    id: 2,
    name: "Graphic Street Tee",
    brand: "Stüssy",
    category: "tshirts",
    subCategory: "Graphic",
    price: 1799,
    salePrice: null,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=500&fit=crop",
    ],
    description:
      "Front and back graphic print tee with a vintage washed finish. Soft-touch 180 GSM jersey cotton for all-day comfort and effortless street cred.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Washed Black"],
    rating: 4.5,
    reviews: 95,
    stock: 55,
    featured: true,
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
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=500&fit=crop",
    ],
    description:
      "Supima cotton crewneck tee with a clean regular fit. Pre-shrunk fabric, reinforced collar, and a minimalist finish — the foundation of every outfit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Grey Melange", "White", "Navy"],
    rating: 4.3,
    reviews: 210,
    stock: 80,
    featured: false,
  },
  {
    id: 4,
    name: "Acid Wash Vintage Tee",
    brand: "Zara",
    category: "tshirts",
    subCategory: "Graphic",
    price: 1299,
    salePrice: 899,
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=500&fit=crop",
    ],
    description:
      "Acid-washed tee with faded distressed graphic and a relaxed fit. Retro '90s aesthetic with modern construction.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Washed Grey", "Washed Blue"],
    rating: 4.4,
    reviews: 67,
    stock: 35,
    featured: false,
  },

  // ───────────────────── PANTS ─────────────────────
  {
    id: 5,
    name: "Tactical Cargo Pants",
    brand: "H&M",
    category: "pants",
    subCategory: "Cargo",
    price: 2499,
    salePrice: 1999,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
    ],
    description:
      "Relaxed-fit cargo pants with six utility pockets, drawstring ankle cuffs, and a cotton-nylon ripstop blend built for durability and style.",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Black", "Olive", "Khaki"],
    rating: 4.6,
    reviews: 110,
    stock: 35,
    featured: true,
  },
  {
    id: 6,
    name: "512 Slim Taper Jeans",
    brand: "Levi's",
    category: "pants",
    subCategory: "Jeans",
    price: 3999,
    salePrice: 2999,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop",
    ],
    description:
      "Levi's 512 slim-taper in advanced stretch denim. Sits below the waist, slim through the thigh, and tapers sharply to the ankle for a modern silhouette.",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Indigo", "Black", "Light Wash"],
    rating: 4.8,
    reviews: 245,
    stock: 45,
    featured: true,
  },
  {
    id: 7,
    name: "Tech Fleece Joggers",
    brand: "Nike",
    category: "pants",
    subCategory: "Joggers",
    price: 3499,
    salePrice: 2499,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop",
    ],
    description:
      "Nike Tech Fleece joggers with tapered leg, zippered side pockets, bonded seams, and an elastic waistband with internal drawcord.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Dark Grey Heather"],
    rating: 4.7,
    reviews: 178,
    stock: 50,
    featured: true,
  },

  // ───────────────────── SHIRTS ─────────────────────
  {
    id: 8,
    name: "Flannel Check Shirt",
    brand: "Jack & Jones",
    category: "shirts",
    subCategory: "Casual",
    price: 1999,
    salePrice: 1499,
    image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
    ],
    description:
      "Brushed cotton flannel shirt in a relaxed regular fit. Buffalo check pattern, button-down collar, and single chest pocket.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Red/Black", "Blue/Grey"],
    rating: 4.4,
    reviews: 70,
    stock: 60,
    featured: false,
  },
  {
    id: 9,
    name: "Slim Fit Oxford Shirt",
    brand: "Ralph Lauren",
    category: "shirts",
    subCategory: "Formal",
    price: 3499,
    salePrice: null,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=400&h=500&fit=crop",
    ],
    description:
      "Premium oxford cotton shirt in a tailored slim fit. Button-down collar, signature embroidered pony, and adjustable barrel cuffs.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Light Blue", "Pink"],
    rating: 4.7,
    reviews: 132,
    stock: 40,
    featured: true,
  },
  {
    id: 10,
    name: "Printed Camp Collar Shirt",
    brand: "Zara",
    category: "shirts",
    subCategory: "Printed",
    price: 2199,
    salePrice: 1599,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
    ],
    description:
      "Relaxed camp collar shirt with all-over tropical print. Viscose-linen blend for a flowy, breathable drape — vacation-ready.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black Print", "Ecru Print"],
    rating: 4.5,
    reviews: 89,
    stock: 50,
    featured: true,
  },
  {
    id: 11,
    name: "Linen Blend Summer Shirt",
    brand: "Mango",
    category: "shirts",
    subCategory: "Casual",
    price: 2799,
    salePrice: 1999,
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=400&h=500&fit=crop",
    ],
    description:
      "Lightweight linen-cotton blend shirt with a relaxed fit. Spread collar, mother-of-pearl buttons, and a curved hem for easy layering.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Sand", "White", "Sky Blue"],
    rating: 4.6,
    reviews: 56,
    stock: 45,
    featured: false,
  },

  // ───────────────────── JACKETS ─────────────────────
  {
    id: 12,
    name: "MA-1 Bomber Jacket",
    brand: "Alpha Industries",
    category: "jackets",
    subCategory: "Bomber",
    price: 5999,
    salePrice: 3999,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop",
    ],
    description:
      "Iconic MA-1 flight bomber with satin shell, reversible rescue-orange lining, ribbed knit collar/cuffs, and a zippered utility sleeve pocket.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Olive", "Navy"],
    rating: 4.8,
    reviews: 198,
    stock: 25,
    featured: true,
  },
  {
    id: 13,
    name: "Leather Biker Jacket",
    brand: "AllSaints",
    category: "jackets",
    subCategory: "Biker",
    price: 7999,
    salePrice: 5499,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
    ],
    description:
      "Hand-finished lamb leather biker jacket with asymmetric zip closure, snap-down lapels, quilted elbow patches, and a slim fit.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Dark Brown"],
    rating: 4.9,
    reviews: 156,
    stock: 15,
    featured: true,
  },
  {
    id: 14,
    name: "Nuptse Puffer Jacket",
    brand: "The North Face",
    category: "jackets",
    subCategory: "Puffer",
    price: 8999,
    salePrice: 6999,
    image: "https://images.unsplash.com/photo-1544923246-77307dd270b2?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544923246-77307dd270b2?w=400&h=500&fit=crop",
    ],
    description:
      "700-fill goose down puffer with DWR finish, stowable hood, secure-zip hand pockets, and a baffled construction that locks in warmth.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Summit Navy", "TNF Red"],
    rating: 4.8,
    reviews: 221,
    stock: 30,
    featured: true,
  },
  {
    id: 15,
    name: "Denim Trucker Jacket",
    brand: "Levi's",
    category: "jackets",
    subCategory: "Denim",
    price: 4999,
    salePrice: 3499,
    image: "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=400&h=500&fit=crop",
    ],
    description:
      "The original Type III trucker jacket in rigid non-stretch denim. Point collar, button front, adjustable waist tabs, and chest flap pockets.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Medium Wash", "Dark Wash", "Black"],
    rating: 4.6,
    reviews: 167,
    stock: 35,
    featured: false,
  },

  // ───────────────────── CAPS ─────────────────────
  {
    id: 16,
    name: "Swoosh Pro Snapback",
    brand: "Nike",
    category: "caps",
    subCategory: "Snapback",
    price: 1499,
    salePrice: 999,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&h=500&fit=crop",
    ],
    description:
      "Structured 6-panel snapback with flat brim, embroidered Swoosh logo, moisture-wicking Dri-FIT sweatband, and rear snap closure.",
    sizes: ["One Size"],
    colors: ["Black", "White", "University Red"],
    rating: 4.7,
    reviews: 203,
    stock: 100,
    featured: true,
  },
  {
    id: 17,
    name: "Trefoil Relaxed Dad Cap",
    brand: "Adidas",
    category: "caps",
    subCategory: "Dad Cap",
    price: 1199,
    salePrice: 899,
    image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&h=500&fit=crop",
    ],
    description:
      "Washed cotton dad cap with pre-curved brim, embroidered Trefoil logo, tonal stitching, and adjustable strapback closure.",
    sizes: ["One Size"],
    colors: ["Black", "Beige", "Olive"],
    rating: 4.4,
    reviews: 87,
    stock: 70,
    featured: false,
  },
  {
    id: 18,
    name: "Watch Beanie",
    brand: "Carhartt WIP",
    category: "caps",
    subCategory: "Beanie",
    price: 999,
    salePrice: null,
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&h=500&fit=crop",
    ],
    description:
      "Stretchable rib-knit acrylic beanie with fold-over cuff and iconic Carhartt square woven label. One size fits all.",
    sizes: ["One Size"],
    colors: ["Black", "Heather Grey", "Burgundy"],
    rating: 4.6,
    reviews: 134,
    stock: 80,
    featured: true,
  },
  {
    id: 19,
    name: "59FIFTY Fitted Cap",
    brand: "New Era",
    category: "caps",
    subCategory: "Fitted",
    price: 1999,
    salePrice: 1499,
    image: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=400&h=500&fit=crop",
    ],
    description:
      "Authentic 59FIFTY fitted cap with structured crown, flat visor, embroidered team logo, and breathable eyelets all around.",
    sizes: ["S/M", "M/L", "L/XL"],
    colors: ["Black", "Navy", "Red"],
    rating: 4.8,
    reviews: 312,
    stock: 60,
    featured: true,
  },
  {
    id: 20,
    name: "Stock Bucket Hat",
    brand: "Stüssy",
    category: "caps",
    subCategory: "Bucket",
    price: 1299,
    salePrice: null,
    image: "https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?w=400&h=500&fit=crop",
    ],
    description:
      "Cotton twill bucket hat with embroidered Stock logo, top eyelets for ventilation, and a packable short brim. Festival-ready.",
    sizes: ["S/M", "L/XL"],
    colors: ["Black", "Stone", "Tie-Dye"],
    rating: 4.3,
    reviews: 45,
    stock: 55,
    featured: false,
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
          // Mongo has products → use them
          setProducts(data);
          setApiConnected(true);
        } else {
          // Mongo empty → keep fallback for now
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

  const resetToDefault = () => {
    setProducts(fallbackProducts);
  };

  const getProductById = (id) => {
    return products.find(product => product.id === parseInt(id));
  };

  const getProductsByCategory = (category) => {
    if (!category || category === 'all') return products;
    return products.filter(product => product.category === category);
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.featured);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        apiConnected,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getProductsByCategory,
        getFeaturedProducts,
        resetToDefault
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};