import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === '123456') {
      Alert.alert('Login Successful', `Welcome ${username}`);
    } else {
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Đăng nhập</Text>
        <TextInput
            style={styles.input}
            placeholder="Tên đăng nhập"
            value={username}
            onChangeText={setUsername}
        />
        <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1F2937',
  },
  input: {
    height: 50,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#1F2937',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
