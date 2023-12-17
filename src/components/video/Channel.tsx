import { router } from 'expo-router';
import React from 'react'
import { Image, StyleSheet, View, Text, Pressable } from 'react-native';
import { useSession } from '../../contexts/AuthContext';

interface channelProps {
    _id: string,
    username: string,
    avatar: string,
    subscribers: number,
}

const Channel: React.FC<{ _id: string }> = ({ _id }) => {
    const [channel, setChannel] = React.useState<channelProps>();
    const {session} = useSession();
    const subscribers = React.useMemo(() => {
        if (!channel?.subscribers) return;

        const numIntl = Intl.NumberFormat('en-US', {
            notation: 'compact'
        });

        return numIntl.format(channel.subscribers);

    }, [channel?.subscribers]);

    React.useMemo(() => {
        fetch(`https://aj-ca-1.vercel.app/api/channels/${_id}`, {
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
                // console.log(res)

            })
            .catch(err => console.error(err))
    }, [_id]);

    const handleSubscribeBtnClicked = () => {
        if (!session) return;

        const channel = JSON.parse(session);

        fetch(`${process.env.EXPO_PUBLIC_API_URL}/channels/${channel._id}/subscribe`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${channel.token}`
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

                setChannel(channel => ({
                    ...channel,
                    subscribers: Number(subscribers) + incrementOrDecrementByOne
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
            <Pressable onPress={handleSubscribeBtnClicked} style={styles.subscriberButton}>
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Subscribe</Text>
            </Pressable>
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