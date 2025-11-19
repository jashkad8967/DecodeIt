# DecodeIt - Daily Good Deed Puzzle Game

A web application that generates personalized daily good deeds based on your zodiac sign, encrypted with a Caesar cipher for you to decode. Complete challenges, earn points, maintain streaks, and track your progress in your personal journal.

## 🌟 Features

- **AI-Powered Good Deeds**: Get personalized daily challenges based on your zodiac sign using free AI
- **Caesar Cipher Puzzles**: Decode encrypted sentences to reveal your daily good deed
- **User Accounts**: Sign up and sign in to save your progress
- **Points & Streaks**: Earn points for solving puzzles and uploading photos, with streak bonuses
- **Personal Journal**: Track your past good deeds with photos
- **Leaderboard**: Compete with other users on the global leaderboard
- **Dark/Light Theme**: Toggle between dark and light themes
- **Photo Uploads**: Upload photos of completed good deeds to earn bonus points
- **Responsive Design**: Works seamlessly on desktop and mobile devices

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

2. **Install frontend dependencies:**
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
│   ├── components/     # React components
│   │   ├── BirthdayInput.js
│   │   ├── CardFrame.js
│   │   └── ImageUpload.js
│   ├── constants/      # Configuration constants
│   │   ├── config.js
│   │   └── zodiac.js
│   ├── hooks/          # Custom React hooks
│   │   └── useAdOffsets.js
│   ├── styles/         # Style utilities
│   │   └── theme.js
│   ├── utils/          # Utility functions
│   │   ├── ai.js              # AI integration
│   │   ├── authHelpers.js     # Authentication
│   │   ├── cipher.js          # Caesar cipher
│   │   ├── dateHelpers.js     # Date utilities
│   │   ├── dateOptions.js     # Date dropdown options
│   │   ├── deedHelpers.js     # Deed calculations
│   │   ├── imageHelpers.js    # Image processing
│   │   ├── storage.js          # LocalStorage management
│   │   └── themeHelpers.js     # Theme utilities
│   ├── App.js          # Main application component
│   ├── App.css         # Application styles
│   └── index.js        # Entry point
└── package.json        # Frontend dependencies
```

## 🎮 How to Play

1. **Sign In or Register**
   - Create an account to save your progress
   - Sign in with your email or username

2. **Enter Your Birthday**
   - Select your birth month, day, and year
   - The app will determine your zodiac sign

3. **Decode Your Good Deed**
   - An AI-generated good deed is encrypted with a Caesar cipher
   - Use the hint to decode the encrypted sentence
   - Submit your answer to earn points

4. **Upload a Photo (Optional)**
   - Upload a photo of your completed good deed
   - Earn bonus points for photo uploads
   - Photos are saved in your journal

5. **Track Your Progress**
   - View your stats, streak, and points in the Journal
   - See your past good deeds with photos
   - Check your ranking on the leaderboard

## 🎯 Points System

- **Solving Puzzle**: 5 points + streak bonus
- **Uploading Photo**: 5 points + streak bonus
- **Streak Bonus**: Increases with consecutive days

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **React Hooks** - State management
- **LocalStorage** - Data persistence
- **Pollinations API** - Free AI for zodiac and good deed generation

## 🎨 Features in Detail

### Authentication
- Email/password registration
- Username or email sign-in
- Account deletion

### Theme System
- Dark mode (default)
- Light mode
- Theme persistence per account
- Theme-aware components

### Data Management
- Account-based data storage
- Leaderboard aggregation
- Points and streak tracking

## 📦 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## 🚢 Deployment

The app can be deployed to:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages** (already configured)

Simply connect your repository and deploy. No additional configuration needed.

## 📝 Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run deploy` - Deploy to GitHub Pages

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🐛 Troubleshooting

### Common Issues

**Points not saving:**
- Check browser console for errors
- Ensure LocalStorage is enabled in your browser

**AI not generating good deeds:**
- Check internet connection
- Verify Pollinations API is accessible

## 📞 Support

For issues or questions, email jkadakiabusiness@gmail.com or open an issue on GitHub.

## 🌐 Live Demo

Visit the live site at: [https://decodeit7.cc](https://decodeit7.cc)

---

**Note**: This app uses free AI services and may have rate limits. All data is stored locally in your browser unless you create an account.
