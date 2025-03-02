using Microsoft.AspNetCore.Identity;
using NetKubernetesAngular.Models;

namespace NetKubernetesAngular.Data
{
    public class LoadDatabase
    {

        public static async Task InsertarData(AppDbContext context, UserManager<Usuario> usuarioManager)
        {
            if (!usuarioManager.Users.Any())
            {
                var usuario = new Usuario
                {
                    Nombre = "Dave",
                    Apellido = "More",
                    Email = "DaveMore@gmail.com",
                    UserName = "dave.more",
                    Telefono = "98142545"
                };

                await usuarioManager.CreateAsync(usuario, "Password123!");

            }

            if (!context.Inmuebles!.Any())
            {
                context.Inmuebles!.AddRange(
                    new Inmueble
                    {
                        Nombre = "Casa de Playa",
                        Direccion = "Av. El Sol 32",
                        Precio = 4500M,
                        FechaCreacion = DateTime.Now
                    },
                    new Inmueble
                    {
                        Nombre = "Casa de Invierno",
                        Direccion = "Av. La Roca 101",
                        Precio = 3500M,
                        FechaCreacion = DateTime.Now
                    }
                );
            }

            context.SaveChanges();
        }
    }
}
