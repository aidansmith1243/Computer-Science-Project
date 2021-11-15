using CardGame.Models;
using CardGame.Models.Database;
using CardGame.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CryptoHelper;
using CardGame.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CardGame.Controllers
{
    [Route("auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        CardGameRepository _cardGameRepository;
        JwtService _jwtService;
        public AuthController(CardGameRepository cardGameRepository, JwtService jwtService)
        {
            _cardGameRepository = cardGameRepository;
            _jwtService = jwtService;
        }
        [HttpPost("register")]
        public IActionResult Post([FromBody] RegisterDto dto)
        {
            Console.WriteLine("POST: register");
            Console.WriteLine($"Username {dto.Username}\n" +
                $"Email {dto.Email}\n" +
                $"Password {dto.Password}");
            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                Password = Crypto.HashPassword(dto.Password)
            };
            return Created("success", _cardGameRepository.CreateUser(user));
        }

        [HttpPost("login")]
        public IActionResult Post([FromBody] LoginDto dto)
        {
            Console.WriteLine("POST: login");
            var user = _cardGameRepository.GetUserByUsername(dto.Username);
            if (user == null) return BadRequest(new { message = "Invalid Credentials" });

            if (user == null || !Crypto.VerifyHashedPassword(user.Password, dto.Password))
            {
                return BadRequest(new { message = "Invalid Credentials" });
            }

            var jwt = _jwtService.Generate(user.UserId);

            Response.Cookies.Append("jwt", jwt, new Microsoft.AspNetCore.Http.CookieOptions
            {
                HttpOnly = true
            });

            return Ok(new
            {
                message = "success"
            });
        }

        
    }
}
