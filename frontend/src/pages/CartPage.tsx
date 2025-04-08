import { useNavigate } from "react-router-dom";
import { CartItem } from "../types/CartItem";
import { useCart } from "../context/CartContext";

// Cart page showing current items and totals with new layout design
function Cart() {
    const navigate = useNavigate();
    const { cart, removeFromCart, clearCart } = useCart();

    const grandTotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    ).toFixed(2);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">🛍️ Your Cart</h2>

            {cart.length === 0 ? (
                <p className="text-muted text-center">No books in your cart yet.</p>
            ) : (
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-8">
                        <ul className="list-group shadow-sm">
                            {cart.map((item: CartItem) => (
                                <li key={item.bookId} className="list-group-item cart-item-box d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-1">{item.title}</h6>
                                        <small>Quantity: {item.quantity}</small>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="me-3">${(item.price * item.quantity).toFixed(2)}</span>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => removeFromCart(item.bookId)}
                                        >
                                            ✖ Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 text-end">
                            <h4>Total: ${grandTotal}</h4>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-4 d-flex flex-wrap justify-content-center gap-3">
                <button className="btn btn-outline-danger" onClick={clearCart}>
                    Clear Cart
                </button>
                <button className="btn btn-success">Proceed to Checkout</button>
                <button className="btn btn-secondary" onClick={() => navigate('/')}>
                    Back to Book List
                </button>
            </div>
        </div>
    );
}

export default Cart;
