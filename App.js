import React, { useState, useEffect } from 'react';
import Stack  from './src/index';
import { AppLoading } from 'expo';
import { NavigationContainer } from "@react-navigation/native";

const App = () => {
  
  const [isReady, setIsReady] = useState(false);
  const loadAssets = async() => {}
  const onFinish = () => setIsReady(true);

  return isReady? (
    <>
    <NavigationContainer>
      <Stack />
    </NavigationContainer>
    </>
  ) : (
    <AppLoading 
      startAsync={loadAssets}
      onFinish={onFinish}
      onError={console.error}
    />
  )
};

export default App;