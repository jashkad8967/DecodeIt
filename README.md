# 🧠 DecodeIt7 — Bottle Swap

A daily logic puzzle inspired by NYT-style games.  
Rearrange bottles to discover the correct order using logical feedback — no hints, no clues, just deduction.

🌐 **Live Site:** https://decodeit7.cc

---

## 🎮 The Game

**Bottle Swap** challenges players to reorder 5 bottles into the correct sequence.

- You have **5 guesses**
- Each guess tells you **how many bottles are in the correct position**
- No adjacency or color hints — only positional correctness
- One puzzle per day, same puzzle for everyone

Think **Wordle-style feedback**, but with pure positional logic.

---

## ✨ Features

- 🧩 Daily deterministic puzzle
- 🖱️ Drag-and-drop bottle swapping
- 📊 Guess history and feedback per attempt
- 🔐 Firebase Authentication (Email/Password)
- 📈 User statistics:
  - Total games
  - Wins / losses
  - Win percentage
  - Current & longest streak
- ☁️ Firestore persistence
- 🌌 Starry animated background
- 🌙 Dark mode & accessibility options
- 🔊 Optional ambient sound
- 📱 Responsive layout

---

## 🛠 Tech Stack

### Frontend
- React
- CSS (custom layout & animations)
- HTML5 Drag & Drop API

### Backend / Services
- Firebase Authentication
- Firebase Firestore
- Firebase Analytics

### Hosting
- GitHub Pages
- Custom domain: `decodeit7.cc`

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── AuthModal.js
│   ├── StatsModal.js
├── data/
│   └── bottlePuzzle.js
├── firebase/
│   └── config.js
├── App.js
├── App.css
└── index.js
````

---

## 🚀 Local Development

This repository is provided **for viewing and evaluation purposes only**.

If you are an authorized collaborator:

```bash
npm install
npm start
```

---

## 🔐 Firebase

The production Firebase project is private.
Local builds require valid Firebase credentials and authorized domains.

---

## 📊 Analytics

Google Analytics is integrated via Firebase Analytics to measure:

* Daily engagement
* Completion rates
* Retention trends

---

## 👤 Author

**Jash Kadakia**
Computer Science & Data Science @ UW–Madison

* GitHub: [https://github.com/jashkad8967](https://github.com/jashkad8967)
* LinkedIn: [https://www.linkedin.com/in/jash-kadakia-jk89672705](https://www.linkedin.com/in/jash-kadakia-jk89672705)
* Website: [https://jashkadakia.me](https://jashkadakia.me)

---

## 🔒 License & Usage

**© 2025 Jash Kadakia. All rights reserved.**

This project is **proprietary software**.

* ❌ No copying
* ❌ No modification
* ❌ No redistribution
* ❌ No commercial or non-commercial reuse

The source code is shared **solely for demonstration and portfolio review purposes**.
