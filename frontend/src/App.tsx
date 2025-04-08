import BookPage from './pages/BookPage.tsx';
import Cart from './pages/CartPage.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.tsx';
import CartSummary from './components/CartSummary.tsx';
import './App.css';

// Root app component with routing and cart provider setup
function App() {
  return (
    <div className="container">
      <div className="row">
        <CartProvider>
          <Router>
            <CartSummary />
            {/* Define routes for home and cart pages */}
            <Routes>
              <Route path='/' element={<BookPage />} />
              <Route path='/cart' element={<Cart />} />
            </Routes>
          </Router>
        </CartProvider>
      </div>
    </div>
  );
}

export default App;
