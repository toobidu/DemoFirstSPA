import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Định nghĩa params cho Bottom Tab Navigator
export type MainTabParamList = {
    Home: undefined;
    Search: undefined;
    Library: undefined;
    Profile: undefined;
};

// Định nghĩa params cho Auth Stack
export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

// Định nghĩa params cho Root Stack
export type RootStackParamList = {
    Splash: undefined;
    Onboarding: undefined;
    Auth: NavigatorScreenParams<AuthStackParamList>;
    Main: NavigatorScreenParams<MainTabParamList>;
};

// Navigation Props cho các navigator
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

// Định nghĩa các route names để tránh hardcode strings
export const ROUTES = {
    // Root Stack
    SPLASH: 'Splash',
    ONBOARDING: 'Onboarding',
    AUTH: 'Auth',
    MAIN: 'Main',

    // Auth Stack
    LOGIN: 'Login',
    REGISTER: 'Register',

    // Main Tab
    HOME: 'Home',
    SEARCH: 'Search',
    LIBRARY: 'Library',
} as const;
