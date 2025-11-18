import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Home from './screens/Home';
import Results from './screens/Results';
import Guide from './screens/Guide';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={Home} options={{ title: 'AssuMement Navigator' }} />
        <Stack.Screen name="Results" component={Results} />
        <Stack.Screen name="Guide" component={Guide} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
