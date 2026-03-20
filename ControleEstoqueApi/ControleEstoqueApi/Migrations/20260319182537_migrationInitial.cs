using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ControleEstoqueApi.Migrations
{
    /// <inheritdoc />
    public partial class migrationInitial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "contole_estoque_categorias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_contole_estoque_categorias", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "contole_estoque_usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Email = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Password = table.Column<string>(type: "varchar(12)", unicode: false, maxLength: 12, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_contole_estoque_usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "contole_estoque_produtos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoriaId = table.Column<int>(type: "int", nullable: false),
                    Nome = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Descricao = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: false),
                    Preco = table.Column<decimal>(type: "decimal(18,0)", unicode: false, nullable: false),
                    QuantidadeEstoque = table.Column<int>(type: "int", nullable: false),
                    DataCadastro = table.Column<DateTime>(type: "datetime", unicode: false, nullable: false),
                    Ativo = table.Column<bool>(type: "bit", unicode: false, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_contole_estoque_produtos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_contole_estoque_produtos_categoria",
                        column: x => x.CategoriaId,
                        principalTable: "contole_estoque_categorias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_contole_estoque_categorias_nome",
                table: "contole_estoque_categorias",
                column: "Nome");

            migrationBuilder.CreateIndex(
                name: "IX_contole_estoque_produtos_CategoriaId",
                table: "contole_estoque_produtos",
                column: "CategoriaId");

            migrationBuilder.CreateIndex(
                name: "IX_contole_estoque_produtos_nome_categoria",
                table: "contole_estoque_produtos",
                columns: new[] { "Nome", "CategoriaId" });

            migrationBuilder.CreateIndex(
                name: "IX_contole_estoque_usuarios_login",
                table: "contole_estoque_usuarios",
                column: "Nome");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "contole_estoque_produtos");

            migrationBuilder.DropTable(
                name: "contole_estoque_usuarios");

            migrationBuilder.DropTable(
                name: "contole_estoque_categorias");
        }
    }
}
