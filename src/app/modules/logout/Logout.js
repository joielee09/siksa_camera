import React from 'react';
import styled from "styled-components/native";
import { Dimensions } from "react-native";
import axios from "axios";
import { TouchableOpacity } from 'react-native-gesture-handler';

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const Text = styled.Text``;
const Wrapper = styled.View``;
const Btn = styled.View`
  width: 100px;
  height: 100px;
  background-color: pink;
`;
const BtnText = styled.Text``;

const Logout = () => {
  
  const handleAxios = async() => {
    console.log("handleAxios!!!");
    await axios.get('http://localhost:3000/login')
    .then((res)=>console.log(res))
    .catch((error)=>console.log(error));
  }

  return (
    <Wrapper>
      <Text>This is Logout Page@</Text>
      <TouchableOpacity onPress={handleAxios}>
      <Btn><BtnText>handle Axios</BtnText></Btn>
      </TouchableOpacity>
    </Wrapper>
  );
};

export default Logout;