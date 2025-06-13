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
        public ICollection<Publicacao> Publicacoes { get; set; } = new List<Publicacao>();
        public ICollection<Comentario> Comentarios { get; set; } = new List<Comentario>();
        public ICollection<Interacao> Interacoes { get; set; } = new List<Interacao>();
    }

    public class Empresa
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Logo { get; set; }
        public ICollection<EmpresaEndereco> Enderecos { get; set; }
        public ICollection<Publicacao> Publicacoes { get; set; }
    }

    public class EmpresaEndereco
    {
        public int Id { get; set; }
        public string Estado { get; set; }
        public string Cidade { get; set; }
        public string Bairro { get; set; }
        public string Rua { get; set; }
        public string Numero { get; set; }
        public int EmpresaId { get; set; }
        public Empresa Empresa { get; set; }
    }

    public class Publicacao
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string? Imagem { get; set; }
        public string? Descricao { get; set; }
        public string Local { get; set; }
        public int EmpresaId { get; set; }
        public Empresa Empresa { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<Comentario> Comentarios { get; set; }
        public ICollection<Interacao> Interacoes { get; set; }
    }

    public class Interacao
    {
        public int Id { get; set; }
        public string Tipo { get; set; } // like ou deslike
        public int PublicacaoId { get; set; }
        public Publicacao Publicacao { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
    }

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
