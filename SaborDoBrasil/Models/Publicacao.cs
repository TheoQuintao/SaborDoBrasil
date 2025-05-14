using System.ComponentModel.DataAnnotations.Schema;

namespace SaborDoBrasil.Models
{
    public class Publicacao
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string? Imagem { get; set; }
        public string? Descricao { get; set; }
        public string Local { get; set; }
        [Column("empresa_id")]
        public int EmpresaId { get; set; }
        public Empresa? Empresa { get; set; }
        [Column("usuario_id")]
        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
        public ICollection<Interacao>? Interacoes { get; set; }
        public ICollection<Comentario>? Comentarios { get; set; }
    }
}