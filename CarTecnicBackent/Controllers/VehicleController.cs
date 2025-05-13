using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarTecnicBackend.Data;
using CarTecnicBackend.Models;

namespace CarTecnicBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehicleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VehicleController(AppDbContext context)
        {
            _context = context;
        }

        // 🔹 Tüm araçları getir
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetVehicles()
        {
            return await _context.Vehicles.ToListAsync();
        }

        // 🔹 Plakaya göre araç getir
        [HttpGet("{plate}")]
        public async Task<ActionResult<Vehicle>> GetVehicle(string plate)
        {
            var vehicle = await _context.Vehicles.FindAsync(plate);
            if (vehicle == null)
                return NotFound();

            return vehicle;
        }

        // 🔹 Yeni araç ekle
        [HttpPost]
        public async Task<ActionResult<Vehicle>> CreateVehicle(Vehicle vehicle)
        {
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVehicle), new { plate = vehicle.Plate }, vehicle);
        }

        // 🔹 Araç güncelle
        [HttpPut("{plate}")]
        public async Task<IActionResult> UpdateVehicle(string plate, Vehicle vehicle)
        {
            if (plate != vehicle.Plate)
                return BadRequest();

            _context.Entry(vehicle).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Vehicles.Any(v => v.Plate == plate))
                    return NotFound();

                throw;
            }

            return NoContent();
        }

        // 🔹 Araç sil
        [HttpDelete("{plate}")]
        public async Task<IActionResult> DeleteVehicle(string plate)
        {
            var vehicle = await _context.Vehicles.FindAsync(plate);
            if (vehicle == null)
                return NotFound();

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
