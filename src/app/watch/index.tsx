import { Stack, useFocusEffect, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import React from 'react'
import { SimpleLineIcons } from '@expo/vector-icons';
import YoutubePlayer , {YoutubeIframeRef} from 'react-native-youtube-iframe';
import { View, StyleSheet, Text, Platform, useWindowDimensions, Image, FlatList, Pressable } from 'react-native'
import { VideoTypes } from '../../types/VideoTypes';
import Channel from '../../components/video/Channel';
import { CommentProps } from '../../types/CommentTypes';
import SideVideoList from '../../components/video/SideVideoList';
import CommentView from '../../components/comment/CommentView';
import DescriptionSection from '../../components/video/DescriptionSection';
import { numberFormat } from '../../common/functions/numberFormat';


type SearchParamType = {
  v: string,
  query?: string
};

const show = () => {
  const { v: id } = useGlobalSearchParams<SearchParamType>();
  const playerRef = React.useRef<YoutubeIframeRef | null>(null);
  const { width, height } = useWindowDimensions();
  const [videoWidth, setVideoWidth] = React.useState(width / 16);
  const [videoHeight, setVideoHeight] = React.useState(height / 8);
  const [video, setVideo] = React.useState<VideoTypes>();
  const [comments, setComments] = React.useState<CommentProps[]>();

  // access & set Window's Width & Height before mounting
  React.useEffect(() => {
    if (Platform.OS === "web") {
      setVideoWidth(width * 0.75);
      setVideoHeight(height / 9);
    }
  }, [width]);

  React.useEffect(() => {
    // fetch Video depending on id
    fetch(`https://aj-ca-1.vercel.app/api/videos/${id}`, {
      method: "GET"
    })
      .then(async (data) => {
        const response = await data.json();

        if (data.ok) {
          console.log(response)
          return response;
        }

        throw response;
      })
      .then(res => {
        // format likes/dislikes
        const numIntl = Intl.NumberFormat('en-US', {
          notation: 'compact'
        });

        res.likes = numIntl.format(res.likes);
        res.dislikes = numIntl.format(res.dislikes);

        // res.description = rep(res.description);
        setVideo(res);

        window.document.title = res.title;


      })
      .catch(err => {
        console.error(err);
      });

    // fetch comments
    fetch(`https://aj-ca-1.vercel.app/api/videos/${id}/comments`, {
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

  }, [id]);

  const fetchMoreComments = () => {
    const initLength = Math.max(comments?.length as number, 10);

    const length = initLength + 10;

    fetch(`http://localhost:3000/api/videos/${id}/comments?comment_limit=${length}`, {
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
        setComments(res);

      })
      .catch(err => {
        console.error(err);
      });
  }

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
          <Channel _id={video?.channel?._id as string} />
          {/* likes and dislikes and other buttons */}
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 20, borderRadius: 40, backgroundColor: '#21212190' }}>
            <SimpleLineIcons name="dislike" size={16} color="white" />
            <Text style={{ fontSize: 16, color: 'white' }}>{numberFormat(video.likes as number)}</Text>
            <SimpleLineIcons name="dislike" size={16} color="white" />
            <Text style={{ fontSize: 16, color: 'white' }}>{numberFormat(video.dislikes as number)}</Text>
          </View>

        </View>

        {/* Description Section */}
        <DescriptionSection video={video}/>

        {/* Comment Section */}
        <CommentView comments={comments} setComments={setComments} video_id={video._id}/>
      </View>

      {/* Side Videos */}
      <SideVideoList videos={[video]}/>
    </View>
  ) : (
    <View style={{ minHeight: '100%', backgroundColor: '#181818' }}>
      <Text>Loading...</Text>
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