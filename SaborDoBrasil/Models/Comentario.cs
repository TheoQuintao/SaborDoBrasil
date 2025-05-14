using System.ComponentModel.DataAnnotations.Schema;

namespace SaborDoBrasil.Models
{
    public class Comentario
    {
        public int Id { get; set; }
        public string Texto { get; set; }
        public DateTime Date { get; set; }
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
        [Column("usuario_id")]
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
        [Column("publicacao_id")]
        public int PublicacaoId { get; set; }
        public Publicacao Publicacao { get; set; }
        public string? Foto { get; set; }
    }
}