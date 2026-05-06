import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import img from '@/assets/images/manreading.jpg'


const Explore = () => {
  const { height, width } = useWindowDimensions();

  const styles = StyleSheet.create({
    circle: {
      backgroundColor: '#a8a9aa',
      width: 45,
      height: 45,
      borderRadius: 1000,
      overflow: 'hidden',
    },

    text: {
      width: 200,
      flexDirection: 'column',
      gap: 4,
      paddingVertical: 6
    },

    name: {
      fontSize: 16,
      fontWeight: 'bold',
      lineHeight: 24,
    },

    message: {
      fontSize: 14,
      lineHeight: 21,
      color: '#6a6a6a',
      fontWeight: '500',
    },

    notification: {
      width: 65,
      marginLeft: 44,
      borderRadius: 1000,
    },

    homeSearch: {
      borderWidth: 0.5,
      borderColor: '#b1b2b6',
      backgroundColor: '#edf1f6',
      width: '100%',
      height: 40,
      borderRadius: 100,
      marginTop: 24,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },

    card: {
      width: '100%',
      padding: 20,
      borderRadius: 12,
      marginTop: 48,

  

      backgroundColor: '#f9f9f9',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 12,
      elevation: 4,         
    },

    username: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
      overflow: 'hidden'
    },

    cont: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    title: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '700',
      marginTop: 16,
    },

    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
      marginTop: 16,
      color: '#636567'
    },

    views: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },

    likes: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },

    share: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },

    imageContainer: {
      height: height * 0.3,
      marginTop: 8,
    },

  });

  return (
    <SafeAreaView style={{ padding: 16 }}>

      <View style={{ height: 65, width: 272, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Profile Image */}
        <View style={styles.circle}>
          <Image
            source={require('@/assets/images/Man Potrait Image.jpg')}
            style={{ width: 45, height: 45 }}
          />
        </View>

        <View style={styles.text}>
          <Text style={styles.name}>Welcome back, Mikee</Text>
          <Text style={styles.message}>Let your voice be heard today</Text>
        </View>

        {/* Notification Icon */}
        <View style={styles.notification}>
          <Ionicons
            name='notifications-outline'
            size={28}
            color={'#5d5e62'}
            style={{ margin: 'auto' }}
          />
        </View>

      </View>

      {/* Search bar */}
      <View style={styles.homeSearch}>
        <Ionicons name='search' size={20} color={'#808289'} />
        <TextInput
          style={{ width: '100%' }}
          placeholder='search title here'
          placeholderTextColor={'#808289'}
        />
      </View>

      {/* Blog Post Card */}
      <View style={styles.card}>

        <View style={styles.cont}>
          <View style={styles.username}>
            <Image
              source={require('@/assets/images/black lady.jpg')}
              style={{ width: 45, height: 45, borderRadius: 100 }}
            />
            <Text style={{ fontSize: 16, fontWeight: '600', lineHeight: 24, color: '#3e3f40' }}>
              GhostWriter
            </Text>
          </View>

          <TouchableOpacity>
            <Ionicons name='bookmark-outline' size={28} color={'dodgerblue'} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>
          The Quiet Power of Reading 30 Minutes a Day
        </Text>

        <Text style={styles.body}>
          Most people scroll through their phones before sleeping without thinking twice. But swapping that habit for just 20 minutes of reading can change everything. It slows your mind down, reduces st.....
        </Text>

        {/* Post Image */}
        <View style={styles.imageContainer}>
          <Image
            source={img}
            style={{
              height: height * 0.3,
              width: width * 0.83,
              borderRadius: 4,
            }}
          />
        </View>

        {/* Engagements */}
        <View style={{ padding: 8, flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>

          {/* Views */}
          <TouchableOpacity style={styles.views} activeOpacity={0.7}>
            <Ionicons name='eye-outline' size={24} color={'dodgerblue'} />
            <Text>3.8K</Text>
          </TouchableOpacity>

          {/* Likes */}
          <TouchableOpacity style={styles.likes} activeOpacity={0.7}>
            <Ionicons name='heart-outline' size={24} color={'dodgerblue'} />
            <Text>2.1K</Text>
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity style={styles.share} activeOpacity={0.7}>
            <Ionicons name='share-outline' size={24} color={'dodgerblue'} />
            <Text>2.1K</Text>
          </TouchableOpacity>

        </View>

      </View>

    </SafeAreaView>
  )
}

export default Explore