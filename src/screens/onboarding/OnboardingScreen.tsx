import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const onboardingData = [
  {
    title: 'Bùng nổ cùng nhịp điệu',
    subtitle: 'Khám phá âm nhạc mới mỗi ngày',
    imageUrl: require('../assets/images/training.png'),
  },
  {
    title: 'Tập trung với giai điệu yêu thích',
    subtitle: 'Danh sách phát cho mọi lúc, mọi nơi',
    imageUrl: require('../assets/images/work.png'),
  },
  {
    title: 'Lan tỏa niềm vui âm nhạc',
    subtitle: 'Đắm mình trong những bản nhạc sôi động',
    imageUrl: require('../assets/images/party.png'),
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('Welcome');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {currentIndex > 0 && (
        <TouchableOpacity
          style={[styles.navButton, styles.leftNav]}
          onPress={handlePrev}
        >
          <Text style={styles.navButtonText}>◄</Text>
        </TouchableOpacity>
      )}
      <View style={styles.content}>
        <Image
          source={onboardingData[currentIndex].imageUrl}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{onboardingData[currentIndex].title}</Text>
        <Text style={styles.subtitle}>{onboardingData[currentIndex].subtitle}</Text>
      </View>
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>
      {currentIndex === onboardingData.length - 1 ? (
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Text style={styles.startButtonText}>Bắt đầu</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.navButton, styles.rightNav]}
          onPress={handleNext}
        >
          <Text style={styles.navButtonText}>►</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Simplified gradient
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    marginBottom: 32,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  activeDot: {
    width: 30,
    backgroundColor: '#fff',
  },
  startButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    padding: 16,
  },
  leftNav: { left: 16 },
  rightNav: { right: 16 },
  navButtonText: {
    fontSize: 24,
    color: '#fff',
  },
});

export default OnboardingScreen;