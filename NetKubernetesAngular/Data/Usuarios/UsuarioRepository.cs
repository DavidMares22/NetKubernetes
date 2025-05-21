using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NetKubernetesAngular.Dtos.UsuarioDto;
using NetKubernetesAngular.Middleware;
using NetKubernetesAngular.Models;
using NetKubernetesAngular.Services;
using NetKubernetesAngular.Token;
using System.Net;

namespace NetKubernetesAngular.Data.Usuarios
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly UserManager<Usuario> _userManager;
        private readonly SignInManager<Usuario> _signInManager;
        private readonly IJwtGenerador _jwtGenerador;
        private readonly AppDbContext _contexto;
        private readonly IUsuarioSesion _usuarioSesion;

        private readonly IEmailService _emailService;

        public UsuarioRepository(
            UserManager<Usuario> userManager,
            SignInManager<Usuario> signInManager,
            IJwtGenerador jwtGenerador,
            AppDbContext contexto,
            IUsuarioSesion usuarioSesion,
            IEmailService emailService
        )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtGenerador = jwtGenerador;
            _contexto = contexto;
            _usuarioSesion = usuarioSesion;
            _emailService = emailService;
        }

        private UsuarioResponseDto TransformerUserToUserDto(Usuario usuario)
        {
            return new UsuarioResponseDto
            {
                Id = usuario.Id,
                Nombre = usuario.Nombre,
                Apellido = usuario.Apellido,
                Telefono = usuario.Telefono,
                Email = usuario.Email,
                UserName = usuario.UserName,
                Token = _jwtGenerador.CrearToken(usuario)
            };
        }



        public async Task<UsuarioResponseDto> GetUsuario()
        {
            var usuario = await _userManager.FindByNameAsync(_usuarioSesion.ObtenerUsuarioSesion());
            if (usuario is null)
            {
                throw new MiddlewareException(
                    HttpStatusCode.Unauthorized,
                    new { mensaje = "El usuario del token no existe en la base de datos" }
                );
            }
            return TransformerUserToUserDto(usuario!);
        }

        public async Task<UsuarioResponseDto> Login(UsuarioLoginRequestDto request)
        {
            var usuario = await _userManager.FindByEmailAsync(request.Email!);
            if (usuario is null)
            {
                throw new MiddlewareException(
                    HttpStatusCode.Unauthorized,
                    new { mensaje = "El email del usuario no existe en mi base de datos" }
                );
            }


            var resultado = await _signInManager.CheckPasswordSignInAsync(usuario!, request.Password!, false);
            if (resultado.Succeeded)
            {
                return TransformerUserToUserDto(usuario);
            }

            throw new MiddlewareException(
                 HttpStatusCode.Unauthorized,
                 new { mensaje = "Las credenciales son incorrectas" }
            );


            throw new System.Exception("No se pudo loguear el usuario");

        }

        public async Task<UsuarioResponseDto> RegistroUsuario(UsuarioRegistroRequestDto request)
        {
            var existeEmail = await _contexto.Users.Where(x => x.Email == request.Email).AnyAsync();
            if (existeEmail)
            {
                throw new MiddlewareException(
                    HttpStatusCode.BadRequest,
                    new { mensaje = "El email del usuario ya existe en la base de datos" }
                );
            }


            var existeUsername = await _contexto.Users.Where(x => x.UserName == request.UserName).AnyAsync();
            if (existeUsername)
            {
                throw new MiddlewareException(
                    HttpStatusCode.BadRequest,
                    new { mensaje = "El username del usuario ya existe en la base de datos" }
                );
            }


            var usuario = new Usuario
            {
                Nombre = request.Nombre,
                Apellido = request.Apellido,
                Telefono = request.Telefono,
                Email = request.Email,
                UserName = request.UserName,
            };

            var resultado = await _userManager.CreateAsync(usuario!, request.Password!);

            if (resultado.Succeeded)
            {
                return TransformerUserToUserDto(usuario);
            }

            throw new Exception("No se pudo registrar el usuario");


        }

        public async Task<ForgotPasswordResponseDto> ForgotPassword(ForgotPasswordRequestDto request)
        {
            var usuario = await _userManager.FindByEmailAsync(request.Email!);
            if (usuario == null)
            {
                throw new MiddlewareException(
                    HttpStatusCode.BadRequest,
                    new { mensaje = "El email del usuario no existe en la base de datos" }
                );
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(usuario);
            var callbackUrl = $"{request.clientUri}/auth/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(request.Email)}";

            // Send email (assumes you have IEmailService injected)
            var emailSent = await _emailService.SendPasswordResetEmailAsync(request.Email, callbackUrl);

            if (!emailSent)
            {
                throw new MiddlewareException(
                    HttpStatusCode.InternalServerError,
                    new { mensaje = "Error al enviar el correo de restablecimiento de contraseña" }
                );
            }

            return new ForgotPasswordResponseDto
            {
                Email = request.Email,
                Message = "Se ha enviado el enlace de restablecimiento de contraseña a su correo electrónico."
            };
        }


        public async Task<ResetPasswordResponseDto> ResetPasswordAsync(ResetPasswordRequestDto request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return new ResetPasswordResponseDto
                {
                    Success = false,
                    Errors = new[] { "User not found." }
                };
            }
            var decodedToken = Uri.UnescapeDataString(request.Token);

            var resetResult = await _userManager.ResetPasswordAsync(user, decodedToken, request.NewPassword);

            if (!resetResult.Succeeded)
            {
                var errors = resetResult.Errors.Select(e => e.Description);
                return new ResetPasswordResponseDto
                {
                    Success = false,
                    Errors = errors
                };
            }

            return new ResetPasswordResponseDto
            {
                Success = true,
                Errors = null
            };
        }



    }
}
