using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CardGame.Models.Database
{
    public class FriendsList
    {
        [Key]
        [Column(Order = 1)]
        public Guid CurrentUserId { get; set; }
        [Key]
        [Column(Order = 2)]
        public Guid OtherUserId { get; set; }
        public bool isPending { get; set; }
        public bool isDeleted { get; set; } = false;
    }
}
