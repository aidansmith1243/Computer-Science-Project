using CardGame.Models.Database;
using CryptoHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CardGame.Models
{
    public class CardGameRepository
    {
        private readonly CardGameContext _context;
        public CardGameRepository(CardGameContext context)
        {
            _context = context;

            // todo Remove temp code for testing
            var temp = GetUserByUsername("admin");
            if(temp == null)
            {
                CreateUser(new User {
                    UserId = Guid.NewGuid(),
                    Username = "admin",
                    Email = "temp@temp.com",
                    Password = Crypto.HashPassword("root")
                });
            }
        }

        public User CreateUser(User user)
        {
            Console.WriteLine("Creating user: " + user.Username);
            _context.User.Add(user);
            _context.SaveChanges();
            return user;
            //todo error check if invalid creation
        }
        public User GetUserByUsername(string username)
        {
            Console.WriteLine("Retrieving user: " + username);
            Console.WriteLine("all users: ");
            foreach (var i in _context.User.ToList())
                Console.WriteLine(i);
            return _context.User.Where(u => u.Username == username).FirstOrDefault();
        }
    }
}
