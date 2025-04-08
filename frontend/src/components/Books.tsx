import { Book as BookType } from '../types/Book.tsx';

interface BookProps {
  book: BookType;
  onAddToCart: (book: BookType) => void;
  quantity: number;
  setQuantity: (bookId: number, value: number) => void;
}

// Renders individual book details with an add-to-cart option
const Book = ({ book, onAddToCart, quantity, setQuantity }: BookProps) => {
  return (
    <div className="col-lg-6 col-md-8 col-sm-10 mb-4 d-flex justify-content-center">
      <div className="card book-card w-100" style={{ maxWidth: '500px' }}>
        <div className="card-body">
          <h5 className="card-title">{book.title}</h5>
          <div className="book-highlight">by <strong>{book.author}</strong></div>
          <p className="card-text">Publisher: <strong>{book.publisher}</strong></p>
          <p className="card-text">ISBN: <strong>{book.isbn}</strong></p>
          <p className="card-text">Classification: <strong>{book.classification}</strong></p>
          <p className="card-text">Pages: <strong>{book.pageCount}</strong></p>
          <p className="card-text">Category: <strong>{book.category}</strong></p>
          <p className="card-text price"><strong>${book.price}</strong></p>

          <label htmlFor="quantity" className="form-label mt-2">Quantity:</label>
          <input
            id="quantity"
            value={quantity}
            type="number"
            min="1"
            className="form-control mb-3"
            placeholder="1"
            onWheel={(e) => e.preventDefault()}
            onKeyDown={(e) => e.preventDefault()}
            onChange={(e) => setQuantity(book.bookId, Number(e.target.value))}
          />

          <button className="btn btn-primary" onClick={() => onAddToCart(book)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Book;

