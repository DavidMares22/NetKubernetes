using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NetKubernetesAngular.Data.Usuarios;
using NetKubernetesAngular.Dtos.UsuarioDto;

namespace NetKubernetesAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {

        private readonly IUsuarioRepository _repository;

        public UsuarioController(IUsuarioRepository repository)
        {
            _repository = repository;
        }


        [HttpPost("resetpassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto request)
        {
            var result = await _repository.ResetPasswordAsync(request);
            if (!result.Success)
            {
                return BadRequest(result.Errors);
            }
            return Ok("Contraseña ha sido cambiada exitosamente.");
        }


        [HttpPost("forgotpassword")]
        public async Task<ActionResult<ForgotPasswordResponseDto>> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
        {
            var result = await _repository.ForgotPassword(request);

            if (result == null)
            {
                return BadRequest("Error al enviar el correo");
            }

            return Ok(result);
        }



        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UsuarioResponseDto>> Login(
            [FromBody] UsuarioLoginRequestDto request
        )
        {

            return await _repository.Login(request);

        }


        [AllowAnonymous]
        [HttpPost("registrar")]
        public async Task<ActionResult<UsuarioResponseDto>> registrar(
            [FromBody] UsuarioRegistroRequestDto request
        )
        {

            return await _repository.RegistroUsuario(request);

        }


        [HttpGet]
        public async Task<ActionResult<UsuarioResponseDto>> DevolverUsuario()
        {

            return await _repository.GetUsuario();

        }




    }
}
