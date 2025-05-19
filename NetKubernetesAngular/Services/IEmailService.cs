namespace NetKubernetesAngular.Services
{
    public interface IEmailService
{
    Task<bool> SendPasswordResetEmailAsync(string toEmail, string callbackUrl);
}

}