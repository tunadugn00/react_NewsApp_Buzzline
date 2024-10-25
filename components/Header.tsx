import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { useRouter } from 'expo-router'; // Thay đổi import này
import { useAuth } from '../components/AuthContext';

type Props = {
  userName: string;
}

const Header = ({ userName }: Props) => {
  const router = useRouter(); // Sử dụng useRouter thay vì useNavigation
  const { user } = useAuth();


  const handleProfilePress = () => {
    router.push('/UserProfileScreen'); // Sử dụng router.push thay vì navigation.navigate
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.userInfo} onPress={handleProfilePress}>
        <Image 
          source={{uri:'https://tintuc.dienthoaigiakho.vn/wp-content/uploads/2024/01/c39af4399a87bc3d7701101b728cddc9.jpg'}} 
          style={styles.userImg}
        />
        <View style={{gap:3,}}>
          <Text style={styles.welcomeTxt}>Welcome!</Text>
          <Text style={styles.userName}>{user?.fullName}</Text>
        </View>
      </TouchableOpacity>
      {/* Rest of the component */}
    </View>
  );
};

export default Header

const styles =StyleSheet.create({
    container:{
        paddingHorizontal:20,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:20,
        marginTop:10,
    },

    userImg:{
        width:50,
        height:50,
        borderRadius:30,
    },
    userInfo:{
      flexDirection:'row',
      alignItems:'center',
      gap:10,
    },
    welcomeTxt:{
      fontSize:12,
      color:Colors.darkGrey
    },
    userName:{
      fontSize:14,
      fontWeight:'700',
      color:Colors.black
    }


})