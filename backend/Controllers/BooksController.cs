using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration.UserSecrets;


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
        // setting the parameters, as well as their default values if nothing is passed. 
        public IActionResult GetBooks(int pageSize = 5, int page = 1, int sorted = 1)
        {
            // logging the cookie for 414
            string? favoriteBook = Request.Cookies["BookType"];
            Console.WriteLine("~~~~~COOKIE~~~~~~~" + favoriteBook);

            // setting cookies for 414
            HttpContext.Response.Cookies.Append("BookType", "Fiction", new CookieOptions()
            {
                HttpOnly = true,
                Secure = true, // Fixed the syntax error here
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.Now.AddMinutes(1)
            });

            // delcaring the list variable
            List<Book> books = new List<Book>(); // Initialize with an empty list

            // if they want to sort it, this will sort the books
            if (sorted == 1)
            {
                books = _dbContext.Books
                    .OrderBy(b => b.Title) // sorting by title alphabetically
                    .Skip(pageSize * (page - 1))
                    .Take(pageSize)
                    .ToList();
            }
            // if not, it won't sort.
            else if (sorted == 0)
            {
                books = _dbContext.Books
                    .Skip(pageSize * (page - 1))
                    .Take(pageSize)
                    .ToList();
            }

            // Always set books to prevent uninitialized usage
            var totalCount = _dbContext.Books.Count();

            var response = new
            {
                Books = books,
                Count = totalCount
            };


            return Ok(response);
        }


        [HttpGet("AllBooks")]
        // getting all the books with no filters or anything
        public IEnumerable<Book> Get()
        {

            return _dbContext.Books;
        }
    }
}
