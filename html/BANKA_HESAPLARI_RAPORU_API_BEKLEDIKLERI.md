# Banka Hesapları Raporu - Backend API Beklentileri

## Frontend Filtreleme Aktif - Sadece Veri Yükleme API'si Gerekli

### 1. Banka Hesapları Raporu Listele API

**Endpoint:** `worker.php`
**POST Parameter:** `bankaHesaplariRaporuListele = "1"`

**Beklenen Response Format:**
```json
{
    "status": 1,
    "message": "Banka hesapları raporu başarıyla getirildi",
    "data": [
        {
            "kasaAdi": "Garanti Hesabı",
            "islemTuru": "TAHSILAT",
            "tutar": "₺50.000,00",
            "tarih": "2024-01-15",
            "vadeTarihi": "2024-01-20",
            "aciklama": "Gelen havale",
            "sonToplamBakiye": "₺125.000,00"
        },
        {
            "kasaAdi": "Nakit Kasa",
            "islemTuru": "MASRAF",
            "tutar": "₺15.000,00",
            "tarih": "2024-01-15",
            "vadeTarihi": "2024-01-10",
            "aciklama": "Ofis masrafları",
            "sonToplamBakiye": "₺110.000,00"
        },
        {
            "kasaAdi": "Garanti Hesabı",
            "islemTuru": "VIRMAN",
            "tutar": "₺25.000,00",
            "tarih": "2024-01-16",
            "vadeTarihi": "2024-01-16",
            "aciklama": "Kasa arası transfer",
            "sonToplamBakiye": "₺150.000,00"
        }
    ]
}
```

### 2. Filtreleme API'si Artık Gerekli Değil

**Not:** Filtreleme artık frontend'de yapılıyor. Backend'den sadece tüm veri yükleniyor ve frontend'de filtreleniyor.

### 3. Veri Formatı Açıklamaları

- **kasaAdi:** Kasa hesabının adı (string)
- **islemTuru:** İşlem türü (TAHSILAT, MASRAF, VIRMAN)
- **tutar:** İşlem tutarı (Türk Lirası formatında string, örn: "₺50.000,00")
- **tarih:** İşlem tarihi (YYYY-MM-DD formatında)
- **vadeTarihi:** Vade tarihi (YYYY-MM-DD formatında)
- **aciklama:** İşlem açıklaması
- **sonToplamBakiye:** Son toplam bakiye (Türk Lirası formatında string)

### 4. Frontend Filtreleme Özellikleri

- **Kasa Seçimi:** `item.kasaAdi` ile eşleştirme
- **İşlem Türü:** `item.islemTuru` ile eşleştirme (TAHSILAT, MASRAF, VIRMAN)
- **Tarih Aralığı:** `item.tarih` ile tarih aralığı karşılaştırması
- **Vade Durumu:** `item.vadeTarihi` ile bugünün tarihi karşılaştırması
  - **Vadesi Gelmiş:** Vade tarihi <= Bugün
  - **Vadesi Gelmemiş:** Vade tarihi > Bugün
- **Anında Filtreleme:** Backend'e istek atmadan frontend'de filtreleme

### 5. Frontend Durumu

✅ **Hazır Olanlar:**
- DataTable yapılandırması
- Frontend filtreleme sistemi
- Anında filtreleme (backend'e istek atmadan)
- Özet kartları (Toplam Giriş, Çıkış, Net Bakiye)
- Export butonları (Excel, PDF, Print, ColVis)
- Responsive tasarım
- Hata yönetimi

⏳ **Backend API'si Bekleniyor:**
- `bankaHesaplariRaporuListele` (sadece veri yükleme)

### 6. DataTable Sütunları

1. **Kasa Adı** - Kasa hesabının adı
2. **İşlem Türü** - TAHSILAT, MASRAF, VIRMAN
3. **Tutar** - İşlem tutarı (Türk Lirası formatında)
4. **Tarih** - İşlem tarihi
5. **Açıklama** - İşlem açıklaması

### 7. Özet Kartları Hesaplama

- **Toplam Giriş:** TAHSILAT işlemlerinin toplamı
- **Toplam Çıkış:** MASRAF işlemlerinin toplamı
- **Net Bakiye:** Giriş - Çıkış
- **Virman:** Nötr işlem (hesaplamaya dahil edilmez)

### 8. Test Etme

Backend API hazır olduğunda:
1. Banka Hesapları Raporu sayfasına git
2. Sayfa yüklendiğinde tüm veriler gelecek
3. Filtrele butonuna bas, anında frontend'de filtrelenecek
4. Temizle butonuna bas, tüm veriler tekrar gösterilecek
5. Export butonları çalışacak
6. Responsive tasarım mobilde çalışacak

### 9. Hata Durumları

- API hazır değilse: Boş tablo gösterilir, hata mesajı verilir
- Veri yoksa: Boş tablo gösterilir
- Hata varsa: Console'da hata loglanır, kullanıcıya bilgi verilir

### 10. Örnek Database Sorgusu

```sql
SELECT 
    k.kasa_adi as kasaAdi,
    kh.islem_turu as islemTuru,
    CONCAT('₺', FORMAT(kh.tutar, 2)) as tutar,
    kh.tarih,
    kh.aciklama
FROM kasa_hareketleri kh
LEFT JOIN kasalar k ON kh.kasa_id = k.id
WHERE kh.sirketID = ?
ORDER BY kh.tarih DESC
```

### 11. Frontend Filtreleme Avantajları

- **Hızlı:** Backend'e istek atmadan anında filtreleme
- **Az Sunucu Yükü:** Sadece ilk yüklemede veri çekiliyor
- **Gerçek Zamanlı:** Filtre değişikliklerinde anında sonuç
- **Özet Kartları:** Filtrelenmiş veriye göre otomatik hesaplama

### 12. Kasa Listesi API (Mevcut)

**Endpoint:** `worker.php`
**POST Parameter:** `OdemeEkleKasaAra = "0"`

**Response Format:**
```json
{
    "status": 1,
    "message": "Kasa listesi başarıyla getirildi",
    "result": [
        {
            "id": 1,
            "text": "Garanti Hesabı"
        },
        {
            "id": 2,
            "text": "Finans Bank Hesabı"
        }
    ]
}
```

### 13. Kasa İşlemleri API (Yeni)

**Endpoint:** `worker.php`
**POST Parameter:** `kasaIslemleriListele = "1"`

**Beklenen Response Format:**
```json
{
    "status": 1,
    "message": "Kasa işlemleri başarıyla getirildi",
    "data": [
        {
            "kasaAdi": "Garanti Hesabı",
            "islemTuru": "TAHSILAT",
            "tutar": "₺50.000,00",
            "tarih": "2024-01-15",
            "vadeTarihi": "2024-01-20",
            "isAdi": "MICE Etkinlik Organizasyonu",
            "masrafAdi": "Konaklama Masrafı",
            "aciklama": "Gelen havale"
        },
        {
            "kasaAdi": "Nakit Kasa",
            "islemTuru": "MASRAF",
            "tutar": "₺15.000,00",
            "tarih": "2024-01-15",
            "vadeTarihi": "2024-01-10",
            "isAdi": "Kurumsal Toplantı",
            "masrafAdi": "Ofis Malzemeleri",
            "aciklama": "Ofis masrafları"
        }
    ]
}
```

**Veri Formatı Açıklamaları:**
- **kasaAdi:** Kasa hesabının adı (string)
- **islemTuru:** İşlem türü (TAHSILAT, MASRAF, VIRMAN)
- **tutar:** İşlem tutarı (Türk Lirası formatında string, örn: "₺50.000,00")
- **tarih:** İşlem tarihi (YYYY-MM-DD formatında)
- **vadeTarihi:** Vade tarihi (YYYY-MM-DD formatında)
- **isAdi:** Bağlı olduğu iş adı (string)
- **masrafAdi:** Masraf adı (string)
- **aciklama:** İşlem açıklaması

**Örnek Database Sorgusu:**
```sql
SELECT 
    k.kasa_adi as kasaAdi,
    kh.islem_turu as islemTuru,
    CONCAT('₺', FORMAT(kh.tutar, 2)) as tutar,
    kh.tarih,
    kh.vade_tarihi as vadeTarihi,
    t.teklif_adi as isAdi,
    m.masraf_adi as masrafAdi,
    kh.aciklama
FROM kasa_hareketleri kh
LEFT JOIN kasalar k ON kh.kasa_id = k.id
LEFT JOIN teklifler t ON kh.teklif_id = t.id
LEFT JOIN masraflar m ON kh.masraf_id = m.id
WHERE kh.sirketID = ?
ORDER BY kh.tarih DESC
```
