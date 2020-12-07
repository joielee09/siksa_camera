import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import * as MediaLibrary from 'expo-media-library';
import ViewShot from "react-native-view-shot";
import { Text, View } from 'react-native';
import { captureRef } from "react-native-view-shot";
import ImageMerge from "../../common/utils/ImageMerge";
import { useFonts } from '@use-expo/font'
import { AppLoading } from 'expo';
import { useNavigation } from '@react-navigation/native';

import { API, graphqlOperation } from "aws-amplify";
import { listUserInformations } from "../../../../graphql/queries";
import { ScrollView } from 'react-native-gesture-handler';

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const BtnContainer = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: 10px 0px 0px 0px;
`;
const CameraWrapper = styled.View`
    background-color: pink;
`;
const Category = styled.View`
    background-color: #495464;
    width: ${WIDTH*0.3}px;
    height: 45px;
    margin: 4px 4px 4px 4px;
    opacity: 0.85;
    border-radius: 5px;
`;
const CategoryFilter = styled.View`
    width: 70px;
    height: 35px;
    background-color: white;
    opacity: 0.7;
    position: absolute;
    right: 4px;
    top: 4px;
    align-items: center;
`;
const CategoryFilterText = styled.Text`
    color: black;
    font-size: 25px;
`;
const CategoryText = styled.Text`
    color: white;
    margin: auto auto;
    font-size: 22px;
    font-family: 'NaverFont';
`;
const CategoryContainer = styled.View`
    width: ${WIDTH*0.8}px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    margin: 5px auto 5px auto;
`;
const CodeImage = styled.Image`
    width: 200px;
    height: 200px;
`;
const DateContainerText = styled.Text`
    color: white;
    margin: auto auto;
    font-size: 22px;
    font-family: '';
`;
const DateFilter = styled.View`
    width: 100px;
    height: 30px;
    background-color: white;
    opacity: 0.7;
    position: absolute;
    top:36px;
    margin: 5px 5px 5px 5px;
`;
const DateFilterText = styled.Text`
    color: black;
    font-size: ${WIDTH*0.08}px;
    margin: auto auto;
`;
const EmptyContainer = styled.View`
`;
const EmptyImage = styled.View`
    width:100px;
    height: 100px;
`;
const FlipBtnContainer = styled.View``;
const FilterContainer = styled.View`
    width: ${WIDTH/2}px;
    height: ${HEIGHT/5}px;
    position: absolute;
    top: ${HEIGHT*0.15}px;
    left: ${WIDTH*0.3}px;
`;
const ScreenContainer = styled.View`
    height: ${HEIGHT}px;
`;
const TakeBtnContainer = styled.View``;
const TimeContainerText = styled.Text`
    color: white;
    margin: auto auto;
    font-size: 22px;
    font-family: 'NaverFont';
`;
const TimeFilter = styled.View`
    width: 100px;
    height: 30px;
    background-color: white;
    opacity: 0.7;
    position: absolute;
    margin: 5px 5px 5px 5px;
`;
const TimeFilterText = styled.Text`
    color: black;
    font-size: 20px;
    font-size: ${WIDTH*0.08}px;
    margin: auto auto;
`;
const Wrapper = styled.View`
    height: ${HEIGHT*2}px;
    background-color: #FBF4F1;
`;
const QueryText = styled.Text``;


const App = () => {

    const userInfo = async() => {
        try {
            const UserInformation = await API.graphql(graphqlOperation(listUserInformations));
            const InformationList = (UserInformation.data.listUserInformations.items);
            InformationList.map(cur=>{
                console.log(cur.name)
                setQueryText(cur.name)
            });
        } catch(e) {
            console.log(e);
        }
    }

    const [isReady, setIsReady] = useState(false);
    const loadAssets = async() => {
    }
    const onFinish = () => {
        setIsReady(true);
    }

    const [fontLoaded] = useFonts({
        'NaverFont': require('../../../assets/fonts/naverFont.ttf'),
    });
    
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [filter, setFilter] = useState(0);
    const [category, setCategory] = useState("");
    const [isCategorized, setIsCategorized] = useState(false);
    const cameraRef = useRef();
    const viewShot = useRef("viewShot");
    const viewShot2 = useRef("viewShot2");
    const [curTime, setCurTime] = useState();
    const [curDate, setCurDate] = useState();
    const [isCurTime, setIsCurTime] = useState(false);
    const [isCurDate, setIsCurDate] = useState(false);
    const [isPicture, setIsPicture] = useState(false);
    const [foodImage, setFoodImage] = useState("https://f4.bcbits.com/img/a0523981018_10.jpg");
    let picture = "https://f4.bcbits.com/img/a0523981018_10.jpg";
    const [queryText, setQueryText] = useState("");

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
            if (hasPermission === null) {
                return <View />;
                }
            if (hasPermission === false) {
            return <Text>No access to camera</Text>;
            }
        })();
        }, []);

    const savePhoto = async(uri)=> {
    try{
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if(status==="granted"){
        const asset = await MediaLibrary.createAssetAsync(uri);
        // let album = await MediaLibrary.getAlbumAsync("Siksa");
        // if(album===null){
        // album = await MediaLibrary.createAlbumAsync(
        //     "Siksa",
        //     asset,
        // );
        // return;
        // }
        await MediaLibrary.addAssetsToAlbumAsync([asset])
    } else {
        setHasPermission(null);
    }
    } catch (error) {
    console.log(error);
    }
    };

    const handleCamera = async() => {
        await handleCapture();
        await goToSave();
    }

    const handleCapture = async() => {
        try {
            let res = await captureRef(viewShot, {
                format: 'png',
                height: WIDTH,
                width: WIDTH,
            });
            picture = res;
            console.log(res);
            setFoodImage(res);
        }
        catch(e) {
            console.error(e);
        }
    }

    const handleCapture2 = async() => {
        try {
            if(isPicture){
                let res = await captureRef(viewShot2, {
                    format: 'png',
                    height: HEIGHT/2,
                    width: WIDTH,
                });
                console.log("capture 2 with syn image: ",res);
                savePhoto(res);
            }
            else {
                alert("사진을 찍어주세요");
            }
        }
        catch(snapshotError) {
        console.error(snapshotError);
        }
    }

const handleBreakFast = () => {
    setCategory("아침");
    if(category==="아침") setIsCategorized(!isCategorized);
    else   setIsCategorized(true);
}
const handleLunch = () => {
    setCategory("점심");
    if(category==="점심") setIsCategorized(!isCategorized);
    else   setIsCategorized(true);
}
const handleDinner = () => {
    setCategory("저녁");
    if(category==="저녁") setIsCategorized(!isCategorized);
    else   setIsCategorized(true);
}
const handleSnack = () => {
    setCategory("간식");
    if(category==="간식")  setIsCategorized(!isCategorized);
    else   setIsCategorized(true);
}
const handleTime = async() => {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth())+1;
    const day = new Date().getDate();    
    setCurTime(`${year}/${month}/${day}`);
    setIsCurTime(!isCurTime);
}

const handleDate = async() => {
    const hour = new Date().getHours();
    const min = new Date().getMinutes();
    const sec = new Date().getSeconds();
    setCurDate(`${hour}:${min}:${sec}`);
    setIsCurDate(!isCurDate);
}

const navigation = useNavigation();
const goToCalendar = () => {
    navigation.navigate("Calendar",{});
}
const goToTryAPI = () => {
    navigation.navigate("TryApi",{});
}
const goToSave = () => {
    navigation.navigate("Save",{
        picture,
        filter,
        isCategorized,
        category,
        isCurTime,
        isCurDate,
        curTime,
        curDate,
    })
}

if(fontLoaded) {
    //return
    return (
        <ScrollView>
        <Wrapper>
        <ScreenContainer>

          {/* Camera */}
        <ViewShot
            ref={viewShot}
            options={{ format: "jpg", quality: 0 }}
            style={{ backgroundColor:"#fff" }}
        >
        <CameraWrapper>
        <Camera
            ratio={'1:1'}
            style={{ height:WIDTH, width: WIDTH }} 
            type={type}
            ref={cameraRef}
        ></Camera>
        </CameraWrapper>
        </ViewShot>
    
        {/* Filter */}
        <FilterContainer>
            <TouchableOpacity onPress={()=>setFilter((filter+1)%4)}>
            {filter===0? 
                (
                    <Feather 
                    name="circle" 
                    size={120} 
                    color="#BB1627" 
                    />
                ) : ( filter===1?
                    (
                        <Feather 
                        name="triangle" 
                        size={120} 
                        color="#492F70" 
                        />
                    ) : (filter===2?
                    (
                        <Feather 
                        name="x" 
                        size={150} 
                        color="#0A773E"
                        style={{ top:-15, left:-15 }}
                        />
                    ) : (
                        <EmptyImage></EmptyImage>
                    )
                    )
                )
            }
            </TouchableOpacity>
        </FilterContainer>
    
          {/* Siksa Category */}
        {isCategorized?
        (
            <CategoryFilter>
            <CategoryFilterText style={{ fontFamily: 'NaverFont' }} >{category}</CategoryFilterText>
            </CategoryFilter>
        ) : (
            <EmptyContainer></EmptyContainer>
        )}
    
        {/* Siksa Time */}
        {isCurTime? (
            <TimeFilter>
                <TimeFilterText style={{ fontFamily: 'NaverFont' }} >{curTime}</TimeFilterText>
            </TimeFilter>
        ) : (
            <EmptyContainer></EmptyContainer>
        )}
    
        {/* Siksa Date */}
        {isCurDate? (
            <DateFilter>
                <DateFilterText style={{ fontFamily: 'NaverFont' }} >{curDate}</DateFilterText>
            </DateFilter>
        ) : (
            <EmptyContainer></EmptyContainer>
        )}
    
        {/* Category Btns */}
        <CategoryContainer>
            {/* Get Breakfast Category */}
            <TouchableOpacity onPress={userInfo}>
            <Category style={{ backgroundColor: '#036139' }} >
            <CategoryText style={{ fontFamily: 'NaverFont' }} >아침</CategoryText>
            </Category>
            </TouchableOpacity>
            {/* Get Lunch Category */}
            <TouchableOpacity onPress={handleLunch}>
            <Category style={{ backgroundColor: '#036139' }} >
            <CategoryText style={{ fontFamily: 'NaverFont' }}>점심</CategoryText>
            </Category>
            </TouchableOpacity>
            {/* Get Dinner Category */}
            <TouchableOpacity onPress={handleDinner}>
            <Category style={{ backgroundColor: '#036139' }} >
            <CategoryText style={{ fontFamily: 'NaverFont' }} >저녁</CategoryText>
            </Category>
            </TouchableOpacity>
            {/* Get Snack Category */}
            <TouchableOpacity onPress={handleSnack}>
            <Category style={{ backgroundColor: '#036139' }} >
            <CategoryText style={{ fontFamily: 'NaverFont' }} >간식</CategoryText>
            </Category>
            </TouchableOpacity>
            {/* Get Current Time */}
            <TouchableOpacity onPress={handleDate}>
            <Category style={{ backgroundColor: '#495464' }} >
            <TimeContainerText style={{ fontFamily: 'NaverFont' }} >시간</TimeContainerText>
            </Category>
            </TouchableOpacity>
            {/* Get Current Date */}
            <TouchableOpacity onPress={handleTime}>
            <Category style={{ backgroundColor: '#495464' }} >
            <DateContainerText style={{ fontFamily: 'NaverFont' }}>날짜</DateContainerText>
            </Category>
            </TouchableOpacity>
            <QueryText>{queryText}</QueryText>
        </CategoryContainer>
    
        <BtnContainer>
          {/* Camera Direction */}
        <FlipBtnContainer>
            <TouchableOpacity onPress={goToTryAPI}>
            {/* <TouchableOpacity onPress={()=>alert("칼로리 계산기는 준비중입니다! :)")}> */}
                <Entypo name="calculator"  size={40} color='#495464' />
            </TouchableOpacity>
            {/* <TouchableOpacity
            onPress={() => {
                setType(
                type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
            }}>
            <MaterialCommunityIcons
                name={
                    type === Camera.Constants.Type.front
                    ? "cellphone-android"
                    : "camera-front-variant"
                }
                color='#495464'
                size={35}
            />
            </TouchableOpacity> */}
        </FlipBtnContainer>
    
        <TakeBtnContainer>
        <TouchableOpacity onPress={handleCamera}>
            <Entypo name="camera"  size={40} color='#495464' />
        </TouchableOpacity>
        </TakeBtnContainer>
        <TakeBtnContainer>
            <TouchableOpacity onPress={goToCalendar}>
            <AntDesign name="calendar" size={40} color='#495464' />
            </TouchableOpacity>
        </TakeBtnContainer>
        </BtnContainer>
        
        </ScreenContainer>
    
        {/* ---------------------- Invisible ---------------------- */}
        <ViewShot
            ref={viewShot2}
            options={{ format: "jpg", quality: 1 }}
            style={{ backgroundColor:"#fff" }}
        >
        <ImageMerge 
            uri={foodImage}
            filter={filter}
            isCategorized={isCategorized}
            category={category}
            isCurTime={isCurTime}
            isCurDate={isCurDate}
            curTime={curTime}
            curDate={curDate}
        />
        </ViewShot>
        </Wrapper>
        </ScrollView>
    );
    //return
} else {
    return(
        <AppLoading 
            startAsync={loadAssets}
            onFinish={onFinish}
            onError={console.error}
        />
    )
}


}
export default App;