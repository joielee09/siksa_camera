import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { API, graphqlOperation } from 'aws-amplify';
import * as Mutations from '../../../../graphql/mutations';
import styled from 'styled-components/native';
import { AntDesign } from '@expo/vector-icons';
import { listPictures_ } from '../../common/graphql/index';
import Storage from '@aws-amplify/storage';
import { S3Image } from 'aws-amplify-react-native';
import { AppLoading } from 'expo';

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
const RenderContainer = styled.View``;

let pictures=[];

export default class AgendaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      isReady: false,
      refreshing: false,
      curDay: '',
      cnt:0,
    };
  };

  refreshScreen =async()=> {
    pictures = await listPictures_();
    await this.loadItems(this.state.curDay);
    this.setState({ refreshing: false });
    this.setState({ isReady: false });
    this.setState({ cnt: this.state.cnt+1 });
    console.log("refreshing state: ", this.state.refreshing);
  }

  apiDeletePicture = async (chosenItemId) => {
    console.log("curDay: ", this.state.curDay);
    this.setState({ refreshing: true });
    
    const postObj = await pictures.filter(picture=>picture.id===chosenItemId);
    const postId = postObj[0].id;
    console.log("API: ",postId);
    try {
      await API.graphql(graphqlOperation(Mutations.deletePicture, {
        input: {id: postId}
      }));
      await Storage.remove(postId);
      pictures = await listPictures_();
      Alert.alert(
        '삭제 성공',
        '포스트가 성공적으로 삭제되었습니다.',
        [
          {text: '확인', onPress:()=>this.refreshScreen()}
        ],
        { cancelable: false }
      );
    } catch(e){
      this.setState({ refreshing: false });
      console.log("error in deleting: ", e);
      Alert.alert(
        '삭제 실패',
        '포스트 삭제에 실패했습니다.',
        [
          {text: '닫기'}
        ],
        { cancelable: false }
      );
    }
  }

  async componentDidMount() {
    try {
      console.log("component did mount!");
      pictures = await listPictures_();
      this.setState({isReady : true});
    } catch (e){
      console.log(e);
    }
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = -30; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
          this.state.items[strTime] = [];
          const numItems = pictures.length;
          for (let j = 0; j < numItems; j++) {
            if(pictures[j].createdAt.slice(0,10)===strTime){
              this.state.items[strTime].push({
                name: strTime + ' #',
                height: 150,
                uri: pictures[j].file.uri  || 'https://i2.wp.com/learn.onemonth.com/wp-content/uploads/2017/08/1-10.png?fit=845%2C503&ssl=1',
                createdAt: pictures[j].createdAt,
                id: pictures[j].id,
              });
            }
          }
      }

    // items 객체에 { 날짜:array } list를 넣음. 
    const newItems = {};
    Object.keys(this.state.items).forEach(key => {
      newItems[key] = this.state.items[key];
    });
    this.setState({
      items: newItems,
      curDay: day,
    });
    }, 1000);
    listPictures_();
  }

  renderItem(item) {
      return (
        <RenderContainer>
        <TouchableOpacity
        style={[styles.item, {height: item.height}]}
        onPress={() =>console.log(item)}
        >
        <Text>{this.state.cnt}</Text>
        <Text>{item.name}</Text>
        <S3Image 
          style={styles.image}
          imgKey={item.id}
        />
        </TouchableOpacity>
        <DeleteBtn>
        <TouchableOpacity onPress={()=>this.apiDeletePicture(item.id)}>
          <AntDesign 
            name="delete" 
            size={24} 
            color="black" 
          />
        </TouchableOpacity>
        </DeleteBtn>
        </RenderContainer>
      );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>이날은 비어있습니다.</Text>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return true;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    listPictures_().then(() => {
      this.setState({ refreshing: false })
    });
  }

  loadAssets = async() => {
    try {
      console.log("load assets!");
      pictures = await listPictures_();
    } catch (e){
      console.log(e);
    }
  }

  onFinish = () => {
    this.setState({ isReady: true });
  }

  render() {
    return (
        this.state.isReady?
        // <ScrollView
        //   refreshControl={
        //     <RefreshControl 
        //       refreshing={this.state.refreshing}
        //       onRefresh={this.onRefresh}
        //     />
        //   }
        // >
            <Agenda
              items={this.state.items}
              loadItemsForMonth={this.loadItems.bind(this)}
              renderItem={this.renderItem.bind(this)}
              renderEmptyDate={this.renderEmptyDate.bind(this)}
              rowHasChanged={this.rowHasChanged.bind(this)}
              onDayPress={day=> console.log('day pressed: ', day)}
              onRefresh={this.refreshScreen.bind(this)}
              refreshing={this.state.refreshing}
              // refreshControl={null}
          />
          // </ScrollView>
        : <AppLoading 
          startAsync={this.loadAssets}
          onFinish={this.onFinish}
          onError={console.warn}
        />
    );
  }

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
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  image: {
    width: 80,
    height: 80,
  }
});