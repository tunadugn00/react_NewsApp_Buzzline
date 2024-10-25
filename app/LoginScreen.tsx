import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/firebaseConfig';



const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION = 30000;

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('savedEmail');
      const savedPassword = await AsyncStorage.getItem('savedPassword');
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error);
    }
  };

  const handleLogin = async () => {
    const currentTime = Date.now();
  
    if (lockoutTime && currentTime < lockoutTime) {
      const remainingTime = Math.ceil((lockoutTime - currentTime) / 1000);
      setError(`Account locked. Try again in ${remainingTime} seconds.`);
      return;
    }
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setFailedAttempts(0);
  
      if (rememberMe) {
        await AsyncStorage.setItem('savedEmail', email);
        await AsyncStorage.setItem('savedPassword', password);
      } else {
        await AsyncStorage.removeItem('savedEmail');
        await AsyncStorage.removeItem('savedPassword');
      }
  
      router.replace('/(tabs)');
    } catch (error: any) {
      let errorMessage = 'Invalid email or password';
  
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address is not valid.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This user has been disabled.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'The password is incorrect.';
      }
  
      setFailedAttempts(prev => prev + 1);
      setError(errorMessage);
  
      if (failedAttempts + 1 >= MAX_FAILED_ATTEMPTS) {
        setLockoutTime(Date.now() + LOCKOUT_DURATION);
        setError('Too many failed attempts. Your account is locked for 30 seconds.');
      }
    }
  };

  const handleSocialLogin = (platform: string) => {
    console.log(`Login with ${platform}`);
  };

  const handleGuestAccess = () => {
    // Điều hướng tới (tabs)
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('@/assets/images/getting-started.jpg')} style={{flex:1}} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
      

        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Feather name="mail" size={20} color="#7F8C8D" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#7F8C8D"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#7F8C8D" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#7F8C8D"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#7F8C8D" />
            </TouchableOpacity>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setRememberMe(!rememberMe)}
            >
              {rememberMe && <Feather name="check" size={16} color="#3498DB" />}
            </TouchableOpacity>
            <Text style={styles.rememberMeText}>Remember Me</Text>
            <TouchableOpacity onPress={() => router.push('/ForgotPassword')}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestButton} onPress={handleGuestAccess}>
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>
        </View>

        {/* Social Login Buttons */}
        <View style={styles.socialLoginContainer}>
          <TouchableOpacity style={[styles.socialButton, styles.googleButton]} onPress={() => handleSocialLogin('google')}>
            <FontAwesome name="google" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, styles.facebookButton]} onPress={() => handleSocialLogin('facebook')}>
            <FontAwesome name="facebook" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, styles.phoneButton]} onPress={() => handleSocialLogin('phone')}>
            <Feather name="phone" size={30} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/SignupScreen')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Login;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor:'rgba(0,0,0,0.5)'
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  formContainer: {
    width: '85%',
    maxWidth: 400,
    
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#3498DB',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberMeText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: -70,
  },
  forgotPasswordText: {
    color: '#EE6363',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#EE6363',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#E74C3C',
    marginBottom: 10,
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  signupLink: {
    color: '#EE6363',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  socialLoginContainer: {
    flexDirection: 'row',  // Xếp các nút theo hàng ngang
    justifyContent: 'space-around',  // Khoảng cách đều nhau giữa các nút
    width: '85%',
    maxWidth: 400,
    marginTop: 20,
  },
  
  socialButton: {
    width: 60,  // Chiều rộng của mỗi button (hình vuông)
    height: 60,  // Chiều cao của mỗi button
    borderRadius: 30,  // Để tạo button tròn
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  googleButton: {
    backgroundColor: '#DB4437',  // Màu đỏ đặc trưng của Google
  },
  
  facebookButton: {
    backgroundColor: '#4267B2',  // Màu xanh đặc trưng của Facebook
  },
  
  phoneButton: {
    backgroundColor: '#34B7F1',  // Màu xanh đặc trưng cho Phone (WhatsApp màu xanh nhạt)
  },
  guestButton: {
    backgroundColor: '#EE6363',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  guestButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
});

