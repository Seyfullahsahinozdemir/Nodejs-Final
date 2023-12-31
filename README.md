# Seyfullah Şahin Özdemir Final Projesi

Bu projede, şu kütüphane ve framework'ler kullanılmıştır:

- **Front-end Framework**: Nextjs
- **Back-end Framework**: Node.js (Express.js)
- **Veritabanı**: MongoDB, mongoose
- **UI Kütüphanesi**: Tailwindcss, flowbite


## Ekran Görüntüleri

### Giriş Ekranı
![Login](images/login.png)

### Giriş Ekranı - Hata Mesajı
![Login - Hata](images/login_error.png)

### Giriş Ekranı - Başarılı Giriş
![Login - Başarılı](images/login_success.png)

### Kayıt Ekranı
![Kayıt](images/register.png)

### Film Listesi
![Film Listesi](images/movie_all.png)

### Film Detayları
![Film Detayları](images/movies_detail.png)

### En Çok Yorum Alan Filmler
![En Çok Yorum Alan Filmler](images/movie_most_commented.png)

### Profil Ekranı
![Profil](images/profile.png)

### Oyuncular
![Yetenekler](images/talents.png)

### Yorumlar - Hata Mesajı
![Yorumlar - Hata](images/comments_error.png)

### Kullanıcı Gösterge Tablosu
![Kullanıcı Gösterge Tablosu](images/dashboard_user.png)

### Film Gösterge Tablosu
![Film Gösterge Tablosu](images/dashboard_movies.png)

## Sonradan eklenen kütüphaneler
- react-icons
- react-redux
- react-toastify
- redux-persist
- tailwindcss
- validator
- cors
- bcrypt


## Proje Tanıtımı
- Proje filmleri inceleyebileceğimiz, filmlere yorum yaparak puan verebileceğimiz bir uygulamadır.

  ### Backend
  - Gateway kullanılarak proje servisler üzerinden yürütülür. Actor, movie, user servislerdir.
  - User 8001, movie 8002, actor 8003, gateway 8080 portunda çalışır.
  
  ### Frontend
  - Uygulamaya giriş yaparken otp kod onaylama işlemi gerekmektedir. Bunun için email adresine gönderilen kod girilir.
  - Giriş yapıldıktan sonra token değeri hem localStorage'de tutulur hem de redux'ta tutulmaktadır.
  - Redux persist kullanmanın amacı rememberMe özelliği seçili olan kullanıcıların logout işlemi yapmadan token değerlerini korumaktır.
  - Uygulamada giriş yapılmadan filmler listelenebilir, oyuncular listelenebilir.
  - Uygulamaya giriş yapmış basic user filmlerin detaylarını listeleyebilir, filmleri favorilere ekleyebilir, filmlere yorum yapabilir (ama her film için sadece bir tane yorum), profil bilgilerini güncelleyebilir.
  - Uygulamaya giriş yapan admin kullanıcısı dashboard sayfasına ulaşabilir.
  - Uygulamada kullanıcılar yetkisi olmayan sayfaya ulaştığı zaman login sayfasına yönlendirilir.
  - Jwt expired olması durumunda cevaptan gelen 401 hata kodu ile kullanıcının hem redux değerleri hem de localStorage bilgileri silinir.

  
