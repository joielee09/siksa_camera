import React, { useState, useEffect } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import MainPage from "./app/modules/camera/Main";
import Save from "./app/modules/save/SavePhoto";
import TryApi from "./app/modules/tryAPI/TryApi";
import Calendar from "./app/modules/calendar/Calendar3";
import styled from "styled-components/native";
import Amplify, { Auth, Hub } from 'aws-amplify';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Linking, Platform, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import awsconfig from '../aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';
import { SimpleLineIcons } from '@expo/vector-icons';

const HeaderText = styled.Text`
`;
const Container = styled.Text`
  flex-direction: row;
  flex-wrap: wrap;
`;
const SwitchContainer = styled.View`
`;
const Stack = createStackNavigator();
async function urlOpener(url, redirectUrl) {
  const { type, url: newUrl } = await WebBrowser.openAuthSessionAsync(
      url,
      redirectUrl
  );

  if (type === 'success' && Platform.OS === 'ios') {
      WebBrowser.dismissBrowser();
      return Linking.openURL(newUrl);
  }
}
Amplify.configure({
  ...awsconfig,
  oauth: {
      ...awsconfig.oauth,
      urlOpener,
  },
});

const Screens = () => {
  const signUp = async() => {
    try {
      const user = await Auth.signIn(username, password);
    } catch (e) {
      console.log(e);
    }
  }
  const signOut = async() => {
    try {
      await Auth.signOut();
    } catch (e) {
      console.log(e);
    }
  }

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(!isEnabled);

  const [user, setUser] = useState(null);

  useEffect(() => {
      Hub.listen('auth', ({ payload: { event, data } }) => {
          switch (event) {
              case 'signIn':
                  getUser().then((userData) => setUser(userData));
                  break;
              case 'signOut':
                  setUser(null);
                  break;
              case 'signIn_failure':
              case 'cognitoHostedUI_failure':
                  console.log('Sign in failure', data);
                  break;
          }
      });

      getUser().then((userData) => setUser(userData));
  }, []);

    function getUser() {
        return Auth.currentAuthenticatedUser()
            .then((userData) => userData)
            .catch(() => console.log('Not signed in'));
    }

  return(
    <Stack.Navigator
    screenOptions={{
      headerTitle:"",
      headerStyle: {
        backgroundColor: '#FBF4F1'
      },
      headerRight: () => 
      user? (
      <TouchableOpacity onPress={() => Auth.signOut()}>
        <SimpleLineIcons name="logout" size={24} color="black" />
      </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => Auth.federatedSignIn()}>
        <SimpleLineIcons name="login" size={24} color="black" />
      </TouchableOpacity>
      )
    }}
    >
    
    <Stack.Screen

    // automatic save for future 
    options={{ 
      // headerRight: () => (
        // <Container>
        // <Entypo name="save" size={18} color="#495464" />
        // <SwitchContainer>        
        // <Switch 
        //   trackColor={{ false: 'lightgray', true: 'lightgray' }}
        //   thumbColor={isEnabled ? '#7BBC9B' : '#495464'}
        //   ios_backgroundColor="#495464"
        //   onValueChange={toggleSwitch}
        //   value={isEnabled}
          
        // />
        // </SwitchContainer>
        // </Container>
      // )
    }}
    name="Main" 
    component={MainPage} 
    />
    <Stack.Screen  name="Calendar" component={Calendar} />
    <Stack.Screen  name="TryApi" component={TryApi} />
    <Stack.Screen name="Save" component={Save} />
    </Stack.Navigator>
  )
};

// export default withAuthenticator(Screens, false);
export default Screens;