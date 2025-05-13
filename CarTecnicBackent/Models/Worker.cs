using System.ComponentModel.DataAnnotations;

namespace CarTecnicBackend.Models
{
    public class Worker
    {
        [Key]
        public int WorkerId { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Department { get; set; }
    }
}
