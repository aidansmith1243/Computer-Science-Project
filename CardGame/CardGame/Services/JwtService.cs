using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace CardGame.Services
{ 
    public class JwtService
    {
        private string secureKey = "aergt58s4rg36srd4gjtsers57kyufy5sxdgb";
        public string Generate(Guid id)
        {
            //var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secureKey));
            //var credentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256Signature);
            //var header = new JwtHeader(credentials);

            //var payload = new JwtPayload(id.ToString(), null, null, null, DateTime.Today.AddDays(1));
            //var securityToken = new JwtSecurityToken(header, payload);

            //return new JwtSecurityTokenHandler().WriteToken(securityToken);

            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secureKey));
            var credentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256Signature);
            //var header = new JwtHeader(credentials);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, id.ToString())
            };


            //var payload = new JwtPayload(id.ToString(), null, null, null, DateTime.Today.AddDays(1));
            var securityToken = new JwtSecurityToken(null, null, claims, expires: DateTime.Today.AddDays(1),signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(securityToken);
        }
        public bool Verify(string jwt)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secureKey);
            try
            {

                tokenHandler.ValidateToken(jwt, new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = false,
                    ValidateAudience = false
                }, out SecurityToken validatedToken);
            }
            catch
            {
                return false;
            }
            return true;
            
        }
    }
}
