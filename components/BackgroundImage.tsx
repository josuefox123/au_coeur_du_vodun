import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType, ImageStyle, StyleProp, ViewStyle } from 'react-native';

type Props = {
  source: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  children?: React.ReactNode;
};

export function ImageBackground({ source, style, imageStyle, resizeMode = 'cover', children }: Props) {
  return (
    <View style={style}>
      <Image
        source={source}
        resizeMode={resizeMode}
        style={[StyleSheet.absoluteFill as ImageStyle, imageStyle]}
      />
      {children}
    </View>
  );
}

