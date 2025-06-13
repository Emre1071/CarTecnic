using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarTecnicBackend.Models
{
    public class CustomerPayment
    {
        [Key]
        public int PaymentId { get; set; }

       
        [Required]
        public int CustomerId { get; set; }

        public Customer? Customer { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal PaymentAmount { get; set; }

        [MaxLength(50)]
        public string PaymentType { get; set; } = "Nakit";

        public DateTime PaymentDate { get; set; } = DateTime.Now;
    }
}
