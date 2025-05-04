using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace UserRoleManagementApi.Models
{
    public class User
    {
        public User()
        {
            Posts = new List<Post>();
            UserRoles = new List<UserRole>();
        }

        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; }

        [JsonIgnore]
        public ICollection<Post> Posts { get; set; }

        [JsonIgnore]
        public ICollection<UserRole> UserRoles { get; set; }
    }
}
