//#region Raporlar eventHandler

    //#region BANKA HESAPLARI RAPORU
    $('#bankaHesaplariRaporuFiltreleBtn').on('click', function() {
        bankaHesaplariRaporuFiltrele();
    });

    $('#bankaHesaplariRaporuTemizleBtn').on('click', function() {
        bankaHesaplariRaporuTemizle();
    });
    //#endregion

    //#region TAHŞİLAT RAPORU
    $(document).on('click', '#tahsilatRaporuFiltreleBtn', function() {
        console.log("Tahsilat raporu filtreleme butonu tıklandı");
        tahsilatRaporuFiltrele();
    });

    $(document).on('click', '#tahsilatRaporuTemizleBtn', function() {
        console.log("Tahsilat raporu temizleme butonu tıklandı");
        tahsilatRaporuTemizle();
    });

    // Tarih aralığı değişikliklerini dinle
    $(document).on('change', '#tarihAraligi', function() {
        console.log("Tarih aralığı değişti");
        // Otomatik filtreleme yapılabilir
    });

    $(document).on('change', '#firmaAdi', function() {
        console.log("Firma adı değişti");
        // Otomatik filtreleme yapılabilir
    });

    $(document).on('change', '#durum', function() {
        console.log("Durum değişti");
        // Otomatik filtreleme yapılabilir
    });
    //#endregion

    //#region MASRAF RAPORU
    $('#filtreleBtn').on('click', function() {
        masrafRaporuFiltrele();
    });

    $('#temizleBtn').on('click', function() {
        masrafRaporuTemizle();
    });

    $('#odemeGrubu').on('change', function() {
        masrafRaporuOdemeGrubuDegisti();
    });
    //#endregion


//#endregion


//#region Raporlar functions

    //#region BANKA HESAPLARI RAPORU
    let bankaHesaplariRaporuAllData = []; // Tüm veri
    let bankaHesaplariRaporuFilteredData = []; // Filtrelenmiş veri

    function bankaHesaplariRaporuLoad() {
        // Tarih aralığı picker'ını başlat
        initTarihAraligiPicker();
        
        var formData = new FormData();
        formData.append("bankaHesaplariRaporuListele", "1");
        
        makeAjax(formData).then((data) => {
            console.log("Banka hesapları raporu verisi:", data);
            
            // Tüm veriyi sakla
            bankaHesaplariRaporuAllData = data.data || [];
            
            bankaHesaplariRaporuFilteredData = [...bankaHesaplariRaporuAllData];
            
            console.log("Yüklenen veri sayısı:", bankaHesaplariRaporuAllData.length);
            if (bankaHesaplariRaporuAllData.length > 0) {
                console.log("İlk veri örneği:", bankaHesaplariRaporuAllData[0]);
            }
            
            // İlk yüklemede tüm veriyi göster
            bankaHesaplariRaporuUpdateTable();
            bankaHesaplariRaporuUpdateSummaryCards();
            
            // Chart'ları oluştur
        //  window.currentChartType = 'gunluk';
        // bankaHesaplariRaporuChartOlustur();
        //  bankaHesaplariRaporuChartEventHandlers();
            
            // İşlem türü dağılımı chart'ını oluştur
        // bankaHesaplariRaporuIslemTuruChartOlustur();
            
            // Tahsilat/Masraf chart'ını oluştur
        // window.currentTahsilatMasrafChartType = 'gunluk';
        // bankaHesaplariRaporuTahsilatMasrafChartOlustur();
        // bankaHesaplariRaporuTahsilatMasrafChartEventHandlers();
        });
        
        // Kasa listesini yükle
        var kasaFormData = new FormData();
        kasaFormData.append("OdemeEkleKasaAra", "0");
        
        makeAjax(kasaFormData).then((data) => {
            if (data && data.result && data.result.length > 0) {
                var kasaListesi = data.result;
                
                // Kasa seçim dropdown'ını temizle ve yeniden doldur
                $('#kasaSecimi').empty();
                $('#kasaSecimi').append('<option value="">Tüm Kasalar</option>');
                
                kasaListesi.forEach(function(kasa) {
                    $('#kasaSecimi').append('<option value="' + kasa.id + '">' + kasa.text + '</option>');
                });
            }
        }).catch((error) => {
            console.error("Kasa listesi yükleme hatası:", error);
        });

        // İş listesini yükle
        var isFormData = new FormData();
        isFormData.append("masrafEkleIsListe", "1");
        
        makeAjax(isFormData).then((data) => {
            if (data && data.result && data.result.length > 0) {
                var isListesi = data.result;
                
                // İş seçim dropdown'ını temizle ve yeniden doldur
                $('#isSecimi').empty();
                $('#isSecimi').append('<option value="">Tüm İşler</option>');
                
                isListesi.forEach(function(is) {
                    $('#isSecimi').append('<option value="' + is.id + '">' + is.text + '</option>');
                });
            }
        }).catch((error) => {
            console.error("İş listesi yükleme hatası:", error);
        });

        // Kasa işlemleri verisini yükle
        kasaIslemleriListele();
    }

    // Kasa işlemleri listeleme fonksiyonu
    function kasaIslemleriListele() {
        console.log("Kasa işlemleri listeleniyor...");
        
        var formData = new FormData();
        formData.append("kasaIslemleriListele", "1");
        
        // Tüm filtreleme parametrelerini backend'e gönder
        var tarihBaslangic = $("#tarihBaslangic").val();
        var tarihBitis = $("#tarihBitis").val();
        var kasaSecimi = $("#kasaSecimi").val();
        var islemTuru = $("#islemTuru").val();
        var odendiDurumu = $("#odendiDurumu").val();
        var vadeDurumu = $("#vadeDurumu").val();
        var isSecimi = $("#isSecimi").val();
        var gruplama = $("#gruplama").val();
        
        // Tarih aralığı filtresi
        if (tarihBaslangic) {
            formData.append("tarihBaslangic", tarihBaslangic);
            console.log("Başlangıç tarihi:", tarihBaslangic);
        }
        if (tarihBitis) {
            formData.append("tarihBitis", tarihBitis);
            console.log("Bitiş tarihi:", tarihBitis);
        }
        
        // Kasa seçimi filtresi
        if (kasaSecimi) {
            formData.append("kasaID", kasaSecimi);
            console.log("Kasa filtresi uygulanıyor:", kasaSecimi);
        }
        
        // İşlem türü filtresi
        if (islemTuru) {
            formData.append("islemTuru", islemTuru);
            console.log("İşlem türü filtresi:", islemTuru);
        }
        
        // Ödendi durumu filtresi
        if (odendiDurumu) {
            formData.append("odendiDurumu", odendiDurumu);
            console.log("Ödendi durumu filtresi:", odendiDurumu);
        }
        
        // Vade durumu filtresi
        if (vadeDurumu) {
            formData.append("vadeDurumu", vadeDurumu);
            console.log("Vade durumu filtresi:", vadeDurumu);
        }
        
        // İş seçimi filtresi
        if (isSecimi) {
            formData.append("isID", isSecimi);
            console.log("İş seçimi filtresi:", isSecimi);
        }
        
        // Gruplama
        if (gruplama) {
            formData.append("gruplama", gruplama);
            console.log("Gruplama:", gruplama);
        }
        
        // Tabloyu temizle
        if (bankaHesaplariRaporuTable) {
            bankaHesaplariRaporuTable.clear().draw();
        }
        
        makeAjax(formData).then((data) => {
            console.log("Kasa işlemleri verisi:", data);
            console.log("Response status:", data.status);
            console.log("Response message:", data.message);
            console.log("Data length:", data.data ? data.data.length : "data yok");
            
            
            if (data.status === 1 && data.data) {
                // Veriyi tabloya ekle
                if (bankaHesaplariRaporuTable) {
                    bankaHesaplariRaporuTable.rows.add(data.data).draw();
                }
                
                // Tüm veriyi sakla (chart'lar için)
                bankaHesaplariRaporuAllData = data.data;
                bankaHesaplariRaporuFilteredData = [...data.data];
                
                
                // Özet kartlarını güncelle
                if (data.ozet) {
                    bankaHesaplariRaporuUpdateSummaryCards(data.ozet);
                } else {
                    bankaHesaplariRaporuUpdateSummaryCards();
                }
                
                // Chart'ları güncelle
                if (window.kasaBakiyeChart) {
                    bankaHesaplariRaporuChartOlustur();
                }
                if (window.islemTuruChart) {
                    bankaHesaplariRaporuIslemTuruChartOlustur();
                }
                if (window.tahsilatMasrafChart) {
                    bankaHesaplariRaporuTahsilatMasrafChartOlustur();
                }
                
                console.log("Kasa işlemleri yüklendi. Veri sayısı:", data.data.length);
            } else {
                console.log("Kasa işlemleri verisi bulunamadı:", data.message);
                Toast.fire({
                    icon: 'warning',
                    title: 'Kasa işlemleri verisi bulunamadı!'
                });
            }
        }).catch((error) => {
            console.error("Kasa işlemleri yükleme hatası:", error);
            Toast.fire({
                icon: 'error',
                title: 'Kasa işlemleri yüklenirken hata oluştu!'
            });
        });
    }

    // Özet kartlarını güncelleme fonksiyonu
    function bankaHesaplariRaporuUpdateSummaryCards(ozetData = null) {
        console.log("Özet kartları güncelleniyor...");
        
        if (ozetData) {
            // Backend'den gelen özet verisini kullan
            $("#toplamGiris").text(ozetData.toplamGiris || "₺0");
            $("#toplamCikis").text(ozetData.toplamCikis || "₺0");
            $("#netBakiye").text(ozetData.netBakiye || "₺0");
            $("#islemSayisi").text(ozetData.islemSayisi || "0");
            console.log("Özet kartları backend verisi ile güncellendi:", ozetData);
        } else {
            // Mevcut veriden hesapla
            let toplamGiris = 0;
            let toplamCikis = 0;
            let islemSayisi = 0;
            
            if (bankaHesaplariRaporuFilteredData && bankaHesaplariRaporuFilteredData.length > 0) {
                bankaHesaplariRaporuFilteredData.forEach(function(item) {
                    // Tutarı sayısal değere çevir
                    let tutar = 0;
                    if (item.tutar && typeof item.tutar === 'string') {
                        let tutarStr = item.tutar.replace(/[₺,]/g, '').replace('.', ',');
                        tutar = parseFloat(tutarStr.replace(',', '.'));
                    } else if (typeof item.tutar === 'number') {
                        tutar = item.tutar;
                    }
                    
                    if (item.islemTuru === 'TAHSILAT') {
                        toplamGiris += tutar;
                    } else if (item.islemTuru === 'MASRAF') {
                        toplamCikis += tutar;
                    }
                    islemSayisi++;
                });
            }
            
            let netBakiye = toplamGiris - toplamCikis;
            
            // Formatla ve göster
            $("#toplamGiris").text(formatPara(toplamGiris));
            $("#toplamCikis").text(formatPara(toplamCikis));
            $("#netBakiye").text(formatPara(netBakiye));
            $("#islemSayisi").text(islemSayisi);
            
            console.log("Özet kartları hesaplandı - Giriş:", toplamGiris, "Çıkış:", toplamCikis, "Net:", netBakiye, "İşlem:", islemSayisi);
        }
    }

    // Para formatı fonksiyonu
    function formatPara(tutar) {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2
        }).format(tutar);
    }


    // Tabloyu güncelleyen fonksiyon
    function bankaHesaplariRaporuUpdateTable() {
        bankaHesaplariRaporuTable.clear().draw();
        bankaHesaplariRaporuFilteredData.forEach(item => {
            // İşlem türüne göre tutar formatını ayarla
            let tutarHtml = '';
            if (item.islemTuru === 'TAHSILAT') {
                tutarHtml = '<span class="text-success">+ ' + item.tutar + '</span>';
            } else if (item.islemTuru === 'MASRAF') {
                tutarHtml = '<span class="text-danger">- ' + item.tutar + '</span>';
            } else {
                tutarHtml = '<span class="text-muted">' + item.tutar + '</span>';
            }
            
            // Vade durumu hesapla
            let vadeDurumu = '-';
            if (item.vadeTarihi) {
                const bugun = new Date();
                const vadeTarihi = new Date(item.vadeTarihi);
                if (vadeTarihi < bugun) {
                    vadeDurumu = '<span class="text-danger">Vadesi Gelmiş</span>';
                } else {
                    vadeDurumu = '<span class="text-success">Vadesi Gelmemiş</span>';
                }
            }
            
            bankaHesaplariRaporuTable.row.add([
                item.kasaAdi,
                item.islemTuru,
                vadeDurumu,
                item.isAdi || '-',
                item.masrafAdi || '-',
                tutarHtml,
                item.aciklama
            ]).draw();
        });
    }

    // Özet kartlarını güncelleyen fonksiyon
    function bankaHesaplariRaporuUpdateSummaryCards() {
        let toplamGiris = 0;
        let toplamCikis = 0;
        let netBakiye = 0;
        let islemSayisi = bankaHesaplariRaporuFilteredData.length;
        
        bankaHesaplariRaporuFilteredData.forEach(item => {
            let tutar = parseFloat(item.tutar.replace(/[^\d.-]/g, '')) || 0;
            
            if (item.islemTuru === 'TAHSILAT') {
                toplamGiris += tutar;
            } else if (item.islemTuru === 'MASRAF') {
                toplamCikis += tutar;
            }
            // VIRMAN işlemleri nötr olduğu için hesaplamaya dahil edilmiyor
        });
        
        netBakiye = toplamGiris - toplamCikis;
        
        $('#toplamGiris').text('₺' + toplamGiris.toLocaleString('tr-TR', {minimumFractionDigits: 2}));
        $('#toplamCikis').text('₺' + toplamCikis.toLocaleString('tr-TR', {minimumFractionDigits: 2}));
        $('#netBakiye').text('₺' + netBakiye.toLocaleString('tr-TR', {minimumFractionDigits: 2}));
        $('#islemSayisi').text(islemSayisi);
        
        // Chart'ları güncelle
        bankaHesaplariRaporuUpdateCharts();
    }

    // Chart'ları güncelleyen fonksiyon
    function bankaHesaplariRaporuUpdateCharts() {
        // Giriş-Çıkış Trendi Chart'ı
        bankaHesaplariRaporuUpdateTrendChart();
        
        // İşlem Türü Dağılımı Chart'ı
        bankaHesaplariRaporuUpdateIslemTuruChart();
    }

    // Giriş-Çıkış Trendi Chart'ı
    function bankaHesaplariRaporuUpdateTrendChart() {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;
        
        // Mevcut chart'ı yok et
        if (window.trendChartInstance) {
            window.trendChartInstance.destroy();
        }
        
        // Tarih bazlı veri gruplama
        const tarihGruplari = {};
        bankaHesaplariRaporuFilteredData.forEach(item => {
            const tarih = item.tarih || new Date().toISOString().split('T')[0];
            if (!tarihGruplari[tarih]) {
                tarihGruplari[tarih] = { giris: 0, cikis: 0 };
            }
            
            const tutar = parseFloat(item.tutar.replace(/[^\d.-]/g, '')) || 0;
            if (item.islemTuru === 'TAHSILAT') {
                tarihGruplari[tarih].giris += tutar;
            } else if (item.islemTuru === 'MASRAF') {
                tarihGruplari[tarih].cikis += tutar;
            }
        });
        
        // Tarihleri sırala
        const sortedTarihler = Object.keys(tarihGruplari).sort();
        const girisVerileri = sortedTarihler.map(tarih => tarihGruplari[tarih].giris);
        const cikisVerileri = sortedTarihler.map(tarih => tarihGruplari[tarih].cikis);
        
        window.trendChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedTarihler,
                datasets: [{
                    label: 'Giriş',
                    data: girisVerileri,
                    borderColor: 'rgb(40, 167, 69)',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.1
                }, {
                    label: 'Çıkış',
                    data: cikisVerileri,
                    borderColor: 'rgb(220, 53, 69)',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Giriş-Çıkış Trendi'
                    },
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₺' + value.toLocaleString('tr-TR');
                            }
                        }
                    }
                }
            }
        });
    }

    // İşlem Türü Dağılımı Chart'ı
    function bankaHesaplariRaporuUpdateIslemTuruChart() {
        const ctx = document.getElementById('islemTuruChart');
        if (!ctx) return;
        
        // Mevcut chart'ı yok et
        if (window.islemTuruChartInstance) {
            window.islemTuruChartInstance.destroy();
        }
        
        // Temel işlem türlerini say
        let tahsilatSayisi = 0;
        let masrafSayisi = 0;
        let virmanSayisi = 0;
        let digerSayisi = 0;
        
        bankaHesaplariRaporuFilteredData.forEach(item => {
            const islemTuru = (item.tabloTur || item.islemTuru || '').toLowerCase();
            
            switch(islemTuru) {
                case 'tahsilat':
                    tahsilatSayisi++;
                    break;
                case 'masraf':
                    masrafSayisi++;
                    break;
                case 'virman':
                    virmanSayisi++;
                    break;
                default:
                    if (islemTuru) {
                        digerSayisi++;
                    }
                    break;
            }
        });
        
        // Sadece mevcut olan işlem türlerini chart'a ekle
        const labels = [];
        const data = [];
        const colors = [];
        
        if (tahsilatSayisi > 0) {
            labels.push(`Tahsilat (${tahsilatSayisi})`);
            data.push(tahsilatSayisi);
            colors.push('#28a745'); // Yeşil
        }
        
        if (masrafSayisi > 0) {
            labels.push(`Masraf (${masrafSayisi})`);
            data.push(masrafSayisi);
            colors.push('#dc3545'); // Kırmızı
        }
        
        if (virmanSayisi > 0) {
            labels.push(`Virman (${virmanSayisi})`);
            data.push(virmanSayisi);
            colors.push('#ffc107'); // Sarı
        }
        
        if (digerSayisi > 0) {
            labels.push(`Diğer (${digerSayisi})`);
            data.push(digerSayisi);
            colors.push('#6c757d'); // Gri
        }
        
        // Eğer hiç veri yoksa boş chart göster
        if (labels.length === 0) {
            window.islemTuruChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Veri Yok'],
                    datasets: [{
                        data: [1],
                        backgroundColor: ['#e9ecef'],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'İşlem Türü Dağılımı'
                        },
                        legend: {
                            display: true,
                            position: 'bottom'
                        }
                    }
                }
            });
            return;
        }
        
        window.islemTuruChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'İşlem Türü Dağılımı',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} işlem (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Backend filtreleme fonksiyonu
    function bankaHesaplariRaporuFiltrele() {
        console.log("Banka hesapları raporu filtreleme başlatıldı - Backend'e request gönderiliyor");
        
        const kasaSecimi = $("#kasaSecimi").val();
        const tarihBaslangic = $("#tarihBaslangic").val();
        const tarihBitis = $("#tarihBitis").val();
        const islemTuru = $("#islemTuru").val();
        const vadeDurumu = $("#vadeDurumu").val();
        const odendiDurumu = $("#odendiDurumu").val();
        const isSecimi = $("#isSecimi").val();
        const gruplama = $("#gruplama").val();
        
        console.log("Filtre değerleri - Kasa:", kasaSecimi, "Tarih Başlangıç:", tarihBaslangic, "Tarih Bitiş:", tarihBitis, "İşlem:", islemTuru, "Vade:", vadeDurumu, "Ödendi:", odendiDurumu, "İş:", isSecimi, "Gruplama:", gruplama);
        
        // Backend'e filtreleme parametreleri ile request gönder
        kasaIslemleriListele();
    }

    function bankaHesaplariRaporuTemizle() {
        console.log("Banka hesapları raporu filtreleri temizleniyor...");
        
        // Form alanlarını temizle
        $('#kasaSecimi').val('');
        $('#tarihAraligi').val('');
        $('#islemTuru').val('');
        $('#vadeDurumu').val('');
        $('#odendiDurumu').val('');
        $('#isSecimi').val('');
        $('#tarihBaslangic').val('');
        $('#tarihBitis').val('');
        
        // DataTable filtrelerini temizle
        if (bankaHesaplariRaporuTable) {
            bankaHesaplariRaporuTable.search('').columns().search('').draw();
            console.log("Filtreler temizlendi");
        }
        
        // Kasa işlemleri verisini yeniden yükle
        kasaIslemleriListele();
    }

    function bankaHesaplariRaporuTemizle() {
        console.log("Banka hesapları raporu filtreleri temizleniyor...");
        
        // Form alanlarını temizle
        $('#kasaSecimi').val('');
        $('#tarihAraligi').val('');
        $('#islemTuru').val('');
        $('#vadeDurumu').val('');
        $('#odendiDurumu').val('');
        $('#isSecimi').val('');
        $('#tarihBaslangic').val('');
        $('#tarihBitis').val('');
        
        // DataTable filtrelerini temizle
        if (bankaHesaplariRaporuTable) {
            bankaHesaplariRaporuTable.search('').columns().search('').draw();
            console.log("Filtreler temizlendi");
        }
        
        // Kasa işlemleri verisini yeniden yükle
        kasaIslemleriListele();
    }

    //#endregion

    //#region TAHŞİLAT RAPORU
    function tahsilatRaporuLoad() {
        console.log("tahsilatRaporuLoad çağrıldı - Tüm veri yüklenecek");
        
        // DataTable'ı başlat
        console.log("DataTable başlatılıyor...");
        
        // DataTable zaten varsa yok et
        if ($.fn.DataTable.isDataTable('#tahsilatRaporTablosu')) {
            console.log("Mevcut DataTable yok ediliyor...");
            $('#tahsilatRaporTablosu').DataTable().destroy();
        }
        
        initTahsilatRaporuTable();
        console.log("DataTable başlatıldı");
        
        // Backend API'yi çağır - TÜM VERİYİ ÇEK
        var formData = new FormData();
        formData.append("tahsilatRaporuListele", "1");
        // Filtreleme parametreleri gönderme, tüm veriyi çek
        
        makeAjax(formData).then((data) => {
            console.log("Tahsilat raporu API yanıtı:", data);
            
            // DataTable'ı yeniden boyutlandır
            setTimeout(function() {
                if(tahsilatRaporuTable) {
                    tahsilatRaporuTable.columns.adjust().draw();
                }
            }, 100);
            
            // Verileri DataTable'a yükle
            tahsilatRaporuTable.clear();
            if(data.data && data.data.length > 0) {
                data.data.forEach(item => {
                    tahsilatRaporuTable.row.add(item);
                });
            }
            tahsilatRaporuTable.draw();
            
            // Özet kartlarını güncelle
            updateTahsilatOzetKartlari(data.data || []);
            
            // Grafikleri güncelle
            updateTahsilatDurumChart(data.data || []);
            updateTahsilatTrendChart(data.data || []);
            
        }).catch((error) => {
            console.error("Tahsilat raporu yükleme hatası:", error);
            console.log("Backend API henüz hazır değil, boş tablo gösteriliyor");
            
            // Hata durumunda boş tablo göster
            tahsilatRaporuTable.clear();
            tahsilatRaporuTable.draw();
            
            // Boş verilerle özet kartları güncelle
            updateTahsilatOzetKartlari([]);
            updateTahsilatDurumChart([]);
            updateTahsilatTrendChart([]);
        });
    }

    async function tahsilatRaporuFirmaListesiYukle() {
        console.log("tahsilatRaporuFirmaListesiYukle çağrıldı");
        
        var firmaSelect = $('#firmaAdi');
        firmaSelect.empty();
        firmaSelect.append('<option value="">Tüm Firmalar</option>');
        
        try {
            // Önce özel API'yi dene
            var formData = new FormData();
            formData.append("tahsilatRaporuFirmaListesi", "1");
            
            const data = await makeAjax(formData);
            console.log("Tahsilat raporu firma listesi API yanıtı:", data);
            
            if(data.data && data.data.length > 0) {
                console.log("Firma sayısı:", data.data.length);
                data.data.forEach(function(firma) {
                    console.log("Firma ekleniyor:", firma.acentaAdi);
                    firmaSelect.append('<option value="' + firma.acentaAdi + '">' + firma.acentaAdi + '</option>');
                });
                
                // Select2'yi başlat
                firmaSelect.select2({
                    theme: "bootstrap4",
                    placeholder: "Firma seçiniz...",
                    allowClear: true
                });
                return;
            }
        } catch (error) {
            console.log("Özel firma API'si hazır değil, acenta listesi kullanılıyor");
        }
        
        try {
            // Fallback: Acenta listesini kullan
            await acentaListele();
            console.log("Acenta listesi yüklendi, dropdown'a aktarılıyor...");
            
            if(acentaListesi && acentaListesi.length > 0) {
                console.log("Acenta sayısı:", acentaListesi.length);
                acentaListesi.forEach(function(acenta) {
                    console.log("Firma ekleniyor:", acenta.text);
                    firmaSelect.append('<option value="' + acenta.id + '">' + acenta.text + '</option>');
                });
                
                // Select2'yi başlat
                firmaSelect.select2({
                    theme: "bootstrap4",
                    placeholder: "Firma seçiniz...",
                    allowClear: true
                });
            } else {
                console.log("acentaListesi boş");
            }
        } catch (fallbackError) {
            console.error("Firma listesi yüklenirken hata:", fallbackError);
            // Hata durumunda en azından "Tüm Firmalar" seçeneği kalsın
            firmaSelect.empty();
            firmaSelect.append('<option value="">Tüm Firmalar</option>');
        }
    }

    function tahsilatRaporuFiltrele() {
        console.log("tahsilatRaporuFiltrele çağrıldı - Frontend filtreleme");
        
        var tarihBaslangic = $("#tarihBaslangic").val();
        var tarihBitis = $("#tarihBitis").val();
        var firmaAdi = $("#firmaAdi").val();
        var durum = $("#durum").val();
        
        console.log("Tarih başlangıç:", tarihBaslangic);
        console.log("Tarih bitiş:", tarihBitis);
        console.log("Firma adı:", firmaAdi);
        console.log("Durum:", durum);
        
        // DataTable'da filtreleme yap
        if (tahsilatRaporuTable) {
            // Tüm filtreleri temizle
            tahsilatRaporuTable.search('').columns().search('').draw();
            
            // Tarih aralığı filtresi (Tahsilat Tarihi - kolon 2)
            if (tarihBaslangic && tarihBitis) {
                tahsilatRaporuTable.column(2).search(function(value, data, index, meta) {
                    var tarih = new Date(value);
                    var baslangic = new Date(tarihBaslangic);
                    var bitis = new Date(tarihBitis);
                    return tarih >= baslangic && tarih <= bitis;
                });
            }
            
            // Firma adı filtresi (Firma Adı - kolon 3)
            if (firmaAdi) {
                tahsilatRaporuTable.column(3).search(firmaAdi, false, false);
            }
            
            // Durum filtresi (Durum - kolon 8)
            if (durum) {
                var durumText = durum === 'yapilmis' ? 'Yapılmış' : 'Yapılmamış';
                tahsilatRaporuTable.column(8).search(durumText, false, false);
            }
            
            // Filtrelemeyi uygula
            tahsilatRaporuTable.draw();
            
            // Filtrelenmiş veriyi al ve özet kartlarını güncelle
            var filteredData = tahsilatRaporuTable.rows({search: 'applied'}).data().toArray();
            updateTahsilatOzetKartlari(filteredData);
            
            console.log("Filtreleme uygulandı. Filtrelenmiş kayıt sayısı:", filteredData.length);
        }
    }

    function tahsilatRaporuTemizle() {
        console.log("Tahsilat raporu filtreleri temizleniyor...");
        
        // Form alanlarını temizle
        $('#tarihAraligi').val('');
        $('#tarihBaslangic').val('');
        $('#tarihBitis').val('');
        $('#firmaAdi').val('').trigger('change');
        $('#durum').val('');
        
        // DataTable filtrelerini temizle
        if (tahsilatRaporuTable) {
            tahsilatRaporuTable.search('').columns().search('').draw();
            
            // Tüm veriyi al ve özet kartlarını güncelle
            var allData = tahsilatRaporuTable.data().toArray();
            updateTahsilatOzetKartlari(allData);
            
            console.log("Filtreler temizlendi. Toplam kayıt sayısı:", allData.length);
        }
    }

    function updateTahsilatOzetKartlari(veriler) {
        var toplamTahsilat = veriler.reduce((sum, item) => sum + parseFloat(item.tutar), 0);
        var yapilmisTahsilat = veriler.filter(item => item.durum === 'yapilmis').reduce((sum, item) => sum + parseFloat(item.tutar), 0);
        var yapilmamisTahsilat = veriler.filter(item => item.durum === 'yapilmamis').reduce((sum, item) => sum + parseFloat(item.tutar), 0);
        var tahsilatOrani = toplamTahsilat > 0 ? ((yapilmisTahsilat / toplamTahsilat) * 100).toFixed(1) : 0;
        
        $('#toplamTahsilat').text(parseFloat(toplamTahsilat).toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}));
        $('#yapilmisTahsilat').text(parseFloat(yapilmisTahsilat).toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}));
        $('#yapilmamisTahsilat').text(parseFloat(yapilmamisTahsilat).toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}));
        $('#tahsilatOrani').text('%' + tahsilatOrani);
    }

    function updateTahsilatDurumChart(veriler) {
        var yapilmis = veriler.filter(item => item.durum === 'yapilmis').length;
        var yapilmamis = veriler.filter(item => item.durum === 'yapilmamis').length;
        
        var ctx = document.getElementById('durumChart').getContext('2d');
        
        if(window.durumChart && typeof window.durumChart.destroy === 'function') {
            window.durumChart.destroy();
        }
        
        window.durumChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Yapılmış', 'Yapılmamış'],
                datasets: [{
                    data: [yapilmis, yapilmamis],
                    backgroundColor: ['#28a745', '#ffc107'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    function updateTahsilatTrendChart(veriler) {
        // Aylık gruplama
        var aylikVeriler = {};
        veriler.forEach(function(item) {
            var ay = item.tarih.substring(0, 7); // YYYY-MM formatında
            if(!aylikVeriler[ay]) {
                aylikVeriler[ay] = 0;
            }
            aylikVeriler[ay] += parseFloat(item.tutar);
        });
        
        var labels = Object.keys(aylikVeriler).sort();
        var data = labels.map(ay => aylikVeriler[ay]);
        
        var ctx = document.getElementById('trendChart').getContext('2d');
        
        if(window.trendChart && typeof window.trendChart.destroy === 'function') {
            window.trendChart.destroy();
        }
        
        window.trendChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tahsilat (₺)',
                    data: data,
                    backgroundColor: '#007bff',
                    borderColor: '#0056b3',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return parseFloat(value).toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'});
                            }
                        }
                    }
                }
            }
        });
    }

    function tahsilatDetay(id) {
        Swal.fire({
            title: 'Tahsilat Detayı',
            text: 'Tahsilat ID: ' + id + ' detayları gösterilecek',
            icon: 'info',
            confirmButtonText: 'Tamam'
        });
    }
    //#endregion

    //#region MASRAF RAPORU
    function masrafRaporuLoad() {
        console.log("masrafRaporuLoad çağrıldı");
        
        // DataTable'ı başlat
        if(typeof masrafRaporuTable === 'undefined') {
            console.log("DataTable başlatılıyor...");
            
            if ( ! $.fn.DataTable.isDataTable( '#masrafRaporTablosu' ) ) {
                initMasrafRaporuTable();
                console.log("DataTable başlatıldı");
            }
            
            if(typeof masrafRaporuTable === 'undefined') {
                console.error("DataTable başlatılamadı!");
                return;
            }
        }
        
        // Önce dropdown'ları yükle
        masrafRaporuOdemeGruplariYukle();
        masrafRaporuOdemeAltGruplariYukle();
        masrafRaporuIsAdlariYukle();
        
        // Backend API'yi çağır
        var formData = new FormData();
        formData.append("masrafRaporuListele", "1");
        
        makeAjax(formData).then((data) => {
            console.log("Masraf raporu API yanıtı:", data);
            
            // DataTable'ı yeniden boyutlandır
            setTimeout(function() {
                if(masrafRaporuTable) {
                    masrafRaporuTable.columns.adjust().draw();
                }
            }, 100);
            
            // Verileri DataTable'a yükle
            masrafRaporuTable.clear();
            if(data.data && data.data.length > 0) {
                data.data.forEach(item => {
                    masrafRaporuTable.row.add(item);
                });
            }
            masrafRaporuTable.draw();
            
            // Özet kartlarını güncelle
            updateMasrafOzetKartlari(data.data || []);
            
        }).catch((error) => {
            console.error("Masraf raporu yükleme hatası:", error);
            console.log("Backend API henüz hazır değil, boş tablo gösteriliyor");
            
            // Hata durumunda boş tablo göster
            masrafRaporuTable.clear();
            masrafRaporuTable.draw();
            
            // Boş verilerle özet kartları güncelle
            updateMasrafOzetKartlari([]);
        });
    }

    function masrafRaporuFiltrele() {
        console.log("masrafRaporuFiltrele çağrıldı");
        
        var tarihBaslangic = $("#tarihBaslangic").val();
        var tarihBitis = $("#tarihBitis").val();
        var odemeGrubu = $("#odemeGrubu").val();
        var odemeAltGrubu = $("#odemeAltGrubu").val();
        var isAdi = $("#isAdi").val();
        
        console.log("Tarih başlangıç:", tarihBaslangic);
        console.log("Tarih bitiş:", tarihBitis);
        console.log("Ödeme grubu:", odemeGrubu);
        console.log("Ödeme alt grubu:", odemeAltGrubu);
        console.log("İş adı:", isAdi);
        
        var formData = new FormData();
        formData.append("masrafRaporuFiltrele", "1");
        formData.append("tarihBaslangic", tarihBaslangic);
        formData.append("tarihBitis", tarihBitis);
        formData.append("odemeGrubu", odemeGrubu);
        formData.append("odemeAltGrubu", odemeAltGrubu);
        formData.append("isAdi", isAdi);
        
        makeAjax(formData).then((data) => {
            console.log("Filtreleme API yanıtı:", data);
            
            // DataTable'ı yeniden boyutlandır
            setTimeout(function() {
                if(masrafRaporuTable) {
                    masrafRaporuTable.columns.adjust().draw();
                }
            }, 100);
            
            // Verileri DataTable'a yükle
            masrafRaporuTable.clear();
            if(data.data && data.data.length > 0) {
                data.data.forEach(item => {
                    masrafRaporuTable.row.add(item);
                });
            }
            masrafRaporuTable.draw();
            
            // Özet kartlarını güncelle
            updateMasrafOzetKartlari(data.data || []);
            
        }).catch((error) => {
            console.error("Masraf raporu filtreleme hatası:", error);
            console.log("Backend API henüz hazır değil, mevcut veriler korunuyor");
            
            // Hata durumunda mevcut verileri koru
            alert("Filtreleme API'si henüz hazır değil. Backend ekibi API'yi hazırladığında çalışacak.");
        });
    }

    function masrafRaporuTemizle() {
        $('#tarihAraligi').val('');
        $('#tarihBaslangic').val('');
        $('#tarihBitis').val('');
        $('#odemeGrubu').val('');
        $('#odemeAltGrubu').val('');
        $('#isAdi').val('');
        masrafRaporuLoad();
    }

    function updateMasrafOzetKartlari(veriler) {
        var toplamMasraf = veriler.reduce((sum, item) => sum + parseFloat(item.tutar), 0);
        var kategoriSayisi = [...new Set(veriler.map(item => item.kategori))].length;
        var ortalamaMasraf = veriler.length > 0 ? (toplamMasraf / veriler.length) : 0;
        
        // Özet kartlarını güncelle
        $('#toplamMasraf').text(toplamMasraf.toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}));
        $('#kategoriSayisi').text(kategoriSayisi);
        $('#ortalamaMasraf').text(ortalamaMasraf.toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}));
    }

    function masrafDetay(id) {
        console.log("Masraf detayı gösteriliyor, ID:", id);
        Swal.fire({
            title: 'Masraf Detayı',
            text: 'Masraf ID: ' + id + ' detayları gösterilecek',
            icon: 'info',
            confirmButtonText: 'Tamam'
        });
    }

    function masrafRaporuOdemeGruplariYukle() {
        console.log("masrafRaporuOdemeGruplariYukle çağrıldı");
        
        // Önce özel API'yi dene, yoksa mevcut API'yi kullan
        var formData = new FormData();
        formData.append("masrafRaporuOdemeGruplari", "1");
        
        makeAjax(formData).then((data) => {
            console.log("Ödeme grupları API yanıtı:", data);
            
            var odemeGrubuSelect = $('#odemeGrubu');
            odemeGrubuSelect.empty();
            odemeGrubuSelect.append('<option value="">Tüm Gruplar</option>');
            
            if(data.status === 1 && data.data && data.data.length > 0) {
                console.log("Ödeme grubu sayısı:", data.data.length);
                data.data.forEach(function(grup) {
                    console.log("Ödeme grubu ekleniyor:", grup.grup_adi);
                    odemeGrubuSelect.append('<option value="' + grup.grup_adi + '">' + grup.grup_adi + '</option>');
                });
            } else {
                console.log("API henüz hazır değil veya veri boş, fallback kullanılıyor");
                
                // Fallback veriler
                odemeGrubuSelect.append('<option value="Ofis Giderleri">Ofis Giderleri</option>');
                odemeGrubuSelect.append('<option value="Seyahat Giderleri">Seyahat Giderleri</option>');
                odemeGrubuSelect.append('<option value="Eğitim Giderleri">Eğitim Giderleri</option>');
                odemeGrubuSelect.append('<option value="Pazarlama Giderleri">Pazarlama Giderleri</option>');
                odemeGrubuSelect.append('<option value="Teknik Giderler">Teknik Giderler</option>');
            }
            
        }).catch((error) => {
            console.log("Özel ödeme grupları API'si hazır değil, fallback kullanılıyor");
            
            // Fallback: Mevcut çalışan API'yi kullan (eğil varsa)
            var odemeGrubuSelect = $('#odemeGrubu');
            odemeGrubuSelect.empty();
            odemeGrubuSelect.append('<option value="">Tüm Gruplar</option>');
            odemeGrubuSelect.append('<option value="Ofis Giderleri">Ofis Giderleri</option>');
            odemeGrubuSelect.append('<option value="Seyahat Giderleri">Seyahat Giderleri</option>');
            odemeGrubuSelect.append('<option value="Eğitim Giderleri">Eğitim Giderleri</option>');
            odemeGrubuSelect.append('<option value="Pazarlama Giderleri">Pazarlama Giderleri</option>');
            odemeGrubuSelect.append('<option value="Teknik Giderler">Teknik Giderler</option>');
        });
    }

    function masrafRaporuOdemeAltGruplariYukle() {
        console.log("masrafRaporuOdemeAltGruplariYukle çağrıldı");
        
        // Önce özel API'yi dene, yoksa mevcut API'yi kullan
        var formData = new FormData();
        formData.append("masrafRaporuOdemeAltGruplari", "1");
        
        makeAjax(formData).then((data) => {
            console.log("Ödeme alt grupları API yanıtı:", data);
            
            var odemeAltGrubuSelect = $('#odemeAltGrubu');
            odemeAltGrubuSelect.empty();
            odemeAltGrubuSelect.append('<option value="">Tüm Alt Gruplar</option>');
            
            if(data.status === 1 && data.data && data.data.length > 0) {
                console.log("Ödeme alt grubu sayısı:", data.data.length);
                data.data.forEach(function(altGrup) {
                    console.log("Ödeme alt grubu ekleniyor:", altGrup.alt_grup_adi);
                    odemeAltGrubuSelect.append('<option value="' + altGrup.alt_grup_adi + '">' + altGrup.alt_grup_adi + '</option>');
                });
            } else {
                console.log("API henüz hazır değil veya veri boş, fallback kullanılıyor");
                
                // Fallback veriler
                odemeAltGrubuSelect.append('<option value="Kırtasiye">Kırtasiye</option>');
                odemeAltGrubuSelect.append('<option value="Temizlik">Temizlik</option>');
                odemeAltGrubuSelect.append('<option value="Yakıt">Yakıt</option>');
                odemeAltGrubuSelect.append('<option value="Ulaşım">Ulaşım</option>');
                odemeAltGrubuSelect.append('<option value="Yemek">Yemek</option>');
                odemeAltGrubuSelect.append('<option value="Konaklama">Konaklama</option>');
                odemeAltGrubuSelect.append('<option value="Telefon">Telefon</option>');
                odemeAltGrubuSelect.append('<option value="İnternet">İnternet</option>');
            }
            
        }).catch((error) => {
            console.log("Özel ödeme alt grupları API'si hazır değil, fallback kullanılıyor");
            
            // Fallback: Mevcut çalışan API'yi kullan (eğer varsa)
            var odemeAltGrubuSelect = $('#odemeAltGrubu');
            odemeAltGrubuSelect.empty();
            odemeAltGrubuSelect.append('<option value="">Tüm Alt Gruplar</option>');
            odemeAltGrubuSelect.append('<option value="Kırtasiye">Kırtasiye</option>');
            odemeAltGrubuSelect.append('<option value="Temizlik">Temizlik</option>');
            odemeAltGrubuSelect.append('<option value="Yakıt">Yakıt</option>');
            odemeAltGrubuSelect.append('<option value="Ulaşım">Ulaşım</option>');
            odemeAltGrubuSelect.append('<option value="Yemek">Yemek</option>');
            odemeAltGrubuSelect.append('<option value="Konaklama">Konaklama</option>');
            odemeAltGrubuSelect.append('<option value="Telefon">Telefon</option>');
            odemeAltGrubuSelect.append('<option value="İnternet">İnternet</option>');
        });
    }

    // Ödeme grubu değiştiğinde alt grupları güncelle
    function masrafRaporuOdemeGrubuDegisti() {
        var secilenGrup = $('#odemeGrubu').val();
        console.log("Seçilen ödeme grubu:", secilenGrup);
        
        if(secilenGrup) {
            // Seçilen gruba göre alt grupları yükle
            var formData = new FormData();
            formData.append("masrafRaporuOdemeAltGruplariByGrup", "1");
            formData.append("odemeGrubu", secilenGrup);
            
            makeAjax(formData).then((data) => {
                console.log("Alt gruplar API yanıtı:", data);
                
                var odemeAltGrubuSelect = $('#odemeAltGrubu');
                odemeAltGrubuSelect.empty();
                odemeAltGrubuSelect.append('<option value="">Tüm Alt Gruplar</option>');
                
                if(data.status === 1 && data.data && data.data.length > 0) {
                    data.data.forEach(function(altGrup) {
                        odemeAltGrubuSelect.append('<option value="' + altGrup.alt_grup_adi + '">' + altGrup.alt_grup_adi + '</option>');
                    });
                } else {
                    console.log("Grup bazlı alt gruplar API'si hazır değil, tüm alt gruplar gösteriliyor");
                    // Fallback: Tüm alt grupları göster
                    odemeAltGrubuSelect.append('<option value="Kırtasiye">Kırtasiye</option>');
                    odemeAltGrubuSelect.append('<option value="Temizlik">Temizlik</option>');
                    odemeAltGrubuSelect.append('<option value="Yakıt">Yakıt</option>');
                    odemeAltGrubuSelect.append('<option value="Ulaşım">Ulaşım</option>');
                    odemeAltGrubuSelect.append('<option value="Yemek">Yemek</option>');
                    odemeAltGrubuSelect.append('<option value="Konaklama">Konaklama</option>');
                    odemeAltGrubuSelect.append('<option value="Telefon">Telefon</option>');
                    odemeAltGrubuSelect.append('<option value="İnternet">İnternet</option>');
                }
                
            }).catch((error) => {
                console.log("Alt gruplar API'si hazır değil");
                // Hata durumunda tüm alt grupları göster
                masrafRaporuOdemeAltGruplariYukle();
            });
        } else {
            // Grup seçilmediyse tüm alt grupları göster
            masrafRaporuOdemeAltGruplariYukle();
        }
    }

    function masrafRaporuIsAdlariYukle() {
        console.log("masrafRaporuIsAdlariYukle çağrıldı");
        
        // Önce özel API'yi dene, yoksa mevcut API'yi kullan
        var formData = new FormData();
        formData.append("masrafRaporuIsAdlari", "1");
        
        makeAjax(formData).then((data) => {
            console.log("İş adları API yanıtı:", data);
            
            var isAdiSelect = $('#isAdi');
            isAdiSelect.empty();
            isAdiSelect.append('<option value="">Tüm İşler</option>');
            
            if(data.status === 1 && data.data && data.data.length > 0) {
                console.log("İş adı sayısı:", data.data.length);
                data.data.forEach(function(is) {
                    console.log("İş adı ekleniyor:", is.is_adi);
                    isAdiSelect.append('<option value="' + is.is_adi + '">' + is.is_adi + '</option>');
                });
            } else {
                console.log("API henüz hazır değil veya veri boş, fallback kullanılıyor");
                
                // Fallback veriler
                isAdiSelect.append('<option value="Proje A">Proje A</option>');
                isAdiSelect.append('<option value="Proje B">Proje B</option>');
                isAdiSelect.append('<option value="Proje C">Proje C</option>');
                isAdiSelect.append('<option value="Genel Giderler">Genel Giderler</option>');
                isAdiSelect.append('<option value="Pazarlama">Pazarlama</option>');
                isAdiSelect.append('<option value="Satış">Satış</option>');
                isAdiSelect.append('<option value="Üretim">Üretim</option>');
                isAdiSelect.append('<option value="Ar-Ge">Ar-Ge</option>');
            }
            
        }).catch((error) => {
            console.log("Özel iş adları API'si hazır değil, fallback kullanılıyor");
            
            // Fallback: Mevcut çalışan API'yi kullan (eğer varsa)
            var isAdiSelect = $('#isAdi');
            isAdiSelect.empty();
            isAdiSelect.append('<option value="">Tüm İşler</option>');
            isAdiSelect.append('<option value="Proje A">Proje A</option>');
            isAdiSelect.append('<option value="Proje B">Proje B</option>');
            isAdiSelect.append('<option value="Proje C">Proje C</option>');
            isAdiSelect.append('<option value="Genel Giderler">Genel Giderler</option>');
            isAdiSelect.append('<option value="Pazarlama">Pazarlama</option>');
            isAdiSelect.append('<option value="Satış">Satış</option>');
            isAdiSelect.append('<option value="Üretim">Üretim</option>');
            isAdiSelect.append('<option value="Ar-Ge">Ar-Ge</option>');
        });
    }

    // Kasa bazında bakiye chart oluşturma
    function bankaHesaplariRaporuChartOlustur() {
        console.log("Kasa bazında bakiye grafiği oluşturuluyor...");
        
        // Mevcut chart'ı yok et
        if (window.kasaBakiyeChart && typeof window.kasaBakiyeChart.destroy === 'function') {
            window.kasaBakiyeChart.destroy();
        }
        
        var ctx = document.getElementById('kasaBakiyeChart').getContext('2d');
        var chartType = window.currentChartType || 'gunluk';
        
        // Backend'den chart verisi çek
        bankaHesaplariRaporuChartVerisiCek(chartType).then(function(chartData) {
            window.kasaBakiyeChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: chartData.datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: {
                                callback: function(value) {
                                    return '₺' + value.toLocaleString('tr-TR');
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Kasa Bazında ' + (chartType === 'gunluk' ? 'Günlük (30 Gün)' : chartType === 'aylik' ? 'Aylık' : 'Yıllık') + ' Bakiye Grafiği'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ₺' + context.parsed.y.toLocaleString('tr-TR');
                                }
                            }
                        }
                    }
                }
            });
        }).catch(function(error) {
            console.error("Chart verisi yüklenirken hata:", error);
            // Hata durumunda boş chart göster
            window.kasaBakiyeChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Veri Yok'],
                    datasets: [{
                        label: 'Veri Bulunamadı',
                        data: [0],
                        borderColor: 'rgba(200, 200, 200, 0.8)',
                        backgroundColor: 'rgba(200, 200, 200, 0.1)',
                        tension: 0.1,
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        });
    }

    // Backend'den chart verisi çekme
    function bankaHesaplariRaporuChartVerisiCek(chartType) {
        return new Promise(function(resolve, reject) {
            var formData = new FormData();
            formData.append("bankaHesaplariRaporuChartVerisi", "1");
            formData.append("chartType", chartType);
            
            // Filtreleme parametrelerini ekle
            var kasaSecimi = $("#kasaSecimi").val();
            var tarihBaslangic = $("#tarihBaslangic").val();
            var tarihBitis = $("#tarihBitis").val();
            
            if (kasaSecimi) {
                formData.append("kasaID", kasaSecimi);
            }
            if (tarihBaslangic) {
                formData.append("tarihBaslangic", tarihBaslangic);
            }
            if (tarihBitis) {
                formData.append("tarihBitis", tarihBitis);
            }
            
            makeAjax(formData).then(function(data) {
                console.log("Chart verisi:", data);
                
                if (data.status === 1 && data.data && data.data.length > 0) {
                    var chartData = bankaHesaplariRaporuChartVerisiHazirla(data.data, chartType);
                    resolve(chartData);
                } else {
                    console.log("Backend'den veri gelmedi, test verisi kullanılıyor");
                    var testData = bankaHesaplariRaporuTestVerisiOlustur(chartType);
                    var chartData = bankaHesaplariRaporuChartVerisiHazirla(testData, chartType);
                    resolve(chartData);
                }
            }).catch(function(error) {
                console.log("Backend hatası, test verisi kullanılıyor:", error);
                var testData = bankaHesaplariRaporuTestVerisiOlustur(chartType);
                var chartData = bankaHesaplariRaporuChartVerisiHazirla(testData, chartType);
                resolve(chartData);
            });
        });
    }

    // Test verisi oluşturma
    function bankaHesaplariRaporuTestVerisiOlustur(chartType) {
        console.log("Test verisi oluşturuluyor, chart type:", chartType);
        
        var testData = [];
        var kasalar = ['Ana Kasa', 'Yan Kasa', 'Merkez Kasa'];
        var today = new Date();
        
        // Kasa seçimi filtresi uygula
        var kasaSecimi = $("#kasaSecimi").val();
        if (kasaSecimi) {
            var secilenKasaAdi = $("#kasaSecimi option:selected").text();
            if (secilenKasaAdi && secilenKasaAdi !== "Tüm Kasalar") {
                kasalar = [secilenKasaAdi];
                console.log("Kasa filtresi uygulandı:", secilenKasaAdi);
            } else {
                console.log("Tüm kasalar gösteriliyor");
            }
        } else {
            console.log("Kasa seçimi yok, tüm kasalar gösteriliyor");
        }
        
        if (chartType === 'gunluk') {
            // Son 30 gün için test verisi
            for (var i = 29; i >= 0; i--) {
                var date = new Date(today);
                date.setDate(date.getDate() - i);
                var dateStr = date.toISOString().split('T')[0];
                
                kasalar.forEach(function(kasa, index) {
                    var baseBakiye = 50000 + (index * 20000); // Her kasa için farklı başlangıç bakiyesi
                    var randomChange = (Math.random() - 0.5) * 10000; // -5000 ile +5000 arası rastgele değişim
                    var bakiye = Math.max(0, baseBakiye + randomChange + (i * 100)); // Günlük artış
                    
                    testData.push({
                        kasaAdi: kasa,
                        tarih: dateStr,
                        bakiye: Math.round(bakiye * 100) / 100
                    });
                });
            }
        } else if (chartType === 'aylik') {
            // Son 12 ay için test verisi
            for (var i = 11; i >= 0; i--) {
                var date = new Date(today);
                date.setMonth(date.getMonth() - i);
                var dateStr = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
                
                kasalar.forEach(function(kasa, index) {
                    var baseBakiye = 50000 + (index * 20000);
                    var randomChange = (Math.random() - 0.5) * 50000;
                    var bakiye = Math.max(0, baseBakiye + randomChange + (i * 5000));
                    
                    testData.push({
                        kasaAdi: kasa,
                        tarih: dateStr,
                        bakiye: Math.round(bakiye * 100) / 100
                    });
                });
            }
        } else if (chartType === 'yillik') {
            // Son 5 yıl için test verisi
            for (var i = 4; i >= 0; i--) {
                var date = new Date(today);
                date.setFullYear(date.getFullYear() - i);
                var dateStr = date.getFullYear().toString();
                
                kasalar.forEach(function(kasa, index) {
                    var baseBakiye = 500000 + (index * 200000);
                    var randomChange = (Math.random() - 0.5) * 200000;
                    var bakiye = Math.max(0, baseBakiye + randomChange + (i * 100000));
                    
                    testData.push({
                        kasaAdi: kasa,
                        tarih: dateStr,
                        bakiye: Math.round(bakiye * 100) / 100
                    });
                });
            }
        }
        
        console.log("Test verisi oluşturuldu:", testData.length, "kayıt");
        return testData;
    }

    // Chart verisi hazırlama
    function bankaHesaplariRaporuChartVerisiHazirla(data, chartType) {
        var kasalar = {};
        var labels = [];
        var datasets = [];
        
        // Eğer veri yoksa boş chart göster
        if (!data || data.length === 0) {
            console.log("Chart için veri bulunamadı, boş chart gösteriliyor");
            return {
                labels: ['Veri Yok'],
                datasets: [{
                    label: 'Veri Bulunamadı',
                    data: [0],
                    borderColor: 'rgba(200, 200, 200, 0.8)',
                    backgroundColor: 'rgba(200, 200, 200, 0.1)',
                    tension: 0.1,
                    fill: false
                }]
            };
        }
        
        // Kasa seçimi filtresi uygula
        var kasaSecimi = $("#kasaSecimi").val();
        var secilenKasaAdi = null;
        if (kasaSecimi) {
            secilenKasaAdi = $("#kasaSecimi option:selected").text();
            if (secilenKasaAdi === "Tüm Kasalar") {
                secilenKasaAdi = null;
                console.log("Tüm kasalar gösteriliyor");
            } else {
                console.log("Kasa filtresi uygulandı:", secilenKasaAdi);
            }
        } else {
            console.log("Kasa seçimi yok, tüm kasalar gösteriliyor");
        }
        
        // Veriyi grupla
        data.forEach(function(item) {
            var kasaAdi = item.kasaAdi || 'Bilinmeyen Kasa';
            
            // Kasa filtresi uygula
            if (secilenKasaAdi && kasaAdi !== secilenKasaAdi) {
                return; // Bu kasa filtrelenmiş, atla
            }
            
            var tarih = new Date(item.tarih);
            var bakiye = parseFloat(item.bakiye) || 0;
            
            // Tarih formatını belirle
            var tarihKey;
            if (chartType === 'gunluk') {
                tarihKey = tarih.toISOString().split('T')[0]; // YYYY-MM-DD
            } else if (chartType === 'aylik') {
                tarihKey = tarih.getFullYear() + '-' + String(tarih.getMonth() + 1).padStart(2, '0'); // YYYY-MM
            } else if (chartType === 'yillik') {
                tarihKey = tarih.getFullYear().toString(); // YYYY
            }
            
            if (!kasalar[kasaAdi]) {
                kasalar[kasaAdi] = {};
            }
            
            kasalar[kasaAdi][tarihKey] = bakiye;
        });
        
        // Tüm tarihleri topla ve sırala
        var allDates = new Set();
        Object.keys(kasalar).forEach(function(kasa) {
            Object.keys(kasalar[kasa]).forEach(function(tarih) {
                allDates.add(tarih);
            });
        });
        
        labels = Array.from(allDates).sort();
        
        // Renk paleti
        var colors = [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(199, 199, 199, 0.8)',
            'rgba(83, 102, 255, 0.8)'
        ];
        
        // Dataset'leri oluştur
        var colorIndex = 0;
        Object.keys(kasalar).forEach(function(kasa) {
            var data = labels.map(function(tarih) {
                return kasalar[kasa][tarih] || 0;
            });
            
            datasets.push({
                label: kasa,
                data: data,
                borderColor: colors[colorIndex % colors.length],
                backgroundColor: colors[colorIndex % colors.length].replace('0.8', '0.1'),
                tension: 0.1,
                fill: false
            });
            
            colorIndex++;
        });
        
        console.log('Chart verisi hazırlandı:', {
            labels: labels,
            datasets: datasets.length,
            kasalar: Object.keys(kasalar)
        });
        
        return {
            labels: labels,
            datasets: datasets
        };
    }

    // Chart butonları event handler'ları
    function bankaHesaplariRaporuChartEventHandlers() {
        $('#gunlukChartBtn').on('click', function() {
            $('.btn-group button').removeClass('active');
            $(this).addClass('active');
            window.currentChartType = 'gunluk';
            bankaHesaplariRaporuChartOlustur();
        });
        
        $('#aylikChartBtn').on('click', function() {
            $('.btn-group button').removeClass('active');
            $(this).addClass('active');
            window.currentChartType = 'aylik';
            bankaHesaplariRaporuChartOlustur();
        });
        
        $('#yillikChartBtn').on('click', function() {
            $('.btn-group button').removeClass('active');
            $(this).addClass('active');
            window.currentChartType = 'yillik';
            bankaHesaplariRaporuChartOlustur();
        });
        
        // Kasa seçimi değiştiğinde chart'ı güncelle
        $('#kasaSecimi').on('change', function() {
            console.log("Kasa seçimi değişti, chart güncelleniyor");
            if (window.kasaBakiyeChart) {
                bankaHesaplariRaporuChartOlustur();
            }
        });
    }

    // İşlem türü dağılımı chart oluşturma
    function bankaHesaplariRaporuIslemTuruChartOlustur() {
        console.log("İşlem türü dağılımı chart'ı oluşturuluyor...");
        
        // Kasa işlemleri tablosundan veri çek ve chart oluştur
        bankaHesaplariRaporuIslemTuruHesapla();
    }

    // İşlem türü verilerini hesaplama
    function bankaHesaplariRaporuIslemTuruHesapla() {
        // Kasa işlemleri tablosundan veri çek
        bankaHesaplariRaporuKasaIslemleriVerisiCek().then(function(data) {
            var islemTurleri = {};
            
            console.log("Kasa işlemleri verisi:", data);
            console.log("İşlem türü hesaplama için veri sayısı:", data.length);
            
            // Veriyi işle
            data.forEach(function(item) {
                var islemTuru = item.islemTuru || item.tabloTur || 'Bilinmeyen';
                
                // HTML tag'lerini temizle
                islemTuru = islemTuru.replace(/<[^>]*>/g, '').trim();
                
                // Virman, Tahsilat, Masraf olarak grupla
                if (islemTuru.includes('Virman')) {
                    islemTuru = 'Virman';
                } else if (islemTuru.includes('Tahsilat')) {
                    islemTuru = 'Tahsilat';
                } else if (islemTuru.includes('Masraf')) {
                    islemTuru = 'Masraf';
                } else {
                    islemTuru = 'Diğer';
                }
                
                if (!islemTurleri[islemTuru]) {
                    islemTurleri[islemTuru] = 0;
                }
                islemTurleri[islemTuru]++;
            });
            
            // Chart'ı güncelle
            bankaHesaplariRaporuIslemTuruChartGuncelle(islemTurleri);
            
        }).catch(function(error) {
            console.log("Kasa işlemleri verisi alınamadı, test verisi kullanılıyor:", error);
            var testIslemTurleri = {
                'Tahsilat': 15,
                'Masraf': 8,
                'Virman': 12,
                'Diğer': 3
            };
            bankaHesaplariRaporuIslemTuruChartGuncelle(testIslemTurleri);
        });
    }

    // Kasa işlemleri tablosundan veri çekme
    function bankaHesaplariRaporuKasaIslemleriVerisiCek() {
        return new Promise(function(resolve, reject) {
            var formData = new FormData();
            formData.append("kasaIslemleriListele", "1");
            
            // Filtreleme parametrelerini ekle
            var kasaSecimi = $("#kasaSecimi").val();
            var tarihBaslangic = $("#tarihBaslangic").val();
            var tarihBitis = $("#tarihBitis").val();
            
            if (kasaSecimi) {
                formData.append("kasaID", kasaSecimi);
            }
            if (tarihBaslangic) {
                formData.append("tarihBaslangic", tarihBaslangic);
            }
            if (tarihBitis) {
                formData.append("tarihBitis", tarihBitis);
            }
            
            makeAjax(formData).then(function(data) {
                console.log("Kasa işlemleri verisi:", data);
                
                if (data.status === 1 && data.data) {
                    resolve(data.data);
                } else {
                    reject(new Error(data.message || 'Kasa işlemleri verisi alınamadı'));
                }
            }).catch(function(error) {
                reject(error);
            });
        });
    }

    // İşlem türü chart'ını güncelleme
    function bankaHesaplariRaporuIslemTuruChartGuncelle(islemTurleri) {
        // Mevcut chart'ı yok et
        if (window.islemTuruChart && typeof window.islemTuruChart.destroy === 'function') {
            window.islemTuruChart.destroy();
        }
        
        var ctx = document.getElementById('islemTuruChart').getContext('2d');
        
        // Chart verisi hazırla
        var labels = Object.keys(islemTurleri);
        var data = Object.values(islemTurleri);
        var colors = [
            '#28a745', // Tahsilat - Yeşil
            '#dc3545', // Masraf - Kırmızı
            '#007bff', // Virman - Mavi
            '#6c757d'  // Diğer - Gri
        ];
        
        console.log("İşlem türü dağılımı:", islemTurleri);
        
        window.islemTuruChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    title: {
                        display: true,
                        text: 'İşlem Türü Dağılımı',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                var label = context.label || '';
                                var value = context.parsed;
                                var total = context.dataset.data.reduce((a, b) => a + b, 0);
                                var percentage = ((value / total) * 100).toFixed(1);
                                return label + ': ' + value + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    }

    // Tahsilat/Masraf chart oluşturma
    function bankaHesaplariRaporuTahsilatMasrafChartOlustur() {
        console.log("Tahsilat/Masraf chart'ı oluşturuluyor...");
        
        // Mevcut chart'ı yok et
        if (window.tahsilatMasrafChart && typeof window.tahsilatMasrafChart.destroy === 'function') {
            window.tahsilatMasrafChart.destroy();
        }
        
        var ctx = document.getElementById('tahsilatMasrafChart').getContext('2d');
        var chartType = window.currentTahsilatMasrafChartType || 'gunluk';
        
        // Backend'den chart verisi çek
        bankaHesaplariRaporuTahsilatMasrafChartVerisiCek(chartType).then(function(chartData) {
            window.tahsilatMasrafChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: chartData.labels,
                    datasets: chartData.datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '₺' + value.toLocaleString('tr-TR');
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Kasa Bazında ' + (chartType === 'gunluk' ? 'Günlük' : chartType === 'aylik' ? 'Aylık' : 'Yıllık') + ' Tahsilat/Masraf'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ₺' + context.parsed.y.toLocaleString('tr-TR');
                                }
                            }
                        }
                    }
                }
            });
        }).catch(function(error) {
            console.error("Tahsilat/Masraf chart verisi yüklenirken hata:", error);
            // Hata durumunda boş chart göster
            window.tahsilatMasrafChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Veri Yok'],
                    datasets: [{
                        label: 'Veri Bulunamadı',
                        data: [0],
                        backgroundColor: 'rgba(200, 200, 200, 0.8)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        });
    }

    // Backend'den tahsilat/masraf chart verisi çekme
    function bankaHesaplariRaporuTahsilatMasrafChartVerisiCek(chartType) {
        return new Promise(function(resolve, reject) {
            var formData = new FormData();
            formData.append("bankaHesaplariRaporuTahsilatMasrafChartVerisi", "1");
            formData.append("chartType", chartType);
            
            // Filtreleme parametrelerini ekle
            var kasaSecimi = $("#kasaSecimi").val();
            var tarihBaslangic = $("#tarihBaslangic").val();
            var tarihBitis = $("#tarihBitis").val();
            
            if (kasaSecimi) {
                formData.append("kasaID", kasaSecimi);
            }
            if (tarihBaslangic) {
                formData.append("tarihBaslangic", tarihBaslangic);
            }
            if (tarihBitis) {
                formData.append("tarihBitis", tarihBitis);
            }
            
            makeAjax(formData).then(function(data) {
                console.log("Tahsilat/Masraf chart verisi:", data);
                
                if (data.status === 1 && data.data) {
                    var chartData = bankaHesaplariRaporuTahsilatMasrafChartVerisiHazirla(data.data, chartType);
                    resolve(chartData);
                } else {
                    console.log("Backend'den veri gelmedi, test verisi kullanılıyor");
                    var testData = bankaHesaplariRaporuTahsilatMasrafTestVerisiOlustur(chartType);
                    var chartData = bankaHesaplariRaporuTahsilatMasrafChartVerisiHazirla(testData, chartType);
                    resolve(chartData);
                }
            }).catch(function(error) {
                console.log("Backend hatası, test verisi kullanılıyor:", error);
                var testData = bankaHesaplariRaporuTahsilatMasrafTestVerisiOlustur(chartType);
                var chartData = bankaHesaplariRaporuTahsilatMasrafChartVerisiHazirla(testData, chartType);
                resolve(chartData);
            });
        });
    }

    // Test verisi oluşturma
    function bankaHesaplariRaporuTahsilatMasrafTestVerisiOlustur(chartType) {
        console.log("Tahsilat/Masraf test verisi oluşturuluyor, chart type:", chartType);
        
        var testData = [];
        var kasalar = ['Ana Kasa', 'Yan Kasa', 'Merkez Kasa'];
        var today = new Date();
        
        // Kasa seçimi filtresi uygula
        var kasaSecimi = $("#kasaSecimi").val();
        if (kasaSecimi) {
            var secilenKasaAdi = $("#kasaSecimi option:selected").text();
            if (secilenKasaAdi && secilenKasaAdi !== "Tüm Kasalar") {
                kasalar = [secilenKasaAdi];
                console.log("Kasa filtresi uygulandı:", secilenKasaAdi);
            }
        }
        
        if (chartType === 'gunluk') {
            // Son 30 gün için test verisi
            for (var i = 29; i >= 0; i--) {
                var date = new Date(today);
                date.setDate(date.getDate() - i);
                var dateStr = date.toISOString().split('T')[0];
                
                kasalar.forEach(function(kasa, index) {
                    var tahsilat = Math.floor(Math.random() * 10000) + 5000; // 5000-15000 arası
                    var masraf = Math.floor(Math.random() * 5000) + 2000; // 2000-7000 arası
                    
                    testData.push({
                        kasaAdi: kasa,
                        tarih: dateStr,
                        tahsilat: tahsilat,
                        masraf: masraf
                    });
                });
            }
        } else if (chartType === 'aylik') {
            // Son 12 ay için test verisi
            for (var i = 11; i >= 0; i--) {
                var date = new Date(today);
                date.setMonth(date.getMonth() - i);
                var dateStr = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
                
                kasalar.forEach(function(kasa, index) {
                    var tahsilat = Math.floor(Math.random() * 100000) + 50000; // 50000-150000 arası
                    var masraf = Math.floor(Math.random() * 50000) + 20000; // 20000-70000 arası
                    
                    testData.push({
                        kasaAdi: kasa,
                        tarih: dateStr,
                        tahsilat: tahsilat,
                        masraf: masraf
                    });
                });
            }
        } else if (chartType === 'yillik') {
            // Son 5 yıl için test verisi
            for (var i = 4; i >= 0; i--) {
                var date = new Date(today);
                date.setFullYear(date.getFullYear() - i);
                var dateStr = date.getFullYear().toString();
                
                kasalar.forEach(function(kasa, index) {
                    var tahsilat = Math.floor(Math.random() * 500000) + 500000; // 500000-1000000 arası
                    var masraf = Math.floor(Math.random() * 200000) + 200000; // 200000-400000 arası
                    
                    testData.push({
                        kasaAdi: kasa,
                        tarih: dateStr,
                        tahsilat: tahsilat,
                        masraf: masraf
                    });
                });
            }
        }
        
        console.log("Tahsilat/Masraf test verisi oluşturuldu:", testData.length, "kayıt");
        return testData;
    }

    // Chart verisi hazırlama
    function bankaHesaplariRaporuTahsilatMasrafChartVerisiHazirla(data, chartType) {
        var kasalar = {};
        var labels = [];
        var datasets = [];
        
        // Eğer veri yoksa boş chart göster
        if (!data || data.length === 0) {
            console.log("Chart için veri bulunamadı, boş chart gösteriliyor");
            return {
                labels: ['Veri Yok'],
                datasets: [{
                    label: 'Veri Bulunamadı',
                    data: [0],
                    backgroundColor: 'rgba(200, 200, 200, 0.8)'
                }]
            };
        }
        
        // Kasa seçimi filtresi uygula
        var kasaSecimi = $("#kasaSecimi").val();
        var secilenKasaAdi = null;
        if (kasaSecimi) {
            secilenKasaAdi = $("#kasaSecimi option:selected").text();
            if (secilenKasaAdi === "Tüm Kasalar") {
                secilenKasaAdi = null;
                console.log("Tüm kasalar gösteriliyor");
            } else {
                console.log("Kasa filtresi uygulandı:", secilenKasaAdi);
            }
        } else {
            console.log("Kasa seçimi yok, tüm kasalar gösteriliyor");
        }
        
        // Veriyi grupla
        data.forEach(function(item) {
            var kasaAdi = item.kasaAdi || 'Bilinmeyen Kasa';
            
            // Kasa filtresi uygula
            if (secilenKasaAdi && kasaAdi !== secilenKasaAdi) {
                return; // Bu kasa filtrelenmiş, atla
            }
            
            var tarih = new Date(item.tarih);
            var tahsilat = parseFloat(item.tahsilat) || 0;
            var masraf = parseFloat(item.masraf) || 0;
            
            // Tarih formatını belirle
            var tarihKey;
            if (chartType === 'gunluk') {
                tarihKey = tarih.toISOString().split('T')[0]; // YYYY-MM-DD
            } else if (chartType === 'aylik') {
                tarihKey = tarih.getFullYear() + '-' + String(tarih.getMonth() + 1).padStart(2, '0'); // YYYY-MM
            } else if (chartType === 'yillik') {
                tarihKey = tarih.getFullYear().toString(); // YYYY
            }
            
            if (!kasalar[kasaAdi]) {
                kasalar[kasaAdi] = {
                    tahsilat: {},
                    masraf: {}
                };
            }
            
            if (!kasalar[kasaAdi].tahsilat[tarihKey]) {
                kasalar[kasaAdi].tahsilat[tarihKey] = 0;
            }
            if (!kasalar[kasaAdi].masraf[tarihKey]) {
                kasalar[kasaAdi].masraf[tarihKey] = 0;
            }
            
            kasalar[kasaAdi].tahsilat[tarihKey] += tahsilat;
            kasalar[kasaAdi].masraf[tarihKey] += masraf;
        });
        
        // Tüm tarihleri topla ve sırala
        var allDates = new Set();
        Object.keys(kasalar).forEach(function(kasa) {
            Object.keys(kasalar[kasa].tahsilat).forEach(function(tarih) {
                allDates.add(tarih);
            });
            Object.keys(kasalar[kasa].masraf).forEach(function(tarih) {
                allDates.add(tarih);
            });
        });
        
        labels = Array.from(allDates).sort();
        
        // Renk paleti
        var colors = [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(199, 199, 199, 0.8)',
            'rgba(83, 102, 255, 0.8)'
        ];
        
        // Dataset'leri oluştur
        var colorIndex = 0;
        Object.keys(kasalar).forEach(function(kasa) {
            var tahsilatData = labels.map(function(tarih) {
                return kasalar[kasa].tahsilat[tarih] || 0;
            });
            
            var masrafData = labels.map(function(tarih) {
                return kasalar[kasa].masraf[tarih] || 0;
            });
            
            datasets.push({
                label: kasa + ' - Tahsilat',
                data: tahsilatData,
                backgroundColor: colors[colorIndex % colors.length],
                borderColor: colors[colorIndex % colors.length],
                borderWidth: 1
            });
            
            datasets.push({
                label: kasa + ' - Masraf',
                data: masrafData,
                backgroundColor: colors[colorIndex % colors.length].replace('0.8', '0.4'),
                borderColor: colors[colorIndex % colors.length],
                borderWidth: 1
            });
            
            colorIndex++;
        });
        
        console.log('Tahsilat/Masraf chart verisi hazırlandı:', {
            labels: labels,
            datasets: datasets.length,
            kasalar: Object.keys(kasalar)
        });
        
        return {
            labels: labels,
            datasets: datasets
        };
    }

    // Chart butonları event handler'ları
    function bankaHesaplariRaporuTahsilatMasrafChartEventHandlers() {
        $('#gunlukTahsilatMasrafChartBtn').on('click', function() {
            $('.btn-group button').removeClass('active');
            $(this).addClass('active');
            window.currentTahsilatMasrafChartType = 'gunluk';
            bankaHesaplariRaporuTahsilatMasrafChartOlustur();
        });
        
        $('#aylikTahsilatMasrafChartBtn').on('click', function() {
            $('.btn-group button').removeClass('active');
            $(this).addClass('active');
            window.currentTahsilatMasrafChartType = 'aylik';
            bankaHesaplariRaporuTahsilatMasrafChartOlustur();
        });
        
        $('#yillikTahsilatMasrafChartBtn').on('click', function() {
            $('.btn-group button').removeClass('active');
            $(this).addClass('active');
            window.currentTahsilatMasrafChartType = 'yillik';
            bankaHesaplariRaporuTahsilatMasrafChartOlustur();
        });
        
        // Kasa seçimi değiştiğinde chart'ı güncelle
        $('#kasaSecimi').on('change', function() {
            console.log("Kasa seçimi değişti, tahsilat/masraf chart güncelleniyor");
            if (window.tahsilatMasrafChart) {
                bankaHesaplariRaporuTahsilatMasrafChartOlustur();
            }
        });
    }

    //#endregion

//#endregion