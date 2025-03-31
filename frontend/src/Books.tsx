// importing react hooks, book type, and the book styling
import { useState, useEffect } from 'react';
import { Book } from './types/Book';
import './Books.css';

function Books() {
    // setting all of our state variables, books array, the results per page, the page you are on, and the total number of pages
    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [page, setPage] = useState<number>(1);
    const [numPages, setNumPages] = useState<number>(1);
    const [sorted, setSorted] = useState<number>(1);

    // use effect to get the books from the backend api. 
    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch(`https://localhost:7172/api/Books/SomeBooks?pageSize=${pageSize}&page=${page}&sorted=${sorted}`, {credentials: 'include'}); // getting the response and passing query parameters
            const data = await response.json();
            setBooks(data.books); // setting the books array 
            console.log(data.books);
            console.log(data.count);
            const numberOfPages = Math.ceil(data.count / pageSize);
            setNumPages(numberOfPages); // setting the number of pages state by taking the total count of records and dividing by the amount of records per page
            console.log(numPages);
        }
        fetchBooks();
    }, [pageSize, page, sorted]); // dependency array, re runs if the page size or the page changes state

    return (
    <>
        {/** Returned JSX with Bootstrap styling */}
        <div className="container mx-auto">
            <div className="row justify-content-center">
                {books.map((b) => (
                    <div 
                        key={b.bookId} 
                        className="col-lg-6 col-md-8 col-sm-10 mb-4 d-flex justify-content-center"
                    >
                        <div className="card shadow-sm hover-scale w-100" style={{ maxWidth: "500px" }}>
                            <div className="card-body">
                                <h5 className="card-title">{b.title}</h5>
                                <p className="card-text text-muted">by <strong>{b.author}</strong></p>
                                <p className="card-text">Published by: <strong>{b.publisher}</strong></p>
                                <p className="card-text">ISBN: <strong>{b.isbn}</strong></p>
                                <p className="card-text">Classification: <strong>{b.classification}</strong></p>
                                <p className="card-text">Page Count: <strong>{b.pageCount}</strong></p>
                                <p className="card-text">
                                    <strong>${b.price}</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>



        {/** Results per page option */}
        <div className="d-flex flex-column justify-content-center align-items-center p-3">
            {/* Pagination Buttons */}
            <div className="pagination-container d-flex align-items-center mb-3">
                <button 
                    className="btn btn-outline-primary me-2" 
                    onClick={() => setPage(page - 1)} 
                    disabled={page === 1}
                >
                    Previous
                </button>
                
                {/* Page number Buttons */}
                {[...Array(numPages)].map((_, index) => (
                    <button 
                        key={index + 1} 
                        className={`btn ${page === index + 1 ? 'btn-primary' : 'btn-outline-primary'} me-2`} 
                        onClick={() => setPage(index + 1)}
                        disabled={page === (index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                
                {/** Next page button, blocked out if the page is = to the total number of pages. */}
                <button 
                    className="btn btn-outline-primary ms-2" 
                    onClick={() => setPage(page + 1)} 
                    disabled={page === numPages}
                >
                    Next
                </button>
            </div>

            {/* Results per Page Dropdown */}
            <div className="mt-3 d-flex justify-content-between align-items-center">
                {/* Results per page */}
                <div className="me-3">
                    <label className="form-label">Results per page:</label>
                    <select 
                        className="form-select w-auto" 
                        value={pageSize} 
                        onChange={(p) => {
                            setPageSize(Number(p.target.value));
                            setPage(1);
                        }}
                    >
                        {/** Different potential values, 5, 10, or 20 results per page. */}
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </div>

                {/* Sort books alphabetically */}
                <div>
                    <label>Sort books alphabetically?</label>
                    <select 
                        className="form-select w-auto" 
                        value={sorted} 
                        onChange={(p) => { setSorted(Number(p.target.value))}}
                    >
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                    </select>
                </div>
            </div>
        </div>
    </>
);

}

export default Books;
