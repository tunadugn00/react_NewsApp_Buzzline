import { StyleSheet, Text, View,TextInput } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'


type Props = {
  withHorizontalPadding: boolean
  setSearchQuery: Function
}

const SearchBar = ({withHorizontalPadding, setSearchQuery}: Props) => {
  return (
    <View style={[styles.container, withHorizontalPadding && {paddingHorizontal:20}]}>
      <View style={styles.searchBar}>
        <Ionicons name='search-outline' size={20} color={Colors.lightGrey}/>
        <TextInput 
            placeholder="Enter Keywords"
            placeholderTextColor={Colors.lightGrey}
            style={styles.searchTxt}
            autoCapitalize='none'
            onChangeText={query => setSearchQuery(query)}/>
      </View>
    </View>
  )
}

export default SearchBar

const styles = StyleSheet.create({
    container:{
        //marginHorizontal:20,
        marginBottom:20,
    },
    searchBar:{
        backgroundColor:"#E4E4E4",
        paddingHorizontal:10,
        paddingVertical:10,
        borderRadius:10,
        flexDirection:'row',
        gap:10,
    },
    searchTxt:{
        fontSize:15,
        flex:1,
        color:Colors.black,
    }

})