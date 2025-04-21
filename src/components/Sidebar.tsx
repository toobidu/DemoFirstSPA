import React from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import theme constants
const COLORS = {
  background: '#121212',
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255,255,255,0.6)',
  },
};

interface UserData {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  premium: boolean;
}

interface MenuItem {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
}

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  userData: UserData;
  translateX: Animated.Value;
}

const Sidebar: React.FC<SidebarProps> = ({isVisible, onClose, userData, translateX}) => {
  const navigation = useNavigation();

  const menuItems: MenuItem[] = [
    {
      icon: <Ionicons name="person-circle" size={24} color="#ffffff" />,
      title: 'Hồ sơ',
      onPress: () => navigation.navigate('ProfileScreen'),
    },
    {
      icon: <Ionicons name="notifications" size={24} color="#ffffff" />,
      title: 'Thông báo',
      onPress: () => navigation.navigate('FavoriteSongsScreen'),
    },
    {
      icon: <Ionicons name="time" size={24} color="#ffffff" />,
      title: 'Lịch sử',
      onPress: () => navigation.navigate('FavoriteSongsScreen'),
    },
    {
      icon: <Ionicons name="settings" size={24} color="#ffffff" />,
      title: 'Cài đặt',
      onPress: () => navigation.navigate('SettingsScreen'),
    },
    {
      icon: <Ionicons name="information-circle" size={24} color="#ffffff" />,
      title: 'Trợ giúp',
      onPress: () => navigation.navigate('HelpScreen'),
    },
    {
      icon: <Ionicons name="log-out" size={24} color="#ffffff" />,
      title: 'Đăng xuất',
      onPress: () => {
        navigation.navigate('WelcomeScreen');
      },
    },
  ];

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        {
          transform: [{translateX}],
        },
      ]}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.userInfo}>
          <Image source={{uri: userData.avatarUrl}} style={styles.avatar} />
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          {userData.premium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              {item.icon}
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: COLORS.background,
    zIndex: 1000,
    elevation: 5,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.1)',
  },
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    padding: 8,
  },
  userInfo: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  premiumBadge: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuText: {
    marginLeft: 16,
    fontSize: 16,
    color: COLORS.text.primary,
  },
});

export default Sidebar;
