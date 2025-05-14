namespace SaborDoBrasil.Models
{
    public class Comentario
    {
        public int Id { get; set; }
        public string Texto { get; set; }
        public DateTime Date { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
        public int PublicacaoId { get; set; }
        public Publicacao Publicacao { get; set; }
        public string? Foto { get; set; }
    }
}