# Masraf Raporu - Backend API Beklentileri

## Frontend Hazır, Backend API'leri Bekleniyor

### 1. Masraf Raporu Listele API

**Endpoint:** `worker.php`
**POST Parameter:** `masrafRaporuListele = "1"`

**Beklenen Response Format:**
```json
{
    "status": 1,
    "message": "Masraf raporu başarıyla getirildi",
    "data": [
        {
            "id": 1,
            "tarih": "2024-01-15",
            "aciklama": "Ofis malzemeleri",
            "tutar": 500.00,
            "odeme_grubu": "Ofis Giderleri",
            "odeme_alt_grubu": "Kırtasiye",
            "is_adi": "Proje A",
            "kategori": "Operasyonel",
            "durum": "Onaylandı"
        }
    ]
}
```

### 2. Masraf Raporu Filtrele API

**Endpoint:** `worker.php`
**POST Parameters:**
- `masrafRaporuFiltrele = "1"`
- `tarihBaslangic` (optional)
- `tarihBitis` (optional)
- `odemeGrubu` (optional)
- `odemeAltGrubu` (optional)
- `isAdi` (optional)
- `kategori` (optional)

**Beklenen Response Format:**
```json
{
    "status": 1,
    "message": "Masraf raporu filtrelendi",
    "data": [
        {
            "id": 1,
            "tarih": "2024-01-15",
            "aciklama": "Ofis malzemeleri",
            "tutar": 500.00,
            "odeme_grubu": "Ofis Giderleri",
            "odeme_alt_grubu": "Kırtasiye",
            "is_adi": "Proje A",
            "kategori": "Operasyonel",
            "durum": "Onaylandı"
        }
    ]
}
```

### 3. Veri Formatı Açıklamaları

- **id:** Masraf kaydının benzersiz ID'si
- **tarih:** Masraf tarihi (YYYY-MM-DD formatında)
- **aciklama:** Masraf açıklaması
- **tutar:** Tutar (sayısal değer)
- **odeme_grubu:** Ödeme grubu (string)
- **odeme_alt_grubu:** Ödeme alt grubu (string)
- **is_adi:** İş/proje adı
- **kategori:** Masraf kategorisi
- **durum:** Masraf durumu (Onaylandı, Beklemede, Reddedildi)

### 4. Ödeme Grupları API

**Endpoint:** `worker.php`
**POST Parameter:** `masrafRaporuOdemeGruplari = "1"`

**Beklenen Response Format:**
```json
{
    "status": 1,
    "message": "Ödeme grupları başarıyla getirildi",
    "data": [
        {
            "id": 1,
            "grup_adi": "Ofis Giderleri"
        },
        {
            "id": 2,
            "grup_adi": "Seyahat Giderleri"
        }
    ]
}
```

### 5. Ödeme Alt Grupları API

**Endpoint:** `worker.php`
**POST Parameter:** `masrafRaporuOdemeAltGruplari = "1"`

**Beklenen Response Format:**
```json
{
    "status": 1,
    "message": "Ödeme alt grupları başarıyla getirildi",
    "data": [
        {
            "id": 1,
            "alt_grup_adi": "Kırtasiye",
            "grup_id": 1
        },
        {
            "id": 2,
            "alt_grup_adi": "Temizlik",
            "grup_id": 1
        }
    ]
}
```

### 6. Grup Bazlı Alt Gruplar API

**Endpoint:** `worker.php`
**POST Parameters:**
- `masrafRaporuOdemeAltGruplariByGrup = "1"`
- `odemeGrubu` (seçilen grup adı)

**Beklenen Response Format:**
```json
{
    "status": 1,
    "message": "Grup bazlı alt gruplar getirildi",
    "data": [
        {
            "id": 1,
            "alt_grup_adi": "Kırtasiye",
            "grup_id": 1
        }
    ]
}
```

### 7. İş Adları API

**Endpoint:** `worker.php`
**POST Parameter:** `masrafRaporuIsAdlari = "1"`

**Beklenen Response Format:**
```json
{
    "status": 1,
    "message": "İş adları başarıyla getirildi",
    "data": [
        {
            "id": 1,
            "is_adi": "Proje A"
        },
        {
            "id": 2,
            "is_adi": "Proje B"
        },
        {
            "id": 3,
            "is_adi": "Genel Giderler"
        }
    ]
}
```

### 7. Frontend Durumu

✅ **Hazır Olanlar:**
- DataTable yapılandırması
- Filtreleme formu
- Export butonları (Excel, PDF, Print, ColVis)
- Özet kartları
- Hata yönetimi
- Responsive tasarım
- Ödeme grubu ve alt grup dropdown'ları (fallback verilerle çalışıyor)
- İş adı dropdown'ı (fallback verilerle çalışıyor)

⏳ **Backend API'leri Bekleniyor:**
- `masrafRaporuListele`
- `masrafRaporuFiltrele`
- `masrafRaporuOdemeGruplari`
- `masrafRaporuOdemeAltGruplari`
- `masrafRaporuOdemeAltGruplariByGrup`
- `masrafRaporuIsAdlari`

### 5. DataTable Sütunları

1. **İşlemler** - Detay görüntüleme butonu
2. **Tarih** - Masraf tarihi
3. **Açıklama** - Masraf açıklaması
4. **Tutar** - Tutar (para formatında)
5. **Ödeme Grubu** - Ödeme grubu
6. **Ödeme Alt Grubu** - Ödeme alt grubu
7. **İş Adı** - İş/proje adı
8. **Kategori** - Masraf kategorisi
9. **Durum** - Masraf durumu

### 6. Test Etme

Backend API'leri hazır olduğunda:
1. Masraf Raporu sayfasına git
2. Sayfa yüklendiğinde veriler gelecek
3. Filtrele butonuna bas, filtrelenmiş veriler gelecek
4. Export butonları çalışacak
5. Özet kartları güncellenecek

### 7. Hata Durumları

- API hazır değilse: Boş tablo gösterilir, hata mesajı verilir
- Veri yoksa: Boş tablo gösterilir
- Hata varsa: Console'da hata loglanır, kullanıcıya bilgi verilir
