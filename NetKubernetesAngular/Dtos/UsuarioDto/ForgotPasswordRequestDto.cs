using System.ComponentModel.DataAnnotations;

namespace NetKubernetesAngular.Dtos.UsuarioDto
{
    public class ForgotPasswordRequestDto
    {
        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        public string? clientUri { get; set; }
    }
}
