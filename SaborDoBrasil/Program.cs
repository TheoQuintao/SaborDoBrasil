var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Habilita arquivos estáticos (wwwroot)
app.UseDefaultFiles(); // Procura por index.html automaticamente
app.UseStaticFiles();  // Serve arquivos estáticos

app.Run();
