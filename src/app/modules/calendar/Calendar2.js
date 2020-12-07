import React, { Component, useEffect } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Agenda, Calendar } from 'react-native-calendars';
import { API, graphqlOperation } from 'aws-amplify';
import { listPictures } from '../../../../graphql/queries';
import { deleteUserInformation } from '../../../../graphql/mutations';
import styled from 'styled-components/native';
import { AntDesign } from '@expo/vector-icons';

const Picture = styled.Image`
    width: 100px;
    height: 100px;
`;
const DeleteBtn = styled.View`
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: lightpink;
    width: 40px;
    height: 40px;
    padding-left: 7px;
    padding-top: 7px;
`;

let pictures=[];
let uri="";
const ListPicture = async() => {
try {
    const data = await API.graphql(graphqlOperation(listPictures));
    pictures = await data.data.listPictures.items;
    pictures.map(cur=> {
        console.log('uri: ', cur);
        uri = cur.file.uri;
    })
    console.log("picture listed!");
} catch(e) {
    console.log('error ', e);
}
};

const userToDelete = {
    id: 'jaeyoungID77'
    };
    const deleteInfo = async() => {
    try {
        console.log("item deleted!!!");
        await API.graphql(graphqlOperation(deleteUserInformation, {input: userToDelete}))
    } catch(e) {
        console.log(e);
    }
};
const handleDelete = () => {
};



const Calnendar = () => {

    
    let  items= {};

    const loadItems = (day) => {
        setTimeout(() => {
        for (let i = -30; i < 85; i++) {
            const time = day.timestamp + i * 24 * 60 * 60 * 1000;
            const strTime = timeToString(time);
            if (!items[strTime]) {
            items[strTime] = [];
            const numItems = pictures.length;
            for (let j = 0; j < numItems; j++) {
                if(pictures[j].createdAt.slice(0,10)===strTime){
                items[strTime].push({
                    name: strTime + ' #',
                    height: 150,
                    key: '12',
                    uri: pictures[j].file.uri,
                    createdAt: pictures[j].createdAt
                });
                }
            }
            }
        }
        const newItems = {};
        Object.keys(items).forEach(key => {
            newItems[key] =items[key];
        });
        items = newItems
        }, 1000);
    }
    
    const renderItem = (item) => {
        return (
          // feature to add: 모달창 나와서 쓴 일기 볼 수 있게
        <TouchableOpacity
            style={[styles.item, {height: item.height}]}
            onPress={() => Alert.alert(item.name)}
        >
            <>
            <DeleteBtn>
            <TouchableOpacity onPress={deleteInfo}>
            <AntDesign 
                name="delete" 
                size={24} 
                color="black" 
            />
            </TouchableOpacity>
            </DeleteBtn>
            <Text>{item.name}</Text>
            <Picture 
            source={{ uri:item.uri }}
            />
            </>
        </TouchableOpacity>
        );
    }
    
    const renderEmptyDate = () => {
        return (
        <View style={styles.emptyDate}>
            <Text>This is empty date!!!!!</Text>
        </View>
        );
    }
    
    const rowHasChanged = (r1, r2) => {
        return r1.name !== r2.name;
    }
    
    const timeToString = (time) => {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    useEffect(() => {
        console.log("component did mount!");
        ListPicture();
    }, []);

    return (
    <Agenda
        items={{
            '2020-12-04': [{name: 'item 1 - any js object'}],
        }}
        loadItemsForMonth={loadItems}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={rowHasChanged}
        onDayPress={day=> console.log('day pressed: ', day)}
    />
    );
}

const styles = StyleSheet.create({
item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
},
emptyDate: {
    height: 30,
    flex: 1,
    paddingTop: 30
}
});

export default Calnendar;