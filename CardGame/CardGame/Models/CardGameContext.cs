using CardGame.Models.Database;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CardGame.Models
{
    public class CardGameContext: DbContext
    {
        public DbSet<User> User { get; set; }
        public DbSet<FriendsList> Friends { get; set; }

        public CardGameContext(DbContextOptions<CardGameContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FriendsList>()
                .HasKey(a => new { a.CurrentUserId, a.OtherUserId });
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}
