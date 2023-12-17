import React from 'react'
import { Pressable, Text, View, Platform } from 'react-native'
import { VideoTypes } from '../../types/VideoTypes'
import { numberFormat } from '../../common/functions/numberFormat'
import { TouchableRipple } from 'react-native-paper'

type Props = {
    video: VideoTypes,

}

const DescriptionSection: React.FC<Props> = ({ video }) => {
    // expand/collapse description section
    const [expandDesc, setExpandDesc] = React.useState<boolean>(false);

    return (
        <TouchableRipple
            rippleColor="rgba(0, 0, 0, .32)"
            // disabled={true}
            onPress={() => setExpandDesc(true)}
            style={{
                ...Platform.select({
                    web: {
                        display: 'flex',
                        cursor: expandDesc ? 'default' : 'pointer',
                    }
                }),
                backgroundColor: '#05050550',
                borderRadius: 20,
                marginVertical: 20,
                padding: 10
            }}>
            <>
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
                        <Text style={{
                            ...Platform.select({
                                web: {
                                    display: 'flex',
                                    cursor: expandDesc ? 'text' : 'pointer',
                                }
                            }),
                            color: 'white'
                        }}>{video.description}</Text>
                    ) : (
                        <Text style={{
                            color: 'white',
                        }} numberOfLines={2}>{video.description}</Text>
                    )}
                    <Pressable disabled={!expandDesc} onPress={() => setExpandDesc(!expandDesc)}>
                        <Text style={{ color: 'white', fontWeight: '600' }}>{expandDesc ? 'collapse' : '...more'}</Text>
                    </Pressable>
                </>
            </>
        </TouchableRipple>
    )
}

export default DescriptionSection