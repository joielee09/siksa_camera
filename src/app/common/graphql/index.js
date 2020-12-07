import { useState } from 'react';
import Auth from '@aws-amplify/auth';
import API, { graphqlOperation } from '@aws-amplify/api';
import Storage from '@aws-amplify/storage';

import * as Queries from '../../../../graphql/queries';
import * as Mutations from '../../../../graphql/mutations';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

import AWSCONFIG from '../../../../aws-exports';
import { Buffer } from 'buffer';
import { v4 as uuid } from 'uuid';
import { func } from 'prop-types';

export const CurrentUser = {
    state : {
        userId: '',
        username: '',
        pictures: []
    },
    userInfo : async() => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            const userId = user.attributes.sub;
            const username = user.attributes.email.split('@')[0];
            return { userId, username };
        } catch(e) {
            console.log(e);
        }
    }
};

export async function listPictures_ () {
    try {
        const data = await API.graphql(graphqlOperation(Queries.listPictures));
        const pictures = await data.data.listPictures.items;
        return pictures;
    } catch (e){
        console.log(e);
    }
}

export async function onRefresh () {
    // setRefresh(true);
    // await listPictures_();
    // setRefresh(false);
};

export async function uploadPicturesToS3 () {

    const user = await Auth.currentAuthenticatedUser();
    const userId = user.attributes.sub;
    const username =  user.attributes.email.split('@')[0];
    const key = uuid() + '.jpg';

    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const result = await ImagePicker.launchImageLibraryAsync(
        { base64: true, allowsEditing: false }
    );
    const buffer = new Buffer(result.base64, 'base64');
    Storage.put(key, buffer, {
        contentType: 'image/jpg'
    }). then((res)=>{
        const bucket = AWSCONFIG.aws_user_files_s3_bucket;
        const region = AWSCONFIG.aws_user_files_s3_bucket_region;
        const uri = result;
        const file = { bucket, region, key, uri };
        API.graphql(graphqlOperation(Mutations.createPicture, {
            input:{
                id: uuid(),
                userId: userId,
                username: username,
                file: file,
            }
        }))
    }). catch (e => {
        console.log(e);
    });
}
