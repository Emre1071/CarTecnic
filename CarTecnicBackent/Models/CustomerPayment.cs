using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarTecnicBackend.Models
{
    public class CustomerPayment
    {
        [Key]
        public int PaymentId { get; set; }

        // 🔗 Müşteri ile ilişki (bire-çok)
        [Required]
        public int CustomerId { get; set; }

        public Customer Customer { get; set; } = null!;

        // 💸 Ödeme miktarı
        [Column(TypeName = "decimal(10,2)")]
        public decimal PaymentAmount { get; set; }

        // 💳 Ödeme tipi (örnek: Nakit, Kredi Kartı)
        [MaxLength(50)]
        public string PaymentType { get; set; } = "Nakit";

        // 🗓️ Ödeme tarihi
        public DateTime PaymentDate { get; set; } = DateTime.Now;
    }
}
