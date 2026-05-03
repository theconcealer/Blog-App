
import { Stack } from 'expo-router'

export default function authlayout()  {
  return (
    <Stack>

      <Stack.Screen name= "login" options={{headerShown: false}}/>
      <Stack.Screen name="signup" options={{headerShown: false}}/>

      <Stack.Screen name="otpggit " options={{headerShown: false}}/>


    </Stack>
  )
};