
import { Stack } from 'expo-router'
import modal from './modal'

export default function Rootlayout()  {
  return (
    <Stack>

      <Stack.Screen name= "index" options={{headerShown: false}}/>
      

      <Stack.Screen name="(tabs)" options={{headerShown: false}}/>

      <Stack.Screen name="auth" options={{headerShown: false}}/>

      <Stack.Screen name="modal" options={{headerShown: false, presentation: "transparentModal",}}/>



    </Stack>
  )
};


