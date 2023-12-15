import { useLocalSearchParams } from 'expo-router';
import React from 'react'
import {StyleSheet, View} from 'react-native';
import Avatar from '../../components/channel/Avatar';
import { FlatList } from 'react-native-gesture-handler';
import VideoBox from '../../components/video/VideoBox';
import VideoList from '../../components/video/VideoList';
import { channelType } from 'src/types/ChannelTypes';

const index = () => {
    const [channel, setChannel] = React.useState<channelType>();
    const {id} = useLocalSearchParams();

    React.useEffect(() => {
        fetch(`https://aj-ca-1.vercel.app/api/channels/${id}`)
        .then(data => {
            const response = data.json();

            if(data.ok) {
                return response
            };

            throw response;
        })
        .then(res => {
            console.log(res)
            setChannel(res);
        })
        .catch(err => console.error(err));
    }, [id]);

  return channel && (
    <View style={styles.container}>
        {/* Channel Logo */}
        <Avatar avatar={channel?.avatar as string} avatarSize={80}/>

        <VideoList videos={channel.videos}/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#181818',
        // height: '100%',
        // justifyContent: 'center',
        alignItems: 'stretch'
    }
})

export default index;