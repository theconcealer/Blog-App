import img from '@/assets/images/manreading.jpg'
import { Ionicons } from '@expo/vector-icons'
import React, { useRef, useState } from 'react'
import { Animated, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

import { useUserStore } from '@/store/useUserStore'



const Explore = () => {

  const user = useUserStore((state) => state.user)

  const { height, width } = useWindowDimensions();
  const router = useRouter()

  //  Toast state and animation
  const [showToast, setShowToast] = useState(false)
  const slideAnim = useRef(new Animated.Value(-100)).current  // starts above screen

  const showSavedToast = () => {
    setShowToast(true)

    //  Slide in from top
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 0,           // slides down to visible position
        duration: 300,
        useNativeDriver: true,
      }),

      //  Hold for 3 seconds
      Animated.delay(3000),

      //  Slide back up
      Animated.timing(slideAnim, {
        toValue: -100,        // slides back above screen
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowToast(false)   // hide after animation completes
    })
  }

  const styles = StyleSheet.create({


    headerContainer: {
      width: '100%',
      // borderWidth: 1,
      height: 60,
      flexDirection: 'row',
      justifyContent: 'space-between'

    },

    profileImage: {
      width: 250,
      height: '100%',
      // borderWidth: 2,
      justifyContent: 'space-between',
      flexDirection: 'row'
    },

    iconContainer: {
      width: 52,
      height: 52,
      backgroundColor: 'dodgerblue',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
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

    // ✅ Toast styles
    toast: {
      position: 'absolute',
      top: 0,
      left: 16,
      right: 16,
      backgroundColor: 'green',
      borderRadius: 12,
      paddingVertical: 24,
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 999,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 10,
      marginTop: 52,
    },

    toastText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '500',
    },

    toastCTA: {
      color: '#f9f9f9',
      fontSize: 14,
      fontWeight: '700',
    },

  });

  return (
    <SafeAreaView style={{ padding: 16 }}>

      {/* Toast Notification */}
      {showToast && (
        <Animated.View style={[styles.toast, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.toastText}>Post saved successfully</Text>
          <TouchableOpacity onPress={() => router.push('/saved')}>
            <Text style={styles.toastCTA}>View post</Text>
          </TouchableOpacity>
        </Animated.View>
      )}



      {/* Header Display */}
      <View style={styles.headerContainer}>

        <View style={styles.profileImage}>

          {/* Profile image container */}
          <TouchableOpacity
            style={{
              width: 60,
              height: 60,
              borderRadius: 100,
              overflow: 'hidden',   // ✅ clips image into circle
            }}
            onPress={() => router.push('/modal')}
          >
            <Image
              source={require('@/assets/images/Man Potrait Image.jpg')}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </TouchableOpacity>

          {/* Container: Name & welcome message */}
          <View style={{
            width: '72%',
            height: '100%',
            // borderWidth: 1,
            paddingVertical: 4,
            flexDirection: 'column',
            gap: 4,
          }}>

            <Text style={styles.name}>{user?.username}</Text>
            <Text style={styles.message}>Write magic today!</Text>

          </View>

        </View>

        {/* Create a post: Quick add */}
        <TouchableOpacity 
          onPress={()=> router.push('/createPost')}
        >
          <View style={styles.iconContainer}>
            <Ionicons name='add' size={24} color={'#f9f9f9'} />
          </View>
        </TouchableOpacity>

      </View>





      {/* Search bar */}
      <View style={styles.homeSearch}>
        <Ionicons name='search' size={20} color={'#808289'} />
        <TextInput
          style={{
            width: '100%',
            flex: 1,
            padding: 0,  //removes Android's extra padding
            includeFontPadding: false,
          }}
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
              {user?.username}
            </Text>
          </View>

          {/* ✅ Bookmark triggers the toast */}
          <TouchableOpacity onPress={showSavedToast}>
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