import { router, useLocalSearchParams } from 'expo-router';
import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/channel/Avatar';
import { FlatList } from 'react-native-gesture-handler';
import VideoBox from '../../components/video/VideoBox';
import VideoList from '../../components/video/VideoList';
import { channelType } from '../../types/ChannelTypes';
import { numberFormat } from '../../common/functions/numberFormat';
import {TouchableRipple} from 'react-native-paper';
import { useProfileState } from '../../hooks/useProfileState';

const index = () => {
    const clientChannel = useProfileState();
    const [channel, setChannel] = React.useState<channelType>();
    const [subbed, setSubbed] = React.useState(false);
    const { id } = useLocalSearchParams();

    // fetch channel from api
    React.useEffect(() => {
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/channels/${id}`)
            .then(data => {
                const response = data.json();

                if (data.ok) {
                    return response
                };

                throw response;
            })
            .then(res => {
                if (Platform.OS === 'web') {
                    document.title = `${res.username}'s Channel`;
                }
                setChannel(res);
            })
            .catch(err => console.error(err));
    }, [id]);
    // update subscribe state based on subscribed array
    React.useEffect(() => {
        if (clientChannel) {
            const channelId = clientChannel._id;

            fetch(`${process.env.EXPO_PUBLIC_API_URL}/channels/${channelId}`)
                .then(data => data.json())
                .then(res => {
                    setSubbed(res.subscribed.findIndex(subbed => subbed === id) !== -1);
                })
                .catch(err => console.error(err));
        }
    }, [clientChannel]);

    // handle subscribe btn clicked, fetch to api and increment/decrement subscriber value
    const handleSubscribeBtnClicked = () => {
        // return if not logged in or channel's id is the same as client's channel
        if (!clientChannel) return router.push('channel/login');

        if(clientChannel._id === id) return;

        fetch(`${process.env.EXPO_PUBLIC_API_URL}/channels/${id}/subscribe`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${clientChannel.token}`
            },
        })
            .then(async (data) => {
                const response = await data.json();

                if (data.ok) {
                    return response;
                }

                throw response;
            })
            .then(res => {
                const incrementOrDecrementByOne = res.type === 'increment' ? 1 : -1
                setSubbed(res.type === 'increment');
                setChannel(channel => ({
                    ...channel,
                    subscribers: channel.subscribers + incrementOrDecrementByOne
                }))
            })
            .catch(err => console.error(err));
    }

    return channel && (
        <View style={styles.container}>
            {/* Channel Logo */}
            <View style={{ justifyContent: 'center', flex: 1, flexDirection: 'row', alignItems: 'center', columnGap: 30, minHeight: 300 }}>
                <Avatar avatar={channel?.avatar as string} avatarSize={80} />
                <View>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: 'white' }}>{channel?.username}</Text>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>{numberFormat(channel?.subscribers)} Subscribers</Text>
                </View>
                <TouchableRipple onPress={handleSubscribeBtnClicked} rippleColor="rgba(0, 0, 0, .6)" style={clientChannel?._id !== id ? styles.subscriberButton : styles.disabledBtn}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{subbed ? 'Subscribed' : 'Subscribe'}</Text>
                </TouchableRipple>
            </View>

            {channel.videos.length > 0 ? (
                <VideoList videos={channel.videos} />
            ) : (
                <Text style={{ alignItems: 'flex-start', fontSize: 24, color: 'white' }}>No Videos</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#181818',
        minHeight: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    subscriberButton: {
        height: 40,
        fontSize: 18,
        backgroundColor: 'white',
        borderRadius: 60,
        justifyContent: 'center',
        paddingHorizontal: 30,
        alignItems: 'center',
        fontWeight: 'bold'
    },
    disabledBtn: {
        height: 40,
        fontSize: 18,
        backgroundColor: '#505050',
        borderRadius: 60,
        justifyContent: 'center',
        paddingHorizontal: 30,
        alignItems: 'center',
        fontWeight: 'bold'
    }
})

export default index;