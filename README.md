# Blog Battle - Yazıların Yarıştığı Oylama Platformu

Proje, kullanıcıların blog yazıları oluşturabildiği, bu yazıların rastgele veya kategoriye göre eşleşerek yarıştığı ve kullanıcı oylarıyla kazananların belirlendiği bir platformdur.

**GitHub Reposu:** https://github.com/elffba/blog-battle-project

**Anasayfa Ekran Görüntüsü:**
![Anasayfa Ekran Görüntüsü](images/anasayfa.png)

**Oylama Ekran Görüntüsü:**
![Oylama Ekran Görüntüsü](images/battle.png)

 ## Projenin Amacı ve Temel Özellikler

* Kullanıcıların kayıt olup giriş yapabilmesi (JWT ile).
* Giriş yapmış kullanıcıların blog yazıları (başlık, içerik, kategori, görsel) ekleyebilmesi, güncelleyebilmesi ve silebilmesi.
* Ziyaretçilerin yazıları okuyabilmesi.
* Yazıların rastgele (veya kategoriye göre - *API desteği eklendi, UI yok*) eşleşerek "Battle" sayfasına düşmesi.
* Giriş yapmış kullanıcıların aktif eşleşmelerdeki iki yazı arasında oy kullanabilmesi (her eşleşmeye 1 oy hakkı).
* Oylama sonrası sonuçların yüzde olarak gösterilmesi.
* Biten eşleşmelerde kazanan yazının belirlenmesi ve işaretlenmesi (kazanma sayısı ve rozet ile).
* Basitleştirilmiş turnuva mantığı: Kazanan yazıların kazanma sayısı (`wins`) ve tur (`currentRound`) bilgisi güncellenir. Yeni eşleşmelerde daha düşük turdaki veya kazanma sayısındaki postlar önceliklendirilir (tam otomatik bracket ilerlemesi yerine).
* Temel liderlik tablosu görünümü (kazanma sayısına göre sıralama).
* Arayüzden yeni eşleşme başlatma butonu (test/demo için).
* **Responsive Tasarım:** Uygulama farklı ekran boyutlarına uyumlu bir responsive tasarıma sahiptir.

## Kullanılan Teknolojiler

**Backend:**

* Node.js
* Express.js
* MongoDB (Veritabanı)
* Mongoose (ODM)
* JSON Web Token (JWT) - Kimlik doğrulama için
* Bcryptjs - Şifre hash'leme için
* Multer - Dosya (görsel) yükleme için
* Cors - Cross-Origin Resource Sharing için
* Dotenv - Ortam değişkenleri için

**Frontend:**

* React (Vite ile)
* React Router DOM v6 - Sayfa yönlendirme için
* Redux Toolkit - Global state yönetimi için
* Axios - API istekleri için
* Tailwind CSS v3 - Stil altyapısı için
* DaisyUI - Tailwind CSS component kütüphanesi (Tema: light)

## Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları takip ediniz:

### Ön Gereksinimler

* Node.js (v18 veya üzeri önerilir)
* npm (Node.js ile birlikte gelir)
* MongoDB (Lokal kurulum veya MongoDB Atlas hesabı)
* Git

### Adımlar

1.  **Projeyi Klonlama:**
    ```bash
    git clone [GitHub Repo Adresin]
    cd blog-battle-project
    ```

2.  **Backend Kurulumu:**
    * Backend klasörüne gidin:
      ```bash
      cd backend
      ```
    * Gerekli paketleri kurun:
      ```bash
      npm install
      ```
    * `.env` Dosyasını Oluşturun: `backend` klasörünün ana dizininde `.env` adında bir dosya oluşturun ve aşağıdaki değişkenleri kendi bilgilerinizle doldurun:
      ```dotenv
      NODE_ENV=development
      PORT=5001 # Backend sunucusunun çalışacağı port (frontend'den farklı olmalı)
      MONGO_URI=mongodb+srv://KULLANICI_ADIN:<SIFREN>@CLUSTER_ADIN.mongodb.net/blogBattleDb?retryWrites=true&w=majority # MongoDB bağlantı adresiniz
      JWT_SECRET=cokgizlibirjsonwebtokenanahtaribunuuret # Güvenli bir JWT secret key üretin
      ```
      * **Not:** `MONGO_URI` için kendi MongoDB Atlas bağlantı string'inizi veya lokal MongoDB adresinizi kullanın. `blogBattleDb` yerine farklı bir veritabanı adı kullanabilirsiniz.
    * Backend sunucusunu geliştirme modunda başlatın:
      ```bash
      npm run dev
      ```
      Sunucu varsayılan olarak `http://localhost:5001` adresinde çalışacaktır.

3.  **Frontend Kurulumu:**
    * **Yeni bir terminal açın** (backend sunucusu çalışmaya devam etmeli).
    * Projenin ana dizininden `frontend` klasörüne gidin:
      ```bash
      cd ../frontend
      # Veya proje ana dizinindeyken: cd frontend
      ```
    * Gerekli paketleri kurun:
      ```bash
      npm install
      ```
    * Frontend uygulamasını geliştirme modunda başlatın:
      ```bash
      npm run dev
      ```
      Uygulama genellikle `http://localhost:5173` adresinde açılacaktır (terminaldeki adresi kontrol edin).

4.  **Uygulamayı Kullanma:**
    * Tarayıcınızda frontend adresini (`http://localhost:5173`) açın.
    * Yeni bir hesapla kayıt olun veya mevcut bir hesapla giriş yapın.
    * Yazı oluşturun, oylama sayfasına gidin, oy verin!
    * Yeni eşleşmeler başlatmak için anasayfadaki "Yeni Kapışma Başlat!" butonunu kullanabilirsiniz.
    * 
## API Endpointleri (Özet)

Bu proje aşağıdaki temel API endpointlerini sunmaktadır:

### Auth (Kimlik Doğrulama)

* `POST /api/auth/register`: Yeni bir kullanıcı kaydı gerçekleştirir.
* `POST /api/auth/login`: Kullanıcının giriş yapmasını sağlar ve bir JWT (JSON Web Token) döndürür.

### Posts (Yazılar)

* `GET /api/posts`: Sistemdeki tüm blog yazılarını listeler.
* `POST /api/posts`: Yeni bir blog yazısı oluşturur. **(Token Gerekli, FormData)**
* `GET /api/posts/:id`: Belirli bir ID'ye sahip blog yazısının detaylarını getirir.
* `PUT /api/posts/:id`: Belirli bir ID'ye sahip blog yazısını günceller. **(Token Gerekli, Yazar Kontrolü, FormData)**
* `DELETE /api/posts/:id`: Belirli bir ID'ye sahip blog yazısını siler. **(Token Gerekli, Yazar Kontrolü)**

### Matches (Eşleşmeler)

* `POST /api/matches/start`: Yeni bir aktif eşleşme başlatır. **(İsteğe bağlı olarak body'de `{ "category": "..." }` ile kategori belirtilebilir)**
* `GET /api/matches/active`: Oylama için rastgele bir aktif eşleşmeyi getirir.
* `POST /api/matches/:matchId/vote`: Belirli bir eşleşmeye oy verir. **(Token Gerekli, Body: `{ "votedForPostId": "..." }`)**
* `POST /api/matches/:matchId/finish`: Aktif bir eşleşmeyi sonlandırır ve kazananı belirler. **(Token Gerekli)**

**Not:** Bu API endpointleri Insomnia kullanılarak test edilmiştir.

## Bilinen Kısıtlamalar ve Olası İyileştirmeler

* **Turnuva Mantığı:** Sistem şu anda tam bir bracket (turnuva ağacı) yapısını otomatik olarak ilerletmek yerine, kazanma sayısına göre basit bir ilerleme mantığı ve rastgele eşleşme (uygun postlar arasında) kullanmaktadır. Kazananlar bir sonraki tura geçer (`currentRound` güncellenir) ve elenenler işaretlenir, ancak eşleşmeler her zaman kesin olarak aynı turdaki kazananlar arasında olmayabilir (basitleştirilmiş `startNewMatch` mantığı).
* **Eşleşme Başlatma:** Yeni eşleşmeler şu anda sadece anasayfadaki buton aracılığıyla manuel olarak tetiklenmektedir. Otomatik eşleşme sistemi eklenmemiştir.
* **Bildirimler:** Yazısı oylamaya çıkan yazarlara bildirim gönderme özelliği eklenmemiştir.
* **Gerçek Zamanlı Güncellemeler:** Oylama sonuçları oy verdikten sonra veya sayfa yenilendiğinde güncellenir, WebSockets ile anlık güncelleme yoktur.
* **UI/UX:** Arayüz işlevseldir ancak animasyonlar (oylama geçişi), detaylı responsive testler ve daha gelişmiş kullanıcı geri bildirimleri (örn: toast notification) eklenebilir.
* **Kategoriye Göre Eşleşme:** Backend kategoriye göre eşleşmeyi desteklese de, frontend'de kategori seçerek eşleşme başlatma arayüzü bulunmamaktadır.
