using System.Collections.Generic;
using System.Threading.Tasks;
using UserRoleManagementApi.Models;

namespace UserRoleManagementApi.Services.Interfaces
{
    public interface IRoleService
    {
        Task<IEnumerable<Role>> GetAllRolesAsync();
        Task<Role> GetRoleByIdAsync(int id);
        Task<Role> CreateRoleAsync(Role role);
        Task<bool> UpdateRoleAsync(Role role); // Returns true if successful
        Task<bool> DeleteRoleAsync(int id);   // Returns true if successful
       
    }
}