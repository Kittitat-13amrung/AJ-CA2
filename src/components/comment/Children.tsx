import React from 'react'
import Comment from './Comment';
import { FlatList, View } from 'react-native';

interface CommentChildrenProps {
    _id: string,
    body: string,
    likes: number,
    dislikes: number,
    children: string[],
    _channel_id: {
        _id: string,
        avatar: string,
        username: string,
    },
    updatedAt: Date,
    setShowReplyInput?: boolean
}

const Children = React.memo(function Children ({children}:{children: CommentChildrenProps[]}) {
  return children?.length > 0 && (
    <View style={{ paddingHorizontal: 60 }}>
        <FlatList
        data={children}
        keyExtractor={item => item._id}
        renderItem={({item}) => <Comment comment={item} isChild={true}/>}
    />
    </View>
  )
});



export default Children;