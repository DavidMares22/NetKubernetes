
namespace NetKubernetesAngular.Models;
public class EmailConfiguration
{
    public string Server { get; set; } = string.Empty;
    public int Port { get; set; }
    public string DefaultEmailAddress { get; set; } = string.Empty;
}
