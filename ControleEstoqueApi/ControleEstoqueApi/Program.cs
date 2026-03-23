using Auth0.ManagementApi.Models;
using ControleEstoqueModel.Entities;
using ControleEstoqueServices.AuthServices;
using ControleEstoqueServices.CategoriaServices;
using ControleEstoqueServices.ProdutoServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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

// Other configurations

builder.Services.AddAuthentication(options =>
{
    options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "your_issuer",
        ValidAudience = "your_audience",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("sdfjsdkfjFKDJSFJSDKJFF3fjk9343h4irfdsohiJK@kJ#$HKJL$")),

        RequireExpirationTime = true,
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            string authorization = context.Request.Headers["Authorization"];

            if (string.IsNullOrEmpty(authorization))
            {
                context.NoResult();
            }
            else
            {
                context.Token = authorization.Replace("Bearer ", string.Empty);
            }

            return Task.CompletedTask;
        },
    };

});


builder.Services.AddScoped<IProdutoService, ProdutoService>();
builder.Services.AddScoped<ICategoriaService, CategoriaService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddTransient<JwtConfiguration>();


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

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
