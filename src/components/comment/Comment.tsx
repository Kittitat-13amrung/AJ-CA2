import React from 'react';
import { Text, View, Image, Pressable, NativeSyntheticEvent, TextLayoutEventData, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useProfileState } from '../../hooks/useProfileState';
import { CommentProps } from '../../types/CommentTypes';
import { useSession } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import { numberFormat } from '../../common/functions/numberFormat';
import { TouchableRipple } from 'react-native-paper'
import { channelType } from 'src/types/ChannelTypes';
import CommentChildren from './Children';

type CommentType = {
    _id: string,
    _channel_id: {
        _id: string,
        avatar: string,
        username: string,
    },
    body: string,
    likes: number,
    dislikes: number,
    children: string[],
    updatedAt?: Date,
    createdAt?: Date,
}

type Props = {
    comment: CommentType | null,
    isChild?: boolean,
    updateComments?: React.Dispatch<React.SetStateAction<CommentProps[] | undefined>>
    channelUpdate: channelType
}

const Comment: React.FC<Props> = ({ comment: propComment, isChild, updateComments, channelUpdate }) => {
    const [liked, setLiked] = React.useState(false);
    const [disliked, setDisliked] = React.useState(false);
    const [showChildren, setShowChildren] = React.useState<boolean>(false);
    const [children, setChildren] = React.useState<CommentProps[]>([]);
    const [comment, setComment] = React.useState<CommentType>();
    const [fetched, setFetched] = React.useState<boolean>(false);
    const [showReplyInput, setShowReplyInput] = React.useState<boolean>(false);
    const loggedInChannel = useProfileState();
    const Reply = React.lazy(() => import('./Reply'));
    const { session } = useSession();

    React.useEffect(() => {
        // initial mount
        setComment(propComment);
        if (channelUpdate) {
            setLiked(channelUpdate.comment_liked.findIndex(likedComment => likedComment === propComment._id) !== -1);
            setDisliked(channelUpdate.comment_disliked.findIndex(dislikedComment => dislikedComment === propComment._id) !== -1);
        }

    }, [channelUpdate])

    // get all children comments 
    const fetchChildrenComments = (id: string) => {
        setFetched(true);
        // fetch data if haven't before
        if (!fetched) {

            fetch(`https://aj-ca-1.vercel.app/api/comments/${id}/children`)
                .then(data => {
                    const response = data.json();

                    if (data.ok) return response;
                    setFetched(true);

                    throw response;
                })
                .then(res => {
                    setChildren(res.comments);
                })
                .catch(err => console.error(err));
        }

        // show/hide children
        setShowChildren(!showChildren);

    }

    // show reply button unless not logged in
    const handleShouldShowReplyBtn = () => {
        if (!session) {
            router.replace('/');
        }

        setShowReplyInput(true);
    }

    // handle like btn clicked, fetch to api and increment/decrement like value
    const handleLikeBtnClicked = () => {
        if (!session) return;

        const channel = JSON.parse(session);

        fetch(`${process.env.EXPO_PUBLIC_API_URL}/comments/${comment._id}/like`, {
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
                setComment(currentComment => ({
                    ...currentComment,
                    likes: currentComment.likes + incrementOrDecrementByOne
                }));
            })
            .catch(err => console.error(err));
    }

    // handle dislike btn clicked, fetch to api and increment/decrement dislike value
    const handleDislikeBtnClicked = () => {
        if (!session) return;

        const channel = JSON.parse(session);

        fetch(`${process.env.EXPO_PUBLIC_API_URL}/comments/${comment._id}/dislike`, {
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
                setComment(currentComment => ({
                    ...currentComment,
                    dislikes: currentComment.dislikes + incrementOrDecrementByOne
                }));
            })
            .catch(err => console.error(err));
    }

    return comment && (
        <>
            <View style={{ flex: 1, flexDirection: 'row', rowGap: 10, columnGap: 20, marginVertical: 10 }}>
                {/* Avatar */}
                <Pressable onPress={() => router.push({
                    pathname: '/channel/[id]',
                    params: {
                        id: comment._channel_id._id
                    }
                })}>
                    <Image style={{ width: 40, height: 40, borderRadius: 40, }} resizeMode='contain' source={{ uri: comment._channel_id.avatar }} />
                </Pressable>

                <View style={{ flex: 1, flexDirection: 'column' }}>
                    {/* Comment Header */}
                    <View style={{ flex: 1, flexDirection: 'row', columnGap: 10 }}>
                        <Pressable onPress={() => router.push({
                            pathname: '/channel/[id]',
                            params: {
                                id: comment._channel_id._id
                            }
                        })}>
                            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>@{comment._channel_id.username}</Text>
                        </Pressable>
                        <Text style={{ color: 'white', fontSize: 14 }}>{Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        }).format(new Date(comment?.updatedAt as Date))}</Text>
                    </View>

                    {/* Comment Body */}
                    <View>
                        <Text style={{ flex: 1, flexDirection: 'row', color: 'white', fontSize: 16 }}>
                            {comment.body}
                        </Text>
                    </View>

                    {/* Like/Dislike & Reply Buttons */}
                    <View style={{ flex: 1, flexDirection: 'row', columnGap: 16, marginVertical: 20 }}>

                        <Pressable style={{ flexDirection: 'row', columnGap: 10 }} onPress={handleLikeBtnClicked}>
                            {liked ?
                                <AntDesign name="like1" size={18} color="white" />
                                :
                                <AntDesign name="like2" size={18} color="white" />
                            }
                            <Text style={{ color: 'white' }}>
                                {numberFormat(comment.likes)}
                            </Text>
                        </Pressable>

                        <Pressable style={{ flexDirection: 'row', columnGap: 10 }} onPress={handleDislikeBtnClicked}>
                            {disliked ?
                                <AntDesign name="dislike1" size={18} color="white" />
                                :
                                <AntDesign name="dislike2" size={18} color="white" />
                            }
                            <Text style={{ color: 'white' }}>
                                {numberFormat(comment.dislikes)}
                            </Text>
                        </Pressable>

                        {/* Reply Component */}
                        <TouchableRipple rippleColor="rgba(0, 0, 0, .6)" onPress={handleShouldShowReplyBtn} style={{ width: '5%', height: 32, alignItems: 'center', borderRadius: 20, backgroundColor: '#303030', paddingVertical: 6, paddingHorizontal: 6 }}>
                            <Text style={{ color: 'white', fontWeight: '600' }}>Reply</Text>
                        </TouchableRipple>

                    </View>

                    {/* Children Comment Header */}
                    {!isChild && (
                        <View style={{ margin: 10 }}>

                            {/* Amount of Replies */}
                            {(comment?.children?.length > 0) && (
                                <>
                                    <TouchableRipple rippleColor="rgba(0, 0, 0, .6)" onPress={() => fetchChildrenComments(comment._id)} style={{ width: '8%', alignItems: 'center', borderRadius: 20, backgroundColor: '#303030', paddingVertical: 12, paddingHorizontal: 12, marginBottom: 12 }}>
                                        <Text style={{ color: 'white', fontWeight: '600' }}>{showChildren ? 'Hide Replies' : comment?.children?.length + ' Replies'}</Text>
                                    </TouchableRipple>

                                    {showChildren && (
                                        <React.Suspense fallback={<ActivityIndicator color='#303030' size={50} />}>
                                            <CommentChildren channelUpdate={channelUpdate} children={children} />
                                        </React.Suspense>
                                    )}
                                </>
                            )}

                        </View>
                    )}

                    {/* Reply Input Box */}
                    {
                        (!isChild && showReplyInput) && (
                            <React.Suspense>
                                {/* Reply Component */}
                                <Reply updateComments={updateComments} avatar={loggedInChannel?.avatar as string} to='comment' id={comment._id} />
                            </React.Suspense>
                        )
                    }
                </View>

            </View>

        </>
    )
}

Comment.defaultProps = {
    isChild: false
}

export default Comment;