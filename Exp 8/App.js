// App.js
import "react-native-gesture-handler";
import React, { useState } from "react";
import { Text, View, Button, TextInput, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

// Placeholder Screens
function TaskPendingScreen({ navigation }) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>No Tasks Pending ✅</Text>
      <Button title="Open Drawer" onPress={() => navigation.openDrawer()} />
    </View>
  );
}

function FilesToPrintScreen({ navigation }) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>No Files to Print 📄</Text>
      <Button title="Open Drawer" onPress={() => navigation.openDrawer()} />
    </View>
  );
}

// Profile Screen with Inline Editing
function ProfileScreen({ navigation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Sarthak Sherekar",
    college: "Goa College of Engineering (GEC)",
    course: "Bachelors in Information & Technology Engineering",
    year: "2nd Year, 3rd Sem",
  });

  return (
    <View style={styles.center}>
      <View style={styles.card}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
            />
            <TextInput
              style={styles.input}
              value={profile.college}
              onChangeText={(text) => setProfile({ ...profile, college: text })}
            />
            <TextInput
              style={styles.input}
              value={profile.course}
              onChangeText={(text) => setProfile({ ...profile, course: text })}
            />
            <TextInput
              style={styles.input}
              value={profile.year}
              onChangeText={(text) => setProfile({ ...profile, year: text })}
            />
            <Button title="Save" onPress={() => setIsEditing(false)} />
          </>
        ) : (
          <>
            <Text style={styles.info}>👤 {profile.name}</Text>
            <Text style={styles.info}>🏫 {profile.college}</Text>
            <Text style={styles.info}>📚 {profile.course}</Text>
            <Text style={styles.info}>🎓 {profile.year}</Text>
            <Button title="Edit" onPress={() => setIsEditing(true)} />
          </>
        )}
      </View>
      <Button title="Open Drawer" onPress={() => navigation.openDrawer()} />
    </View>
  );
}

// Bottom Tabs
const Tab = createBottomTabNavigator();
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: "center",
        tabBarIcon: ({ color, size, focused }) => {
          let name = "home-outline";
          if (route.name === "Task Pending") name = focused ? "list" : "list-outline";
          if (route.name === "Files to be Printed") name = focused ? "document" : "document-outline";
          if (route.name === "Profile") name = focused ? "person" : "person-outline";
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Task Pending" component={TaskPendingScreen} />
      <Tab.Screen name="Files to be Printed" component={FilesToPrintScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Custom Drawer Content with Header
function CustomDrawerContent(props) {
  const profileInfo = {
    name: "Sarthak Sherekar",
    college: "Goa College of Engineering (GEC)",
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerName}>{profileInfo.name}</Text>
        <Text style={styles.drawerCollege}>{profileInfo.college}</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

// Drawer Navigator
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="HomeTabs"
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{ headerShown: true }}
        >
          <Drawer.Screen name="HomeTabs" component={Tabs} options={{ title: "Home" }} />
          <Drawer.Screen name="Settings" component={() => <View style={styles.center}><Text>Settings Placeholder ⚙️</Text></View>} />
          <Drawer.Screen name="About App" component={() => <View style={styles.center}><Text>About App Placeholder ℹ️</Text></View>} />
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

// Styles
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "600" },
  card: {
    width: "90%",
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    gap: 10,
    marginBottom: 20,
  },
  info: { fontSize: 18, marginBottom: 5 },
  input: { borderWidth: 1, padding: 8, borderRadius: 5, backgroundColor: "white" },
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  drawerName: { fontSize: 18, fontWeight: "bold" },
  drawerCollege: { fontSize: 14, color: "#555" },
});
