using ControleEstoqueModel.Entities;
using ControleEstoqueServices.Repositories;
using System;
using System.Collections.Generic;
using System.Text;

namespace ControleEstoqueServices.ProdutoServices
{
    public interface IProdutoService : IRepository<Produtos>
    {
    }

    public class ProdutoService : Repository<Produtos>, IProdutoService
    {
        private readonly DatabaseContext _databaseContext;

        public ProdutoService(DatabaseContext databaseContext) : base(databaseContext)
        {
            _databaseContext = databaseContext;
        }
    }
}
