import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

// Sticky cart summary that shows total price and redirects to cart page
const CartSummary = () => {
    const navigate = useNavigate();
    const { cart } = useCart();

    // Calculate the full cart total
    const totalAmount = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <div
            style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                padding: "8px 12px",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                fontSize: "14px",
                zIndex: 1000,
                width: "120px",
                textAlign: "center",
            }}
            onClick={() => navigate("/cart")}
        >
            🛒
            <strong>${totalAmount.toFixed(2)}</strong>
        </div>
    );
};

export default CartSummary;
