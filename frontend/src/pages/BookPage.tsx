import { useState, useEffect } from 'react';
import { Book as BookType } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';
import Books from '../components/Books.tsx';
import CookieConsent from 'react-cookie-consent';
import Fingerprint from '../components/Fingerprint.tsx';
import CategoryFilter from '../components/CategoryFilter.tsx';

function BookPage() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [page, setPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(1);
  const [sorted, setSorted] = useState<number>(1);
  const [quantities, setQuantities] = useState<{ [bookId: number]: number }>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  const setQuantity = (bookId: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [bookId]: value }));
  };

  const handleAddToCart = (book: BookType) => {
    const item: CartItem = {
      bookId: book.bookId,
      title: book.title,
      price: book.price,
      quantity: quantities[book.bookId] || 1,
    };
    addToCart(item);
    navigate('/cart');
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const categoryParams = selectedCategories
          .map((c) => `categories=${encodeURIComponent(c)}`)
          .join('&');

        const response = await fetch(
          `https://localhost:7172/api/Books/SomeBooks?pageSize=${pageSize}&page=${page}&sorted=${sorted}` +
            (selectedCategories.length > 0 ? `&${categoryParams}` : ''),
          { credentials: 'include' }
        );

        if (!response.ok) throw new Error('Error loading books');

        const data = await response.json();
        setBooks(data.books);
        setNumPages(Math.ceil(data.count / pageSize));
      } catch (err) {
        console.error('Failed to fetch books:', err);
      }
    };

    fetchBooks();
  }, [pageSize, page, sorted, selectedCategories]);

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Sidebar: Category Filter */}
        <div className="col-lg-3 col-md-4 mb-4">
          <div className="sticky-top bg-light p-3 rounded shadow-sm" style={{ top: '1rem' }}>
            <h5 className="text-center mb-3">Filter Categories</h5>
            <CategoryFilter
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
        </div>

        {/* Main Content: Book List */}
        <div className="col-lg-9 col-md-8">
          <div className="row justify-content-center">
            {books.map((book) => (
              <Books
                key={book.bookId}
                book={book}
                onAddToCart={handleAddToCart}
                quantity={quantities[book.bookId] || 1}
                setQuantity={setQuantity}
              />
            ))}
          </div>

          {/* Pagination & Sorting */}
          <div className="d-flex flex-column justify-content-center align-items-center p-3 bg-light rounded shadow-sm mt-4">
            <div className="pagination-container d-flex align-items-center mb-3">
              <button
                className="btn btn-outline-primary me-2"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>

              {[...Array(numPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`btn ${page === index + 1 ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                  onClick={() => setPage(index + 1)}
                  disabled={page === index + 1}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="btn btn-outline-primary ms-2"
                onClick={() => setPage(page + 1)}
                disabled={page === numPages}
              >
                Next
              </button>
            </div>

            <div className="mt-3 d-flex justify-content-between align-items-center w-100">
              <div className="me-3">
                <label className="form-label">Results per page:</label>
                <select
                  className="form-select w-auto"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>

              <div>
                <label className="form-label">Sort books alphabetically:</label>
                <select
                  className="form-select w-auto"
                  value={sorted}
                  onChange={(e) => setSorted(Number(e.target.value))}
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CookieConsent
        location="bottom"
        buttonText="Accept"
        cookieName="Cookies"
        style={{
          background: "white",
          color: "black",
          border: "2px solid black",
          fontWeight: "bold",
          textAlign: "center",
        }}
        buttonStyle={{
          background: "blue",
          color: "white",
          borderRadius: "5px",
          fontWeight: "bold",
        }}
        expires={150}
      >
        This site uses cookies to improve your browsing experience.
      </CookieConsent>

      <Fingerprint />
    </div>
  );
}

export default BookPage;

