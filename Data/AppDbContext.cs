using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NetKubernetesAngular.Models;

namespace NetKubernetesAngular.Data
{
    public class AppDbContext : IdentityDbContext<Usuario>
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
        public DbSet<Inmueble> Inmuebles { get; set; }

    }
}
