# Tahsilat Raporu - Backend API Beklentileri

## Frontend Hazır, Backend API'leri Bekleniyor

### 1. Tahsilat Raporu Listele API

**Endpoint:** `worker.php`
**POST Parameter:** `tahsilatRaporuListele = "1"`

**Beklenen Response Format:**
```json
{
    "status": 1,
    "message": "Tahsilat raporu başarıyla getirildi",
    "data": [
        {
            "id": 1,
            "tarih": "2024-01-15",
            "firma_adi": "ABC Şirketi",
            "is_adi": "Proje 1",
            "aciklama": "Test tahsilat",
            "tutar": 15000.50,
            "odeme_turu": "Banka Havalesi",
            "durum": "yapilmis"
        }
    ]
}
```

### 2. Tahsilat Raporu Filtrele API

**Endpoint:** `worker.php`
**POST Parameters:**
- `tahsilatRaporuFiltrele = "1"`
- `tarihBaslangic` (optional)
- `tarihBitis` (optional)
- `firmaAdi` (optional)
- `durum` (optional: "yapilmis" veya "yapilmamis")

**Beklenen Response Format:**
```json
{
    "status": 1,
    "message": "Tahsilat raporu filtrelendi",
    "data": [
        {
            "id": 1,
            "tarih": "2024-01-15",
            "firma_adi": "ABC Şirketi",
            "is_adi": "Proje 1",
            "aciklama": "Test tahsilat",
            "tutar": 15000.50,
            "odeme_turu": "Banka Havalesi",
            "durum": "yapilmis"
        }
    ]
}
```

### 3. Veri Formatı Açıklamaları

- **id:** Tahsilat kaydının benzersiz ID'si
- **tarih:** Tahsilat tarihi (YYYY-MM-DD formatında)
- **firma_adi:** Acenta/firma adı
- **is_adi:** İş/proje adı
- **aciklama:** Tahsilat açıklaması
- **tutar:** Tutar (sayısal değer)
- **odeme_turu:** Ödeme türü (string)
- **durum:** "yapilmis" veya "yapilmamis"

### 4. Tahsilat Raporu Firma Listesi API

**Endpoint:** `worker.php`
**POST Parameter:** `tahsilatRaporuFirmaListesi = "1"`

**Beklenen Response Format:**
```json
{
    "status": 1,
    "message": "Firma listesi başarıyla getirildi",
    "data": [
        {
            "id": 1,
            "acentaAdi": "ABC Şirketi",
            "acentaKodu": "ABC001"
        },
        {
            "id": 2,
            "acentaAdi": "XYZ Ltd",
            "acentaKodu": "XYZ002"
        }
    ]
}
```

### 5. Frontend Durumu

✅ **Hazır Olanlar:**
- DataTable yapılandırması
- Filtreleme formu
- Grafik entegrasyonu
- Özet kartları
- Hata yönetimi
- Firma dropdown (mevcut acentaListele API'si ile çalışıyor)

⏳ **Backend API'leri Bekleniyor:**
- `tahsilatRaporuListele`
- `tahsilatRaporuFiltrele`
- `tahsilatRaporuFirmaListesi` (opsiyonel - mevcut acentaListele kullanılabilir)

### 5. Test Etme

Backend API'leri hazır olduğunda:
1. Tahsilat Raporu sayfasına git
2. Sayfa yüklendiğinde veriler gelecek
3. Filtrele butonuna bas, filtrelenmiş veriler gelecek
4. Grafikler ve özet kartları güncellenecek

### 6. Hata Durumları

- API hazır değilse: Boş tablo gösterilir, hata mesajı verilir
- Veri yoksa: Boş tablo gösterilir
- Hata varsa: Console'da hata loglanır, kullanıcıya bilgi verilir
