using Microsoft.EntityFrameworkCore;

namespace SaborDoBrasil.Models
{
    public class SaborDoBrasilContext : DbContext
    {
        public SaborDoBrasilContext(DbContextOptions<SaborDoBrasilContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Empresa> Empresas { get; set; }
        public DbSet<EmpresaEndereco> EmpresasEndereco { get; set; }
        public DbSet<Publicacao> Publicacoes { get; set; }
        public DbSet<Interacao> Interacoes { get; set; }
        public DbSet<Comentario> Comentarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configurações adicionais se necessário
            modelBuilder.Entity<Usuario>().ToTable("usuarios");
            modelBuilder.Entity<Empresa>().ToTable("empresas");
            modelBuilder.Entity<EmpresaEndereco>().ToTable("empresas_endereco");
            modelBuilder.Entity<Publicacao>().ToTable("publicacoes");
            modelBuilder.Entity<Interacao>().ToTable("interacoes");
            modelBuilder.Entity<Comentario>().ToTable("comentarios");
        }
    }
}
