using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using UserRoleManagementApi.Models;
using UserRoleManagementApi.Services.Interfaces;

namespace UserRoleManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;

        public PostsController(IPostService postService)
        {
            _postService = postService;
        }

        // GET: api/Posts
        // Get all posts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Post>>> GetPosts()
        {
            var posts = await _postService.GetAllPostsAsync();
            return Ok(posts);
        }

        // GET: api/Posts/5
        // Get a specific post by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPost(int id)
        {
            var post = await _postService.GetPostByIdAsync(id);
            if (post == null)
            {
                return NotFound();
            }
            return Ok(post);
        }

        // POST: api/Posts
        // Create a new post
        [HttpPost]
        public async Task<ActionResult<Post>> CreatePost(Post post)
        {
            var createdPost = await _postService.CreatePostAsync(post);
            // Return 201 Created status
            return CreatedAtAction(nameof(GetPost), new { id = createdPost.Id }, createdPost);
        }

        // PUT: api/Posts/5
        // Update an existing post by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, Post post)
        {
            if (id != post.Id)
            {
                return BadRequest("Post ID mismatch");
            }

            var success = await _postService.UpdatePostAsync(post);
            if (!success)
            {
                return NotFound(); // Post not found or update failed
            }

            return NoContent(); // Indicate success
        }

        // DELETE: api/Posts/5
        // Delete a post by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var success = await _postService.DeletePostAsync(id);
            if (!success)
            {
                return NotFound(); // Post not found
            }

            return NoContent(); // Indicate success
        }

          [HttpGet("byuser/{userId}")] // <-- Define the route with user ID parameter
        public async Task<ActionResult<IEnumerable<Post>>> GetPostsByUser(int userId) // Get user ID from route
        {
            var posts = await _postService.GetPostsByUserIdAsync(userId);
            return Ok(posts); // Return the list of posts
        }
    }
}