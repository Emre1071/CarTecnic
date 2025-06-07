using CarTecnicBackend.Data; // 📌 DbContext için gerekli
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ✅ VERİTABANI BAĞLANTISI
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ CORS AYARLARI
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost3000", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // React frontend için
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ✅ CONTROLLER & SWAGGER
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ✅ MIDDLEWARE
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 🟢 CORS aktif ediliyor (Authorization'dan önce!)
app.UseCors("AllowLocalhost3000");

app.UseAuthorization();
app.MapControllers();

app.Run();
