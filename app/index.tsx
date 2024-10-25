import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import '@/firebaseConfig';

const Page = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light"></StatusBar>
      <ImageBackground source={require('@/assets/images/getting-started.jpg')} style={{flex:1}} resizeMode="cover">
        <View style={styles.wrapper}>
          <Animated.Text style={styles.title} entering={FadeInRight.delay(300).duration(500)}>Welcome to Buzzline!</Animated.Text>
          <Animated.Text style={styles.description} entering={FadeInRight.delay(700).duration(500)}>
            Stay informed with the latest news, updates, and stories, all in one place. Your daily news starts here!</Animated.Text>
          <Animated.View entering={FadeInDown.delay(1200).duration(500)}>
            <TouchableOpacity style={styles.btn}
              onPress={() => router.replace("/LoginScreen")}>
              <Text style={styles.btnText}>Get Started</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ImageBackground>
      
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  wrapper:{
    flex:1,
    justifyContent:'flex-end',
    paddingBottom:50,
    paddingHorizontal:30,
    gap:10,
    backgroundColor:'rgba(0,0,0,0.5)'
  },
  title:{
    color:Colors.white,
    fontSize:30,
    fontWeight:'600',
    letterSpacing:1.5,
    lineHeight:35,
    textAlign:'center',
  },
  description:{
    color:Colors.white,
    fontSize:16,
    fontWeight:'500',
    letterSpacing:1.2,
    lineHeight:22,
    textAlign:'center'
  },
  btn:{
    backgroundColor: '#EE6363',
    paddingVertical:15,
    marginVertical:20,
    alignItems:'center',
    borderRadius:15,
  },
  btnText:{
    color:Colors.white,
    fontSize:16,
    fontWeight:'700',
  }
  
});