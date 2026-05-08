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
    tabBarIcon: ({size, color}) => <FontAwesome name = "home" size={size} color={color} />
 }} />

 <Tabs.Screen name="search" options={{
    headerShown: false,
    tabBarIcon: ({size, color}) => <FontAwesome name = "search" size={size} color={color} />
 }} />


 <Tabs.Screen name="saved" options={{
    headerShown: false,
    tabBarIcon: ({size, color}) => <FontAwesome name = "bookmark" size={size} color={color} />
 }} />


 <Tabs.Screen name="profile" options={{
    headerShown: false,
    tabBarIcon: ({size, color}) => <FontAwesome name = "user" size={size} color={color} />
 }} />



 
 </Tabs>
 );
}