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

            var claimsDictionary = _httpContextAccessor.HttpContext!.User.Claims
                          .ToDictionary(c => c.Type, c => c.Value);
            // Get the userName from the claims of the current HTTP context.
            var userName = _httpContextAccessor.HttpContext!.User?.Claims?
                                .FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            return userName!;
        }
    }
}
