import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { VideoTypes } from '../../types/VideoTypes'
import { numberFormat } from '../../common/functions/numberFormat'

type Props = {
    video: VideoTypes,

}

const DescriptionSection: React.FC<Props> = ({ video }) => {
    // expand/collapse description section
    const [expandDesc, setExpandDesc] = React.useState<boolean>(false);

    return (
        <Pressable disabled={expandDesc} onPress={() => setExpandDesc(true)} style={{ backgroundColor: '#05050550', borderRadius: 20, marginVertical: 20, padding: 10 }}>
            {/* Views & Datetime */}
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', columnGap: 10, marginBottom: 10 }}>
                <Text style={{ color: 'white' }}>
                    {numberFormat(video.views)} views
                </Text>
                <Text style={{ color: 'white' }}>
                    {Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    }).format(new Date(video.updatedAt))}
                </Text>
            </View>

            {/* expand/collapse description */}
            <>
                {expandDesc ? (
                    <Text style={{ color: 'white' }}>{video.description}</Text>
                ) : (
                    <Text style={{ color: 'white' }} numberOfLines={2}>{video.description}</Text>
                )}
                <Pressable onPress={() => setExpandDesc(!expandDesc)}>
                    <Text style={{ color: 'white', fontWeight: '600' }}>{expandDesc ? 'collapse' : '...more'}</Text>
                </Pressable>
            </>
        </Pressable>
    )
}

export default DescriptionSection