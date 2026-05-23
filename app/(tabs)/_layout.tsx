import { Tabs } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function TabLayout() {
 return (
 <Tabs
 screenOptions={({ route }) => ({
 headerShown: false,

  tabBarActiveTintColor: "dodgerblue", // color for active tab
  tabBarInactiveTintColor: "#b8b3b3", // color for inactive tab

 tabBarIcon: ({ size }) => {
 const name = route.name === "home" ? "home" : "settings";
 return <Ionicons name={name} size={size} />;
 },

// styling the NavBar: you ensure you call the "tabBarStyle" inside the screen options open it with a curly bracket and style inside

 tabBarStyle: {
    
 }

 })}
 >
<Tabs.Screen
                name="index"
                options={{
                    href: null
                }}
            />

 <Tabs.Screen name="home" options={{
    headerShown: false,
    tabBarIcon: ({size, color}) => <Ionicons name = "home" size={size} color={color} />
 }} />

 {/* <Tabs.Screen name="search" options={{
    headerShown: false,
    tabBarIcon: ({size, color}) => <Ionicons name = "search" size={size} color={color} />
 }} /> */}


 <Tabs.Screen name="saved" options={{
    headerShown: false,
    tabBarIcon: ({size, color}) => <Ionicons name = "bookmark-outline" size={size} color={color} />
 }} />


 <Tabs.Screen name="settings" options={{
    headerShown: false,
    tabBarIcon: ({size, color}) => <Ionicons name = "settings-outline" size={size} color={color} />
 }} />



 
 </Tabs>
 );
}