using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CardGame.Models.Database
{
    public class User
    {
        [Key]
        [JsonIgnore]
        public Guid UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        [JsonIgnore]
        public string Password { get; set; }
        [JsonIgnore]
        public bool isDeleted { get; set; } = false;
        [JsonIgnore]
        public DateTimeOffset dateCreated { get; set; }
    }
}
