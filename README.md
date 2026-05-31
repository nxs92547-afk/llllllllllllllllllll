# HTML Oyun Geliştirici Asistanı

Bu proje, kullanıcılara tek bir HTML dosyası içinde çalışan basit oyunlar (HTML, CSS ve JS dahil) geliştirmelerinde yardımcı olan yapay zeka destekli bir web uygulamasıdır. Arka planda Google Gemini API (Gemini 2.0 Flash) kullanılmaktadır.

## Özellikler

- 🤖 **Yapay Zeka Destekli Sohbet:** Oyun fikirlerinizi anlatın, asistan size anında oynanabilir kod yazsın.
- 🎮 **Canlı Önizleme:** Asistanın yazdığı oyun kodu otomatik olarak ayıklanır ve sağ taraftaki iframe ekranında anında çalıştırılır.
- 🌙 **Karanlık Tema:** Göz yormayan, şık ve modern bir karanlık tema (dark mode) tasarımı.
- 🔑 **Güvenli API Anahtarı Yönetimi:** Gemini API anahtarınızı sadece tarayıcınızın yerel depolama alanında (localStorage) saklarsınız.
- 🔄 **Bağlam Korumalı Sohbet:** Önceki mesajlarınız asistanla paylaşılır, böylece yazdığınız oyuna devam edebilir veya güncellemeler isteyebilirsiniz.

## Teknolojiler

- **Arka Yüz (Backend):** Node.js, Express.js
- **Ön Yüz (Frontend):** HTML5, CSS3, Vanilla JavaScript
- **Yapay Zeka API:** Google Generative AI (`@google/generative-ai`)
- **Ek Kütüphaneler:** Markdown formatındaki yanıtları işlemek için `marked.js` ve ikonlar için `FontAwesome`.

## Kurulum ve Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin:

### Ön Koşullar

- Sisteminizde **Node.js**'in yüklü olması gerekmektedir.

### Kurulum Adımları

1. Bu projeyi indirin veya klonlayın.
2. Terminali açın ve projenin ana dizinine gidin.
3. Gerekli paketleri kurmak için şu komutu çalıştırın:
   ```bash
   npm install express cors @google/generative-ai
   ```
4. Sunucuyu başlatmak için:
   ```bash
   node server.js
   ```
5. Tarayıcınızı açın ve `http://localhost:3000` adresine gidin.
6. Karşınıza çıkan ekrana geçerli bir Google Gemini API anahtarı girerek kullanmaya başlayın!

*(Not: Gemini API anahtarınızı [Google AI Studio](https://aistudio.google.com/) üzerinden ücretsiz olarak alabilirsiniz.)*

## Nasıl Kullanılır?

1. Projeyi açtığınızda API anahtarınızı girip kaydedin.
2. Sol taraftaki sohbet bölümüne nasıl bir oyun istediğinizi yazın (Örneğin: "Yön tuşlarıyla hareket eden bir yılan oyunu yaz").
3. Asistan kodu yazdıktan sonra, sağ taraftaki Canlı Önizleme penceresinde oyun otomatik olarak başlayacaktır.
4. Oyunla ilgili bir değişiklik isterseniz (Örn: "Arka planı mavi yap ve yılanı hızlandır"), sohbet kısmından belirtmeniz yeterlidir.