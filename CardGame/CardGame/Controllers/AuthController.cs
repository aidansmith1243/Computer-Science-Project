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
using System.Net;
using Microsoft.AspNetCore.Server.HttpSys;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;

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
            //todo limit to only certain characters
            Console.WriteLine("POST: register");
            Console.WriteLine($"Username {dto.Username}\n" +
                $"Email {dto.Email}\n" +
                $"Password {dto.Password}");

            var users = _cardGameRepository.GetUsers();
            if (users.Where(x => x.Username == dto.Username || x.Email == dto.Email).ToList().Count > 0)
            {
                return BadRequest();
            }
            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                Password = Crypto.HashPassword(dto.Password)
            };
            var createdUser = _cardGameRepository.CreateUser(user);
            
            if (createdUser == null)
                return BadRequest();
            return Created("success",true);
        }


        [HttpPost("login")]
        public IActionResult Post([FromBody] LoginDto dto)
        {
            Console.WriteLine("POST: login");
            var user = _cardGameRepository.GetUserByUsername(dto.Username);

            if (user == null || !Crypto.VerifyHashedPassword(user.Password, dto.Password))
            {
                return BadRequest(new { message = "Invalid Credentials" });
            }

            var jwt = _jwtService.Generate(user.UserId);

            Response.Cookies.Append("access_token", jwt, new Microsoft.AspNetCore.Http.CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.None,
                Secure = true
            });

            return Ok(new
            {
                message = "success",
            });
        }
        [HttpPost("logout")]
        public IActionResult Post()
        {
            Console.WriteLine("POST: logout");

            Response.Cookies.Delete("access_token");

            return Ok(new
            {
                message = "success",
            });
        }
    }
}
