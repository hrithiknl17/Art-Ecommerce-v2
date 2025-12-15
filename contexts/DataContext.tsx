import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { db } from '../firebase';
import { 
  collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot, getDocs
} from "firebase/firestore";

type Product = {
  id: string; // FIRESTORE USES STRING ID
  name: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  rating: number;
  stock: number;
  sales: number;
};

type CartItem = Product & { quantity: number };

type DataContextType = {
  products: Product[];
  orders: any[];
  customers: any[];
  cart: CartItem[];
  selectedProduct: Product | null;
  activeCategory: string;
  toast: { show: boolean; message: string };
  
  setActiveCategory: (category: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  getCartTotal: () => number;
  clearCart: () => void;

  addProduct: (product: any) => void;
  updateProduct: (product: any) => void;
  deleteProduct: (id: string) => void;

  placeOrder: (details: any) => void;
  updateOrderStatus: (id: string, status: string) => void;

  showToast: (msg: string) => void;
  hideToast: () => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children?: ReactNode }) => {

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  // ---------------------------------------------------------
  // 🔥 REAL-TIME FIRESTORE PRODUCT LISTENER
  // ---------------------------------------------------------
  // Load products from Firestore
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const firestoreProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (firestoreProducts.length > 0) {
          setProducts(firestoreProducts as Product[]);
          localStorage.setItem("products", JSON.stringify(firestoreProducts));
        } else {
          console.log("No products found in Firestore");
        }

      } catch (error) {
        console.error("🔥 Firestore load failed, falling back to local:", error);
      }
    };

    loadProducts();
  }, []);

  // ---------------------------------------------------------
  // LOCAL CART PERSISTENCE
  // ---------------------------------------------------------
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ---------------------------------------------------------
  // TOASTS
  // ---------------------------------------------------------
  const showToast = (message: string) => setToast({ show: true, message });
  const hideToast = () => setToast({ show: false, message: "" });

  // ---------------------------------------------------------
  // CART LOGIC
  // ---------------------------------------------------------
  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    showToast(`Added ${product.name} to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const getCartTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const clearCart = () => setCart([]);

  // ---------------------------------------------------------
  // ADMIN: ADD PRODUCT → FIRESTORE
  // ---------------------------------------------------------
  const addProduct = async (newProduct: any) => {
    try {
      await addDoc(collection(db, "products"), {
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category,
        image: newProduct.image,
        stock: newProduct.stock,
        rating: 0,
        sales: 0,
        createdAt: Date.now()
      });
      showToast("Product added");
    } catch (err) {
      console.error(err);
      showToast("Error adding product");
    }
  };

  // ---------------------------------------------------------
  // ADMIN: UPDATE PRODUCT → FIRESTORE
  // ---------------------------------------------------------
  const updateProduct = async (updated: any) => {
    try {
      await updateDoc(doc(db, "products", updated.id), updated);
      showToast("Product updated");
    } catch (err) {
      console.error(err);
      showToast("Error updating product");
    }
  };

  // ---------------------------------------------------------
  // ADMIN: DELETE PRODUCT
  // ---------------------------------------------------------
  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      showToast("Product deleted");
    } catch (err) {
      console.error(err);
      showToast("Error deleting");
    }
  };

  // ---------------------------------------------------------
  // PLACE ORDER (LOCAL ONLY FOR NOW)
  // ---------------------------------------------------------
  const placeOrder = (details: any) => {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: details.name,
      date: new Date().toISOString().split("T")[0],
      items: cart.reduce((a, c) => a + c.quantity, 0),
      total: getCartTotal(),
      status: "Processing"
    };

    setOrders([newOrder, ...orders]);
    clearCart();
    showToast("Order placed!");
  };

  const updateOrderStatus = (id: string, status: string) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status } : o))
    );
    showToast("Order updated");
  };

  return (
    <DataContext.Provider
      value={{
        products,
        orders,
        customers,
        cart,
        activeCategory,
        toast,

        setActiveCategory,
        setSelectedProduct,
        addToCart,
        removeFromCart,
        getCartTotal,
        clearCart,

        addProduct,
        updateProduct,
        deleteProduct,

        placeOrder,
        updateOrderStatus,

        showToast,
        hideToast
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside provider");
  return ctx;
};

export const formatRupee = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
