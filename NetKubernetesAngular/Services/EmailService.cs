namespace NetKubernetesAngular.Services
{
    using System.Net;
    using System.Net.Mail;
    using Microsoft.Extensions.Options;
    using NetKubernetesAngular.Models;

    public class EmailService : IEmailService
    {
        private readonly EmailConfiguration _config;

        public EmailService(IOptions<EmailConfiguration> config)
        {
            _config = config.Value;
        }

        public async Task<bool> SendPasswordResetEmailAsync(string toEmail, string callbackUrl)
        {
            try
            {
                var message = new MailMessage
                {
                    From = new MailAddress(_config.DefaultEmailAddress),
                    Subject = "Restablecer contraseña",
                    Body = $"Haz clic en el siguiente enlace para restablecer tu contraseña: {callbackUrl}",
                    IsBodyHtml = false
                };

                message.To.Add(new MailAddress(toEmail));

                using var client = new SmtpClient(_config.Server, _config.Port)
                {
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = true // Adjust this if you need authentication
                };

                await client.SendMailAsync(message);
                return true;
            }
            catch
            {
                // Log error in real-world apps
                return false;
            }
        }
    }

}