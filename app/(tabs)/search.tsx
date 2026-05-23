import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

const search = () => {

  

  return (
    <SafeAreaView style={{
      padding: 16,
    }}>

      {/* Search bar */}
      <View style={styles.homeSearch}>
        <Ionicons name='search' size={20} color={'#808289'} />
        <TextInput
          style={{
            width: '100%',
            flex: 1,
            padding: 0,                          //removes Android's extra padding
            includeFontPadding: false,
          }}
          placeholder='search by username or title'
          placeholderTextColor={'#808289'}
        />
      </View>

    </SafeAreaView>
  )
}

export default search

const styles = StyleSheet.create({
  homeSearch: {
    borderWidth: 0.5,
    borderColor: '#b1b2b6',
    backgroundColor: '#edf1f6',
    width: '100%',
    height: 40,
    borderRadius: 10,
    marginTop: 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
})