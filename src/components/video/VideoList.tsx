import React from 'react'
import { FlatList, View, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import VideoBox from './VideoBox';
import { VideoTypes } from '../../types/VideoTypes';

type Props = {
    videos: VideoTypes[];
    onEndReached?: () => void;
}

const VideoList: React.FC<Props> = ({ videos, onEndReached }) => {
    const { width, height } = useWindowDimensions();
    const [numColumns, setNumColumns] = React.useState(calcNumColumns(width));

    const formatData = (data: VideoTypes[], numColumns: number) => {
        const amountFullRows = Math.floor(data.length / numColumns);
        let amountItemsLastRow = data.length - amountFullRows * numColumns;

        let temp = Array.from(data);

        while (amountItemsLastRow !== numColumns && amountItemsLastRow !== 0) {
            const obj = {
                _id: 'string',
                url: 'string',
                title: 'string',
                thumbnail: 'string',
                duration: 0,
                updatedAt: new Date(),
                createdAt: new Date(),
                description: '',
                likes: 1,
                dislikes: 1,
                views: 0,
                channel: {
                    _id: 'string',
                    username: 'string',
                    avatar: 'string'
                },
                key: `empty-${amountItemsLastRow}`,
                empty: true
            }

            temp.push(obj)
            amountItemsLastRow++;
        }

        return temp;
    };

    React.useEffect(() => {
        // set amount of videos to fit in a column
        setNumColumns(calcNumColumns(width));
    }, [width]);

    // loading placeholder of 10 items
    const templateArr = Array(10).fill(0);

    const renderItem = ({ item }) => {
        if (item.empty) {
            return <View style={[styles.item, styles.itemTransparent]} />;
        }

        return (
            <View style={styles.item}>
                <VideoBox key={item._id} _id={item._id} title={item.title} url={item.url} thumbnail={item.thumbnail} channel={item.channel} duration={item.duration} views={item.views} createdAt={item.createdAt} updatedAt={item.updatedAt} />
            </View>
        )
    }

    function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    return videos.length > 0 ? (
        <FlatList data={formatData(videos, numColumns)} renderItem={renderItem}
            contentContainerStyle={styles.videoContainer}
            // showsVerticalScrollIndicator={false}
            getItemLayout={(data, index) => ({ length: 380, offset: 380 * index, index })}
            key={numColumns}
            numColumns={numColumns}
            onEndReached={({ distanceFromEnd }) => debounce(onEndReached(), 500)}
            onEndReachedThreshold={0.5}
        />
    ) : (
        <View style={styles.container}>
            {/* <View style={styles.videoContainer}>
    
            <FlatList data={formatData(templateArr, numColumns)} renderItem={({ item }) => {
              if (item.empty) {
                return <View style={[styles.item, styles.itemTransparent]} />;
              }
    
              return (
                <View style={styles.item}>
                  <VideoBoxTemplate />
                </View>
              )
            }
            }
              key={numColumns}
              numColumns={numColumns}
            />
          </View> */}
        </View>
    );
}

const calcNumColumns = (width: number, minCols: number = 1) => {
    const cols = width / styles.item.width;
    const colsFloor = Math.floor(cols) > minCols ? Math.floor(cols) : minCols;
    const colsMinusMargin = cols - .5 * colsFloor * styles.item.margin;
    if (colsMinusMargin < colsFloor && colsFloor > minCols) return colsFloor - 1;
    else return colsFloor;
};

const styles = StyleSheet.create({
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 3,
        width: 380,
    },
    itemTransparent: {
        backgroundColor: 'transparent'
    },
    videoContainer: {
        paddingVertical: 10,
        alignItems: 'center', // if you want to fill rows left to right
        justifyContent: 'space-around',
        backgroundColor: '#181818',
    },
    container: {
        backgroundColor: '#181818',
        // height: '100%',
        // flex: 1,
    }
});

export default VideoList;