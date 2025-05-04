using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UserRoleManagementApi.Data;
using UserRoleManagementApi.Models;
using UserRoleManagementApi.Services.Interfaces;

namespace UserRoleManagementApi.Services.Implementations
{
     public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        // Consider injecting a password hasher service here
        // private readonly IPasswordHasher<User> _passwordHasher;

        public UserService(ApplicationDbContext context /*, IPasswordHasher<User> passwordHasher */)
        {
            _context = context;
            // _passwordHasher = passwordHasher;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User> CreateUserAsync(User user)
        {
            // === IMPORTANT: HASH THE PASSWORD BEFORE SAVING! ===
            // Replace with your actual hashing logic
            // user.Password = _passwordHasher.HashPassword(user.Password);
            // ===================================================

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> UpdateUserAsync(User receivedUser)
        {
            var userToUpdate = await _context.Users.FindAsync(receivedUser.Id);

            if (userToUpdate == null)
            {
                return false;
            }

            userToUpdate.Username = receivedUser.Username;
            userToUpdate.Email = receivedUser.Email;

            // === Conditional Password Update ===
            if (!string.IsNullOrEmpty(receivedUser.Password))
            {
                // ** IMPORTANT: HASH THE NEW PASSWORD HERE! **
                // Replace with your actual hashing logic
                userToUpdate.Password = receivedUser.Password; // <--- HASH THIS!
                // =======================================
            }
            // If receivedUser.Password is null or empty, the password is not modified.


            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                 if (!await UserExists(receivedUser.Id))
                 {
                     return false;
                 }
                 else
                 {
                     throw;
                 }
            }
            catch (Exception ex)
            {
                // Log the exception in a real application
                Console.WriteLine($"Error saving user updates: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return false;
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<User>> GetAllUsersWithRolesAsync()
        {
             return await _context.Users
                 .Include(u => u.UserRoles)
                 .ThenInclude(ur => ur.Role)
                 .ToListAsync();
        }

        public async Task<User> GetUserWithRolesAsync(int id)
        {
             return await _context.Users
                 .Include(u => u.UserRoles)
                 .ThenInclude(ur => ur.Role)
                 .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<IEnumerable<User>> GetAllUsersWithPostsAsync()
        {
             return await _context.Users.Include(u => u.Posts).ToListAsync();
        }

        public async Task<User> GetUserWithPostsAsync(int id)
        {
             return await _context.Users.Include(u => u.Posts).FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<bool> AssignRoleToUserAsync(int userId, int roleId)
        {
            var user = await _context.Users.Include(u => u.UserRoles).FirstOrDefaultAsync(u => u.Id == userId);
            var role = await _context.Roles.FindAsync(roleId);

            if (user == null || role == null)
            {
                return false;
            }

            if (!user.UserRoles.Any(ur => ur.RoleId == roleId))
            {
                user.UserRoles.Add(new UserRole { UserId = userId, RoleId = roleId });
                await _context.SaveChangesAsync();
            }

            return true;
        }

        public async Task<bool> RemoveRoleFromUserAsync(int userId, int roleId)
        {
            var userRole = await _context.UserRoles
                .FirstOrDefaultAsync(ur => ur.UserId == userId && ur.RoleId == roleId);

            if (userRole == null)
            {
                return false;
            }

            _context.UserRoles.Remove(userRole);
            await _context.SaveChangesAsync();
            return true;
        }

        private async Task<bool> UserExists(int id)
        {
            return await _context.Users.AnyAsync(e => e.Id == id);
        }
    }
}