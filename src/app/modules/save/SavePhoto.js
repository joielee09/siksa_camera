import React, { useRef, useState, useEffect } from 'react';
import styled from "styled-components/native";
import { Dimensions, Alert, Button } from "react-native";
import ImageMerge from "../../common/utils/ImageMerge";
import * as MediaLibrary from 'expo-media-library';
import { TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons'; 
import { useFonts } from '@use-expo/font'
import { AppLoading } from 'expo';
import ViewShot from "react-native-view-shot";
import { captureRef } from "react-native-view-shot";
import * as Linking from 'expo-linking';
import { API, graphqlOperation } from 'aws-amplify';
import { createPicture } from '../../../../graphql/mutations';
import { v4 as uuid } from 'uuid';
import Storage from '@aws-amplify/storage';
import AWSCONFIG from '../../../../aws-exports';
import Amplify, { Auth } from 'aws-amplify';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Mutation from '../../../../graphql/mutations';
import { Buffer } from 'buffer';
import { uploadPicturesToS3 } from '../../common/graphql/index';
import { useNavigation } from '@react-navigation/native';


const WIDTH = Dimensions.get("screen").width;

const HEIGHT = Dimensions.get("screen").height;

const Wrapper = styled.View`
    height: ${HEIGHT}px;
    background-color: #FBF4F1;
`;
const TakeBtnContainer = styled.View`
    width: ${WIDTH*0.4}px;
    height: 60px;
    background-color: #036139;
    opacity: 0.85;
    border-radius: 3px;
    margin: 20px auto 0px auto;
    flex-direction: row;
    padding: 15px;
`;
const BtnText = styled.Text`
    font-size: 20px;
    color: white;
    margin: auto;
`;
const IconContainer = styled.View`
`;

const Save = ({ 
    route:{
        params
    }
}) => {
    const navigation = useNavigation();
    const {
        picture,
        filter,
        isCategorized,
        category,
        isCurTime,
        isCurDate,
        curTime,
        curDate
    } = params;

    useFonts({
        'NaverFont': require('../../../assets/fonts/naverFont.ttf'),
    });
    const [isReady, setIsReady] = useState(false);
    const viewShot2 = useRef("viewShot2");


    const saveAlert = () => {
        Alert.alert(
            "",
            "✔ saved!!! ",
            [
                { text: "OK", onPress: () => navigation.goBack() }
            ],
            { cancelable: false }
        );
    };

    const handleSave = async() => {
        try {
            let res = await captureRef(viewShot2, {
                format: 'png',
                height: HEIGHT/2,
                width: WIDTH,
            });
            await console.log("capture 2 with syn image: ",res);
            uploadToS3(res);
        }
        catch(e) {
            console.error(e);
        }
    }
    const loadAssets = () => {};
    const onFinish = () => {
        setIsReady(true);
    };

    const uploadToS3 = async(image) => {
        // key for storage
        const key = uuid() + '.jpg1010jpg';
        try {
            const res = await fetch(image);
            console.log("res: ", res);
            const blob = await res.blob();
            Storage.put( key ,  blob ,{
                contentType: 'image/png',
            }).then((res)=> {
                const bucket = `${AWSCONFIG.aws_user_files_s3_bucket}/public/`;
                const region = AWSCONFIG.aws_user_files_s3_bucket_region;
                const uri = image;
                const file = { bucket, region, key, uri };
                API.graphql(graphqlOperation(Mutation.createPicture, {
                    input: {
                        // id for api
                        id: key,
                        userId: '1010',
                        username: '1010',
                        file: file
                    }
                }));
            })
        } catch (e) {
            console.log(e);
        }
    }

if(isReady){
    return (
        <Wrapper>
        <ViewShot
            ref={viewShot2}
            options={{ format: "jpg", quality: 1 }}
            style={{ backgroundColor:"#fff" }}
        >
        <ImageMerge 
            uri={picture}
            filter={filter}
            isCategorized={isCategorized}
            category={category}
            isCurTime={isCurTime}
            isCurDate={isCurDate}
            curTime={curTime}
            curDate={curDate}
        />
        </ViewShot>

        <TouchableOpacity onPress={()=>{
            saveAlert();
            handleSave();
        }}>
        <TakeBtnContainer>
            <BtnText style={{ fontFamily: 'NaverFont' }} >저장  </BtnText>
            <Entypo name="save"  size={30} color='white'/>
        </TakeBtnContainer>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{
            uploadPicturesToS3();
        }}>
        <TakeBtnContainer>
            <BtnText style={{ fontFamily: 'NaverFont' }} >저장&기록  </BtnText>
            <Entypo name="instagram" size={30} color="white" />
        </TakeBtnContainer>
        </TouchableOpacity>

        </Wrapper>
    )
} else {
    return(
        <AppLoading 
        startAsync={loadAssets}
        onFinish={onFinish}
        onError={console.error}
        />
    )
}};

export default Save;

    // const savePhoto = async(uri)=> {
    //     try{
    //         const { status } = await MediaLibrary.requestPermissionsAsync();
    //         if(status==="granted"){
    //             const asset = await MediaLibrary.createAssetAsync(uri);
    //             let album = await MediaLibrary.getAlbumAsync("Siksa");
    //             if(album===null){
    //                 album = await MediaLibrary.createAlbumAsync(
    //                     "Siksa",
    //                     asset,
    //                 );
    //                 return;
    //             }
    //             else await MediaLibrary.addAssetsToAlbumAsync([asset], "");
    //         } else {
    //             setHasPermission(null);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };