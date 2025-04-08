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
        private AppDbContext _dbContext;

        public BooksController(AppDbContext temp)
        {
            _dbContext = temp;
        }

        [HttpGet("SomeBooks")]
        // Returns a filtered, paginated, and optionally sorted list of books.
        // Supports optional category filtering via query string.
        public IActionResult GetBooks(int pageSize = 5, int page = 1, int sorted = 1, [FromQuery] List<string>? categories = null)
        {
            var query = _dbContext.Books.AsQueryable();

            // Apply category filtering if any categories are specified
            if (categories != null && categories.Count > 0)
            {
                query = query.Where(b => categories.Contains(b.Category));
            }

            // Log and set a test cookie for demonstration
            string? favoriteBook = Request.Cookies["BookType"];
            Console.WriteLine("~~~~~COOKIE~~~~~~~ " + favoriteBook);

            HttpContext.Response.Cookies.Append("BookType", "Fiction", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.Now.AddMinutes(1)
            });

            // Sort by title if specified
            if (sorted == 1)
            {
                query = query.OrderBy(b => b.Title);
            }

            var totalCount = query.Count();

            // Apply pagination
            var books = query
                .Skip(pageSize * (page - 1))
                .Take(pageSize)
                .ToList();

            var response = new
            {
                Books = books,
                Count = totalCount
            };

            return Ok(response);
        }

        [HttpGet("AllBooks")]
        // Returns all books with no filtering, sorting, or pagination
        public IEnumerable<Book> Get()
        {
            return _dbContext.Books;
        }

        [HttpGet("GetBookCategories")]
        // Returns a distinct list of all book categories
        public IActionResult GetBookCategories()
        {
            var categories = _dbContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();

            return Ok(categories);
        }
    }
}
