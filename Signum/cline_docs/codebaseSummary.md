# Codebase Summary

## Project Structure

### Root Level
- `App.js` - Main entry point with navigation setup and authentication flow
- `app.json` - Expo configuration with app metadata and permissions

### src/ Directory Structure

#### screens/
Main app screens implementing different features:
- **OnboardingScreen.js** - First-time user experience
- **LoginScreen.js** - Authentication (sign in/sign up)
- **RecordingScreen.js** - Core recording functionality with 5 questions
- **RecordingsListScreen.js** - List view of all recordings
- **PlaybackScreen.js** - Audio playback interface
- **InsightsScreen.js** - Analytics and reflection statistics
- **AccountScreen.js** - User settings and preferences

#### components/
Reusable UI components:
- **RecordingButton.js** - Animated record/stop button
- **QuestionCard.js** - Display for reflection questions
- **StanfordLogo.js** - Stanford branding component
- **BottomTabBar.js** - Custom tab navigation (if needed)

#### services/
Business logic and data handling:
- **audioService.js** - Audio recording/playback management
- **storageService.js** - AsyncStorage wrapper for data persistence
- **authService.js** - Mock authentication service

#### constants/
App configuration:
- **colors.js** - Stanford branding color palette
- **questions.js** - 5 daily reflection questions

#### utils/
Helper functions:
- **permissions.js** - Audio permission handling

## Key Components and Their Interactions

### Navigation Flow
1. App.js checks authentication state
2. Unauthenticated users see Onboarding → Login
3. Authenticated users access Main Tabs (Record, Recordings, Insights, Account)

### Data Flow
1. Audio recordings saved locally via storageService
2. Recording metadata includes question, date, duration
3. All data persisted using AsyncStorage

## External Dependencies
- **expo-av**: Audio recording and playback
- **@react-native-async-storage/async-storage**: Local data storage
- **@react-navigation/***: Navigation libraries
- **@expo/vector-icons**: Icon library
- **react-native-safe-area-context**: Safe area handling

## Recent Significant Changes
- Initial project setup pending
- All code specifications defined in complete-voice-app.md

## User Feedback Integration
- App designed for daily use with minimal friction
- Simple recording interface with visual feedback
- Clear question progression (1 of 5, 2 of 5, etc.)
