using Microsoft.EntityFrameworkCore;
using SaborDoBrasil.Models;
using Pomelo.EntityFrameworkCore.MySql;

var builder = WebApplication.CreateBuilder(args);

// Adiciona o contexto do banco de dados MySQL
builder.Services.AddDbContext<SaborDoBrasilContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true
    ); // Adiciona suporte a controllers e configura opções de serialização JSON

var app = builder.Build();

// Habilita arquivos estáticos (wwwroot)
app.UseDefaultFiles(); // Procura por index.html automaticamente
app.UseStaticFiles();  // Serve arquivos estáticos

app.MapControllers(); // Mapeia as rotas dos controllers

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<SaborDoBrasilContext>();
    try
    {
        var usuarios = db.Usuarios.ToList();
        Console.WriteLine($"Usuários cadastrados: {usuarios.Count}");
    }
    catch (Exception ex)
    {
        Console.WriteLine("Erro ao acessar o banco: " + ex.Message);
    }
}

app.Run();
