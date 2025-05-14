using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Adicione o serviço do DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

// Adicione suporte a controllers
builder.Services.AddControllers();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Mapeie os controllers da API
app.MapControllers();

// (Opcional) Mapeie a rota raiz para o index.html
app.MapGet("/", async context =>
{
    await context.Response.SendFileAsync("wwwroot/index.html");
});

app.Run();