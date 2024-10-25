import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { lazy, useEffect, useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { NewsDataType } from '@/types'
import axios from 'axios'
import Loading from '@/components/Loading'
import { Colors } from '@/constants/Colors'
import Moment from "moment"
import AsyncStorage from '@react-native-async-storage/async-storage'

type Props = {}


const NewsDetails = (props: Props) => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [news, setNews] = useState<NewsDataType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bookmark, setBookmark] = useState(false);

    useEffect(() => {
        getgNews();
    }, []);

    useEffect(() => {
        const checkBookmark = async () => {
          if (!isLoading && news.length > 0) {
            const bookmarks = await AsyncStorage.getItem("bookmark");
            const bookmarkArray = bookmarks ? JSON.parse(bookmarks) : [];
            setBookmark(bookmarkArray.includes(news[0].article_id));
          }
        };
        
        checkBookmark();
      }, [isLoading, news]);

    const getgNews = async () => {
        try {
            const URL = `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&id=${id}`
            const response = await axios.get(URL);


            if (response && response.data) {
                setNews(response.data.results);
                setIsLoading(false)
            }
        } catch (err: any) {
            console.log('Error Message:', err.Message)
        }
    };

    const saveBookmark = async (newsId: string) => {
        try {
          const bookmarks = await AsyncStorage.getItem("bookmark");
          let bookmarkArray = bookmarks ? JSON.parse(bookmarks) : [];
          if (!bookmarkArray.includes(newsId)) {
            bookmarkArray.push(newsId);
            await AsyncStorage.setItem("bookmark", JSON.stringify(bookmarkArray));
            setBookmark(true);
            alert("News Saved!");
          }
        } catch (error) {
          console.error("Error saving bookmark:", error);
        }
      };
      
      const removeBookmark = async (newsId: string) => {
        try {
          const bookmarks = await AsyncStorage.getItem("bookmark");
          let bookmarkArray = bookmarks ? JSON.parse(bookmarks) : [];
          bookmarkArray = bookmarkArray.filter((id: string) => id !== newsId);
          await AsyncStorage.setItem("bookmark", JSON.stringify(bookmarkArray));
          setBookmark(false);
          alert("News unsaved!");
        } catch (error) {
          console.error("Error removing bookmark:", error);
        }
      };

    return (
        <>
            <Stack.Screen 
                options={{
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name='arrow-back' size={22} />
                    </TouchableOpacity>
                ),
                headerRight: () => 
                <TouchableOpacity
                    onPress={() => bookmark
                        ? removeBookmark(news[0].article_id)
                        : saveBookmark(news[0].article_id)}>
                    <Ionicons
                        name={bookmark ? "bookmark" : "bookmark-outline"}
                        size={22}
                        color={bookmark ? "blue" : Colors.black} />
                </TouchableOpacity>,
                title: ''
            }} />
            {isLoading ? (
                <Loading size={'large'} />
            ) : (
                <ScrollView contentContainerStyle={styles.contentContainer} style={styles.contentContainer}>
                    <Text style={styles.title}>{news[0].title}</Text>
                    <View style={styles.newsInfoWrapper}>
                        <Text style={styles.newsInfo}>{Moment(news[0].pubDate).format('MMMM DD, hh.mm a')}</Text>
                        <Text style={styles.newsInfo}>{news[0].source_name}</Text>
                    </View>
                    <Image source={{ uri: news[0].image_url }} style={styles.newsImg} />
                    {news[0].description ? (
                        <Text style={styles.newsContent}>{news[0].description}</Text>
                    ) : (
                        <Text style={styles.newsContent}>{news[0].content}</Text>
                    )}
                </ScrollView>
            )}

        </>
    )
}

export default NewsDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,

    },
    contentContainer: {
        marginHorizontal: 8,
        paddingBottom: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.black,
        marginVertical: 10,
    },
    newsImg: {
        width: '100%',
        height: 300,
        marginBottom: 20,
        borderRadius: 10,
    },
    newsInfoWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    newsInfo: {
        fontSize: 12,
        color: Colors.darkGrey
    },
    newsContent: {
        fontSize: 14,
        color: '#555',
        letterSpacing: 0.8,
        lineHeight: 22,
    }
})