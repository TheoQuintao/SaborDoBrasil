using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SaborDoBrasil.Models;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    public AuthController(AppDbContext context) => _context = context;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == request.Email && u.Senha == request.Senha);

        if (user == null)
            return Unauthorized(new { message = "Usuário ou senha inválidos" });

        // Retorne apenas dados necessários
        return Ok(new {
            id = user.Id,
            nome = user.Nome,
            email = user.Email,
            foto = user.Foto
        });
    }
}

public class LoginRequest
{
    public string Email { get; set; }
    public string Senha { get; set; }
}