# 🇹🇳 Tunisian Lens — Mobile Application

Museum-grade cultural photography and visual storytelling mobile application for iOS and Android, built with Flutter.

---

## 🏛️ Architectural Overview

The application follows the **Repository & MVVM** pattern:

```text
mobile/
├── lib/
│   ├── data/
│   │   ├── models/           # Domain & data models (PhotoItem, PhotoExif, Artist, TunisianRegion)
│   │   └── repositories/     # Single-source-of-truth repositories (PhotoRepository, ArtistRepository)
│   ├── theme/
│   │   └── app_theme.dart    # Museum-grade tokens (Deep Canvas, Desert Ochre, Sidi Azure, Playfair Display)
│   ├── ui/
│   │   ├── widgets/          # Reusable UI widgets (MasonryPhotoCard, ExifOpticsSheet, BadgePill, RegionFilterChips)
│   │   └── screens/          # Core screens (HomeFeedScreen, PhotoDetailScreen, ExploreScreen, ArtistProfileScreen, ClientVaultScreen)
│   └── main.dart             # App entry point, MultiProvider registration, and system chrome styling
└── test/
    └── photo_repository_test.dart  # Unit tests for data filtering, search, and favorites
```

---

## 🎨 Visual System & Tokens

* **Deep Neutral Canvas**: `#0B0C0E`
* **Surface**: `#15171C`
* **Elevated Surface**: `#1E2127`
* **Border Edge**: `#262930`
* **Desert Ochre**: `#D99B56`
* **Sidi Azure**: `#3884E6`
* **Typography**:
  * Display / Headlines: **Playfair Display** (Serif)
  * Body: **Plus Jakarta Sans**
  * Technical EXIF: **JetBrains Mono**

---

## 🚀 Key Features

1. **Staggered Multi-Column Masonry Feed**:
   * Native aspect ratio containers (`4:5`, `4:3`, `16:9`, `1:1`) to eliminate layout shift (CLS).
   * Cached network imagery with shimmer loading states.
   * Cultural region pills and location geo-tags.

2. **Camera Optics & EXIF Sheet**:
   * Interactive modal showing Camera Body, Lens, Aperture ($f$-stop), Shutter Speed, Focal Length, ISO, and GPS Coordinates.

3. **Regional Exploration & Territories**:
   * Filter and explore all 4 distinct Tunisian biomes:
     * *North* (Bizerte, Tabarka, Cap Bon)
     * *Tunis & Suburbs* (Carthage, Sidi Bou Said, Medina)
     * *Sahel* (Sousse, Monastir, Mahdia, El Jem)
     * *South & Sahara* (Tozeur, Tataouine, Matmata, Douz)

4. **Creative Guild & Photographer Folios**:
   * Profiles with verified credential badges (*Verified*, *Pro*, *Elite*).
   * Primary equipment and optics manifest.
   * Direct booking and folio view.

5. **Client Passcode Vault**:
   * Encrypted private gallery access for commissioned commercial/editorial clients.

---

## 📲 How to Run

### 1. Prerequisites
If Flutter is not yet installed on your machine:
* Download Flutter SDK from [flutter.dev](https://docs.flutter.dev/get-started/install/windows)
* Add `flutter\bin` to your system `PATH`.
* Verify installation:
  ```bash
  flutter doctor
  ```

### 2. Install Dependencies
Navigate into the `mobile` folder:
```bash
cd mobile
flutter pub get
```

### 3. Run Tests
```bash
flutter test
```

### 4. Launch Application
* **On Android Emulator or Physical Device**:
  ```bash
  flutter run
  ```
* **On Chrome (Web preview)**:
  ```bash
  flutter run -d chrome
  ```
