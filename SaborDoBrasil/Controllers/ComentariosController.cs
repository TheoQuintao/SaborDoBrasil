using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SaborDoBrasil.Models;

[ApiController]
[Route("api/[controller]")]
public class ComentariosController : ControllerBase
{
    private readonly AppDbContext _context;
    public ComentariosController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Comentario>>> Get() =>
        await _context.Comentarios
            .Include(c => c.Usuario)
            .Include(c => c.Publicacao)
            .ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Comentario>> Get(int id)
    {
        var comentario = await _context.Comentarios
            .Include(c => c.Usuario)
            .Include(c => c.Publicacao)
            .FirstOrDefaultAsync(c => c.Id == id);
        if (comentario == null) return NotFound();
        return comentario;
    }

    [HttpPost]
    public async Task<ActionResult<Comentario>> Post(Comentario comentario)
    {
        _context.Comentarios.Add(comentario);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = comentario.Id }, comentario);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, Comentario comentario)
    {
        if (id != comentario.Id) return BadRequest();
        _context.Entry(comentario).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var comentario = await _context.Comentarios.FindAsync(id);
        if (comentario == null) return NotFound();
        _context.Comentarios.Remove(comentario);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}