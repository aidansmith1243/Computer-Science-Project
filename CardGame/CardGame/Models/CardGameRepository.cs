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
            var temp = GetUserByUsername("p1");
            if(temp == null)
            {
                var U1 = new User {
                    UserId = Guid.NewGuid(),
                    Username = "p1",
                    Email = "temp@temp.com",
                    Password = Crypto.HashPassword("a")
                };
                var U2 = new User
                {
                    UserId = Guid.NewGuid(),
                    Username = "p2",
                    Email = "temp2@temp.com",
                    Password = Crypto.HashPassword("a")
                };
                var U3 = new User
                {
                    UserId = Guid.NewGuid(),
                    Username = "p3",
                    Email = "temp3@temp.com",
                    Password = Crypto.HashPassword("a")
                };
                var U4 = new User
                {
                    UserId = Guid.NewGuid(),
                    Username = "p4",
                    Email = "temp4@temp.com",
                    Password = Crypto.HashPassword("a")
                };
                CreateUser(U1);
                CreateUser(U2);
                CreateUser(U3);
                CreateUser(U4);
                CreateFriendConnection(U1.UserId, U2.UserId);
                CreateFriendConnection(U1.UserId, U3.UserId);
                CreateFriendConnection(U1.UserId, U4.UserId);
                CreateFriendConnection(U2.UserId, U3.UserId);
                CreateFriendConnection(U2.UserId, U4.UserId);
                CreateFriendConnection(U3.UserId, U4.UserId);
            }
        }

        public User CreateUser(User user)
        {
            try
            {
                _context.User.Add(user);
                _context.SaveChanges();
            }
            catch
            {
                Console.WriteLine("Error creating user");
                return null;
            }
            return user;
        }
        public List<User> GetUsers()
        {
            return _context.User.ToList();
        }
        public List<string> GetPendingInvites(string userId)
        {
            var friendIds = _context.Friends.Where(x => x.CurrentUserId.ToString() == userId && x.isPending).Select(x => x.OtherUserId).ToList();
            List<string> friends = new List<string>();
            foreach(var x in friendIds)
            {
                friends.Add(GetUserById(x.ToString()).Username);
            }
            return friends;
        }
        public bool AddFriend(string u1, string u2) 
        {
            var u1Id = GetUserByUsername(u1).UserId;
            var u2Id = GetUserByUsername(u2).UserId;

            var connection1 = _context.Friends.Where(x => x.CurrentUserId == u1Id && x.OtherUserId == u2Id).FirstOrDefault();
            var connection2 = _context.Friends.Where(x => x.CurrentUserId == u2Id && x.OtherUserId == u1Id).FirstOrDefault();

            if (connection1 == null)
            {
                _context.Friends.Add(new FriendsList
                {
                    CurrentUserId = u1Id,
                    OtherUserId = u2Id,
                    isPending = false,
                    isDeleted = false
                });
            }
            else
            {
                connection1.isPending = false;
                _context.SaveChanges();
                return true;
            }
            if (connection2 == null)
            {
                _context.Friends.Add(new FriendsList
                {
                    CurrentUserId = u2Id,
                    OtherUserId = u1Id,
                    isPending = true,
                    isDeleted = false
                });
            }
            else
            {
                connection2.isPending = true;
            }
            _context.SaveChanges();
            return false;
        }
        private void CreateFriendConnection(Guid user1, Guid user2)
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
