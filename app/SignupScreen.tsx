import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '@/firebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';

const SignupScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    age: '',
    general: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!fullName) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!gender) {
      newErrors.gender = 'Please select a gender';
      isValid = false;
    }

    if (!age || isNaN(Number(age))) {
      newErrors.age = 'Age is invalid';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (validateForm()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Authentication account created successfully");

        try {
          await setDoc(doc(db, 'users', user.uid), {
            fullName,
            dateOfBirth: dateOfBirth.toISOString(),
            gender,
            age: Number(age),
            email
          });
          console.log("Data saved to Firestore successfully");
          navigation.navigate('LoginScreen' as never);
        } catch (firestoreError) {
          console.error("Error saving to Firestore:", firestoreError);
          setErrors(prev => ({ ...prev, general: `Unable to save information: ${firestoreError.message}` }));
        }
      } catch (authError) {
        console.error("Error creating Authentication account:", authError);
        setErrors(prev => ({ ...prev, general: `Unable to create account: ${authError.message}` }));
      }
    }
  };

  const handleInputChange = (field: keyof typeof errors) => (text: string) => {
    switch(field) {
      case 'email': setEmail(text); break;
      case 'password': setPassword(text); break;
      case 'confirmPassword': setConfirmPassword(text); break;
      case 'fullName': setFullName(text); break;
      case 'age': setAge(text); break;
    }
    setErrors(prev => ({ ...prev, [field]: '', general: '' }));
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
  };

  const handleGenderSelection = (selectedGender: string) => {
    setGender(selectedGender);
    setErrors(prev => ({ ...prev, gender: '' }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('@/assets/images/getting-started.jpg')} style={{flex:1}} resizeMode="cover">
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>Create Account</Text>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="#7F8C8D" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#7F8C8D"
                value={fullName}
                onChangeText={handleInputChange('fullName')}
              />
            </View>
            {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}

            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#7F8C8D" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#7F8C8D"
                value={email}
                onChangeText={handleInputChange('email')}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#7F8C8D" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#7F8C8D"
                value={password}
                onChangeText={handleInputChange('password')}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#7F8C8D" />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            <View style={styles.inputContainer}>
              <Feather name="check-circle" size={20} color="#7F8C8D" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#7F8C8D"
                value={confirmPassword}
                onChangeText={handleInputChange('confirmPassword')}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#7F8C8D" />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

            <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
              <Feather name="calendar" size={20} color="#7F8C8D" style={styles.icon} />
              <Text style={styles.dateText}>{dateOfBirth.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>Gender:</Text>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'male' && styles.selectedGender]}
                onPress={() => handleGenderSelection('male')}
              >
                <Text style={styles.genderButtonText}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'female' && styles.selectedGender]}
                onPress={() => handleGenderSelection('female')}
              >
                <Text style={styles.genderButtonText}>Female</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'other' && styles.selectedGender]}
                onPress={() => handleGenderSelection('other')}
              >
                <Text style={styles.genderButtonText}>Other</Text>
              </TouchableOpacity>
            </View>
            {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}

            <View style={styles.inputContainer}>
              <Feather name="hash" size={20} color="#7F8C8D" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Age"
                placeholderTextColor="#7F8C8D"
                value={age}
                onChangeText={handleInputChange('age')}
                keyboardType="numeric"
              />
            </View>
            {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}

            {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen' as never)}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

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
    backgroundColor: 'rgba(0,0,0,0.5)'
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
    marginBottom: 10,
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
  dateText: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#FFFFFF',
    textAlignVertical: 'center',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  genderLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 10,
  },
  genderButton: {
    backgroundColor: '#2C3E50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  selectedGender: {
    backgroundColor: '#3498DB',
  },
  genderButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#EE6363',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#E74C3C',
    marginBottom: 10,
    marginLeft: 5,
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  loginLink: {
    color: '#EE6363',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default SignupScreen;