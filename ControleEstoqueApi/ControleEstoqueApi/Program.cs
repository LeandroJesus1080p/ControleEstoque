using ControleEstoqueModel.Entities;
using ControleEstoqueServices.CategoriaServices;
using ControleEstoqueServices.ProdutoServices;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// registra o banco de dados
builder.Services.AddDbContextPool<DatabaseContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"), b => b
        .MigrationsAssembly("ControleEstoqueApi")
        .MigrationsHistoryTable("abms_erp_migrations_history"));

});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder => { builder.WithOrigins("*").AllowAnyHeader().AllowAnyMethod(); });
});

builder.Services.AddScoped<IProdutoService, ProdutoService>();
builder.Services.AddScoped<ICategoriaService, CategoriaService>();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// define política padrão CORS


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
