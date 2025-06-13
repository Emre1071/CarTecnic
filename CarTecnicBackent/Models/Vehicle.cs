using System.ComponentModel.DataAnnotations;

namespace CarTecnicBackend.Models
{
    public class Vehicle
    {
        [Key]
        public string Plate { get; set; } = string.Empty; 

        [Required, MaxLength(100)]
        public string Brand { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string Type { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Model { get; set; } = string.Empty;

        public int CustomerId { get; set; }
        public Customer? Customer { get; set; }
        
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
