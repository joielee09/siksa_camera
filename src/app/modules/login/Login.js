import React from 'react';
import styled from 'styled-components/native';
import { SignIn } from "aws-amplify-react";

const Wrapper = styled.View``;
const Text = styled.Text``;

const Login = () => {
  return(
    <Wrapper>
      <Text> This is Login Page. </Text>
    </Wrapper>
  );
}

export default Login;