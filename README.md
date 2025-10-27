# VeriHive 🌱

**Making social media human again**

VeriHive is a revolutionary social app designed to combat "brain rot" by focusing on personal growth, genuine connection, and mental well-being.

---

## 🌟 Features

- **Real Identity Verification**: Face scan authentication for genuine connections
- **AI-Powered Safety**: Intelligent content moderation and behavior monitoring
- **Interest-Based Spaces**: Curated communities for meaningful discussions
- **Private Journaling**: Personal reflection space for self-growth
- **Goal Tracking**: Track and achieve your personal development goals
- **Support Bot**: AI-powered emotional support when you need it
- **Minimalist UI**: Clean, uncluttered interface with earth tone palette
- **Supportive Language**: Encouraging and empathetic user experience

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Database**: MongoDB
- **Real-time**: Socket.io
- **AI Services**: OpenAI API, Face++ API

### Frontend
- **Framework**: React Native
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: React Context/Redux
- **Push Notifications**: Firebase Cloud Messaging

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development, Mac only)
- [MongoDB](https://www.mongodb.com/try/download/community) (local) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)

### API Keys Required

You'll need to create accounts and get API keys for:
- [OpenAI API](https://platform.openai.com/api-keys)
- [Face++ API](https://www.faceplusplus.com/)
- [Firebase](https://console.firebase.google.com/)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/nitinyxko/verihive-app.git
cd verihive-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

#### Configure `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/verihive
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/verihive

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key-here

# Face++ API
FACEPP_API_KEY=your-facepp-api-key
FACEPP_API_SECRET=your-facepp-api-secret

# Firebase
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# Socket.io
SOCKET_PORT=5001
```

#### Start the backend server:

```bash
npm run dev
```

The backend should now be running at `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Fix Expo compatibility issues
npx expo install --fix

# Start Metro bundler
npm start
```

### 4. Run on Device/Emulator

#### For Android:

```bash
# Make sure Android emulator is running or device is connected
npm run android
```

#### For iOS (Mac only):

```bash
# Install iOS dependencies
cd ios
pod install
cd ..

# Run on iOS
npm run ios
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Expo Version Compatibility Issues

```bash
cd frontend
npx expo install --fix
rm -rf node_modules package-lock.json
npm install
npm start -- --clear
```

#### 2. Metro Bundler Cache Issues

```bash
npm start -- --clear
# Or
npx expo start --clear
```

#### 3. MongoDB Connection Failed

- Check if MongoDB is running: `mongod --version`
- Verify MONGODB_URI in `.env` file
- For MongoDB Atlas, check network access and whitelist your IP

#### 4. API Key Errors

- Verify all API keys are correctly set in `.env`
- Check API key permissions and quotas
- Ensure no extra spaces in the `.env` file

#### 5. Android Build Issues

```bash
cd android
./gradlew clean
cd ..
npm run android
```

#### 6. iOS Build Issues (Mac only)

```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

---

## 📁 Project Structure

```
verihive-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── navigation/
│   │   ├── services/
│   │   ├── utils/
│   │   └── assets/
│   ├── App.tsx
│   └── package.json
└── README.md
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## 🚢 Deployment

### Backend Deployment (Example: Heroku)

```bash
cd backend
heroku create verihive-backend
git push heroku main
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set OPENAI_API_KEY=your-openai-key
# Set other environment variables
```

### Frontend Deployment

#### Build for Android:

```bash
cd frontend
eas build --platform android
```

#### Build for iOS:

```bash
cd frontend
eas build --platform ios
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Nitin** - *Initial work* - [@nitinyxko](https://github.com/nitinyxko)

---

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- Face++ for face recognition
- Firebase for push notifications
- MongoDB for database solutions
- React Native community

---

## 📞 Support

For support and questions:
- Create an [issue](https://github.com/nitinyxko/verihive-app/issues)
- Email: support@verihive.app (if available)

---

## 🗺️ Roadmap

- [ ] iOS app release
- [ ] Web version
- [ ] Dark mode enhancement
- [ ] Multi-language support
- [ ] Video journaling
- [ ] Group challenges
- [ ] Wellness metrics dashboard

---

**VeriHive - Making social media human again 🌱**
