using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SaborDoBrasil.Models;

[ApiController]
[Route("api/[controller]")]
public class EmpresasEnderecoController : ControllerBase
{
    private readonly AppDbContext _context;
    public EmpresasEnderecoController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmpresaEndereco>>> Get() =>
        await _context.EmpresasEndereco.Include(e => e.Empresa).ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<EmpresaEndereco>> Get(int id)
    {
        var endereco = await _context.EmpresasEndereco.Include(e => e.Empresa).FirstOrDefaultAsync(e => e.Id == id);
        if (endereco == null) return NotFound();
        return endereco;
    }

    [HttpPost]
    public async Task<ActionResult<EmpresaEndereco>> Post(EmpresaEndereco endereco)
    {
        _context.EmpresasEndereco.Add(endereco);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = endereco.Id }, endereco);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, EmpresaEndereco endereco)
    {
        if (id != endereco.Id) return BadRequest();
        _context.Entry(endereco).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var endereco = await _context.EmpresasEndereco.FindAsync(id);
        if (endereco == null) return NotFound();
        _context.EmpresasEndereco.Remove(endereco);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}