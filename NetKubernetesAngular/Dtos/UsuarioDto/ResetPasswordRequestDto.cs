namespace NetKubernetesAngular.Dtos.UsuarioDto
{

    public class ResetPasswordRequestDto
    {
        public string Email { get; set; } = null!;
        public string Token { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }


}