using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarTecnicBackend.Data;
using CarTecnicBackend.Models;

namespace CarTecnicBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransactionController(AppDbContext context)
        {
            _context = context;
        }

        // 🔹 Tüm işlemleri getir
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
        {
            return await _context.Transactions
                .Include(t => t.Customer)
                .Include(t => t.Vehicle)
                .ToListAsync();
        }

      

        // 🔹 Yeni işlem ekle
        [HttpPost]
        public async Task<ActionResult<Transaction>> CreateTransaction(Transaction transaction)
        {
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFullTransaction), new { id = transaction.TransactionId }, transaction);
        }

        // 🔹 İşlem güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTransaction(int id, Transaction transaction)
        {
            if (id != transaction.TransactionId)
                return BadRequest();

            _context.Entry(transaction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Transactions.Any(t => t.TransactionId == id))
                    return NotFound();

                throw;
            }

            return NoContent();
        }

        // 🔹 İşlem sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
                return NotFound();

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        // 🔹 ID ile işlem getir
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetFullTransaction(int id)
        {
            var t = await _context.Transactions
                .Include(t => t.Customer)
                .Include(t => t.Vehicle)
                .FirstOrDefaultAsync(t => t.TransactionId == id);

            if (t == null)
                return NotFound();

            return Ok(new
            {
                formNo = t.TransactionId,
                ad = t.Customer?.Name ?? "",
                soyad = t.Customer?.Surname ?? "",
                telefon = t.Customer?.Tel ?? "",
                evTel = t.Customer?.HomeTel ?? "",
                mail = t.Customer?.Mail ?? "",
                plaka = t.Vehicle?.Plate ?? "",
                marka = t.Vehicle?.Brand ?? "",
                model = t.Vehicle?.Model ?? "",
                tip = t.Vehicle?.Type ?? "",
                status = t.Status,
                problem = t.Problem,
                result = t.Result,
                price = t.Price,
                department = t.Department,
                workerName = t.WorkerName,
                customerId = t.CustomerId
            });
        }





        // 🔍 Sayfa numarasına göre 20'şerli işlem verisi getir
        [HttpGet("pagedSearch")]
        public async Task<ActionResult<IEnumerable<object>>> GetPagedFilteredTransactions([FromQuery] string? q = "", [FromQuery] int page = 1)
        {
            const int pageSize = 20;

            var query = _context.Transactions
                .Include(t => t.Customer)
                .Include(t => t.Vehicle)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(q) && q.Trim().Length >= 2)
            {
                var keywords = q.ToLower().Trim().Split(" ", StringSplitOptions.RemoveEmptyEntries);

                if (keywords.Length >= 2)
                {
                    query = query.Where(t =>
                        keywords.All(k =>
                            (t.Customer.Name.ToLower().Contains(k)) ||
                            (t.Customer.Surname.ToLower().Contains(k))
                        ));
                }
                else
                {
                    string keyword = keywords[0];
                    query = query.Where(t =>
                        t.TransactionId.ToString().Contains(keyword) ||
                        t.Customer.Name.ToLower().Contains(keyword) ||
                        t.Customer.Surname.ToLower().Contains(keyword) ||
                        t.Customer.Tel.ToLower().Contains(keyword) ||
                        t.Vehicle.Plate.ToLower().Contains(keyword) ||
                        t.Vehicle.Brand.ToLower().Contains(keyword) ||
                        t.Vehicle.Model.ToLower().Contains(keyword) ||
                        t.Vehicle.Type.ToLower().Contains(keyword)
                    );
                }
            }

            var paged = await query
                .OrderByDescending(t => t.TransactionId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new
                {
                    FormNo = t.TransactionId,
                    Ad = t.Customer.Name,
                    Soyad = t.Customer.Surname,
                    Telefon = t.Customer.Tel,
                    Kategori = t.Vehicle.Type,
                    Ucret = t.Price + " TL"
                })
                .ToListAsync();

            return Ok(paged);
        }




        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<object>>> SearchTransactions([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q) || q.Trim().Length < 2)
                return BadRequest("En az iki harf giriniz.");

            q = q.ToLower().Trim();
            var keywords = q.Split(" ", StringSplitOptions.RemoveEmptyEntries);

            var transactions = await _context.Transactions
                .Include(t => t.Customer)
                .Include(t => t.Vehicle)
                .OrderByDescending(t => t.TransactionId)
                .ToListAsync();

            var seenCustomerIds = new HashSet<int>();
            var filtered = new List<Transaction>();

            foreach (var t in transactions)
            {
                if (seenCustomerIds.Contains(t.CustomerId))
                    continue;

                bool matches = false;

                // 🔹 2 kelime varsa sadece ad + soyad alanına bak
                if (keywords.Length >= 2)
                {
                    var name = t.Customer?.Name?.ToLower() ?? "";
                    var surname = t.Customer?.Surname?.ToLower() ?? "";

                    matches = keywords.All(k =>
                        name.Contains(k) || surname.Contains(k));
                }
                else
                {
                    var keyword = keywords[0];

                    matches =
                        t.TransactionId.ToString().Contains(keyword) ||
                        (t.Customer?.Name?.ToLower().Contains(keyword) ?? false) ||
                        (t.Customer?.Surname?.ToLower().Contains(keyword) ?? false) ||
                        (t.Customer?.Tel?.ToLower().Contains(keyword) ?? false) ||
                        (t.Vehicle?.Plate?.ToLower().Contains(keyword) ?? false) ||
                        (t.Vehicle?.Brand?.ToLower().Contains(keyword) ?? false) ||
                        (t.Vehicle?.Type?.ToLower().Contains(keyword) ?? false) ||
                        (t.Vehicle?.Model?.ToLower().Contains(keyword) ?? false);
                }

                if (matches)
                {
                    filtered.Add(t);
                    seenCustomerIds.Add(t.CustomerId);
                }

                if (filtered.Count >= 10)
                    break;
            }

            var result = filtered.Select(t => new
            {
                TransactionId = t.TransactionId,
                CustomerId = t.CustomerId,
                Ad = t.Customer?.Name ?? "",
                Soyad = t.Customer?.Surname ?? "",
                Telefon = t.Customer?.Tel ?? "",
                Plaka = t.Vehicle?.Plate ?? ""
            }).ToList();

            return Ok(result);
        }






    }
}
