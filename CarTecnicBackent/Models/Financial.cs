using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarTecnicBackend.Models
{
    public class Financial
    {
        [Key]
        [ForeignKey("Customer")] // Müşteri ile birebir bağlantı
        public int CustomerId { get; set; }

        public Customer Customer { get; set; } = null!;

        [Column(TypeName = "decimal(10,2)")]
        public decimal Debt { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalPayments { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal RemainingDebt { get; set; }
    }
}
