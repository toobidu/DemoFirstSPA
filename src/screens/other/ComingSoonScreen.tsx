import React, {useEffect, useRef} from 'react';
import {Animated, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeft} from 'iconsax-react-native';


const ComingSoonScreen = ({navigation}) => {
  // Animation cho loading dots
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDots = () => {
      const duration = 600;
      const delay = 200;

      Animated.loop(
        Animated.sequence([
          Animated.timing(dot1Anim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(dot1Anim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(dot2Anim, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(dot2Anim, {
              toValue: 0,
              duration,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      }, delay);

      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(dot3Anim, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(dot3Anim, {
              toValue: 0,
              duration,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      }, delay * 2);
    };

    animateDots();
  }, [dot1Anim, dot2Anim, dot3Anim]);

  const handleGoBack = () => {
    if (navigation?.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />

      {/* Header với nút Go Back */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Animated Container cho hình ảnh */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/ccson.png')}
            style={styles.image}
            resizeMode="contain"
          />
          {/* Đã xóa hiệu ứng glow */}
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.mainTitle}>Tính năng sắp ra mắt!</Text>
        </View>

        {/* Decorative Loading Dots */}
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[
              styles.loadingDot,
              {
                opacity: dot1Anim,
                transform: [
                  {
                    scale: dot1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                opacity: dot2Anim,
                transform: [
                  {
                    scale: dot2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                opacity: dot3Anim,
                transform: [
                  {
                    scale: dot3Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
  },
  image: {
    width: 200,
    height: 200,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.5,
    fontFamily: 'System',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1DB954',
    marginHorizontal: 4,
  },
});

export default ComingSoonScreen;
