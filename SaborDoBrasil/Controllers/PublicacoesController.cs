using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class PublicacoesController : ControllerBase
{
    private readonly AppDbContext _context;
    public PublicacoesController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Publicacao>>> Get() =>
        await _context.Publicacoes
            .Include(p => p.Empresa)
            .Include(p => p.Usuario)
            .ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Publicacao>> Get(int id)
    {
        var publicacao = await _context.Publicacoes
            .Include(p => p.Empresa)
            .Include(p => p.Usuario)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (publicacao == null) return NotFound();
        return publicacao;
    }

    [HttpPost]
    public async Task<ActionResult<Publicacao>> Post(Publicacao publicacao)
    {
        _context.Publicacoes.Add(publicacao);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = publicacao.Id }, publicacao);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, Publicacao publicacao)
    {
        if (id != publicacao.Id) return BadRequest();
        _context.Entry(publicacao).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var publicacao = await _context.Publicacoes.FindAsync(id);
        if (publicacao == null) return NotFound();
        _context.Publicacoes.Remove(publicacao);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}