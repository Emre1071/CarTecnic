using Microsoft.EntityFrameworkCore;
using CarTecnicBackend.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace CarTecnicBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Tablolar
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Financial> Financials { get; set; }
        public DbSet<Worker> Workers { get; set; }
        public DbSet<CustomerPayment> CustomerPayments { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Müşteri telefon no unique olacak
            modelBuilder.Entity<Customer>()
                .HasIndex(c => c.Tel)
                .IsUnique();

            // Araç primary key = Plate
            modelBuilder.Entity<Vehicle>()
                .HasKey(v => v.Plate);

            // Finansal tablo birebir bağlantılı
            modelBuilder.Entity<Financial>()
                .HasKey(f => f.CustomerId);
            modelBuilder.Entity<Financial>()
                .HasOne(f => f.Customer)
                .WithOne(c => c.Financial)
                .HasForeignKey<Financial>(f => f.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);

            // Transaction → Vehicle ilişki
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Vehicle)
                .WithMany(v => v.Transactions)
                .HasForeignKey(t => t.Plate)
                .HasPrincipalKey(v => v.Plate)
                .OnDelete(DeleteBehavior.NoAction);

            // Transaction → Customer ilişki
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Customer)
                .WithMany(c => c.Transactions)
                .HasForeignKey(t => t.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);


            // Customer ↔ CustomerPayment (bire-çok)
            modelBuilder.Entity<CustomerPayment>()
                .HasOne(p => p.Customer)
                .WithMany(c => c.CustomerPayments)
                .HasForeignKey(p => p.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);



        }
    }
}
