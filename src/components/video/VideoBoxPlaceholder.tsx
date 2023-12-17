import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

const VideoBoxPlaceholder = () => {
  return (
    <View style={styles.container}>

      {/* Thumbnail Template */}
      <View style={{ backgroundColor: '#303030', aspectRatio: '16/9', width: 380, borderRadius: 20, flex: 1, justifyContent: 'flex-end' }} />

      {/* Body */}
      <View style={{ flexDirection: 'row', columnGap: 10, marginVertical: 15, alignItems: 'flex-start' }}>
        {/* Avatar */}
        <View style={styles.channelLogo} />

        <View>
          <Text style={styles.titleText}>Test</Text>

          <Text
            style={styles.baseText}>
            props.channel.username
          </Text>

          <View style={{ flexDirection: 'row', columnGap: 5, }}>
            <Text style={styles.baseText}>0 views</Text>
            <Text style={styles.baseText}>-</Text>
            <Text style={styles.baseText}>Test</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
  },
  channelName: {
    fontFamily: 'Cochin',
    fontSize: 12,
    color: '#aaaaaa'
  },
  channelNameHover: {
    fontFamily: 'Cochin',
    fontSize: 12,
    color: '#ffaaaa'
  },
  baseText: {
    paddingVertical: 2,
    fontFamily: 'Cochin',
    fontSize: 13,
    color: '#aaaaaa'
  },
  titleText: {
    fontSize: 16,
    // maxWidth: '50%',
    fontWeight: '600',
    color: '#ffffff'
  },
  channelLogo: {
    backgroundColor: '#303030',
    borderRadius: 100,
    aspectRatio: '1',
    width: 40
  },
  thumbnail: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default VideoBoxPlaceholder;