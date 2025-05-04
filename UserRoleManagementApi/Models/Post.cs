using UserRoleManagementApi.Models; 
using System.Text.Json.Serialization; 
using System.Collections.Generic ;
public class Post
{
      public Post()
    {
    
        User = null;
    }
    public int Id { get; set; }
    public string Content { get; set; }



    public int UserId { get; set; }
    [JsonIgnore] 
    public User? User { get; set; }
}
