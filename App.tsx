import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
 
export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
 
  return (
    <>
      <StatusBar style="light" />
      {isLoading ? (
        <SplashScreen onFinish={() => setIsLoading(false)} />
      ) : (
        <HomeScreen />
      )}
    </>
  );
}
 