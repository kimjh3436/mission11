import { CartItem } from "../types/CartItem";
import { useState, ReactNode, useContext, createContext } from "react";

// Defines the structure for our cart context, including cart data and utility functions
interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (bookId: number) => void;
    clearCart: () => void;
}

// Create the cart context with a default of undefined
const CartContext = createContext<CartContextType | undefined>(undefined);

// Main context provider component — wraps app to make cart features globally accessible
export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Adds a new item or updates quantity if it already exists
    const addToCart = (item: CartItem) => {
        setCart((prevCart) => {
            const found = prevCart.find((i) => i.bookId === item.bookId);
            return found
                ? prevCart.map((i) =>
                      i.bookId === item.bookId
                          ? { ...i, quantity: i.quantity + item.quantity }
                          : i
                  )
                : [...prevCart, item];
        });
    };

    // Removes a specific item based on book ID
    const removeFromCart = (bookId: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.bookId !== bookId));
    };

    // Empties the entire cart
    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to access cart context easily from components
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
