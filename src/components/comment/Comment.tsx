import React from 'react';
import { Text, View, Image, Pressable, NativeSyntheticEvent, TextLayoutEventData, TouchableOpacity } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useProfileState } from '../../hooks/useProfileState';
import { CommentProps } from '../../types/CommentTypes';
import { useSession } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import { numberFormat } from '../../common/functions/numberFormat';


type Props = {
    comment: {
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
    } | null,
    isChild?: boolean,
    updateComments?: React.Dispatch<React.SetStateAction<CommentProps[] | undefined>>

}

const Comment: React.FC<Props> = ({ comment, isChild, updateComments }) => {
    const [showChildren, setShowChildren] = React.useState<boolean>(false);
    const [showCommentBody, setShowCommentBody] = React.useState<boolean>(false);
    const [children, setChildren] = React.useState<CommentProps[]>([]);
    const [fetched, setFetched] = React.useState<boolean>(false);
    const [showReplyInput, setShowReplyInput] = React.useState<boolean>(false);
    const loggedInChannel = useProfileState();
    const Reply = React.lazy(() => import('./Reply'));
    const CommentChildren = React.lazy(() => import('./Children'));
    const { session } = useSession();

    // get all children comments 
    const fetchChildrenComments = (id: string) => {
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

    const handleShowReadMoreBtn = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
        console.log(e.nativeEvent);
        console.log('test')
    }

    const [numberOfLines, setNumberOfLines] = React.useState<number>(3);

    const onTextLayout = React.useCallback(
        (e: NativeSyntheticEvent<TextLayoutEventData>) => {
            const MAX_LINES = 3;
          if (e.nativeEvent.lines.length > MAX_LINES) {
            setShowCommentBody(true);
            setNumberOfLines(MAX_LINES);
          }
        console.log('test')
        },
        [showCommentBody]
      );

    return comment && (
        <>
            <View style={{ flex: 1, flexDirection: 'row', rowGap: 10, columnGap: 20, marginVertical: 10 }}>
                {/* Avatar */}
                <Image style={{ width: 40, height: 40, borderRadius: 40, }} resizeMode='contain' source={{ uri: comment._channel_id.avatar }} />

                <View style={{ flex: 1, flexDirection: 'column' }}>
                    {/* Comment Header */}
                    <View style={{ flex: 1, flexDirection: 'row', columnGap: 10 }}>
                        <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>@{comment._channel_id.username}</Text>
                        <Text style={{ color: 'white', fontSize: 14 }}>{Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        }).format(new Date(comment?.updatedAt as Date))}</Text>
                    </View>

                    {/* Comment Body */}
                    <View>
                        <Text style={{ flex: 1, flexDirection: 'row', color: 'white', fontSize: 16 }} numberOfLines={numberOfLines} onTextLayout={onTextLayout}>
                            {comment.body}
                        </Text>
                        {/* Read More Btn */}
                        <Pressable  onPress={() => setShowCommentBody(!showCommentBody)}>
                            <Text style={{ fontWeight: '700', color: 'white', fontSize: 12 }}>
                                {showCommentBody ? 'Collapse' : 'Read More'}
                            </Text>
                        </Pressable >
                    </View>

                    {/* Like/Dislike & Reply Buttons */}
                    <View style={{ flex: 1, flexDirection: 'row', columnGap: 16, marginVertical: 20 }}>

                        <SimpleLineIcons name="like" size={16} color="white" />
                        <Text style={{ color: 'white' }}>
                            {numberFormat(comment.likes)}
                        </Text>

                        <SimpleLineIcons name="dislike" size={16} color="white" />
                        <Text style={{ color: 'white' }}>
                            {numberFormat(comment.dislikes)}
                        </Text>

                        {/* Reply Component */}
                        <Pressable onPress={handleShouldShowReplyBtn} style={{ width: '5%', height: 32, alignItems: 'center', borderRadius: 20, backgroundColor: '#303030', paddingVertical: 6, paddingHorizontal: 6 }}>
                            <Text style={{ color: 'white', fontWeight: '600' }}>Reply</Text>
                        </Pressable>

                    </View>

                    {/* Children Comment Header */}
                    {!isChild && (
                        <View style={{ margin: 10 }}>

                            {/* Amount of Replies */}
                            {comment?.children?.length > 0 && (
                                <>
                                    <Pressable onPress={() => fetchChildrenComments(comment._id)} style={{ width: '6%', alignItems: 'center', borderRadius: 20, backgroundColor: '#303030', paddingVertical: 12, paddingHorizontal: 12, marginBottom: 12 }}>
                                        <Text style={{ color: 'white', fontWeight: '600' }}>{showChildren ? 'Hide Replies' : comment?.children?.length + ' Replies'}</Text>
                                    </Pressable>

                                    {showChildren && (
                                        <React.Suspense fallback={<Text style={{ color: 'white' }}>Loading...</Text>}>
                                            <CommentChildren children={children} />
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