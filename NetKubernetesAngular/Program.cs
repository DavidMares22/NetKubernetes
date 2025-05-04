
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using NetKubernetesAngular.Data.Inmuebles;
using NetKubernetesAngular.Data;
using NetKubernetesAngular.Middleware;
using NetKubernetesAngular.Profiles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using NetKubernetesAngular.Data.Usuarios;
using NetKubernetesAngular.Models;
using NetKubernetesAngular.Token;
using System.Text;
using Microsoft.AspNetCore.Authentication;

namespace NetKubernetesAngular
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

        //    var connectionString = Environment.GetEnvironmentVariable("SQLServerConnection");

        //     if (string.IsNullOrEmpty(connectionString))
        //     {
        //         connectionString = builder.Configuration.GetConnectionString("SQLServerConnection");
        //     }

           

            builder.Services.AddDbContext<AppDbContext>(opt => {
                opt.LogTo(Console.WriteLine, new[] {DbLoggerCategory.Database.Command.Name},
                    LogLevel.Information).EnableSensitiveDataLogging();

                opt.UseSqlServer(builder.Configuration.GetConnectionString("SQLServerConnection"));
            });

             builder.Logging.AddConsole(); 
            var logger = builder.Services.BuildServiceProvider().GetRequiredService<ILogger<Program>>();
            logger.LogInformation(" Connection String being used -> {ConnectionString}", builder.Configuration.GetConnectionString("SQLServerConnection"));


            builder.Services.AddScoped<IInmuebleRepository, InmuebleRepository>();

            // Add services to the container.

            builder.Services.AddControllers(opt =>
            {
                // Create an authorization policy that requires the user to be authenticated
                var policy = new AuthorizationPolicyBuilder()
                                .RequireAuthenticatedUser()
                                .Build();

                // Add the authorization policy to the filters, so it applies to all controllers
                opt.Filters.Add(new AuthorizeFilter(policy));
            });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Configure AutoMapper with the InmuebleProfile
            var mapperConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new InmuebleProfile()); // Add the InmuebleProfile to the configuration
            });

            // Create an IMapper instance using the configuration
            IMapper mapper = mapperConfig.CreateMapper();
            // Register the IMapper instance as a singleton service in the dependency injection container
            builder.Services.AddSingleton(mapper);

            // Add IdentityCore services for the Usuario entity
            var builderSecurity = builder.Services.AddIdentityCore<Usuario>();

            // Create an IdentityBuilder for the Usuario entity
            var identityBuilder = new IdentityBuilder(builderSecurity.UserType, builder.Services);

            // Add Entity Framework stores for the Identity system
            identityBuilder.AddEntityFrameworkStores<AppDbContext>();

            // Add SignInManager service for the Usuario entity
            identityBuilder.AddSignInManager<SignInManager<Usuario>>();

            // Add a singleton service for the system clock
            builder.Services.AddSingleton<TimeProvider>(TimeProvider.System);
            //builder.Services.AddSingleton<ISystemClock, SystemClock>();

            // Add a scoped service for generating JWT tokens
            builder.Services.AddScoped<IJwtGenerador, JwtGenerador>();

            // Add a scoped service for managing user sessions
            builder.Services.AddScoped<IUsuarioSesion, UsuarioSesion>();

            // Add a scoped service for user repository
            builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();

            // Create a symmetric security key for JWT token signing
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]));

            // Configure JWT authentication
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                            .AddJwtBearer(opt =>
                            {
                                opt.TokenValidationParameters = new TokenValidationParameters
                                {
                                    ValidateIssuerSigningKey = true, // Validate the signing key
                                    IssuerSigningKey = key, // Set the signing key
                                    ValidateAudience = false, // Do not validate the audience
                                    ValidateIssuer = false // Do not validate the issuer
                                };
                            });

            // Configure CORS policy to allow any origin, method, and header
            builder.Services.AddCors(o => o.AddPolicy("corsapp", builder =>
            {
                 builder.WithOrigins("http://front.local:8086")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
            }));

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseMiddleware<ManagerMiddleware>();


            app.UseCors("corsapp");
            app.UseAuthentication();


            app.UseAuthorization();


            app.MapControllers();


            // Run the asynchronous code in a separate method
            Task.Run(async () =>
            {

                using (var ambiente = app.Services.CreateScope())
                {
                var services = ambiente.ServiceProvider;

                try
                {
                    var userManager = services.GetRequiredService<UserManager<Usuario>>();
                    var context = services.GetRequiredService<AppDbContext>();
                    await context.Database.MigrateAsync();
                    await LoadDatabase.InsertarData(context, userManager);

                }
                catch (Exception e)
                {
                    var logging = services.GetRequiredService<ILogger<Program>>();
                    logging.LogError(e, "Ocurrio un error en la migracion");
                }
               }
             }).GetAwaiter().GetResult();


            app.Run();
        }
    }
}
