import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const RecordingScreen = () => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordings, setRecordings] = useState([]);

  const questions = [
    "Talk me through how today went—for you. How were you feeling physically and mentally?",
    "What was the highlight of your day?",
    "What challenged you today and how did you handle it?",
    "What are you grateful for today?",
    "How would you rate your energy levels throughout the day?"
  ];

  useEffect(() => {
    // Request permissions on component mount
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access microphone is required!');
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    })();
  }, []);

  const startRecording = async () => {
    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    
    // Save recording with metadata
    const recordingData = {
      uri,
      question: questions[currentQuestionIndex],
      date: new Date().toISOString(),
      questionIndex: currentQuestionIndex,
    };
    
    // Save to AsyncStorage
    const existingRecordings = await AsyncStorage.getItem('recordings');
    const recordingsArray = existingRecordings ? JSON.parse(existingRecordings) : [];
    recordingsArray.push(recordingData);
    await AsyncStorage.setItem('recordings', JSON.stringify(recordingsArray));
    
    setRecording(null);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleMicrophonePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.time}>9:41</Text>
        <View style={styles.statusIcons}>
          <Ionicons name="wifi" size={16} color="#000" style={styles.statusIcon} />
          <Ionicons name="cellular" size={16} color="#000" style={styles.statusIcon} />
          <Ionicons name="battery-full" size={16} color="#000" style={styles.statusIcon} />
        </View>
      </View>

      {/* Phone Frame */}
      <View style={styles.phoneFrame}>
        {/* Dynamic Island / Notch */}
        <View style={styles.dynamicIsland} />

        {/* Stanford Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBackground}>
            <Text style={styles.logoText}>S</Text>
          </View>
        </View>

        {/* Question Text */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {questions[currentQuestionIndex]}
          </Text>
        </View>

        {/* Recording Status */}
        <Text style={styles.recordingStatus}>
          {isRecording ? 'recording' : currentQuestionIndex > 0 ? 'next question' : ''}
        </Text>

        {/* Control Button */}
        <View style={styles.controlsContainer}>
          {!isRecording && currentQuestionIndex > 0 ? (
            <TouchableOpacity
              style={[styles.controlButton, styles.nextButton]}
              onPress={handleNextQuestion}
            >
              <Ionicons name="arrow-forward" size={30} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.controlButton,
                isRecording ? styles.recordingButton : styles.micButton
              ]}
              onPress={handleMicrophonePress}
            >
              <Ionicons name="mic" size={30} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBar} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingTop: 20,
  },
  statusBar: {
    width: screenWidth * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 5,
  },
  statusIcon: {
    marginLeft: 5,
  },
  phoneFrame: {
    width: screenWidth * 0.9,
    maxWidth: 390,
    height: 750,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  dynamicIsland: {
    width: 126,
    height: 37,
    backgroundColor: '#000000',
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: -10,
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 60,
  },
  logoBackground: {
    width: 120,
    height: 120,
    backgroundColor: '#B91C1C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 80,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  questionContainer: {
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  questionText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
    color: '#1F2937',
    fontWeight: '400',
  },
  recordingStatus: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 30,
  },
  controlsContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 80,
  },
  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    backgroundColor: '#3B82F6',
  },
  recordingButton: {
    backgroundColor: '#EF4444',
  },
  nextButton: {
    backgroundColor: '#10B981',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -67 }],
    width: 134,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 3,
  },
});

export default RecordingScreen;