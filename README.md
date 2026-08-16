

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).
  
## Get started 

1. Install dependencies
   ```bash
   npm install
   ```


2. Start the app 
   ```bash
   npx expo start
   ```

  
  

---

  
# My App — React Native (Expo Router)

  

اپلیکیشن موبایل ساخته‌شده با **Expo** و **Expo Router**، برای یادگیری React Native و به‌عنوان نقطه‌ی شروع پروژه‌ی دانشگاهی.

  

## تکنولوژی‌ها

  

| بخش | ابزار |

|---|---|

| Framework | React Native (via Expo) |

| Router | Expo Router (فایل‌محور، مثل Next.js) |

| زبان | TypeScript (فایل‌های `.ts`/`.tsx`) |

| بسته‌بندی/باندلر | Metro |

| تست روی گوشی | Expo Go (SDK 54) |

  

## پیش‌نیازها
- Node.js 
- npm

- گوشی موبایل با اپ **Expo Go** نصب‌شده (از Google Play یا App Store)
  - یا شبیه‌ساز Android Studio / Xcode Simulator (اختیاری)


## نصب


```bash

git clone <repo-url>

cd my-app

npm install

```

  

## اجرا (Development)

  

```bash

npx expo start

```

  

بعد از اجرا:

- یه **QR کد** تو ترمینال یا مرورگر نمایش داده می‌شه

- با اپ **Expo Go** روی گوشی، QR کد رو اسکن کن

- یا کلیدهای زیر رو تو ترمینال بزن:

  - `w` → باز کردن نسخه‌ی وب

  - `a` → باز کردن روی شبیه‌ساز اندروید (اگه نصب داری)

  - `i` → باز کردن روی شبیه‌ساز iOS (فقط macOS)

  - `r` → ری‌لود اپ

  - `m` → باز کردن منوی dev

  

اگه بعد از تغییر کانفیگ (metro/babel) رفتار عجیب دیدی، کش رو پاک کن و دوباره اجرا کن:

```bash

npx expo start -c

```

  

## ساختار پروژه

  

```

my-app/

├── app/                      # صفحات اپ (Expo Router — فایل‌محور)

│   ├── (tabs)/                # گروه route برای تب‌های پایین صفحه

│   ├── _layout.tsx            # لایه‌ی مشترک کل اپ (Navigator اصلی)

│   └── modal.tsx               # نمونه صفحه‌ی مودال

│

├── components/                # کامپوننت‌های قابل استفاده‌ی مجدد

│   ├── ui/

│   ├── themed-text.tsx        # کامپوننت متن با پشتیبانی از dark/light mode

│   ├── themed-view.tsx

│   ├── parallax-scroll-view.tsx

│   ├── hello-wave.tsx

│   └── external-link.tsx

│

├── constants/

│   └── theme.ts               # تعریف رنگ‌ها و تم روشن/تاریک

│

├── hooks/

│   ├── use-color-scheme.ts    # تشخیص حالت روشن/تاریک سیستم

│   ├── use-color-scheme.web.ts

│   └── use-theme-color.ts

│

├── assets/

│   └── images/                 # آیکون‌ها و تصاویر استاتیک

│

├── scripts/

│   └── reset-project.js        # اسکریپت پاک‌سازی boilerplate اولیه

│

├── app.json                    # کانفیگ اصلی Expo (نام اپ، آیکون، پلاگین‌ها)

├── tsconfig.json                # تنظیمات TypeScript

├── eslint.config.js              # قوانین Lint

└── package.json

```

  

### نکات مهم درباره‌ی ساختار

  

- **`app/` = Entry Point و مسیرها.** هر فایل داخل این پوشه خودکار به یه route تبدیل می‌شه (شبیه `pages/` تو Next.js). نیازی به تعریف دستی navigator نیست.

- **`(tabs)`** یه *route group* هست — پرانتز یعنی این پوشه تو مسیر URL ظاهر نمی‌شه، فقط برای گروه‌بندی و تعریف یه navigator مشترک (اینجا Tab Navigator) استفاده می‌شه.

- **`_layout.tsx`** لایه‌ی مشترکیه که دور همه‌ی صفحات می‌پیچه (مثل تعریف Stack/Provider اصلی).

- تفاوتی با پروژه‌های ساده‌ی React وب: به‌جای HTML، از کامپوننت‌های native (`View`, `Text`, ...) استفاده می‌شه که مستقیم به UI بومی iOS/Android رندر می‌شن.

  

## دستورات مفید

  

| دستور | کاربرد |

|---|---|

| `npx expo start` | اجرای سرور توسعه |

| `npx expo start -c` | اجرا با پاک‌کردن کش |

| `npm run lint` | بررسی Lint (اگه تعریف شده باشه) |

| `npx expo install <package>` | نصب پکیج با نسخه‌ی سازگار با SDK فعلی |

  

## ساخت نسخه‌ی نهایی (Build)

  

برای گرفتن فایل نصبی (APK/IPA) واقعی (نه فقط تست با Expo Go)، از **EAS Build** استفاده می‌شه:

  

```bash

npm install -g eas-cli

eas login

eas build:configure

eas build --platform android

```

  

> این مرحله نیاز به حساب Expo (رایگان) داره و برای مراحل بعدی پروژه لازم می‌شه، نه الان.

  

## وضعیت پروژه

  

🚧 در حال توسعه — پروژه‌ی یادگیری React Native.