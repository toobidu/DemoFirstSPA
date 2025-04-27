import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, InfoCircle } from 'iconsax-react-nativejs';
import { useNavigation } from '@react-navigation/native';
import Music from '../../../assets/images/logo/Music';

const IntroductionScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Giới thiệu</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Music width={100} height={100} />
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.appName}>SoundClone</Text>
            <Text style={styles.version}>Version 1.0.0</Text>

            <View style={styles.divider} />

            <View style={styles.specSection}>
              <Text style={styles.sectionTitle}>Công nghệ sử dụng</Text>
              <View style={styles.specList}>
                <Text style={styles.specItem}>• React Native 0.79.0</Text>
                <Text style={styles.specItem}>• React 19.0.0</Text>
                <Text style={styles.specItem}>• Track Player 4.1.1</Text>
                <Text style={styles.specItem}>• Node.js ≥18</Text>
                <Text style={styles.specItem}>• Gradle 8.13</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.creditsSection}>
              <Text style={styles.sectionTitle}>Các nhà phát triển</Text>
              <View style={styles.developersGrid}>
                {[
                  {
                    name: 'Dung Do Van',
                    avatar: require('../../../assets/images/wibu.png')
                  },
                  {
                    name: 'Duy Hoang Quang',
                    avatar: require('../../../assets/images/wibu.png')
                  },
                  {
                    name: 'Hai Dang Hoang',
                    avatar: require('../../../assets/images/wibu.png')
                  },
                  {
                    name: 'Dung To Tien',
                    avatar: require('../../../assets/images/developers/dung-to.jpg')
                  }
                ].map((developer, index) => (
                  <View key={index} style={styles.developerCard}>
                    <View style={styles.avatarContainer}>
                      <Image
                        source={developer.avatar}
                        style={styles.avatar}
                        resizeMode="cover"
                      />
                    </View>
                    <Text style={styles.developerName} numberOfLines={2} textAlign="center">
                      {developer.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.copyright}>© 2025 SoundClone</Text>
            <Text style={styles.poweredBy}>Powered by React Native</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  logoContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  infoSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  version: {
    fontSize: 18,
    color: '#1DB954',
    fontWeight: '600',
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: '#2a2a2a',
    marginVertical: 24,
  },
  specSection: {
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  specList: {
    width: '100%',
    paddingHorizontal: 20,
  },
  specItem: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 12,
  },
  creditsSection: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
  },
  developersGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  developerCard: {
    width: '45%',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  developerName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  copyright: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.6,
    marginBottom: 4,
  },
  poweredBy: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.4,
  },
});

export default IntroductionScreen;
