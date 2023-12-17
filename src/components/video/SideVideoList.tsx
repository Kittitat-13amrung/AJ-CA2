import React from 'react'
import { FlatList, View } from 'react-native'
import VideoBox from './VideoBox'
import { VideoTypes } from '../../types/VideoTypes'

type Props = {
    videos: VideoTypes[]
}

const SideVideoList:React.FC<Props> = ({videos}) => {
    return (
        <View style={{ maxWidth: '17%' }}>
            <FlatList
                data={videos}
                renderItem={({ item }) => <VideoBox {...item} />}
                numColumns={1}
            />
        </View>
    )
}

export default SideVideoList