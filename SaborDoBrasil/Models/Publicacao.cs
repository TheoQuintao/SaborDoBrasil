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

    public ICollection<Interacao> Interacoes { get; set; }
    public ICollection<Comentario> Comentarios { get; set; }
}