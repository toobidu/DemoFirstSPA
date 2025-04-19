import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/music/HomeScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
       <Stack.Navigator
         initialRouteName="Login"
         screenOptions={{ headerShown: false }}
       >
         <Stack.Screen name="Login" component={LoginScreen} />
         <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
         <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
         <Stack.Screen name="HomeScreen" component={HomeScreen} />
       </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
