// all necessaru imports
import { useState, useEffect } from 'react';
import { Book as BookType } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';
import Books from '../components/Books.tsx';
import CookieConsent from 'react-cookie-consent';
import Fingerprint from '../components/Fingerprint.tsx';
import CategoryFilter from '../components/CategoryFilter.tsx';

// taking selected categories as a parameter to the BookPage component.
// this is to make the api call to get the books based on the selected categories.
function BookPage() {
  // states to maintain all the books, the number of results per page, the page number, the total number of pages, if the books are sorted, and the quantity of the book to be added
  const [books, setBooks] = useState<BookType[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [page, setPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(1);
  const [sorted, setSorted] = useState<number>(1);
  const [quantities, setQuantities] = useState<{ [bookId: number]: number }>({});

  // setting the quantity for the book, this is used to set the quantity of the book when it is added to the cart
  const setQuantity = (bookId: number, value: number) => {
    setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [bookId]: value,
    }));
};

  // use navigate to allow us to route to the cart page
  const navigate = useNavigate();
  // add to cart function that we created in cartcontext
  const { addToCart } = useCart();

  // state to maintain categories and then make api calls using them
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // function to add item to cart, book is passed as a parameter and then it builds a cart item using the book object, it then adds the item and routes to the your cart page
  const handleAddToCart = (book: BookType) => {
    const newItem: CartItem = {
      bookId: book.bookId,
      title: book.title,
      price: book.price,
      quantity: quantities[book.bookId] || 1,
    };
    addToCart(newItem);
    navigate('/cart');
  };

  useEffect(() => {
    const fetchBooks = async () => {
        try {
            // Mapping out the selected categories, adds each selected one and puts an & between them so the backend can read them
            const categoryParams = selectedCategories
                .map((category) => `categories=${encodeURIComponent(category)}`)
                .join('&');

            console.log(categoryParams); // logging the category params to see if they are being created correctly
            // making the api call, pasing the parameters, and also dynamically creating the selected categories parameters based on what is in the selectedcaregories state
            const response = await fetch(
                `https://localhost:7172/api/Books/SomeBooks?pageSize=${pageSize}&page=${page}&sorted=${sorted}${
                    selectedCategories.length > 0 ? `&${categoryParams}` : ''
                }`,
                { credentials: 'include' }
            );
            // some simple error handling, throws an error if we don't get a 200 response from the server
            if (!response.ok) {
                throw new Error(`Error fetching books: ${response.statusText}`);
            }

            const data = await response.json(); // converting data to json to be used
            setBooks(data.books); // setting the book state
            const numberOfPages = Math.ceil(data.count / pageSize); // getting number of pages
            setNumPages(numberOfPages); // setting number of pages
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    fetchBooks();
}, [pageSize, page, sorted, selectedCategories]); // use effect dependencies, will run when any of these variables is updated

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Sidebar - Filter Component */}
        <div className="col-lg-3 col-md-4 mb-4">
          <div className="sticky-top bg-light p-3 rounded shadow-sm" style={{ top: '1rem' }}>
            <h5 className="text-center mb-3">Filter Categories</h5>
            <CategoryFilter selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
          </div>
        </div>

        {/* Main Content - Books */}
        <div className="col-lg-9 col-md-8">
          <div className="row justify-content-center">
            {books.map((book) => (
              <Books
                key={book.bookId}
                book={book}
                onAddToCart={handleAddToCart}
                quantity={quantities[book.bookId] || 1} // Default to 1 if no quantity is set
                setQuantity={setQuantity} // Pass the setQuantity function
              />
            ))}
          </div>

          {/* Pagination and Sorting */}
          <div className="d-flex flex-column justify-content-center align-items-center p-3 bg-light rounded shadow-sm mt-4">
            {/**Pagination container class we haven't used either, makes page things look nice. */}
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
{/**we haven't ever styled with a button outline, so I added that here */}
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
                {/**uses form label for the label to align with the bootstrap styling*/}
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
        This site uses cookies to enhance user experience.
      </CookieConsent>

      <Fingerprint />
    </div>
  );
}

export default BookPage;