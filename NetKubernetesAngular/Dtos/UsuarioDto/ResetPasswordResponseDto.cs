namespace NetKubernetesAngular.Dtos.UsuarioDto
{


    public class ResetPasswordResponseDto
{
    public bool Success { get; set; }
    public IEnumerable<string>? Errors { get; set; }

    public ResetPasswordResponseDto()
    {
    }

    public ResetPasswordResponseDto(bool success, IEnumerable<string>? errors = null)
    {
        Success = success;
        Errors = errors;
    }
}

}