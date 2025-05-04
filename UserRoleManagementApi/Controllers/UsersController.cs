using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using UserRoleManagementApi.Models;
using UserRoleManagementApi.Services.Interfaces;
using System.Linq;

namespace UserRoleManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/Users
        // Get all users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        // GET: api/Users/5
        // Get a specific user by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        // GET: api/Users/WithRoles
        // Get all users with their roles included
        [HttpGet("WithRoles")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsersWithRoles()
        {
            var users = await _userService.GetAllUsersWithRolesAsync();
            return Ok(users);
        }

        // GET: api/Users/5/WithRoles
        // Get a specific user with their roles included by ID
        [HttpGet("{id}/WithRoles")]
       public async Task<ActionResult> GetUserWithRoles(int id) // Change return type to ActionResult
    {
        var user = await _userService.GetUserWithRolesAsync(id); // Still calls the correct service method and loads data

        if (user == null)
        {
            return NotFound();
        }

        // === Manually construct an anonymous object to control JSON serialization ===
        // This explicitly includes the properties we want and structures userRoles as needed
        var userToSerialize = new
        {
            user.Id, // Include basic user properties
            user.Username,
            user.Email,
            // Explicitly select and structure the UserRoles collection
            userRoles = user.UserRoles.Select(ur => new
            {
                ur.UserId, // Include UserRole IDs if needed by frontend (optional)
                ur.RoleId,
                role = new 
                {
                    ur.Role.Id,   
                    ur.Role.Name 
                }
               
            }).ToList() 
        };
       

        // Return the explicitly constructed object. ASP.NET Core will serialize this object.
        return Ok(userToSerialize);
    }
        // GET: api/Users/WithPosts
        // Get all users with their posts included
        [HttpGet("WithPosts")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsersWithPosts()
        {
            var users = await _userService.GetAllUsersWithPostsAsync();
            return Ok(users);
        }

        // GET: api/Users/5/WithPosts
        // Get a specific user with their posts included by ID
        [HttpGet("{id}/WithPosts")]
        public async Task<ActionResult<User>> GetUserWithPosts(int id)
        {
            var user = await _userService.GetUserWithPostsAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        // POST: api/Users
        // Create a new user
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            var createdUser = await _userService.CreateUserAsync(user);
            // Return 201 Created status with the location of the new resource
            return CreatedAtAction(nameof(GetUser), new { id = createdUser.Id }, createdUser);
        }

        // PUT: api/Users/5
        // Update an existing user by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            // Ensure the ID in the route matches the ID in the request body
            if (id != user.Id)
            {
                return BadRequest("User ID mismatch");
            }

            var success = await _userService.UpdateUserAsync(user);
            if (!success)
            {
                return NotFound(); // User not found or update failed
            }

            return NoContent(); // Return 204 No Content on successful update
        }

        // DELETE: api/Users/5
        // Delete a user by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var success = await _userService.DeleteUserAsync(id);
            if (!success)
            {
                return NotFound(); // User not found
            }

            return NoContent(); // Return 204 No Content on successful deletion
        }

        // POST: api/Users/5/AssignRole/3
        // Assign a role (roleId) to a user (userId)
        [HttpPost("{userId}/AssignRole/{roleId}")]
        public async Task<IActionResult> AssignRoleToUser(int userId, int roleId)
        {
            var success = await _userService.AssignRoleToUserAsync(userId, roleId);
            if (!success)
            {
                return NotFound("User or Role not found"); // User or Role not found
            }

            return NoContent(); // Indicate success
        }

        // DELETE: api/Users/5/RemoveRole/3
        // Remove a role (roleId) from a user (userId)
        [HttpDelete("{userId}/RemoveRole/{roleId}")]
        public async Task<IActionResult> RemoveRoleFromUser(int userId, int roleId)
        {
            var success = await _userService.RemoveRoleFromUserAsync(userId, roleId);
            if (!success)
            {
                return NotFound("User-Role relationship not found"); // Relationship not found
            }

            return NoContent(); // Indicate success
        }
    }
}