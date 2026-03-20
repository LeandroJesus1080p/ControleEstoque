namespace ControleEstoqueModel.Entities
{
    public class Categoria : Table
    {
        public required string Nome { get; set; }

        public virtual ICollection<Produtos> Produtos { get; set; } = [];
    }
}
