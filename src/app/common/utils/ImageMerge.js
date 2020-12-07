import React, { useEffect } from 'react';
import styled from "styled-components/native";
import { Dimensions } from "react-native";
import ImageOverlay from "react-native-image-overlay";
import { useFonts } from '@use-expo/font';
import { Feather } from '@expo/vector-icons'; 

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const Wrapper = styled.View``;
const Image = styled.Image`
    width: ${WIDTH}px;
    height: ${HEIGHT/2}px;
`;
const EmptyContainer = styled.View``;
const CategoryFilter = styled.View`
    width: 70px;
    height: 30px;
    background-color: white;
    opacity: 0.7;
    position: absolute;
    right: 4px;
    top: 4px;
    align-items: center;
`;
const CategoryFilterText = styled.Text`
    color: black;
    font-size: ${WIDTH*0.08}px;
`;

const TimeFilter = styled.View`
    width: 100px;
    height: 30px;
    background-color: white;
    opacity: 0.7;
    position: absolute;
    left: 0px;
    top: 0px;
    margin: 5px 5px 5px 5px;
`;
const TimeFilterText = styled.Text`
    color: black;
    font-size: 20px;
    font-size: ${WIDTH*0.08}px;
    margin: auto auto;
`;
const DateFilter = styled.View`
    width: 100px;
    height: 30px;
    background-color: white;
    opacity: 0.7;
    position: absolute;
    left: 0px;
    top: 36px;
    margin: 5px 5px 5px 5px;
`;
const DateFilterText = styled.Text`
    color: black;
    font-size: ${WIDTH*0.08}px;
    margin: auto auto;
`;

const Convert = ({ 
    uri, 
    filter, 
    isCategorized, 
    category,
    isCurTime,
    isCurDate,
    curTime,
    curDate, 
}) => {

    const [fonts] = useFonts({
        'NaverFont': require('../../../assets/fonts/naverFont.ttf'),
    });

    return (
    <Wrapper>
    <ImageOverlay
        source={{ uri:uri }}
        height={HEIGHT/2}
        width={WIDTH}
        overlayAlpha={0}
    >
        <>
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
                    />
            ) : (
                <EmptyContainer></EmptyContainer>
            )))}   
            

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

        </>
    </ImageOverlay>
    </Wrapper>
    );
}

export default Convert;