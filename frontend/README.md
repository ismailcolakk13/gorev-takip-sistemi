# Görev Takip Sistemi - Frontend

Modern, sürükle-bırak (drag-and-drop) destekli Kanban panosu ve görev yönetim arayüzü.

## 🛠️ Teknolojiler

- **React 19** & **TypeScript**
- **Vite** (Ultra hızlı derleme ve HMR)
- **Tailwind CSS v4** (Modern ve esnek stil sistemi)
- **Lucide Icons** (Arayüz ikonları)

## 📁 Dizin Yapısı

```text
frontend/
├── src/
│   ├── api/              # Spring Boot REST API istemcileri (task, project, user, comment)
│   ├── components/       # UI bileşenleri (Navbar, KanbanBoard, TaskCard, Modallar)
│   ├── types/            # Backend DTO'larına karşılık gelen TypeScript tipleri
│   ├── App.tsx           # Ana dashboard ve filtreleme paneli
│   └── index.css         # Tailwind yapılandırması
├── vite.config.ts        # Vite ve Spring Boot API proxy (/api -> :8080)
└── package.json
```

## 🚀 Çalıştırma

1. **Bağımlılıkları yükleyin (İlk seferde):**
   ```bash
   cd frontend
   npm install
   ```

2. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```
   Arayüz `http://localhost:5173` adresinde açılacaktır.

3. **Backend ile İletişim:**
   - Vite proxy yapılandırması sayesinde frontend üzerinden `/api/...` adresine yapılan istekler otomatik olarak `http://localhost:8080` backend sunucusuna iletilir.
   - Ayrıca Spring Boot tarafında da `CorsConfig` tanımlanmıştır.

## ✨ Özellikler

- **Kanban Panosu:** `TODO`, `IN_PROGRESS`, `COMPLETED` sütunları arasında sürükle-bırak (Drag & Drop) veya hızlı geçiş butonları.
- **Proje Yönetimi:** Üst bardan anlık proje değiştirme ve yeni proje oluşturma.
- **Görev Yönetimi:** Detaylı görev oluşturma (Başlık, Açıklama, Öncelik, Atanan Kişi).
- **Yorum Sistemi:** Göreve tıklandığında açılan modal ile geçmiş yorumları listeleme ve anlık yorum ekleme.
- **Filtreleme & Arama:** Görev başlığına/açıklamasına ve atanan kullanıcıya göre canlı filtreleme.
