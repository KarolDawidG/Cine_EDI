import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { VHS } from "../../Vhs/interfaces/VhsInterface";
import { notify } from "../../../notification/Notify";

interface CartContextType {
  cartItems: VHS[];
  addToCart: (vhs: VHS, callback?: () => void) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<VHS[]>(() => {
    const initialBasket = JSON.parse(localStorage.getItem("cart") || "[]");
    return initialBasket;
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (vhs: VHS, callback?: () => void) => {
    const idUser = localStorage.getItem('idUser');
    const isAlreadyInCart = cartItems.some(item => item.id === vhs.id);

    if (isAlreadyInCart) {
      notify('This video is already in your cart');
      return;
    }

    const updatedVhs = {
      ...vhs,
      account_id: idUser,
      due_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
      status: 'rented'
    };

    setCartItems((prevItems) => [...prevItems, updatedVhs]);
    notify('The video has been added to the cart!');
    
    if (callback) callback();
  };

  const removeFromCart = (index: number) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
