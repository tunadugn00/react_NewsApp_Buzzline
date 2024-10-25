import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '@/firebaseConfig';

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    if (!email) {
      setMessage('Please enter your email address.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Please check your inbox.');
      setIsResetSent(true);
    } catch (error) {
      setMessage('Error sending reset email. Please try again.');
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('LoginScreen' as never);
  };

  return (
    <LinearGradient
      colors={['#2C3E50', '#34495E']}
      style={styles.container}
    >
      <ImageBackground source={require('@/assets/images/getting-started.jpg')} style={{flex:1}} resizeMode="cover">
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView} 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>Enter your email to reset your password</Text>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#3498DB" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Your email address"
                placeholderTextColor="#7F8C8D"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isResetSent}
              />
            </View>
            {message ? <Text style={[styles.messageText, isResetSent && styles.successMessage]}>{message}</Text> : null}
            {isResetSent ? (
              <TouchableOpacity style={styles.button} onPress={handleBackToLogin}>
                <Text style={styles.buttonText}>Back to Login</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Reset Password</Text>
              </TouchableOpacity>
            )}
            {!isResetSent && (
              <TouchableOpacity style={styles.linkButton} onPress={handleBackToLogin}>
                <Text style={styles.linkButtonText}>Back to Login</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor:'rgba(0,0,0,0.5)'
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#BDC3C7',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    width: '100%',
    maxWidth: 300,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#EE6363',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    maxWidth: 300,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageText: {
    color: '#E74C3C',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
  },
  linkButtonText: {
    color: '#EE6363',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successMessage: {
    color: '#2ECC71',
  },
});

export default ForgotPasswordScreen;