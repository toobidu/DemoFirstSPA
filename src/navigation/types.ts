// import { NavigatorScreenParams } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
//
// // Định nghĩa params cho Bottom Tab Navigator
// export type TabParamList = {
//     HomeScreen: undefined;
//     SearchingScreen: undefined;
//     PlaylistScreen: undefined;
// };
//
// // Định nghĩa params cho Stack Navigator
// export type RootStackParamList = {
//     Splash: undefined;
//     Onboarding: undefined;
//     Welcome: undefined;
//     Login: undefined;
//     Register: undefined;
//     ForgotPassword: undefined;
//     ResetPassword: { token: string };
//     Optional: undefined;
//     OtpScreen: { email: string };
//     MainTab: NavigatorScreenParams<TabParamList>;
//     NowPlayingScreen: { songId: string };
//     ProfileScreen: undefined;
//     SettingsScreen: undefined;
//     FavoriteSongsScreen: undefined;
//     HelpScreen: undefined;
// };
//
// // Navigation Props cho Stack Navigator
// export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
//
// // Navigation Props cho Bottom Tab Navigator
// export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;
//
// // Định nghĩa các route names để tránh hardcode strings
// export const ROUTES = {
//     SPLASH: 'Splash',
//     ONBOARDING: 'Onboarding',
//     WELCOME: 'Welcome',
//     LOGIN: 'Login',
//     REGISTER: 'Register',
//     FORGOT_PASSWORD: 'ForgotPassword',
//     RESET_PASSWORD: 'ResetPassword',
//     OPTIONAL: 'Optional',
//     OTP_SCREEN: 'OtpScreen',
//     MAIN_TAB: 'MainTab',
//     NOW_PLAYING: 'NowPlayingScreen',
//     PROFILE: 'ProfileScreen',
//     SETTINGS: 'SettingsScreen',
//     FAVORITE_SONGS: 'FavoriteSongsScreen',
//     HELP: 'HelpScreen',
// } as const;
