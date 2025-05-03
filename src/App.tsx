import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import TrackPlayer from 'react-native-track-player';
import { AuthProvider } from './context/AuthContext'; // bạn có thể cần điều chỉnh đường dẫn
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import NowPlayingScreen from './screens/music/NowPlayingScreen';
import MainApp from './screens/music/MainApp';
import ProfileScreen from "./screens/other/sidebar-screen/ProfileScreen";
import IntroductionScreen from './screens/other/sidebar-screen/IntroductionScreen';
import MusicPlayerBar from 'components/MusicPlayerBar';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/*<Stack.Screen name="LoginScreen" component={LoginScreen} />*/}
            {/*<Stack.Screen name="RegisterScreen" component={RegisterScreen} />*/}
            {/*<Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />*/}
            <Stack.Screen name="MainApp" component={MainApp} />
            <Stack.Screen name="NowPlayingScreen" component={NowPlayingScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="IntroductionScreen" component={IntroductionScreen} />
          </Stack.Navigator>
          <MusicPlayerBar />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
