using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarTecnicBackend.Data;
using CarTecnicBackend.Models;

namespace CarTecnicBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CustomerController(AppDbContext context)
        {
            _context = context;
        }

        // 🔹 Tüm müşterileri getir
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            return await _context.Customers.ToListAsync();
        }

        // 🔹 ID ile müşteri getir
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
                return NotFound();

            return customer;
        }

        // 🔹 Yeni müşteri oluştur
        [HttpPost]
        public async Task<ActionResult<Customer>> CreateCustomer(Customer customer)
        {
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCustomer), new { id = customer.CustomerId }, customer);
        }

        // 🔹 Müşteri güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, Customer customer)
        {
            if (id != customer.CustomerId)
                return BadRequest();

            _context.Entry(customer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Customers.Any(e => e.CustomerId == id))
                    return NotFound();

                throw;
            }

            return NoContent();
        }

        // 🔹 Müşteri sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
                return NotFound();

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // 🔍 Telefon numarasına göre ara
        [HttpGet("find-by-tel")]
        public async Task<ActionResult<Customer>> GetByTel([FromQuery] string tel)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Tel == tel);
            if (customer == null)
                return NotFound();

            return customer;
        }
    }
}
