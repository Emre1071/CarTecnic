using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace CarTecnicBackend.Models
{
    [Index(nameof(Tel), IsUnique = true)]
    public class Customer
    {
        [Key]
        public int CustomerId { get; set; }

        [Required, MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string Surname { get; set; } = string.Empty;

        [Required, MaxLength(15)]
        public string Tel { get; set; } = string.Empty;

        [MaxLength(15)]
        public string? HomeTel { get; set; }

        [MaxLength(100), EmailAddress]
        public string? Mail { get; set; }


        // İlişkiler
        public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
        public Financial? Financial { get; set; }

        // 💳 Müşteri ödeme ilişkisi (bire-çok)
        public ICollection<CustomerPayment> CustomerPayments { get; set; } = new List<CustomerPayment>();
    }
}
