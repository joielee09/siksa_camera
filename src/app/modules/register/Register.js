import React, { useState } from 'react';
import styled from "styled-components/native";
import { Dimensions } from "react-native";

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const Text = styled.Text``;
const Wrapper = styled.View``;
const UserIdContainer = styled.View``;
const UserIdInput = styled.TextInput`
  border: 0.5px black solid;
  height: 40px;
  width: ${WIDTH/2}px;
  margin-top: 10px;
`;
const UserPasswordContainer = styled.View``;
const UserPasswordInput = styled.TextInput`
  border: 0.5px black solid;
  height: 40px;
  width: ${WIDTH/2}px;
  margin-top: 10px;
`;
const NameContainer = styled.View``;
const NameInput = styled.TextInput`
  border: 0.5px black solid;
  height: 40px;
  width: ${WIDTH/2}px;
  margin-top: 10px;
`;
const EmailContainer = styled.View``;
const EmailInput = styled.TextInput`
  border: 0.5px black solid;
  height: 40px;
  width: ${WIDTH/2}px;
  margin-top: 10px;
`;

const Login = () => {
  
  const [userId, onChangeUserId] = useState();
  const [userPassword, onChangeuserPassword] = useState();
  const [name, onChangeName] = useState();
  const [email, onChangeEmail] = useState();

  return (
    <Wrapper>
      <UserIdContainer>
        <UserIdInput 
          placeholder="아이디를 입력하세요."
          onChangeText={text=>onChangeUserId(text)}
          value={userId}
        />
      </UserIdContainer>
      <UserPasswordContainer>
        <UserPasswordInput
          placeholder="비밀번호를 입력하세요."
          onChangeText={text=>onChangeuserPassword(text)}
          value={userPassword}
        />
      </UserPasswordContainer>
      <NameContainer>
        <NameInput 
          placeholder="이름을 입력하세요."
          onChangeText={text=>onChangeName(text)}
          value={name}
        />
      </NameContainer>
      <EmailContainer>
        <EmailInput 
          placeholder="이메일을 입력하세요."
          onChangeText={text=>onChangeEmail(text)}
          value={email}
        />
      </EmailContainer>
    </Wrapper>
  );
};

export default Login;