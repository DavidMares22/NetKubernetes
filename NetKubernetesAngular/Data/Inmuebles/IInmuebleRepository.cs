using NetKubernetesAngular.Models;

namespace NetKubernetesAngular.Data.Inmuebles
{
    public interface IInmuebleRepository
    {
        Task<bool> SaveChanges();

        Task<IEnumerable<Inmueble>> GetAllInmuebles();

        Task<Inmueble> GetInmuebleById(int id);

        Task CreateInmueble(Inmueble inmueble);

        Task DeleteInmueble(int id);
    }
}
