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
                var U1 = new User {
                    UserId = Guid.NewGuid(),
                    Username = "admin",
                    Email = "temp@temp.com",
                    Password = Crypto.HashPassword("root")
                };
                var U2 = new User
                {
                    UserId = Guid.NewGuid(),
                    Username = "root",
                    Email = "temp2@temp.com",
                    Password = Crypto.HashPassword("root")
                };
                CreateUser(U1);
                CreateUser(U2);
                CreateFriendConnection(U1.UserId, U2.UserId);
            }
        }

        public User CreateUser(User user)
        {
            _context.User.Add(user);
            _context.SaveChanges();
            return user;
            //todo error check if invalid creation
        }
        public void CreateFriendConnection(Guid user1, Guid user2)
        {
            _context.Friends.Add(new FriendsList
            {
                CurrentUserId = user1,
                OtherUserId = user2,
                isPending = false,
                isDeleted = false
            });
            _context.Friends.Add(new FriendsList
            {
                CurrentUserId = user2,
                OtherUserId = user1,
                isPending = false,
                isDeleted = false
            });
            _context.SaveChanges();
        }
        public User GetUserByUsername(string username)
        {
            return _context.User.Where(u => u.Username == username).FirstOrDefault();
        }
        public User GetUserById(string guid)
        {
            return _context.User.Where(u => u.UserId.ToString() == guid).FirstOrDefault();
        }
        public List<User> GetFriends(string userId)
        {
            var friendConnections = _context.Friends.Where(
                u => u.CurrentUserId.ToString() == userId 
                && !u.isPending );
            var friends = (from f in friendConnections
                          join u in _context.User on f.OtherUserId equals u.UserId
                          select u).ToList();
            return friends;
        }
        public List<User> GetFriends(Guid userId)
        {
            return GetFriends(userId.ToString());
        }
        public void SetOnlineStatus(Guid userId, bool isOnline)
        {
            SetOnlineStatus(userId.ToString(), isOnline);
        }
        public void SetOnlineStatus(string userId, bool isOnline)
        {
            var user = _context.User.Find(new Guid(userId));
            if (user != null)
            {
                user.isOnline = isOnline;
                try
                {
                    _context.SaveChanges();
                }
                catch { }
            }
        }
    }
}
