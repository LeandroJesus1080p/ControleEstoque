namespace ControleEstoqueModel.Entities
{
    public class Usuario : Table    
    {
        public required string Nome { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
