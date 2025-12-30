# Almost 🎯

A challenging number guessing game where being close isn't good enough — you need to get it **exactly right**!

## 🎮 How to Play

1. **Read the question** - You'll see a trivia question with a numeric answer
2. **Make your guess** - Enter a number (you have 3 attempts)
3. **Get feedback**:
   - 🎯 **Perfect!** - You got it exactly right (you win!)
   - 😅 **Too close** - You were in the "close" range but not exact (you lose!)
   - **Too far** - Your guess was outside the range
4. **Win or lose** - Get it exactly right to win, or use up all 3 attempts to see the answer

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd decode-puzzle
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
decode-puzzle/
├── public/              # Static files
│   └── index.html      # Main HTML file
├── src/
│   ├── data/           # Game data
│   │   └── questions.js # Question definitions
│   ├── App.js          # Main application component
│   ├── App.css         # Application styles
│   └── index.js        # Entry point
└── package.json        # Dependencies
```

## 🎯 Game Rules

- You have **3 attempts** to guess the correct answer
- Getting the answer **exactly right** = Win! 🎉
- Being in the "close" range but not exact = Lose! 😅
- Being too far away = Try again

## 🛠️ Tech Stack

- **React** - UI framework
- **CSS3** - Styling with modern design
- **LocalStorage** (optional) - For future features

## 📦 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## 🚢 Deployment

The app can be deployed to:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**

Simply connect your repository and deploy.

## 📝 Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

---

**Almost** - Get it exactly right, or you lose! 🎯
