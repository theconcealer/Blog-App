import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import img from '@/assets/images/manreading.jpg'


const explore = () => {
  const { height, width } = useWindowDimensions();

  const styles = StyleSheet.create({
    circle: {
      backgroundColor: '#a8a9aa',
      width: 65,
      height: 65,
      borderRadius: 1000,
      overflow: 'hidden',
    },

    text: {
      // borderWidth: 1,
      // borderColor: 'red',
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
      fontWeight: 500,
    },

    notification: {
      // borderWidth: 1,
      width: 65,
      marginLeft: 44,
      backgroundColor: '#e1e2e4',
      borderRadius: 1000,

    },

    card: {
      width: '100%',
      padding: 20,
      borderRadius: 12,
      borderWidth: 0.5,
      borderColor: '#c6c7c9',
      marginTop: 48,
    },

    username: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
      overflow: 'hidden'
    },

    cont:{
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    title: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: 700,
      marginTop: 16,
    },

    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: 400,
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
      // borderWidth: 1,
      height: height * 0.3,
      marginTop: 8,
    },

  });

  return (
    <SafeAreaView style={{ padding: 16 }}>

      <View style={{ height: 65, width: 272, flexDirection: 'row', gap: 8 }}>

        {/* Image */}
        <View style={styles.circle}>
          <Image
            source={require('@/assets/images/Man Potrait Image.jpg')}

            // styling for profile image
            style={{
              width: 65,
              height: 65,
            }}
          />
        </View>

        <View style={styles.text}>

          <Text style={styles.name}>Welcome back, Mikee</Text>
          <Text style={styles.message}>Let your voice be heard today</Text>

        </View>

        {/* Notification Icon */}
        <View style={styles.notification}>
          <Ionicons name='notifications-outline' size={32} color={'#1e1e1e'}
            style={{
              margin: 'auto'
            }}
          />
        </View>

      </View>



      {/* Blog Post */}
      <View style={styles.card}>
        <View style={styles.cont}>
          <View style={styles.username}>
            <Image
              source={require('@/assets/images/black lady.jpg')}
              style={{
                width: 45,
                height: 45,
                borderRadius: 100
              }}
            />
            <Text style={{ fontSize: 16, fontWeight: 600, lineHeight: 24, color: '#3e3f40' }}>Ghost001</Text>
          </View>

          <View>
            <TouchableOpacity>
              <Ionicons name='bookmark-outline' size={28} color={'#1e1e1e'}/>
            </TouchableOpacity>
          </View>

        </View>

        <Text style={styles.title}>The Quiet Power of Reading 30 Minutes a Day</Text>

        <Text style={styles.body}>Most people scroll through their phones before sleeping without thinking twice. But swapping that habit for just 20 minutes of reading can change everything. It slows your mind down, reduces st.</Text>

        {/* Post Images */}
        <View style={styles.imageContainer}>
          <View>
            <Image
              source={img}
              style={{
                height: height * 0.3,
                width: width * 0.83,
                borderRadius: 4,
              }}
            />
          </View>
        </View>

        {/* Engagements */}
        <View style={{ padding: 8, flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, }}>

          {/* Views */}
          <View style={styles.views}>
            <Ionicons name='eye-outline' size={24} color={'#828283'} />
            <Text>3.8K</Text>
          </View>

          {/* Likes */}
          <View style={styles.likes}>
            <Ionicons name='heart-outline' size={24} color={'tomato'} />
            <Text>2.1K</Text>
          </View>


          {/* Likes */}
          <View style={styles.share}>
            <Ionicons name='share-outline' size={24} color={'#828283'} />
            <Text>2.1K</Text>
          </View>

        </View>







      </View>



    </SafeAreaView >
  )
}

export default explore

// const styles = StyleSheet.create({
//   circle: {
//     backgroundColor: '#a8a9aa',
//     width: 65,
//     height: 65,
//     borderRadius: 1000,
//     overflow: 'hidden',
//   },

//   text: {
//     // borderWidth: 1,
//     // borderColor: 'red',
//     width: 200,
//     flexDirection: 'column',
//     gap: 4,
//     paddingVertical: 6
//   },

//   name: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     lineHeight: 24,
//   },

//   message: {
//     fontSize: 14,
//     lineHeight: 21,
//     color: '#6a6a6a',
//     fontWeight: 500,
//   },

//   notification: {
//     // borderWidth: 1,
//     width: 65,
//     marginLeft: 44,
//     backgroundColor: '#e1e2e4',
//     borderRadius: 1000,

//   },

//   card: {
//     width: '100%',
//     padding: 20,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#a7a8a9',
//     marginTop: 48,
//   },

//   username: {
//     flexDirection: 'row',
//     gap: 12,
//     alignItems: 'center',
//     overflow: 'hidden'
//   },

//   title: {
//     fontSize: 16,
//     lineHeight: 24,
//     fontWeight: 700,
//     marginTop: 16,
//   },

//   body: {
//     fontSize: 16,
//     lineHeight: 24,
//     fontWeight: 400,
//     marginTop: 16,
//     color: '#636567'
//   },

//   views: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },

//   likes: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },

//   share: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },

//   imageContainer: {
//     borderWidth: 1,
//     height: height * 0.8,
//     marginTop: 8,
//   },

// })