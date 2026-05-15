import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import UsernameEmail from '@/components/UsernameEmail'
import SettingsCategory from '@/components/SettingsCategory'
import { Ionicons } from '@expo/vector-icons'



const settings = () => {
  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            {/* <Ionicons name='chevron-back-outline' size={24} color='dodgerblue' /> */}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>



        {/* Profile Image */}
        <View style={styles.profileImg}>
          <Image
            source={require('@/assets/images/Man Potrait Image.jpg')}
            style={{
              width: 72,
              height: 72,
              borderRadius: 100,
            }}
          />
        </View>

        {/* Username & Email*/}
        <UsernameEmail
          username='mikee'
          email='mndubuisi1000@gmail.com'
        />

        <SettingsCategory
          category='Personal Details'
          icon='person-outline'
          name1='Personal Information'
          name2='Language Preference'
        />

        <SettingsCategory
          category='General Settings'
          icon='settings-outline'
          name1='Languages'
          name2='Text size'
        />

        <SettingsCategory
          category='Help & Support'
          icon='chatbubble-ellipses-outline'
          name1='Contact Support'
          name2='FAQs'
        />


        <TouchableOpacity style={styles.btnLogout}>
          <Text style={{
            color: 'tomato', fontSize: 16, lineHeight: 24, fontWeight: 600,
          }}>Log Out</Text>
          <Ionicons name='log-out-outline' size={24} color={'#e68383'} />
        </TouchableOpacity>








      </SafeAreaView>
    </ScrollView>
  )
}

export default settings

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

  profileImg: {
    width: 72,
    height: 72,
    shadowColor: '#030c25',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
    borderRadius: 100,
  },

  container: {
    padding: 16,
    flex: 1,
  },

  btnLogout: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  }
})