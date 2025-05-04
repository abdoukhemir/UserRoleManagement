using System.Collections.Generic;
using System.Threading.Tasks;
using UserRoleManagementApi.Models;

namespace UserRoleManagementApi.Services.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(int id);
        Task<User> CreateUserAsync(User user);
        Task<bool> UpdateUserAsync(User user); 
        Task<bool> DeleteUserAsync(int id);   

        
        Task<IEnumerable<User>> GetAllUsersWithRolesAsync();
        Task<User> GetUserWithRolesAsync(int id);
        Task<IEnumerable<User>> GetAllUsersWithPostsAsync();
        Task<User> GetUserWithPostsAsync(int id);
        Task<bool> AssignRoleToUserAsync(int userId, int roleId);
        Task<bool> RemoveRoleFromUserAsync(int userId, int roleId);
    }
}