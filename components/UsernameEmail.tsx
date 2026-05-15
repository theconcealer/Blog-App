import { StyleSheet, Text, View } from 'react-native'
import React from 'react'



// Props for username and email in settings
type Props = {
  username: string,
  email: string,
}

const UsernameEmail = (props: Props) => {
  return (
    <View style={styles.userInfo}>
      <Text style={styles.username}>{props.username}</Text>
      <Text style={styles.email}>{props.email}</Text>
    </View>
  )
}

export default UsernameEmail

const styles = StyleSheet.create({

    userInfo:{
        // borderWidth: 1,
        padding: 4,
        flexDirection: 'column',
        gap: 4,
    },

    username:{
        width: 'auto',
        fontSize: 18,
        lineHeight: 27,
        fontWeight: 600,
        color: '#1e1e1e',
    },

    email: {
        width: 'auto',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: 400,
        color: '#58595c',    
    }
})