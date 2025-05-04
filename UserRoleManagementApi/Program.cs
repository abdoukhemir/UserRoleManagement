using UserRoleManagementApi.Data;
using Microsoft.EntityFrameworkCore;
using UserRoleManagementApi.Services.Interfaces;
using UserRoleManagementApi.Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPostService, PostService>();
builder.Services.AddScoped<IRoleService, RoleService>();

// === ADD CORS SERVICE HERE ===
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDevClient",
        builder =>
        {
            // Allow requests from the Angular development server's origin
            // IMPORTANT: Replace with your Angular app's actual URL and port if different
            builder.WithOrigins("http://localhost:4200")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
            // If you implement authentication that uses credentials (like cookies or specific headers), uncomment the line below
            // .AllowCredentials();
        });
});
// =============================

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add controller support
builder.Services.AddControllers();

// Register ApplicationDbContext with PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// === ADD CORS MIDDLEWARE HERE ===
// Place UseCors after UseRouting and before UseAuthorization
// app.UseRouting() is implicitly called by app.UseEndpoints() or app.MapControllers()
// but placing UseCors here is a common and safe spot.
app.UseCors("AllowAngularDevClient");
// ================================

app.UseAuthorization();

// Allow routing to controllers
app.MapControllers(); // <-- Needed for controller-based API endpoints

// Keep your weather endpoint (optional, you can remove this if you don't need it)
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}