import { Stack, useFocusEffect, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { View, StyleSheet, Text, Platform, useWindowDimensions, Image, FlatList, Pressable, ActivityIndicator } from 'react-native'
import { VideoTypes } from '../../types/VideoTypes';
import Channel from '../../components/video/Channel';
import { CommentProps } from '../../types/CommentTypes';
import SideVideoList from '../../components/video/SideVideoList';
import CommentView from '../../components/comment/CommentView';
import DescriptionSection from '../../components/video/DescriptionSection';
import { numberFormat } from '../../common/functions/numberFormat';
import { useSession } from '../../contexts/AuthContext';
import { channelType } from '../../types/ChannelTypes';


type SearchParamType = {
    v: string,
    query?: string
};

const show = () => {
    // init states
    const { v: id } = useGlobalSearchParams<SearchParamType>();
    const playerRef = React.useRef<YoutubeIframeRef | null>(null);
    const { width, height } = useWindowDimensions();
    const [videoWidth, setVideoWidth] = React.useState(width / 16);
    const [videoHeight, setVideoHeight] = React.useState(height / 8);
    const [isLoading, setIsLoading] = React.useState(false);
    const [video, setVideo] = React.useState<VideoTypes>();
    const [comments, setComments] = React.useState<CommentProps[]>();
    const [videoSuggestions, setVideoSuggestions] = React.useState<VideoTypes[]>();
    const { session } = useSession();
    const [channelUpdate, setChannelUpdate] = React.useState<channelType>();
    const [liked, setLiked] = React.useState(false);
    const [disliked, setDisliked] = React.useState(false);

    // access & set Window's Width & Height before mounting
    React.useEffect(() => {
        if (Platform.OS === "web") {
            setVideoWidth(width * 0.75);
            setVideoHeight(height / 9);
        }
    }, [width]);

    // fetch video from api
    React.useEffect(() => {
        setIsLoading(true);
        // fetch Video depending on id
        if (id) {
            fetch(`${process.env.EXPO_PUBLIC_API_URL}/videos/${id}`, {
                method: "GET"
            })
                .then(async (data) => {
                    const response = await data.json();

                    if (data.ok) {
                        return response;
                    }

                    throw response;
                })
                .then(res => {
                    setIsLoading(false);
                    setVideo(res);

                    // set window title
                    window.document.title = res.title;

                    // fetch for random video suggestions
                    fetch(`${process.env.EXPO_PUBLIC_API_URL}/videos/random/${res.tag}`, {
                        method: "GET"
                    })
                        .then(async (data) => {
                            const response = await data.json();

                            if (data.ok) {
                                return response;
                            }

                            throw response;
                        })
                        .then(res => {
                            setVideoSuggestions(res);

                        })
                        .catch(err => {
                            console.error(err);
                        });

                })
                .catch(err => {
                    console.error(err);
                });

            // fetch comments
            fetch(`${process.env.EXPO_PUBLIC_API_URL}/videos/${id}/comments`, {
                method: "GET"
            })
                .then(async (data) => {
                    const response = await data.json();

                    if (data.ok) {
                        // console.log(response)
                        return response;
                    }

                    throw response;
                })
                .then(res => {
                    setComments(res);

                })
                .catch(err => {
                    console.error(err);
                });
        }

    }, [id]);

    // update like and dislike states based on liked/disliked array
    React.useEffect(() => {
        if (session) {
            const channel = JSON.parse(session);
            const channelId = channel._id;

            fetch(`${process.env.EXPO_PUBLIC_API_URL}/channels/${channelId}`)
                .then(data => data.json())
                .then(res => {
                    setChannelUpdate(res);
                    setLiked(res.liked.findIndex(likedVideo => likedVideo === id) !== -1);
                    setDisliked(res.disliked.findIndex(dislikedVideo => dislikedVideo === id) !== -1);
                })
                .catch(err => console.error(err));
        }
    }, [session]);

    // should render Iframe for Web or Mobile
    const shouldRenderIframe = video?.url && Platform.OS === "web" ? (
        <iframe
            style={styles.video}
            width={videoWidth}
            // height={videoHeight}
            allowFullScreen
            src={`https://www.youtube.com/embed/${decodeURI(decodeURI(video.url.substring(9)))}?autoplay=1&mute=1`}
        ></iframe>
    ) : (
        <YoutubePlayer
            ref={playerRef}
            height={640}
            width={340}
            videoId={decodeURI(decodeURI(video?.url.substring(9) as string))}
        />
    );

    // handle like btn clicked, fetch to api and increment/decrement like value
    const handleLikeBtnClicked = () => {
        if (!session) return;

        const channel = JSON.parse(session);

        fetch(`${process.env.EXPO_PUBLIC_API_URL}/videos/${id}/like`, {
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

                setLiked(res.type === 'increment');

                setVideo(video => ({
                    ...video,
                    likes: video.likes + incrementOrDecrementByOne
                }))
            })
            .catch(err => console.error(err));
    }

    // handle dislike btn clicked, fetch to api and increment/decrement dislike value
    const handleDislikeBtnClicked = () => {
        if (!session) return;

        const channel = JSON.parse(session);

        fetch(`${process.env.EXPO_PUBLIC_API_URL}/videos/${id}/dislike`, {
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
                setDisliked(res.type === 'increment');
                setVideo(video => ({
                    ...video,
                    dislikes: video.dislikes + incrementOrDecrementByOne
                }))
            })
            .catch(err => console.error(err));
    }

    // render Video view when data is present
    const shouldRenderVideoView = video && width ? (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', columnGap: 20 }}>
            {/* Main Content */}
            <View style={{ width: '80%', paddingHorizontal: 50 }}>
                {/* Video */}
                {shouldRenderIframe}

                {/* Video Title */}
                <Text style={styles.title}>{video.title}</Text>

                {/* Channel & Video Descriptions */}
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Channel _id={video?.channel?._id as string} channelUpdate={channelUpdate}/>

                    <View style={{ width: '62%' }} />

                    {/* likes and dislikes and other buttons */}
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                        {/* Like Btn */}
                        <TouchableRipple onPress={handleLikeBtnClicked} style={{ alignItems: 'center', justifyContent: 'center', height: 50, width: '50%', borderStartStartRadius: 60, borderEndStartRadius: 60, backgroundColor: '#21212190' }} rippleColor="rgba(0, 0, 0, .6)">
                            <>
                                {channelUpdate?._id && liked ?
                                    <AntDesign name="like1" size={24} color="white" />
                                    :
                                    <AntDesign name="like2" size={24} color="white" />
                                }
                                <Text style={{ fontSize: 16, color: 'white' }}>{numberFormat(video.likes as number)}</Text>
                            </>
                        </TouchableRipple>

                        {/* Dislike Btn */}
                        <TouchableRipple onPress={handleDislikeBtnClicked} style={{ alignItems: 'center', justifyContent: 'center', height: 50, width: '50%', borderEndEndRadius: 60, borderStartEndRadius: 60, backgroundColor: '#21212190' }} rippleColor="rgba(0, 0, 0, .6)">
                            <>
                            {channelUpdate?._id && disliked ?
                                    <AntDesign name="dislike1" size={24} color="white" />
                                    :
                                    <AntDesign name="dislike2" size={24} color="white" />
                                }
                                <Text style={{ fontSize: 16, color: 'white' }}>{numberFormat(video.dislikes as number)}</Text>
                            </>
                        </TouchableRipple>
                    </View>

                </View>

                {/* Description Section */}
                <DescriptionSection video={video} />

                {/* Comment Section */}
                <CommentView channelUpdate={channelUpdate} comments={comments} setComments={setComments} video_id={video._id} />
            </View>

            {/* Side Videos */}
            <SideVideoList videos={videoSuggestions} />
        </View>
    ) : (
        <View style={{ minHeight: '100%', justifyContent: 'center', backgroundColor: '#181818' }}>
            <ActivityIndicator size={100} color={'#303030'} />
        </View>
    )

    return (
        <View style={styles.container}>
            {shouldRenderVideoView}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        minHeight: '100%',
        backgroundColor: '#181818',
        alignItems: 'center',
        padding: 20
    },
    video: {
        aspectRatio: '16/9',
        borderRadius: 10
    },
    title: {
        marginVertical: 12,
        fontWeight: '600',
        fontSize: 22,
        color: 'white'
    },
    button: {
        // color: 'white',
        width: 25,
        height: 25
    }
});

export default show;