import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, ImageSourcePropType, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export type BokononPose = 'idle' | 'throw' | 'point';

interface BokononSpriteProps {
  pose: BokononPose;
  size?: number;
  onFinish?: () => void;
}

// Dictionnaire des poses officielles pour sprites 2D (PNG transparents sans formes CSS)
const SPRITE_FRAMES: Record<BokononPose, ImageSourcePropType[]> = {
  idle: [
    require('@/assets/images/bokonon/bokonon_idle_1.png'),
    require('@/assets/images/bokonon/bokonon_idle_2.png'),
  ],
  throw: [
    require('@/assets/images/bokonon/bokonon_throw_1.png'),
    require('@/assets/images/bokonon/bokonon_throw_2.png'),
    require('@/assets/images/bokonon/bokonon_throw_3.png'),
  ],
  point: [
    require('@/assets/images/bokonon/bokonon_point_1.png'),
    require('@/assets/images/bokonon/bokonon_point_2.png'),
  ],
};

export function BokononSprite({
  pose,
  size = width * 0.85,
  onFinish,
}: BokononSpriteProps) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setFrameIndex(0);

    if (pose === 'idle') {
      const interval = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % SPRITE_FRAMES.idle.length);
      }, 600);
      return () => clearInterval(interval);
    }

    if (pose === 'throw') {
      let cur = 0;
      const interval = setInterval(() => {
        cur += 1;
        if (cur < SPRITE_FRAMES.throw.length) {
          setFrameIndex(cur);
        } else {
          clearInterval(interval);
          if (onFinish) onFinish();
        }
      }, 150);
      return () => clearInterval(interval);
    }

    if (pose === 'point') {
      let cur = 0;
      const interval = setInterval(() => {
        cur += 1;
        if (cur < SPRITE_FRAMES.point.length) {
          setFrameIndex(cur);
        } else {
          clearInterval(interval);
          if (onFinish) onFinish();
        }
      }, 180);
      return () => clearInterval(interval);
    }
  }, [pose, onFinish]);

  const currentFrame =
    SPRITE_FRAMES[pose][frameIndex] || SPRITE_FRAMES[pose][0];

  return (
    <View style={[styles.root, { width: size, height: size }]}>
      <Image
        source={currentFrame}
        style={StyleSheet.absoluteFill}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
});
