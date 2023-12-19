import React from 'react'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'
import Reply from './Reply'
import Comment from './Comment'
import { CommentProps } from '../../types/CommentTypes'
import { useProfileState } from '../../hooks/useProfileState'
import FadeIn from '../animation/FadeIn'
import { channelType } from 'src/types/ChannelTypes'

type Props = {
    comments: CommentProps[],
    setComments: React.Dispatch<React.SetStateAction<CommentProps[]>>,
    video_id: string,
    channelUpdate: channelType
}

const CommentView: React.FC<Props> = ({ comments, setComments, video_id, channelUpdate }) => {
    const loggedInChannel = useProfileState();


    return comments ? (
        <View>
            {/* Comment Section Header */}
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 24 }}>{comments?.length} Comments</Text>
            </View>
            {/* Reply Component */}
            <Reply updateComments={setComments} avatar={loggedInChannel?.avatar as string} to='video' id={video_id} />
            {/* Comments */}
            <FlatList
                style={{ marginVertical: 30 }}
                data={comments}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <FadeIn>
                        <Comment updateComments={setComments} channelUpdate={channelUpdate} comment={item} />
                    </FadeIn>
                )}
            />

        </View>
    ) : <ActivityIndicator color={"#303030"} size={50} />
}

export default CommentView