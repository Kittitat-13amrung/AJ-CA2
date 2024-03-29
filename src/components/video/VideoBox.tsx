import { VideoTypes } from '../../types/VideoTypes';
import { Link, router } from 'expo-router';
import { LinkProps } from 'expo-router/build/link/Link';
import React from 'react'
import { View, Image, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';

const VideoBox = (props: VideoTypes) => {
  const [dateTime, setDateTime] = React.useState('');
  const [videoDuration, setVideoDuration] = React.useState<string>('00:00:00');

  // converting seconds to hh:mm::ss format
  function timeConvert(n: number | string) {
    if (typeof n === 'string') n = Number(n);

    let num = n;
    let hours = (num / 60);
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes: string | number = Math.round(minutes);
    let seconds = (minutes - rminutes) * 60;
    let rseconds: string | number = Math.floor(Math.abs(seconds));
    let fhours = '';
    (rhours === 0) ? fhours = '' : fhours = rhours + ':';
    (rminutes < 10) ? rminutes = '0' + rminutes : rminutes;
    (rseconds < 10) ? rseconds = '0' + rseconds : rseconds;
    setVideoDuration(fhours + rminutes + ":" + rseconds);
  }

  // execute formatting function on onMount
  React.useEffect(() => {
    if (props.updatedAt) {
      const date = new Date(props.updatedAt);

      const seconds = date.getSeconds();
      const minutes = date.getMinutes();
      const hours = date.getHours();
      const day = date.getDay() + 1;
      const month = date.getMonth() + 1;
      const year = new Date().getFullYear() - date.getFullYear();

      // convert seconds to hh:mm:ss
      timeConvert((props.duration / 100) / 60)


      const dateSet = new Map([['year', year], ['month', month], ['day', day], ['hours', hours], ['minutes', minutes], ['seconds', seconds]])
      const dateToUse = new Map();
      dateSet.forEach((date, key) => {
        if (date > 0) {
          dateToUse.set(key, date)
        }
      })

      // separate keys and values from Map
      const dateData = [...dateToUse.values()] as Number[];
      const dateKey = [...dateToUse.keys()] as string[];

      // re-format date
      const dateMap = {
        year: ' years',
        month: ' months',
        day: ' days',
        hours: ' hours',
        minutes: ' minutes',
        seconds: ' seconds'
      }

      // if date either months, years, or days is less than 1 splice out 's' for semantic meaning 
      const videoDate = Number(dateData[0]) > 1 ? dateMap[dateKey[0]] : (dateMap[dateKey[0]]).substring(0, (dateMap[dateKey[0]]).length - 1)

      // if date is less than 1, use 'a' letter instead
      const prefix = Number(dateData) > 1 ? dateData : 'a';

      // concat datetime
      setDateTime(prefix + videoDate + ' ago.');

    }
  }, []);

  return (
    // click to link to video
    <Pressable onPress={() => {
      router.push({
        pathname: "/watch?v=[v]",
        params: {
          v: props._id
        }
      });
    }} style={styles.container}>

      {/* Thumbnail */}
      <ImageBackground resizeMode='cover' style={{ aspectRatio: '16/9', width: 360, flex: 1, justifyContent: 'flex-end' }} imageStyle={{ borderRadius: 10 }} source={{ uri: props.thumbnail }}>
        <Text style={{ alignSelf: 'flex-end', marginBottom: 5, marginEnd: 5, backgroundColor: '#30303090', color: 'white', fontWeight: '600', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 }}>{videoDuration}</Text>
      </ImageBackground>

      {/* Body */}
      <View style={{ flexDirection: 'row', columnGap: 10, marginVertical: 15, alignItems: 'flex-start' }}>
        {/*  */}
        {props.channel && <Image style={styles.channelLogo} source={{ uri: props.channel.avatar }} />}
        <View style={{ flexShrink: 1 }}>
          <Text style={styles.titleText}>{props.title}</Text>

          {props.channel && <Link
            href={`/channel/${props.channel._id}` as any}
            style={styles.baseText}>
            {props.channel.username}
          </Link>}

          <View style={{ flexDirection: 'row', columnGap: 5, }}>
            <Text style={styles.baseText}>{new Intl.NumberFormat('en-GB', {
              notation: 'compact'
            }).format(
              props.views,
            )} views</Text>
            <Text style={styles.baseText}>-</Text>
            <Text style={styles.baseText}>{dateTime}</Text>
          </View>
        </View>
      </View>
    </Pressable>
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
    // maxWidth: '40%',
    // flex: 1,
    flexShrink: 1,
    fontWeight: '600',
    color: '#ffffff'
  },
  channelLogo: {
    // backgroundColor: 'red',
    borderRadius: 100,
    aspectRatio: '1',
    width: 40
  },
  thumbnail: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 40
  },
});

export default VideoBox;