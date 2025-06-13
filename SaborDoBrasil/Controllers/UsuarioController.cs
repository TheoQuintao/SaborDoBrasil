using Microsoft.AspNetCore.Mvc;
using SaborDoBrasil.Models;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class UsuarioController : ControllerBase
{
    private readonly SaborDoBrasilContext _context;
    public UsuarioController(SaborDoBrasilContext context) => _context = context;

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest req)
    {
        var user = _context.Usuarios.FirstOrDefault(u => u.Email == req.Email && u.Senha == req.Senha);
        if (user == null) return Unauthorized();
        return Ok(new {
            user.Id,
            user.Nome,
            user.Email,
            user.Apelido,
            user.Foto,
            Likes = user.Interacoes.Count(i => i.Tipo == "like"),
            Dislikes = user.Interacoes.Count(i => i.Tipo == "deslike")
        });
    }

    // POST /api/usuario/register
    [HttpPost("register")]
    public IActionResult Register([FromBody] Usuario usuario)
    {
        if (usuario == null)
            return BadRequest("Usuário não pode ser nulo");
        if (string.IsNullOrEmpty(usuario.Email) || string.IsNullOrEmpty(usuario.Nome) ||
            string.IsNullOrEmpty(usuario.Apelido) || string.IsNullOrEmpty(usuario.Senha))
            return BadRequest("Todos os campos são obrigatórios");

        // Garante que as coleções não sejam nulas
        usuario.Publicacoes = new List<Publicacao>();
        usuario.Comentarios = new List<Comentario>();
        usuario.Interacoes = new List<Interacao>();

        if (_context.Usuarios.Any(u => u.Email == usuario.Email))
            return Conflict("Email já cadastrado");
        _context.Usuarios.Add(usuario);
        _context.SaveChanges();
        return Ok(usuario);
    }
}

public class LoginRequest
{
    public string Email { get; set; }
    public string Senha { get; set; }
}