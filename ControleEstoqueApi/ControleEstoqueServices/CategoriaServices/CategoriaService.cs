using ControleEstoqueModel.Entities;
using ControleEstoqueServices.Repositories;
using System;
using System.Collections.Generic;
using System.Text;

namespace ControleEstoqueServices.CategoriaServices
{
    public interface ICategoriaService : IRepository<Categoria>
    {
    }
    public class CategoriaService : Repository<Categoria>, ICategoriaService
    {
        private readonly DatabaseContext _databaseContext;

        public CategoriaService(DatabaseContext databaseContext) : base(databaseContext)
        {
            _databaseContext = databaseContext;
        }
    }
}
