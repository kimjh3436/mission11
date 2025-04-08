using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    // Handles DB interactions and table mappings
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Book> Books { get; set; } // Books table in the database

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Book>(entity =>
            {
                entity.HasIndex(e => e.BookId)
                      .HasDatabaseName("IX_Books_BookID")
                      .IsUnique();

                entity.Property(e => e.BookId).HasColumnName("BookID");
                entity.Property(e => e.Isbn).HasColumnName("ISBN");
            });
        }
    }
}
