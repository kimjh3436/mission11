using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BooksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("SomeBooks")]
        // Retrieves a subset of books with optional filtering, sorting, and pagination.
        public IActionResult GetBooks(int pageSize = 5, int page = 1, int sorted = 1, [FromQuery] List<string>? categories = null)
        {
            var query = _context.Books.AsQueryable();

            // Filter by category if applicable
            if (categories != null && categories.Any())
            {
                query = query.Where(book => categories.Contains(book.Category));
            }

            // Read client-side preference cookie
            var preferredCategory = Request.Cookies["BookType"];
            Console.WriteLine("[COOKIE] Client preference: " + preferredCategory);

            // Set a secure cookie on the client
            Response.Cookies.Append("BookType", "Fiction", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(1)
            });

            if (sorted == 1)
            {
                query = query.OrderBy(book => book.Title);
            }

            var total = query.Count();
            var pagedBooks = query.Skip(pageSize * (page - 1)).Take(pageSize).ToList();

            return Ok(new { Books = pagedBooks, Count = total });
        }

        [HttpGet("AllBooks")]
        // Returns all books in the system with no filtering
        public IEnumerable<Book> GetAllBooks()
        {
            return _context.Books;
        }

        [HttpGet("GetBookCategories")]
        // Provides a list of all available categories
        public IActionResult GetBookCategories()
        {
            var allCategories = _context.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();

            return Ok(allCategories);
        }
    }
}
