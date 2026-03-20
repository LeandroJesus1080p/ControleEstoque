namespace ControleEstoqueModel.Entities
{
    public class Produtos : Table
    {
        public int CategoriaId { get; set; }
        public required string Nome { get; set; }
        public required string Descricao { get; set; }
        public required decimal Preco { get; set; }
        public int QuantidadeEstoque { get; set; }
        public required DateTime DataCadastro { get; set; }
        public bool Ativo { get; set; }

        public Categoria? Categoria { get; set; }
    }
}
