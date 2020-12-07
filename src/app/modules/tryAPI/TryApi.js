import React, { useEffect, useState } from 'react';
import styled from "styled-components/native";
import { Dimensions, TextPropTypes } from "react-native";
import { API, graphqlOperation } from 'aws-amplify';
import { listUserInformations, getUserInformation, listPictures } from '../../../../graphql/queries';
import { createPicture, createUserInformation, updateUserInformation, deleteUserInformation } from '../../../../graphql/mutations';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import Amplify, { Auth } from 'aws-amplify';
import * as Permissions from 'expo-permissions';
import { CurrentUser } from '../../common/graphql/index';
import { listPictures_ } from '../../common/graphql/index';
import { uploadPicturesToS3 } from '../../common/graphql/index';
import Storage from '@aws-amplify/storage';
import awsconfig from '../../../../aws-exports';
Amplify.configure(awsconfig);

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const Empty = styled.View`
    height: 200px;
    width: 200px;
`;
const Text = styled.Text``;
const Wrapper = styled.View``;
const UserNameText = styled.Text`
    border: 1px solid black;
    margin: 10px;
`;
const UserWeightText = styled.Text`
    border: 1px solid black;
    margin: 10px;
`;
const UserHeightText = styled.Text`
    border: 1px solid black;
    margin: 10px;
`;
const Btn = styled.View`
    width: 100px;
    height: 100px;
    background-color: pink;
    margin: 10px;
`;
const BtnText = styled.Text``;
const UserInfoWrapper = styled.View`
    border: 1px solid black;
    background-color: lime;
`;
const UserInput = styled.View`
    border: 1px solid black;
    background-color: pink;
`;
const NameInput = styled.TextInput`
    border: 1px solid black;
    margin: 10px;
`;
const HeightInput = styled.TextInput`
    border: 1px solid black;
    margin: 10px;
`;
const WeightInput = styled.TextInput`
    border: 1px solid black;
    margin: 10px;
`;
const Picture = styled.Image`
    width: 200px;
    height: 200px;
`;


const Try = () => {

    const removeImageFromS3 = async (key) => {
        // const res = await Storage.remove('e8b3f656-d144-45a8-a117-24575ebf2449.jpg1010jpg');
        console.log("removal success! ",res);
    }

    const storageConfigure = async()=>{
        const res = await Storage.list('');
        res.map(cur=> {
            console.log("key of each file: ",cur.key);
        })
    }

    const [picUri, setPicUri] = useState();
    const storageGet = async() => {
        const tmp = await Storage.get(
            'e8b3f656-d144-45a8-a117-24575ebf2449.jpg1010jpg', 
            { level: 'public' }
        );
        setPicUri(tmp);
        console.log(tmp);
    }





    const handlePictures = async() => {
        await listPictures_();
    }

    const [name, setName] = useState("");
    const [height, setHeight] = useState();
    const [weight, setWeight] = useState();

    const userInfo = {
        name: 'Lizzet',
        height: 169,
        weight: 72
    }

    const createInfo = async() => {
        try {
            console.log('created a new user');
            await API.graphql(graphqlOperation(
                createUserInformation, 
                {input: userInfo})
            );
        } catch(e) {
            console.log(e);
        }
    }
    const listInfo = async() => {
        try {
            const UserInformation = await API.graphql(graphqlOperation(listUserInformations));
            const InformationList = (UserInformation.data.listUserInformations.items);
            // InformationList.map(cur=>{
            //     console.log(cur.name)
            // });
        } catch(e) {
            console.log(e);
        }
    }

    const userUpdate = {
        id:'475fd10e-6466-4793-81bf-599e0d3e69ef',
        weight: 45
    }
    const updateInfo = async() => {
        try {
            console.log("user information updated")
            await API.graphql(graphqlOperation(updateUserInformation, {input: userUpdate}));
        } catch(e) {
            console.log(e)
        }
    }

    const userToDelete = {
        id: 'b3468d6a-569a-4499-9b34-73b88d7cf41c'
    }
    const deleteInfo = async() => {
        try {
            console.log("deleted the user");
            await API.graphql(graphqlOperation(deleteUserInformation, {input: userToDelete}))
        } catch(e) {
            console.log(e);
        }
    }

    const userId = {
        id: '475fd10e-6466-4793-81bf-599e0d3e69ef'
    }
    const oneUser = async() => {
        try {
            const user = await API.graphql(graphqlOperation(getUserInformation, {id: '475fd10e-6466-4793-81bf-599e0d3e69ef'}))
            console.log(user);
            setName(user.data.getUserInformation.name);
            setHeight(user.data.getUserInformation.height);
            setWeight(user.data.getUserInformation.weight);
        } catch(e) {
            console.log(e);
        }
    }

    let pictures=[];
    const [isReady, setIsReady] = useState(false);
    const [uri, setUri] = useState('https://ichef.bbci.co.uk/news/1024/cpsprodpb/151AB/production/_111434468_gettyimages-1143489763.jpg')
    const ListPicture = async() => {
        try {
            const data = await API.graphql(graphqlOperation(listPictures));
            pictures = await data.data.listPictures.items;
            // pictures.map(cur=> {
            //     console.log('each picture: ',cur);
            //     setUri(cur);
            // })
        } catch(e) {
            console.log('error ', e);
        }
    }
    const pictureInfo = {
        file : {
            bucket: 'client3-assets20104-dev',
            key: 'mulan22.png',
            region: 'ap-northeast-2',
            uri: 'https://client3-assets20104-dev.s3.ap-northeast-2.amazonaws.com/mulan.png'
        },
        username: 'jaeyounglee22'
    };
    const CreatePicture = async() => {
        try {
            await API.graphql(graphqlOperation(
                createPicture,
                {input:{
                    id: 'jaeyoungID88',
                    userId: 'jaeyoungIDD88',
                    username:'jaeyoungeee88',
                    file: {
                        bucket: 'client3-assets20104-dev',
                        key: 'challenge.png',
                        region: 'ap-northeast-2',
                        uri: 'https://media.istockphoto.com/photos/development-attainment-motivation-career-growth-concept-mans-hand-picture-id922618410?k=6&m=922618410&s=612x612&w=0&h=ECbgRD9eIRM1M6dUiNu9m42S7FRPId0KU6cCcBnC3CE='
                    }
                }})
            );
            console.log('create picture');
        } catch(e) {
            console.log(e);
        }
    };
    const getCurUser = async() => {
        try {
          const curUser = await Auth.currentAuthenticatedUser();
        //   setUserid(curUser.attributes.sub);
          setUsername(curUser.attributes.email.split('@')[0]);
        } catch(e) {
          console.log("userError: ", e);
        }
        ListPicture();
      };

    useEffect(() => {
        getCurUser();
    }, [])

    return (
    <ScrollView>
    <Wrapper>

        <Empty />
        <UserInput>
            <NameInput />
            <HeightInput />
            <WeightInput />
        </UserInput>

        <Picture 
            source={{ uri: picUri }}
        />
        <UserInfoWrapper>
            <UserNameText>{name}</UserNameText>
            <UserHeightText>{height}</UserHeightText>
            <UserWeightText>{weight}</UserWeightText>
        </UserInfoWrapper>

        <TouchableOpacity onPress={removeImageFromS3}>
        <Btn><BtnText>removeImageFromS3</BtnText></Btn>
        </TouchableOpacity>

        <TouchableOpacity onPress={storageConfigure}>
        <Btn><BtnText>storageConfigure</BtnText></Btn>
        </TouchableOpacity>

        <TouchableOpacity onPress={storageGet}>
        <Btn><BtnText>storageGet</BtnText></Btn>
        </TouchableOpacity>

        <TouchableOpacity onPress={deleteInfo}>
        <Btn><BtnText>deleteInfo</BtnText></Btn>
        </TouchableOpacity>

        <TouchableOpacity onPress={oneUser}>
        <Btn><BtnText>oneUser</BtnText></Btn>
        </TouchableOpacity>

        <TouchableOpacity onPress={ListPicture}>
        <Btn><BtnText>list Picture</BtnText></Btn>
        </TouchableOpacity>

        {/* <Picture 
            source={{ uri:uri }}
        /> */}

        {
            isReady? 
                pictures.map(cur=>{
                    // console.log("uri: ", cur);
                    // <Picture 
                    //     source={{ uri:cur.file.uri }}
                    // />
                })
             : ( 
                <Text>로딩안됨</Text>
            )
        }

        

        <TouchableOpacity onPress={CreatePicture}>
        <AntDesign name="camera" size={100} color="black" />
        </TouchableOpacity>

    </Wrapper>
    </ScrollView>
);
};

export default Try;