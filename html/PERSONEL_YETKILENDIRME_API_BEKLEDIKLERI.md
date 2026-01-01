# Personel Yetkilendirme Sistemi - Backend API Beklentileri

## Frontend Hazır, Backend API'leri Bekleniyor

### 1. Modülleri Getir API

**Endpoint:** `worker.php`
**POST Parameters:**
- `modulleriGetir = "1"`

**Beklenen Response Format:**
```json
{
    "status": 1,
    "message": "Modüller başarıyla getirildi",
    "data": [
        {
            "ad": "teklifler",
            "baslik": "Teklifler",
            "icon": "fa-solid fa-file-contract"
        },
        {
            "ad": "hizmetler", 
            "baslik": "Hizmetler",
            "icon": "fa-solid fa-cogs"
        },
        {
            "ad": "firma",
            "baslik": "Firma Yönetimi",
            "icon": "fa-solid fa-building"
        },
        {
            "ad": "personel",
            "baslik": "Personel Yönetimi", 
            "icon": "fa-solid fa-users"
        },
        {
            "ad": "raporlar",
            "baslik": "Raporlar",
            "icon": "fa-solid fa-chart-bar"
        },
        {
            "ad": "muhasebe",
            "baslik": "Muhasebe",
            "icon": "fa-solid fa-calculator"
        }
    ]
}
```

**Not:** Yetki türleri (ekleme, silme, düzenleme, görüntüleme, export) frontend'de statik olarak tanımlanmıştır. Her modül için otomatik olarak eklenir. Raporlar ve Muhasebe modülleri için export yetkisi de eklenir.
```

### 2. Personel Yetkilerini Getir API

**Endpoint:** `worker.php`
**POST Parameters:**
- `personelYetkileriGetir = "1"`
- `personelID` - Personel ID'si

**Beklenen Response Format:**
```json
{
    "status": 1,
    "message": "Personel yetkileri başarıyla getirildi",
    "data": {
        "modulYetkiler": {
            "teklifler": {
                "aktif": true,
                "detay": ["ekleme", "duzenleme", "goruntuleme", "export"]
            },
            "hizmetler": {
                "aktif": true,
                "detay": ["ekleme", "duzenleme", "silme", "goruntuleme"]
            },
            "firma": {
                "aktif": true,
                "detay": ["ekleme", "duzenleme", "silme", "goruntuleme"]
            },
            "personel": {
                "aktif": true,
                "detay": ["ekleme", "duzenleme", "silme", "goruntuleme"]
            },
            "raporlar": {
                "aktif": true,
                "detay": ["goruntuleme", "export"]
            },
            "muhasebe": {
                "aktif": true,
                "detay": ["ekleme", "duzenleme", "goruntuleme", "export"]
            }
        }
    }
}
```

### 2. Personel Yetkilerini Kaydet API

**Endpoint:** `worker.php`
**POST Parameters:**
- `personelYetkileriKaydet = "1"`
- `personelID` - Personel ID'si
- `modulYetkiler` - JSON string (modül bazlı yetki yapısı)

**Beklenen Response Format:**
```json
{
    "status": 1,
    "message": "Personel yetkileri başarıyla kaydedildi"
}
```

### 3. Personel Sil API

**Endpoint:** `worker.php`
**POST Parameters:**
- `personelSil = "1"`
- `personelID` - Personel ID'si

**Beklenen Response Format:**
```json
{
    "status": 1,
    "message": "Personel başarıyla silindi"
}
```

### 4. Modül Yetki Yapısı

#### Teklifler:
- **Ekleme** - Yeni teklif oluşturma
- **Düzenleme** - Mevcut teklifleri düzenleme
- **Görüntüleme** - Teklifleri görüntüleme
- **Export** - Teklif verilerini export etme

#### Hizmetler:
- **Ekleme** - Yeni hizmet ekleme
- **Düzenleme** - Mevcut hizmetleri düzenleme
- **Silme** - Hizmet silme
- **Görüntüleme** - Hizmetleri görüntüleme

#### Firma Yönetimi:
- **Ekleme** - Yeni firma ekleme
- **Düzenleme** - Mevcut firmaları düzenleme
- **Silme** - Firma silme
- **Görüntüleme** - Firmaları görüntüleme

#### Personel Yönetimi:
- **Ekleme** - Yeni personel ekleme
- **Düzenleme** - Mevcut personelleri düzenleme
- **Silme** - Personel silme
- **Görüntüleme** - Personelleri görüntüleme

#### Raporlar:
- **Görüntüleme** - Raporları görüntüleme
- **Export** - Rapor verilerini export etme

#### Muhasebe:
- **Ekleme** - Yeni muhasebe kaydı ekleme
- **Düzenleme** - Mevcut kayıtları düzenleme
- **Görüntüleme** - Muhasebe kayıtlarını görüntüleme
- **Export** - Muhasebe verilerini export etme

### 5. Frontend Özellikleri

✅ **Hazır Olanlar:**
- Personel listesi DataTable yapılandırması
- Yetkilendirme modalı (responsive tasarım)
- İşlemler sütunu (Düzenle, Yetkilendirme, Sil butonları)
- JavaScript fonksiyonları
- Event handler'lar
- Toast bildirimleri
- Form validasyonu

### 6. Modal Özellikleri

- **Personel Bilgileri:** TC No, Ad, Departman gösterimi
- **Ana Modül Yetkileri:** 10 farklı modül için checkbox'lar
- **Detay Yetkiler:** 6 farklı işlem türü için checkbox'lar
- **Temizle Butonu:** Tüm seçimleri kaldırır
- **Kaydet Butonu:** Yetkileri backend'e gönderir
- **Loading State:** Kaydetme sırasında buton durumu değişir

### 7. İşlemler Sütunu

Her personel için 3 buton:
1. **Düzenle** (Mavi) - `personelDuzenle()` fonksiyonunu çağırır
2. **Yetkilendirme** (Sarı) - `personelYetkilendirmeAc()` fonksiyonunu çağırır
3. **Sil** (Kırmızı) - `personelSilConfirm()` fonksiyonunu çağırır

### 8. Güvenlik Notları

- Sadece sistem yöneticisi yetkisine sahip kullanıcılar personel yetkilendirme yapabilir
- Yetki değişiklikleri loglanmalı
- Personel silme işlemi geri alınamaz olmalı
- Yetki kontrolü her sayfa yüklendiğinde yapılmalı

### 9. Test Senaryoları

1. **Yetki Yükleme:** Personel seçildiğinde mevcut yetkiler doğru yüklenmeli
2. **Yetki Kaydetme:** Seçilen yetkiler backend'e doğru gönderilmeli
3. **Form Temizleme:** Temizle butonu tüm seçimleri kaldırmalı
4. **Personel Silme:** Silme işlemi onay sonrası çalışmalı
5. **Hata Yönetimi:** Backend hatalarında kullanıcıya bilgi verilmeli

### 10. Örnek Database Sorguları

#### Yetkileri Getir:
```sql
SELECT 
    p.id,
    p.personelAd,
    p.personelTC,
    p.departman,
    GROUP_CONCAT(py.yetki) as yetkiler,
    GROUP_CONCAT(py.detayYetki) as detayYetkiler
FROM personel p
LEFT JOIN personel_yetkiler py ON p.id = py.personelID
WHERE p.id = ? AND p.sirketID = ?
GROUP BY p.id
```

#### Yetkileri Kaydet:
```sql
-- Önce mevcut yetkileri sil
DELETE FROM personel_yetkiler WHERE personelID = ? AND sirketID = ?;

-- Yeni yetkileri ekle
INSERT INTO personel_yetkiler (personelID, sirketID, yetki, detayYetki, created_at) 
VALUES (?, ?, ?, ?, NOW());
```

#### Personel Sil:
```sql
-- Önce yetkileri sil
DELETE FROM personel_yetkiler WHERE personelID = ? AND sirketID = ?;

-- Personeli sil
DELETE FROM personel WHERE id = ? AND sirketID = ?;
```
