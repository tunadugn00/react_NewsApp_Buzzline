import { StyleSheet, Text, View, Image, Dimensions,TouchableOpacity } from 'react-native'
import React from 'react'
import { NewsDataType } from '@/types'
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '@/constants/Colors'
import { Link } from 'expo-router'

const { width: SCREEN_WIDTH } = Dimensions.get('screen');

type Props = {
  slideItem: NewsDataType,
  index: number,
  scrollX: SharedValue<number>,
  itemWidth: number,
  spacing: number
}

const SliderItem = ({ slideItem, index, scrollX, itemWidth, spacing }: Props) => {
  const size = itemWidth + spacing;

  const inputRange = [
    (index - 1) * size,
    index * size,
    (index + 1) * size
  ];

  const rnStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            inputRange,
            [0.85, 1, 0.85],
            Extrapolation.CLAMP
          ),
        },
      ],
      opacity: interpolate(
        scrollX.value,
        inputRange,
        [0.6, 1, 0.6],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <Link href={`/news/${slideItem.article_id}`} asChild>
      <TouchableOpacity>
        <Animated.View style={[
          styles.itemWrapper,
          {
            width: itemWidth,
            marginHorizontal: spacing / 2
          },
          rnStyle
        ]} key={slideItem.article_id}>
          <Image
            source={{ uri: slideItem.image_url }}
            style={[styles.image, { width: itemWidth }]}
          />
          <LinearGradient
            colors={["transparent", 'rgba(0,0,0,0.8)']}
            style={[styles.background, { width: itemWidth }]}
          >
            <View style={styles.sourceInfo}>
              {slideItem.source_icon && (
                <Image source={{ uri: slideItem.source_icon }} style={styles.sourceIcon} />
              )}
              <Text style={styles.sourceName}>{slideItem.source_name}</Text>
            </View>
            <Text style={styles.title} numberOfLines={2}>{slideItem.title}</Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  )
}

export default SliderItem

const styles = StyleSheet.create({
  itemWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  image: {
    height: 180,
    borderRadius: 20,
  },
  background: {
    position: 'absolute',
    height: 180,
    borderRadius: 20,
    padding: 20,
  },
  sourceInfo: {
    flexDirection: 'row',
    position: 'absolute',
    top: 85,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 10,
  },
  sourceName: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600'
  },
  sourceIcon: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 14,
    color: Colors.white,
    position: 'absolute',
    top: 120,
    paddingHorizontal: 20,
    fontWeight: '600'
  },
})