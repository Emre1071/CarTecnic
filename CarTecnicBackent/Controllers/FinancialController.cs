using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarTecnicBackend.Data;
using CarTecnicBackend.Models;

namespace CarTecnicBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FinancialController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FinancialController(AppDbContext context)
        {
            _context = context;
        }

        // 🔹 Tüm finansal kayıtları getir
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Financial>>> GetAll()
        {
            return await _context.Financials
                .Include(f => f.Customer)
                .ToListAsync();
        }

        // 🔹 Müşteri ID ile finansal kayıt getir
        [HttpGet("{customerId}")]
        public async Task<ActionResult<Financial>> GetByCustomerId(int customerId)
        {
            var financial = await _context.Financials
                .Include(f => f.Customer)
                .FirstOrDefaultAsync(f => f.CustomerId == customerId);

            if (financial == null)
                return NotFound();

            return financial;
        }

        // 🔹 Yeni finansal kayıt oluştur
        [HttpPost]
        public async Task<ActionResult<Financial>> Create(Financial financial)
        {
            // 🧠 Kalan borcu otomatik hesapla
            financial.RemainingDebt = financial.Debt - financial.TotalPayments;

            _context.Financials.Add(financial);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetByCustomerId), new { customerId = financial.CustomerId }, financial);
        }

        // 🔹 Kayıt güncelle (örneğin ödeme yapıldı)
        [HttpPut("{customerId}")]
        public async Task<IActionResult> Update(int customerId, Financial financial)
        {
            if (customerId != financial.CustomerId)
                return BadRequest();

            // 🧠 Kalan borcu güncelle
            financial.RemainingDebt = financial.Debt - financial.TotalPayments;

            _context.Entry(financial).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Financials.Any(f => f.CustomerId == customerId))
                    return NotFound();

                throw;
            }

            return NoContent();
        }

        // 🔹 Finansal kayıt sil
        [HttpDelete("{customerId}")]
        public async Task<IActionResult> Delete(int customerId)
        {
            var record = await _context.Financials.FindAsync(customerId);
            if (record == null)
                return NotFound();

            _context.Financials.Remove(record);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
