using ControleEstoqueServices.AuthServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ControleEstoqueApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(AuthService _service) : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login()
        {
            var token = _service.GenerateJwtToken();
            return Ok(new { token });
        }
    }
}
