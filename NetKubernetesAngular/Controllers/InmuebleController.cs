﻿using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using NetKubernetesAngular.Data.Inmuebles;
using NetKubernetesAngular.Dtos.InmuebleDto;
using NetKubernetesAngular.Middleware;
using NetKubernetesAngular.Models;
using System.Net;

namespace NetKubernetesAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InmuebleController : ControllerBase
    {

        private readonly IInmuebleRepository _repository;
        private IMapper _mapper;

        public InmuebleController(
            IInmuebleRepository repository,
            IMapper mapper
        )
        {
            _mapper = mapper;
            _repository = repository;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<InmuebleResponseDto>>> GetInmuebles()
        {
            var inmuebles = await _repository.GetAllInmuebles();
            return Ok(_mapper.Map<IEnumerable<InmuebleResponseDto>>(inmuebles));
        }


        [HttpGet("{id}", Name = "GetInmuebleById")]
        public async Task<ActionResult<InmuebleResponseDto>> GetInmuebleById(int id)
        {
            var inmueble = await _repository.GetInmuebleById(id);

            if (inmueble is null)
            {
                throw new MiddlewareException(
                    HttpStatusCode.NotFound,
                    new { mensaje = $"No se encontro el inmueble por este id {id}" }
                );

            }


            return Ok(_mapper.Map<InmuebleResponseDto>(inmueble));

        }

        [HttpPost]
        public async Task<ActionResult<InmuebleResponseDto>> CreateInmueble([FromBody] InmuebleRequestDto inmueble)
        {
            var inmuebleModel = _mapper.Map<Inmueble>(inmueble);
            await _repository.CreateInmueble(inmuebleModel);
            await _repository.SaveChanges();

            var inmuebleResponse = _mapper.Map<InmuebleResponseDto>(inmuebleModel);

            return CreatedAtRoute(nameof(GetInmuebleById), new { inmuebleResponse.Id }, inmuebleResponse);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteInmueble(int id)
        {
            await _repository.DeleteInmueble(id);
            await _repository.SaveChanges();
            return Ok();
        }


        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateInmueble(int id, [FromBody] InmuebleRequestDto inmuebleDto)
        {
            var inmuebleModel = _mapper.Map<Inmueble>(inmuebleDto);
            await _repository.UpdateInmueble(id, inmuebleModel);
            var result = await _repository.SaveChanges();

            if (!result)
            {
                throw new MiddlewareException(
                    HttpStatusCode.InternalServerError,
                    new { mensaje = "No se pudieron guardar los cambios." }
                );
            }

            return NoContent(); // 204
        }







    }
}
