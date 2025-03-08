using AutoMapper;
using NetKubernetesAngular.Dtos.InmuebleDto;
using NetKubernetesAngular.Models;

namespace NetKubernetesAngular.Profiles
{
    public class InmuebleProfile : Profile
    {

        public InmuebleProfile()
        {
            CreateMap<Inmueble, InmuebleResponseDto>();
            CreateMap<InmuebleRequestDto, Inmueble>();
        }

    }
}
