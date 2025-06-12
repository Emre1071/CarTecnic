using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarTecnicBackent.Migrations
{
    /// <inheritdoc />
    public partial class AddBranchToTransaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Branch",
                table: "Transactions",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Branch",
                table: "Transactions");
        }
    }
}
