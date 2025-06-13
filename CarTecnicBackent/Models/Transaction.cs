using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarTecnicBackend.Models
{
    public class Transaction
    {
        [Key]
        public int TransactionId { get; set; }

        
        public int CustomerId { get; set; }
        public Customer? Customer { get; set; }  

        
        public string Plate { get; set; } = string.Empty;
        public Vehicle? Vehicle { get; set; }   

        [Required, MaxLength(50)]
        public string Status { get; set; } = "Bekliyor";

        [Required, MaxLength(255)]
        public string Problem { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? Result { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? Price { get; set; }

        [MaxLength(100)]
        public string? WorkerName { get; set; }

        [MaxLength(100)]
        public string? Department { get; set; }

        [MaxLength(100)]
        public string? Branch { get; set; }
    }
}
