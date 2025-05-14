using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Empresa> Empresas { get; set; }
    public DbSet<EmpresaEndereco> EmpresasEndereco { get; set; }
    public DbSet<Publicacao> Publicacoes { get; set; }
    public DbSet<Interacao> Interacoes { get; set; }
    public DbSet<Comentario> Comentarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Exemplo de configuração para enum em Interacao
        modelBuilder.Entity<Interacao>()
            .Property(i => i.Tipo)
            .HasConversion<string>();

        // Outras configurações podem ser adicionadas aqui conforme necessário
    }
}