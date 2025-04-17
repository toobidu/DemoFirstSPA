import React from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import SplashScreen from './src/screens/onboarding/SplashScreen.tsx';
// import OnboardingScreen from '@/screens/onboarding/OnboardingScreen';
// import {RootStackParamList} from '@/navigation';
import {StyleSheet, Text, View} from 'react-native';
// const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="Splash"
//         screenOptions={{
//           headerShown: false,
//           gestureEnabled: false,
//         }}>
//         <Stack.Screen name="Splash" component={SplashScreen} />
//         <Stack.Screen name="Onboarding" component={OnboardingScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };
    return (
        <View style={styles.container}>
            <Text>Open up App.tsx to start working on your app!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default App;
