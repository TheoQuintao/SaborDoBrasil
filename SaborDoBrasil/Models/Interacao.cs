namespace SaborDoBrasil.Models
{
    public class Interacao
    {
        public int Id { get; set; }
        public string Tipo { get; set; } // "like" ou "deslike"
        public int PublicacaoId { get; set; }
        public Publicacao Publicacao { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
    }
}