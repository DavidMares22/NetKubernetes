using System.Security.Claims;

namespace NetKubernetesAngular.Token
{ 
    public class UsuarioSesion : IUsuarioSesion
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        // Constructor that accepts an IHttpContextAccessor to access the current HTTP context.
        public UsuarioSesion(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
 
        public string ObtenerUsuarioSesion()
        {
            // Access the current HTTP context and retrieve the user's claims.
            var userName = _httpContextAccessor.HttpContext!.User?.Claims?
                                .FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            // Return the user's name identifier.
            return userName!;
        }
    }
}
