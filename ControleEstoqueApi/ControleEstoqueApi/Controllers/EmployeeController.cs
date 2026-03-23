using ControleEstoqueModel.Entities.mvvm;
using ControleEstoqueModel.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ControleEstoqueApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        [HttpPost]
        public IActionResult Post([FromForm] EmployeeViewModel employeeView)
        {
            var filePath = Path.Combine("Storage", "Iremosfazerumtestes.png");

            using Stream fileStream = new FileStream(filePath, FileMode.Create);
            employeeView.Photo.CopyTo(fileStream);


            var employee = new Employee(employeeView.Name, employeeView.Age, filePath);

            return Ok();
            
        }
    }
}
