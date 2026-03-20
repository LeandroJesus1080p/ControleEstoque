using Microsoft.EntityFrameworkCore;

namespace ControleEstoqueModel.Entities
{
    public class DatabaseContext : DbContext
    {
        private const string BASE_NAME = "contole_estoque";

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

        public DbSet<Produtos> Produtos { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Produtos>(entity =>
            {
                entity.ToTable($"{BASE_NAME}_produtos");

                entity.HasIndex(e => new { e.Nome, e.CategoriaId }, $"IX_{BASE_NAME}_produtos_nome_categoria");

                entity.Property(e => e.Nome).IsRequired().HasMaxLength(100).IsUnicode(false);
                entity.Property(e => e.Descricao).IsRequired().HasMaxLength(500).IsUnicode(false);
                entity.Property(e => e.Preco).IsRequired().HasColumnType("decimal").IsUnicode(false);
                entity.Property(e => e.DataCadastro).IsRequired().HasColumnType("datetime").IsUnicode(false);
                entity.Property(e => e.Ativo).IsRequired().HasColumnType("bit").IsUnicode(false);

                entity.HasOne(d => d.Categoria)
                      .WithMany(p => p.Produtos)
                      .HasForeignKey(d => d.CategoriaId)
                      .OnDelete(DeleteBehavior.Restrict)
                      .HasConstraintName($"FK_{BASE_NAME}_produtos_categoria");
            });

            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.ToTable($"{BASE_NAME}_categorias");

                entity.HasIndex(e => e.Nome, $"IX_{BASE_NAME}_categorias_nome");

                entity.Property(e => e.Nome).IsRequired().HasMaxLength(100).IsUnicode(false);
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.ToTable($"{BASE_NAME}_usuarios");

                entity.HasIndex(e => e.Nome, $"IX_{BASE_NAME}_usuarios_login");

                entity.Property(e => e.Email).IsRequired().IsUnicode(false);
                entity.Property(e => e.Password).IsRequired().HasMaxLength(12).IsUnicode(false);
            });
        }
    }
}
