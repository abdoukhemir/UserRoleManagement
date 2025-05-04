using UserRoleManagementApi.Models;
using System.Collections.Generic;
using System.Text.Json.Serialization;
public class Role
{
       public Role()
    {
        UserRoles = new List<UserRole>();
    }
    public int Id { get; set; }
    public string Name { get; set; }

    [JsonIgnore] 

    public ICollection<UserRole> UserRoles { get; set; }
}