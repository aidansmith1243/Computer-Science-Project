using CardGame.Models.Database;
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
            return _context.User.FirstOrDefault(u => u.Username == username);
        }
    }
}
