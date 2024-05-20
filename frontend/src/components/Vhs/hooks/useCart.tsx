import { useState, useEffect } from "react";
import { VHS } from "../interfaces/VhsInterface";
import { notify } from "../../../notification/Notify";

export const useCart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const existingProducts = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(existingProducts);
  }, []);

  const addToCart = (product: VHS, callback: () => void = () => {}) => {
    const existingProducts = JSON.parse(localStorage.getItem('cart') || '[]');

    const productIndex = existingProducts.findIndex((item: { id: string }) => item.id === product.id);
    if (productIndex !== -1) {
      notify('Produkt juz jest w koszyku!');
    } else {
      notify('Produkt dodano do koszyka!');
      existingProducts.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(existingProducts));
    setCartItems(existingProducts);
    callback();
  };

  return {
    cartItems,
    addToCart,
  };
};
