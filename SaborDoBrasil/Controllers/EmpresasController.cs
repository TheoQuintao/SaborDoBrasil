using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SaborDoBrasil.Models;

[ApiController]
[Route("api/[controller]")]
public class EmpresasController : ControllerBase
{
    private readonly AppDbContext _context;
    public EmpresasController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Empresa>>> Get() =>
        await _context.Empresas.Include(e => e.Enderecos).ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Empresa>> Get(int id)
    {
        var empresa = await _context.Empresas.Include(e => e.Enderecos).FirstOrDefaultAsync(e => e.Id == id);
        if (empresa == null) return NotFound();
        return empresa;
    }

    [HttpPost]
    public async Task<ActionResult<Empresa>> Post(Empresa empresa)
    {
        _context.Empresas.Add(empresa);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = empresa.Id }, empresa);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, Empresa empresa)
    {
        if (id != empresa.Id) return BadRequest();
        _context.Entry(empresa).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var empresa = await _context.Empresas.FindAsync(id);
        if (empresa == null) return NotFound();
        _context.Empresas.Remove(empresa);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}