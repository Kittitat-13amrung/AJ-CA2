import { Stack, useFocusEffect, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import React from 'react'
import { SimpleLineIcons } from '@expo/vector-icons';
import YoutubePlayer , {YoutubeIframeRef} from 'react-native-youtube-iframe';
import { View, StyleSheet, Text, Platform, useWindowDimensions, Image, FlatList, Pressable } from 'react-native'
import VideoBox from '../../components/video/VideoBox';
import { VideoTypes } from '../../types/VideoTypes';
import Channel from '../../components/video/Channel';
import Comment from '../../components/comment/Comment';
import { CommentProps } from '../../types/CommentTypes';
import Reply from '../../components/comment/Reply';
import { useProfileState } from '../../hooks/useProfileState';


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
  const loggedInChannel = useProfileState();

  // expand/collapse description section
  const [expandDesc, setExpandDesc] = React.useState<boolean>(false);

  // access & set Window's Width & Height before mounting
  React.useEffect(() => {
    if (Platform.OS === "web") {
      setVideoWidth(width / 1.05);
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
    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
      {/* Main Content */}
      <View>
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

        {/* Comment Section */}
        <View>
          {/* Comment Section Header */}
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 24 }}>{comments?.length} Comments</Text>
          </View>
          {/* Reply Component */}
          <Reply updateComments={setComments} avatar={loggedInChannel?.avatar as string} to='video' id={video._id} />
          {/* Comments */}
          <FlatList
            style={{ marginVertical: 30 }}
            data={comments}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <View>
                <Comment comment={item} />
              </View>
            )} 
            onEndReached={fetchMoreComments}
            />

        </View>
      </View>

      {/* Side Videos */}
      <View style={{ width: '30%' }}>
        <FlatList
          data={[video]}
          renderItem={({ item }) => <VideoBox {...video} />}
        />
      </View>
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

export function numberFormat(num: number) {
  return num > 0 ? Intl.NumberFormat('en-US', { notation: 'compact' }).format(num) : num;
}

export function rep(text: string) {
  // Put the URL to variable $1 and Domain name
  // to $3 after visiting the URL
  const Rexp =
    /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig;

  // Replacing the RegExp content by HTML element
  return text.replace(Rexp,
    "{<Link href='$1'>$3</Link>}");
}

export default show;