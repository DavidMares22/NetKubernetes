using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NetKubernetesAngular.Middleware;
using NetKubernetesAngular.Models;
using NetKubernetesAngular.Token;
using System.Net;

namespace NetKubernetesAngular.Data.Inmuebles
{
    public class InmuebleRepository : IInmuebleRepository
    {

        private readonly AppDbContext _contexto;
        private readonly IUsuarioSesion _usuarioSesion;
        private readonly UserManager<Usuario> _userManager;

        public InmuebleRepository(
            AppDbContext contexto,
            IUsuarioSesion sesion,
            UserManager<Usuario> userManager
        )
        {
            _contexto = contexto;
            _usuarioSesion = sesion;
            _userManager = userManager;
        }

        public async Task CreateInmueble(Inmueble inmueble)
        {
            var usuario = await _userManager.FindByNameAsync(_usuarioSesion.ObtenerUsuarioSesion());
            if (usuario is null)
            {
                throw new MiddlewareException(
                    HttpStatusCode.Unauthorized,
                    new { mensaje = "El usuario no es valido para hacer esta insercion" }
                );
            }

            if (inmueble is null)
            {
                throw new MiddlewareException(
                    HttpStatusCode.BadRequest,
                    new { mensaje = "Los datos del inmueble son incorrectos" }
                );
            }


            inmueble.FechaCreacion = DateTime.Now;
            inmueble.UsuarioId = Guid.Parse(usuario!.Id);

            await _contexto.Inmuebles!.AddAsync(inmueble);
        }

        public async Task DeleteInmueble(int id)
        {
            var inmueble = await _contexto.Inmuebles!
                                .FirstOrDefaultAsync(x => x.Id == id);

            _contexto.Inmuebles!.Remove(inmueble!);
        }

        public async Task<IEnumerable<Inmueble>> GetAllInmuebles()
        {
            return await _contexto.Inmuebles!.ToListAsync();
        }

        // public async Task<Inmueble> GetInmuebleById(int id)
        // {
        //     return await _contexto.Inmuebles!.FirstOrDefaultAsync(x => x.Id == id)!;
        // }

        public async Task<Inmueble?> GetInmuebleById(int id)
        {
            return _contexto.Inmuebles == null
                ? null
                : await _contexto.Inmuebles.FirstOrDefaultAsync(x => x.Id == id);
        }
        // More or equal to 0 means that the changes were saved successfully.
        public async Task<bool> SaveChanges()
        {
            return ((await _contexto.SaveChangesAsync()) >= 0);
        }


        public async Task UpdateInmueble(int id, Inmueble updatedInmueble)
        {
            var existingInmueble = await _contexto.Inmuebles!.FirstOrDefaultAsync(x => x.Id == id);

            if (existingInmueble == null)
            {
                throw new MiddlewareException(
                    HttpStatusCode.NotFound,
                    new { mensaje = $"No se encontró el inmueble con id {id}" }
                );
            }

            // Optional: Check that the user making the update is the owner
            var usuario = await _userManager.FindByNameAsync(_usuarioSesion.ObtenerUsuarioSesion());
            if (usuario == null || existingInmueble.UsuarioId != Guid.Parse(usuario.Id))
            {
                throw new MiddlewareException(
                    HttpStatusCode.Unauthorized,
                    new { mensaje = "No tiene permisos para modificar este inmueble" }
                );
            }

            // Update fields
            existingInmueble.Nombre = updatedInmueble.Nombre;
            existingInmueble.Direccion = updatedInmueble.Direccion;
            existingInmueble.Precio = updatedInmueble.Precio;
            existingInmueble.FechaCreacion = DateTime.Now;

            _contexto.Inmuebles.Update(existingInmueble);
        }

    }
}
