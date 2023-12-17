import React from 'react'
import { View, StyleSheet, FlatList, Text, useWindowDimensions, ScrollView } from 'react-native'
import VideoBox from '../components/video/VideoBox';
import { VideoTypes } from '../types/VideoTypes';
import { Stack } from 'expo-router';
import VideoList from '../components/video/VideoList';

const index = () => {
    const [videos, setVideos] = React.useState<VideoTypes[]>([]);
    const [page, setPage] = React.useState<number>(1);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<String>("");

    // set title name
    React.useEffect(() => {
        window.document.title = 'Home';
    }, []);

    // fetch videos from api based on page state
    React.useEffect(() => {
        fetch(`https://aj-ca-1.vercel.app/api/videos?limit=30&page=${page}`, {
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
                setVideos(prevVideos => {
                    return prevVideos.concat(data.videos)
                });
            })
            .catch(err => {
                console.error(err);
                setError(err.message)
            });
    }, [page]);

    // fetch for more videos when end of list is reached
    const fetchMoreVideos = () => {
        setPage(prevPage => prevPage + 1);
    }

    return (
        <VideoList onEndReached={fetchMoreVideos} videos={videos} />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#181818',
        height: '100%',
    }
})

export default index;