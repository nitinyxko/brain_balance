# BrainBalance

A digital wellness and rehabilitation app designed to help users manage and improve their digital habits through mindful exercises, community support, and personal tracking.

## Features

- 📱 Onboarding with identity verification
- 🧠 Brain training exercises
- 👥 Community support system
- 🌟 Curated spaces for positive content
- 📝 Personal journal
- 📊 Progress tracking
- 🎯 Daily challenges
- 🤝 Buddy system for accountability

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Expo Go app on your mobile device

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd brain-balance
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## Development

### Project Structure

```
brain-balance/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── navigation/     # Navigation configuration
│   ├── context/        # React Context providers
│   ├── hooks/          # Custom React hooks
│   └── theme/          # Theme configuration
├── assets/            # Images, fonts, etc.
└── App.tsx           # Root component
```

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start the app on Android emulator/device
- `npm run ios` - Start the app on iOS simulator/device
- `npm run web` - Start the app in web browser
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run build:android` - Build Android app
- `npm run build:ios` - Build iOS app

## Features Implementation

### Brain Training Games

- N-Back: Working memory training
- Pattern Path: Sequence recall challenge
- Stroop Test: Color-word challenge
- Memory Match: Visual memory exercise

### Community Features

- Real-time chat
- Voice/video rooms
- Moderated discussions
- Support groups

### Journal & Progress Tracking

- Daily mood tracking
- Progress visualization
- Goal setting
- Achievement system

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details