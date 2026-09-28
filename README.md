# 🫧 FocusBubble

<p align="center">
  <strong>A calmer way to focus.</strong>
</p>

<p align="center">
  FocusBubble is a modern focus and productivity app designed to help you turn your attention into meaningful work.
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#technology">Technology</a> ·
  <a href="#roadmap">Roadmap</a>
</p>

---

## 🌱 About FocusBubble

In a world full of notifications, distractions, and endless tabs, staying focused can be difficult.

**FocusBubble is built to make focused work simple.**

Create a session, choose how you want to focus, and give your attention to one thing at a time.

Whether you're **studying, coding, reading, writing, working, or learning**, FocusBubble gives you a structured space to focus and build better productivity habits.

> **One session. One intention. Full focus.**

---

## ✨ Features

### 🎯 Focus Sessions

Start dedicated sessions designed around focused work.

FocusBubble provides structure around your time so you can spend less energy deciding *when* to work and more energy actually doing it.

### 🧩 Advanced Session Types

Different tasks require different approaches.

FocusBubble includes support for **advanced session types**, giving you more flexibility in how you structure your focus time.

### 📊 Progress & History

Your focus journey is more than a timer.

Track your sessions and build an understanding of your productivity over time.

Use your history to recognize patterns, stay consistent, and keep moving forward.

### 🔐 Authentication

FocusBubble includes user authentication and cloud-service integrations for personalized experiences and data.

The project supports integrations with:

* Firebase Authentication
* Google Authentication
* Firestore
* Supabase

### 📱 Android

FocusBubble is built with **Capacitor**, allowing the application to run as a native Android app while sharing its core React and TypeScript code.

### 🎨 Clean, Distraction-Free Experience

The interface is designed around the core purpose of the application:

**helping you focus.**

The codebase uses reusable React components and a modular architecture so the application can continue to grow without becoming difficult to maintain.

---

# 🧠 The FocusBubble Philosophy

Productivity doesn't have to mean doing more.

Sometimes it means doing **one thing well**.

FocusBubble is built around a simple cycle:

```text
              ┌──────────────┐
              │    INTEND    │
              │ Choose a goal│
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │     FOCUS    │
              │  Do the work │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │   COMPLETE   │
              │ Finish your  │
              │    session   │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │    REFLECT   │
              │ Track your   │
              │   progress   │
              └──────┬───────┘
                     │
                     └──────────► Repeat
```

Small focused sessions can become consistent habits.

---

# 🛠️ Technology

FocusBubble is built with a modern TypeScript-based stack.

| Technology     | Purpose                         |
| -------------- | ------------------------------- |
| **React**      | User interface                  |
| **TypeScript** | Application development         |
| **Vite**       | Development & build tooling     |
| **Capacitor**  | Native mobile integration       |
| **Android**    | Mobile application              |
| **Supabase**   | Backend & data services         |
| **Firebase**   | Authentication & cloud services |
| **Firestore**  | Cloud data                      |
| **PostgreSQL** | Database                        |
| **CSS**        | Application styling             |

---

# 🏗️ Architecture

FocusBubble follows a modular application structure:

```text
Focusbubble/
│
├── android/              # Native Android application
│
├── components/           # Reusable UI components
├── contexts/             # Shared application state
├── services/             # Application & backend services
├── plugins/              # Application plugins
│
├── src/
│   └── plugins/          # Additional integrations
│
├── App.tsx               # Main application
├── index.tsx             # Application entry point
├── types.ts              # Shared TypeScript types
│
├── index.css             # Global styles
├── index.html            # HTML entry point
│
├── capacitor.config.ts   # Capacitor configuration
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies & scripts
│
├── DATABASE_SCHEMA.sql   # Database schema
│
├── FIREBASE_SETUP.md
├── FIRESTORE_SETUP.md
├── SUPABASE_SETUP.md
└── ENABLE_GOOGLE_AUTH.md
```

---

# 🚀 Getting Started

## Prerequisites

Before you begin, make sure you have:

* [Node.js](https://nodejs.org/)
* npm
* Android Studio — if developing for Android
* A configured backend environment

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/muridabuhamed/Focusbubble.git
cd Focusbubble
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your environment

Configure the services required by your deployment.

See the included setup guides:

```text
FIREBASE_SETUP.md
FIRESTORE_SETUP.md
SUPABASE_SETUP.md
ENABLE_GOOGLE_AUTH.md
```

### 4. Start the development server

```bash
npm run dev
```

The development server will provide a local URL where you can open FocusBubble.

---

# 📱 Running on Android

FocusBubble uses Capacitor for Android.

After installing dependencies:

```bash
npx cap sync android
```

Open the Android project:

```bash
npx cap open android
```

You can then run FocusBubble using an Android emulator or a connected Android device through Android Studio.

---

# 🗄️ Database

The project includes its database structure in:

```text
DATABASE_SCHEMA.sql
```

Backend configuration and setup instructions are available in the repository documentation.

> **Important:** Never commit passwords, API keys, service-account credentials, or other secrets to GitHub.

---

# 🗺️ Roadmap

FocusBubble is actively evolving.

Planned and potential improvements include:

* [ ] More advanced focus session configurations
* [ ] Custom session presets
* [ ] Focus streaks
* [ ] Productivity analytics
* [ ] Detailed session statistics
* [ ] Session goals
* [ ] Notifications and reminders
* [ ] Improved offline support
* [ ] Cross-device synchronization
* [ ] Additional native integrations
* [ ] iOS support

The roadmap may evolve as the application develops and user feedback is collected.

---

# 🤝 Contributing

Contributions, ideas, and feedback are welcome.

### Fork the repository

Create your own fork of FocusBubble.

### Create a branch

```bash
git checkout -b feature/my-feature
```

### Make your changes

Implement your feature or fix and test it locally.

### Commit your changes

```bash
git commit -m "Add my feature"
```

### Push your branch

```bash
git push origin feature/my-feature
```

Then open a Pull Request.

---

# 🔒 Security

Please do not commit sensitive information to the repository.

This includes:

* API keys
* Passwords
* Database credentials
* Firebase service-account files
* Authentication secrets
* Private environment variables

If you discover a security vulnerability, please report it privately instead of publicly exposing the issue or sensitive information.

---

# 📄 License

A license has not yet been specified for this repository.

If FocusBubble is released as an open-source project, add a `LICENSE` file and update this section accordingly.

---

# 👨‍💻 Author

**Murid Abuhamed**

GitHub: [@muridabuhamed](https://github.com/muridabuhamed)

---

<p align="center">
  <br />
  🫧
  <br />
  <br />
  <strong>Focus on what matters.</strong>
  <br />
  <sub>Built with React, TypeScript & Capacitor.</sub>
</p>
