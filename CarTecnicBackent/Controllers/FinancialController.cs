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

        // Tüm finansal kayıtları getir
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Financial>>> GetAll()
        {
            return await _context.Financials
                .Include(f => f.Customer)
                .ToListAsync();
        }

        //  Müşteri ID ile finansal kayıt getir
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

        //  Yeni ödeme ekle
        [HttpPost("add-payment")]
        public async Task<IActionResult> AddPayment([FromBody] CustomerPayment payment)
        {
            //  Geçerli müşteri kontrolü
            var customerExists = await _context.Customers.AnyAsync(c => c.CustomerId == payment.CustomerId);
            if (!customerExists)
                return NotFound("Belirtilen müşteri bulunamadı.");

            //  Ödeme tarihini şu an olarak ata
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


        [HttpGet("summary/{customerId}")]
        public async Task<IActionResult> GetFinancialSummary(int customerId)
        {
            //  Toplam Borç = Customer'ın tüm işlemlerindeki Price toplamı
            var totalDebt = await _context.Transactions
                .Where(t => t.CustomerId == customerId)
                .SumAsync(t => t.Price ?? 0);

            //  Toplam Ödeme = Bu müşterinin yaptığı tüm ödemelerin toplamı
            var totalPaid = await _context.Set<CustomerPayment>()
                .Where(p => p.CustomerId == customerId)
                .SumAsync(p => p.PaymentAmount);

            //  Kalan Borç = Borç - Ödeme
            var remaining = totalDebt - totalPaid;

            return Ok(new
            {
                totalDebt = totalDebt.ToString("0.00"),
                totalPaid = totalPaid.ToString("0.00"),
                remaining = remaining.ToString("0.00")
            });
        }



        //  Müşteriye ait tüm ödeme kayıtlarını getir
        [HttpGet("payments/{customerId}")]
        public async Task<IActionResult> GetCustomerPayments(int customerId)
        {
            var payments = await _context.CustomerPayments
                .Where(p => p.CustomerId == customerId)
                .OrderByDescending(p => p.PaymentDate)
                .Select(p => new
                {
                    p.PaymentAmount,
                    p.PaymentType,
                    PaymentDate = p.PaymentDate.ToString("yyyy-MM-dd HH:mm:ss")
                })
                .ToListAsync();

            return Ok(payments);
        }





    }
}
