using System.ComponentModel.DataAnnotations.Schema;

namespace SaborDoBrasil.Models
{
    public class Interacao
    {
        public int Id { get; set; }
        public string Tipo { get; set; } // "like" ou "deslike"
        [Column("publicacao_id")]
        public int PublicacaoId { get; set; }
        public Publicacao Publicacao { get; set; }
        [Column("usuario_id")]
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
    }
}