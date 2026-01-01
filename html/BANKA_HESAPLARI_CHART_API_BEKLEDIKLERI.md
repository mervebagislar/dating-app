# BANKA HESAPLARI CHART API GEREKSİNİMLERİ

## API Endpoint
**POST** `/worker.php`

## Request Parametreleri

### Zorunlu Parametreler
- `bankaHesaplariRaporuChartVerisi` = "1"

### Opsiyonel Parametreler
- `chartType` = "gunluk" | "aylik" | "yillik"
- `kasaID` = Kasa ID (integer)
- `tarihBaslangic` = Başlangıç tarihi (YYYY-MM-DD formatında)
- `tarihBitis` = Bitiş tarihi (YYYY-MM-DD formatında)

## Request Örneği
```javascript
var formData = new FormData();
formData.append("bankaHesaplariRaporuChartVerisi", "1");
formData.append("chartType", "gunluk");
formData.append("kasaID", "1");
formData.append("tarihBaslangic", "2024-01-01");
formData.append("tarihBitis", "2024-01-31");
```

## Response Formatı

### Başarılı Response
```json
{
    "status": 1,
    "message": "",
    "data": [
        {
            "kasaAdi": "Ana Kasa",
            "tarih": "2024-01-15",
            "bakiye": 50000.00
        },
        {
            "kasaAdi": "Ana Kasa", 
            "tarih": "2024-01-16",
            "bakiye": 52000.00
        },
        {
            "kasaAdi": "Yan Kasa",
            "tarih": "2024-01-15",
            "bakiye": 25000.00
        }
    ]
}
```

### Hata Response
```json
{
    "status": 0,
    "message": "Hata mesajı",
    "data": ""
}
```

## Veri Açıklamaları

### Chart Type'a Göre Tarih Formatları
- **gunluk**: YYYY-MM-DD (30 günlük veri)
- **aylik**: YYYY-MM (Aylık toplam)
- **yillik**: YYYY (Yıllık toplam)

### Bakiye Hesaplama
- Her kasa için günlük/aylık/yıllık toplam bakiye
- Tarih sıralamasına göre artan sırada
- Negatif bakiye değerleri de dahil

### Filtreleme
- `kasaID` verilirse sadece o kasa
- `tarihBaslangic` ve `tarihBitis` verilirse o tarih aralığı
- Hiçbiri verilmezse tüm kasalar ve tüm tarihler

## Backend İşlem Adımları

1. **Parametre Kontrolü**
   - `bankaHesaplariRaporuChartVerisi` = "1" kontrolü
   - `chartType` parametresi kontrolü

2. **Veri Çekme**
   - Kasa bazında bakiye hesaplama
   - Tarih aralığına göre filtreleme
   - Chart type'a göre gruplama

3. **Veri Formatı**
   - Her kasa için ayrı kayıt
   - Tarih sıralaması
   - Bakiye değeri (decimal)

4. **Response Hazırlama**
   - Başarılı durumda data array
   - Hata durumunda status = 0

## Test Verisi Örneği

### Günlük Chart (30 Gün)
```json
{
    "status": 1,
    "message": "",
    "data": [
        {"kasaAdi": "Ana Kasa", "tarih": "2024-01-01", "bakiye": 45000.00},
        {"kasaAdi": "Ana Kasa", "tarih": "2024-01-02", "bakiye": 47000.00},
        {"kasaAdi": "Yan Kasa", "tarih": "2024-01-01", "bakiye": 20000.00},
        {"kasaAdi": "Yan Kasa", "tarih": "2024-01-02", "bakiye": 22000.00}
    ]
}
```

### Aylık Chart
```json
{
    "status": 1,
    "message": "",
    "data": [
        {"kasaAdi": "Ana Kasa", "tarih": "2024-01", "bakiye": 50000.00},
        {"kasaAdi": "Ana Kasa", "tarih": "2024-02", "bakiye": 55000.00},
        {"kasaAdi": "Yan Kasa", "tarih": "2024-01", "bakiye": 25000.00},
        {"kasaAdi": "Yan Kasa", "tarih": "2024-02", "bakiye": 28000.00}
    ]
}
```

### Yıllık Chart
```json
{
    "status": 1,
    "message": "",
    "data": [
        {"kasaAdi": "Ana Kasa", "tarih": "2024", "bakiye": 600000.00},
        {"kasaAdi": "Yan Kasa", "tarih": "2024", "bakiye": 300000.00}
    ]
}
```

## Notlar
- Chart verisi gerçek zamanlı olmalı
- Filtreleme parametreleri frontend'den gelir
- Tarih formatları tutarlı olmalı
- Bakiye hesaplaması doğru olmalı
- Performans için gerekirse cache kullanılabilir
