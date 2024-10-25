import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Alert } from 'react-native';
import { useAuth } from '../components/AuthContext';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Colors } from '@/constants/Colors';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const UserProfileScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: new Date(),
    gender: '',
    age: '',
  });

  useEffect(() => {
    fetchUserData();
  }, [user?.uid]);

  const fetchUserData = async () => {
    if (user?.uid) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            ...data,
            dateOfBirth: new Date(data.dateOfBirth),
            age: data.age.toString(),
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load user data');
      }
    }
  };

  const handleSave = async () => {
    if (user?.uid) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          ...userData,
          dateOfBirth: userData.dateOfBirth.toISOString(),
          age: Number(userData.age),
        });
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Failed to update profile');
      }
    }
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.replace('/LoginScreen');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setUserData(prev => ({ ...prev, dateOfBirth: selectedDate }));
    }
  };

  const renderField = (label: string, value: string, field: keyof typeof userData) => {
    if (isEditing && field !== 'email') {
      return (
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>{label}:</Text>
          {field === 'dateOfBirth' ? (
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {userData.dateOfBirth.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ) : field === 'gender' ? (
            <View style={styles.genderContainer}>
              {['male', 'female', 'other'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    userData.gender === gender && styles.selectedGender
                  ]}
                  onPress={() => setUserData(prev => ({ ...prev, gender }))}
                >
                  <Text style={styles.genderButtonText}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={(text) => setUserData(prev => ({ ...prev, [field]: text }))}
              keyboardType={field === 'age' ? 'numeric' : 'default'}
            />
          )}
        </View>
      );
    }
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}:</Text>
        <Text style={styles.fieldValue}>
          {field === 'dateOfBirth'
            ? new Date(value).toLocaleDateString()
            : value}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://tintuc.dienthoaigiakho.vn/wp-content/uploads/2024/01/c39af4399a87bc3d7701101b728cddc9.jpg' }}
          style={styles.profileImage}
        />

        {renderField('Full Name', userData.fullName, 'fullName')}
        {renderField('Email', userData.email, 'email')}
        {renderField('Date of Birth', userData.dateOfBirth.toISOString(), 'dateOfBirth')}
        {renderField('Gender', userData.gender, 'gender')}
        {renderField('Age', userData.age, 'age')}

        {showDatePicker && (
          <DateTimePicker
            value={userData.dateOfBirth}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  fetchUserData();
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.itemBtn , styles.logoutButton]} onPress={handleLogout}>
            <Text style={[styles.itemBtnTxt]}>Log out</Text>
            <MaterialIcons name='logout' size={16} style={styles.itemBtnicon} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  itemBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomColor: Colors.background,
    borderBottomWidth: 1,
    marginTop:20,
  },
  itemBtnTxt:{
    fontSize:20,
    fontWeight:'800',
    color: Colors.white,
    marginLeft:120
  },
  itemBtnicon:{
    fontSize:20,
    fontWeight:'800',
    color: Colors.white,
    marginRight:100,
    marginTop:5,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  fieldLabel: {
    fontSize: 16,
    color: Colors.darkGrey,
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 18,
    color: Colors.black,
  },
  input: {
    fontSize: 18,
    color: Colors.black,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tint,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: Colors.tabIconDefault,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  logoutButton: {
    backgroundColor: Colors.tint,
    borderRadius:30,
  },
  dateButton: {
    padding: 10,
    backgroundColor: Colors.tint,
    borderRadius: 5,
  },
  dateButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  genderButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: Colors.tint,
  },
  genderButtonText: {
    color: Colors.black,
    fontSize: 16,
  },
});

export default UserProfileScreen;