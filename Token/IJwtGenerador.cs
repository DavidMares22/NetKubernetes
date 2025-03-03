using NetKubernetesAngular.Models;

namespace NetKubernetesAngular.Token
{
    public interface IJwtGenerador
    {
        string CrearToken(Usuario usuario);
    }
}
