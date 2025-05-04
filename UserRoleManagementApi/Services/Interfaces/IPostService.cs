using System.Collections.Generic;
using System.Threading.Tasks;
using UserRoleManagementApi.Models;

namespace UserRoleManagementApi.Services.Interfaces
{
    public interface IPostService
    {
        Task<IEnumerable<Post>> GetAllPostsAsync();
        Task<Post> GetPostByIdAsync(int id);
        Task<Post> CreatePostAsync(Post post);
        Task<bool> UpdatePostAsync(Post post); 
        Task<bool> DeletePostAsync(int id);   
        Task<IEnumerable<Post>> GetPostsByUserIdAsync(int userId);
    }
}