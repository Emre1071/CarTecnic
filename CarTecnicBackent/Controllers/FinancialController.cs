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

        // 🔸 Yeni ödeme ekle
        [HttpPost("add-payment")]
        public async Task<IActionResult> AddPayment([FromBody] CustomerPayment payment)
        {
            // 🧾 Geçerli müşteri kontrolü
            var customerExists = await _context.Customers.AnyAsync(c => c.CustomerId == payment.CustomerId);
            if (!customerExists)
                return NotFound("Belirtilen müşteri bulunamadı.");

            // 🕒 Ödeme tarihini şu an olarak ata
            payment.PaymentDate = DateTime.Now;

            _context.Add(payment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "✅ Ödeme başarıyla kaydedildi.",
                paymentId = payment.PaymentId,
                date = payment.PaymentDate
            });
        }




    }
}
