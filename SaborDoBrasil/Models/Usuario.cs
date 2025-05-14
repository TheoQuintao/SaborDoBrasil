namespace SaborDoBrasil.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Apelido { get; set; }
        public string Senha { get; set; }
        public string? Foto { get; set; }

        public ICollection<Publicacao> Publicacoes { get; set; }
        public ICollection<Interacao> Interacoes { get; set; }
        public ICollection<Comentario> Comentarios { get; set; }
    }
}