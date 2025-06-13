using Microsoft.AspNetCore.Mvc;
using CarTecnicBackend.Data;
using CarTecnicBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace CarTecnicBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        //  Kullanıcı girişi
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User loginData)
        {
            if (string.IsNullOrWhiteSpace(loginData.Username) || string.IsNullOrWhiteSpace(loginData.Password))
                return BadRequest("Kullanıcı adı ve şifre zorunludur.");

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == loginData.Username && u.Password == loginData.Password);

            if (user == null)
                return Unauthorized("Kullanıcı adı veya şifre yanlış.");

            // Şifre geri gönderilmez
            return Ok(new
            {
                user.UserId,
                user.Username
            });
        }

        //  Şifre değiştirme
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) ||
                string.IsNullOrWhiteSpace(dto.CurrentPassword) ||
                string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                return BadRequest("Tüm alanlar zorunludur.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);

            if (user == null)
                return NotFound("Kullanıcı bulunamadı.");

            if (user.Password != dto.CurrentPassword)
                return BadRequest("Mevcut şifre hatalı.");

            user.Password = dto.NewPassword;
            await _context.SaveChangesAsync();

            return Ok("Şifre başarıyla değiştirildi.");
        }
    }

    //  Şifre Değiştirme DTO
    public class ChangePasswordDto
    {
        public string Username { get; set; } = string.Empty;
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
