using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using UserRoleManagementApi.Models;
using UserRoleManagementApi.Services.Interfaces;

namespace UserRoleManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RolesController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        // GET: api/Roles
        // Get all roles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Role>>> GetRoles()
        {
            var roles = await _roleService.GetAllRolesAsync();
            return Ok(roles);
        }

        // GET: api/Roles/5
        // Get a specific role by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Role>> GetRole(int id)
        {
            var role = await _roleService.GetRoleByIdAsync(id);
            if (role == null)
            {
                return NotFound();
            }
            return Ok(role);
        }

        // POST: api/Roles
        // Create a new role
        [HttpPost]
        public async Task<ActionResult<Role>> CreateRole(Role role)
        {
            var createdRole = await _roleService.CreateRoleAsync(role);
             // Return 201 Created status
            return CreatedAtAction(nameof(GetRole), new { id = createdRole.Id }, createdRole);
        }

        // PUT: api/Roles/5
        // Update an existing role by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, Role role)
        {
             if (id != role.Id)
            {
                return BadRequest("Role ID mismatch");
            }

            var success = await _roleService.UpdateRoleAsync(role);
            if (!success)
            {
                return NotFound(); // Role not found or update failed
            }

            return NoContent(); // Indicate success
        }

        // DELETE: api/Roles/5
        // Delete a role by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
             var success = await _roleService.DeleteRoleAsync(id);
            if (!success)
            {
                return NotFound(); // Role not found
            }

            return NoContent(); // Indicate success
        }
    }
}