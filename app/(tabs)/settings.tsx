import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { useDarkMode } from '@/components/DarkModeContext'

type Props = {}

const Page = (props: Props) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <>
    <Stack.Screen options={{
      headerShown: true
    }} />
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <TouchableOpacity style={[styles.itemBtn, isDarkMode && styles.darkItemBtn]}>
        <Text style={[styles.itemBtnTxt, isDarkMode && styles.darkItemBtnTxt]}>About</Text>
        <MaterialIcons name='arrow-forward-ios' size={16} color={isDarkMode ? Colors.white : Colors.lightGrey}/>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.itemBtn, isDarkMode && styles.darkItemBtn]}>
        <Text style={[styles.itemBtnTxt, isDarkMode && styles.darkItemBtnTxt]}>Send Feedback</Text>
        <MaterialIcons name='arrow-forward-ios' size={16} color={isDarkMode ? Colors.white : Colors.lightGrey}/>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.itemBtn, isDarkMode && styles.darkItemBtn]}>
        <Text style={[styles.itemBtnTxt, isDarkMode && styles.darkItemBtnTxt]}>Privacy Policy</Text>
        <MaterialIcons name='arrow-forward-ios' size={16} color={isDarkMode ? Colors.white : Colors.lightGrey}/>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.itemBtn, isDarkMode && styles.darkItemBtn]}>
        <Text style={[styles.itemBtnTxt, isDarkMode && styles.darkItemBtnTxt]}>Terms of Use</Text>
        <MaterialIcons name='arrow-forward-ios' size={16} color={isDarkMode ? Colors.white : Colors.lightGrey}/>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.itemBtn, isDarkMode && styles.darkItemBtn]} onPress={toggleDarkMode}>
        <Text style={[styles.itemBtnTxt, isDarkMode && styles.darkItemBtnTxt]}>Dark Mode</Text>
        <Switch
          trackColor={{false:'#767577', true:'#3e3e3e'}}
          thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleDarkMode}
          value={isDarkMode}
          style={{transform: [{scale: 1}], marginBottom: -15, marginRight: -8}}
        />
      </TouchableOpacity>

    </View>
    </>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  darkContainer: {
    backgroundColor: Colors.black,
  },
  itemBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomColor: Colors.background,
    borderBottomWidth: 1,
  },
  darkItemBtn: {
    backgroundColor: Colors.black,
    borderBottomColor: Colors.lightGrey,
  },
  itemBtnTxt: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black,
  },
  darkItemBtnTxt: {
    color: Colors.white,
  },
})