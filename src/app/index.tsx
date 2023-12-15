import React from 'react'
import { View, StyleSheet, FlatList, Text, useWindowDimensions } from 'react-native'
import VideoBox from '../components/video/VideoBox';
import { VideoTypes } from '../types/VideoTypes';
import { Stack } from 'expo-router';
import VideoList from '../components/video/VideoList';

const index = () => {
  const [videos, setVideos] = React.useState<VideoTypes[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<String>("");

  React.useEffect(() => {
    window.document.title = 'Home';

    fetch('https://aj-ca-1.vercel.app/api/videos?limit=200', {
      method: "GET",
    }).then(async (data) => {
      const response = await data.json()

      if (data.ok) {
        return response
      }

      throw response
    })
      .then(data => {
        // console.log(data)
        setVideos(data.videos)
      })
      .catch(err => {
        console.error(err);
        setError(err.message)
      });

  }, []);

  const fetchMoreVideos = (end:number) => {
    console.log('fetching', end)
    if(!isLoading) {
      setIsLoading(true);
      fetch(`http://localhost:3000/api/videos?limit=20&page=${page}`, {
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
          setPage(prevPage => prevPage + 1);
          // setIsLoading(false);
          console.log(res.videos)
  
          setVideos(prevVideos => {
            return prevVideos.concat(res.videos)
          });
  
          // console.log(videos)
  
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  return (
    <VideoList videos={videos} />
  );
};

export default index;