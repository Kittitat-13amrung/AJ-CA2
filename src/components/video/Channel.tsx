import { router } from 'expo-router';
import React from 'react'
import { Image, StyleSheet, View, Text, Pressable } from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import { useSession } from '../../contexts/AuthContext';

interface channelProps {
    _id: string,
    username: string,
    avatar: string,
    subscribers: number,
}

const Channel: React.FC<{ _id: string, channelUpdate: any }> = ({ _id, channelUpdate }) => {
    // init states
    const [channel, setChannel] = React.useState<channelProps>();
    const [subbed, setSubbed] = React.useState(false);
    const {session} = useSession();
    // subscriber formatting
    const subscribers = React.useMemo(() => {
        if (!channel?.subscribers) return;

        const numIntl = Intl.NumberFormat('en-US', {
            notation: 'compact'
        });

        return numIntl.format(channel.subscribers);

    }, [channel?.subscribers]);

    // fetch channel using id
    React.useMemo(() => {
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/channels/${_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => {
                const response = data.json();

                if (data.ok) return response;

                throw response;
            })
            .then(res => {
                setChannel(res);
            })
            .catch(err => console.error(err))
    }, [_id]);

    // update subscribe state based on subscribed array
    React.useEffect(() => {
        if(channelUpdate?._id) {
            setSubbed(channelUpdate.subscribed.findIndex(subbed => subbed === _id) !== -1);
        }
    }, [channelUpdate]);

    // handle subscribe btn clicked, fetch to api and increment/decrement sub value
    const handleSubscribeBtnClicked = () => {
        if (!session) return;

        const clientChannel = JSON.parse(session);

        fetch(`${process.env.EXPO_PUBLIC_API_URL}/channels/${_id}/subscribe`, {
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
        <Pressable onPress={() => router.push(`/channel/${channel._id}` as any)} style={styles.container}>
            <Image resizeMode='cover' style={styles.avatar} source={{ uri: channel.avatar }} />
            <View>
                <Text style={styles.username}>{channel.username}</Text>
                <Text style={styles.subscriber}>{subscribers} subscribers</Text>
            </View>
            <TouchableRipple onPress={handleSubscribeBtnClicked} rippleColor="rgba(0, 0, 0, .6)" style={styles.subscriberButton}>
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{subbed ? 'Subscribed' : 'Subscribe'}</Text>
            </TouchableRipple>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        // flexWrap: 'wrap',
        marginVertical: 10,
        columnGap: 20,
        width: '18%',
        color: '#fff'
    },
    username: {
        color: 'white',
        fontSize: 18
    },
    subscriber: {
        color: 'white',
        fontSize: 14
    },
    subscriberButton: {
        fontSize: 18,
        backgroundColor: 'white',
        borderRadius: 60,
        justifyContent: 'center',
        paddingHorizontal: 30,
        alignItems: 'center',
        fontWeight: 'bold'
    },
    avatar: {
        aspectRatio: '1',
        borderRadius: 60,
        width: 45,
        height: 45
    },
});

export default Channel;