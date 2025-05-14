using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class InteracoesController : ControllerBase
{
    private readonly AppDbContext _context;
    public InteracoesController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Interacao>>> Get() =>
        await _context.Interacoes
            .Include(i => i.Usuario)
            .Include(i => i.Publicacao)
            .ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Interacao>> Get(int id)
    {
        var interacao = await _context.Interacoes
            .Include(i => i.Usuario)
            .Include(i => i.Publicacao)
            .FirstOrDefaultAsync(i => i.Id == id);
        if (interacao == null) return NotFound();
        return interacao;
    }

    [HttpPost]
    public async Task<ActionResult<Interacao>> Post(Interacao interacao)
    {
        _context.Interacoes.Add(interacao);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = interacao.Id }, interacao);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, Interacao interacao)
    {
        if (id != interacao.Id) return BadRequest();
        _context.Entry(interacao).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var interacao = await _context.Interacoes.FindAsync(id);
        if (interacao == null) return NotFound();
        _context.Interacoes.Remove(interacao);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}