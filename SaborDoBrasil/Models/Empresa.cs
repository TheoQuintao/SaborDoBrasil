namespace SaborDoBrasil.Models
{
    public class Empresa
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Logo { get; set; }

        public ICollection<EmpresaEndereco> Enderecos { get; set; }
        public ICollection<Publicacao> Publicacoes { get; set; }
    }
}