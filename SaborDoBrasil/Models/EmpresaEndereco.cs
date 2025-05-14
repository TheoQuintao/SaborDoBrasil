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