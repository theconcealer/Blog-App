import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

const saved = () => {

  const router = useRouter
  return (
    <SafeAreaView style={{ padding: 16 }}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          {/* <Ionicons name='chevron-back-outline' size={24} color='dodgerblue' /> */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Saved Posts</Text>
        <View style={{ width: 24 }} />
      </View>

    </SafeAreaView>
  )
}

export default saved

const styles = StyleSheet.create({
  // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e1e1e',
    },
})