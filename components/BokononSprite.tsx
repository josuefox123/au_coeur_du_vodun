import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Image,
  ImageSourcePropType,
  Dimensions,
  Easing,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export type BokononPose = 'idle' | 'throw' | 'point';

interface BokononSpriteProps {
  pose: BokononPose;
  size?: number;
  onFinish?: () => void;
}

const THEME = {
  gold: '#C5A059',
  goldHalo: 'rgba(197, 160, 89, 0.25)',
  shadow: 'rgba(0, 0, 0, 0.55)',
};

// Dictionnaire des frames pour l'option Sprite Sheet
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

// Cauris animés lors du lancer
const COWRIES = [
  { id: 1, endX: -26, endY: 10, rotate: '-25deg' },
  { id: 2, endX: 24, endY: 8, rotate: '30deg' },
  { id: 3, endX: -12, endY: -8, rotate: '15deg' },
  { id: 4, endX: 18, endY: -12, rotate: '-40deg' },
];

export function BokononSprite({
  pose,
  size = width * 0.82,
  onFinish,
}: BokononSpriteProps) {
  const [frameIndex, setFrameIndex] = useState(0);

  // Animations marionnette 2D (Cut-out)
  const breathAnim = useRef(new Animated.Value(0)).current;
  const armAnim = useRef(new Animated.Value(0)).current;
  const headAnim = useRef(new Animated.Value(0)).current;
  const cowriesFlight = useRef(new Animated.Value(0)).current;
  const cowriesOpacity = useRef(new Animated.Value(0)).current;

  // 1. Respiration en boucle (idle)
  useEffect(() => {
    const breathLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: -5,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    breathLoop.start();
    return () => breathLoop.stop();
  }, [breathAnim]);

  // 2. Gestion des poses et synchronisation frames & marionnette
  useEffect(() => {
    setFrameIndex(0);

    if (pose === 'idle') {
      // Alternance des frames idle
      const interval = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % SPRITE_FRAMES.idle.length);
      }, 600);

      Animated.parallel([
        Animated.timing(armAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(headAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(cowriesOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();

      return () => clearInterval(interval);
    }

    if (pose === 'throw') {
      // Défilement rapide des frames du lancer
      let cur = 0;
      const interval = setInterval(() => {
        cur += 1;
        if (cur < SPRITE_FRAMES.throw.length) {
          setFrameIndex(cur);
        } else {
          clearInterval(interval);
          if (onFinish) onFinish();
        }
      }, 140);

      // Animation marionnette du lancer
      Animated.sequence([
        Animated.timing(armAnim, {
          toValue: -30,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(armAnim, {
            toValue: 10,
            duration: 260,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.timing(cowriesOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.spring(cowriesFlight, {
            toValue: 1,
            friction: 4,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      return () => clearInterval(interval);
    }

    if (pose === 'point') {
      // Pose d'incantation : bras tendu vers l'avant
      let cur = 0;
      const interval = setInterval(() => {
        cur += 1;
        if (cur < SPRITE_FRAMES.point.length) {
          setFrameIndex(cur);
        } else {
          clearInterval(interval);
          if (onFinish) onFinish();
        }
      }, 160);

      Animated.parallel([
        Animated.spring(armAnim, {
          toValue: -55,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(headAnim, {
          toValue: -4,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      return () => clearInterval(interval);
    }
  }, [pose, armAnim, headAnim, cowriesFlight, cowriesOpacity, onFinish]);

  const currentFrame =
    SPRITE_FRAMES[pose][frameIndex] || SPRITE_FRAMES[pose][0];

  return (
    <View style={[styles.root, { width: size, height: size }]}>
      {/* Ombre portée ovale au sol (style jeu vidéo) */}
      <View style={styles.groundShadow} />

      {/* Rendu marionnette 2D détourée (sans cadre rectangulaire) */}
      <Animated.View
        style={[
          styles.puppetContainer,
          {
            transform: [{ translateY: breathAnim }],
          },
        ]}>
        {/* Corps du Bokonon assis en tailleur sur sa natte */}
        <View style={styles.bodyMatBase}>
          <View style={styles.reedMat} />
          <View style={styles.foldedLegs} />
          <View style={styles.whiteTunic} />
        </View>

        {/* Tête méditative avec marques et coiffe */}
        <Animated.View
          style={[
            styles.headPiece,
            {
              transform: [{ translateY: headAnim }],
            },
          ]}>
          <View style={styles.ritualCap} />
          <View style={styles.faceHead}>
            <View style={styles.faceMarksRow}>
              <View style={styles.markPip} />
              <View style={styles.markPip} />
              <View style={styles.markPip} />
            </View>
            <View style={styles.eyesClosed} />
            <View style={styles.priestBeard} />
          </View>
        </Animated.View>

        {/* Bras articulé (épaule pivotante qui lance et tend la main) */}
        <Animated.View
          style={[
            styles.armSocket,
            {
              transform: [
                { translateY: -18 },
                {
                  rotate: armAnim.interpolate({
                    inputRange: [-60, 20],
                    outputRange: ['-60deg', '20deg'],
                  }),
                },
                { translateY: 18 },
              ],
            },
          ]}>
          <View style={styles.armSleeve} />
          <View style={styles.handForearm}>
            <View style={styles.handPalm} />
          </View>
        </Animated.View>

        {/* Plateau divinatoire Opon Ifá posé au sol devant le prêtre */}
        <View style={styles.oponTray}>
          <View style={styles.oponInner}>
            <View style={styles.sacredPowder} />

            {/* Cauris animés qui volent et rebondissent */}
            {COWRIES.map((c) => (
              <Animated.View
                key={c.id}
                style={[
                  styles.cowrieShell,
                  {
                    opacity: cowriesOpacity,
                    transform: [
                      {
                        translateX: cowriesFlight.interpolate({
                          inputRange: [0, 1],
                          outputRange: [18, c.endX],
                        }),
                      },
                      {
                        translateY: cowriesFlight.interpolate({
                          inputRange: [0, 0.4, 1],
                          outputRange: [-35, -50, c.endY],
                        }),
                      },
                      {
                        scale: cowriesFlight.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.6, 1],
                        }),
                      },
                    ],
                  },
                ]}>
                <View style={styles.cowrieSlit} />
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Rendu Sprite Sheet si des PNG sont fournis */}
        <Image
          source={currentFrame}
          style={StyleSheet.absoluteFill}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  groundShadow: {
    position: 'absolute',
    bottom: 12,
    width: '74%',
    height: 18,
    borderRadius: 9,
    backgroundColor: THEME.shadow,
    transform: [{ scaleY: 0.5 }],
  },
  puppetContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bodyMatBase: {
    alignItems: 'center',
    marginTop: 35,
  },
  reedMat: {
    position: 'absolute',
    bottom: -18,
    width: 220,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#3D2513',
    borderWidth: 2,
    borderColor: '#613C20',
  },
  foldedLegs: {
    width: 150,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E6E1D5',
    borderWidth: 1.5,
    borderColor: '#C7BFB0',
  },
  whiteTunic: {
    width: 104,
    height: 82,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    backgroundColor: '#FFFFFF',
    marginTop: -38,
    borderWidth: 1.5,
    borderColor: '#DDD8CB',
  },
  headPiece: {
    position: 'absolute',
    top: '18%',
    alignItems: 'center',
    zIndex: 20,
  },
  ritualCap: {
    width: 48,
    height: 38,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#821D12',
    borderWidth: 2,
    borderColor: THEME.gold,
    marginBottom: -6,
  },
  faceHead: {
    width: 54,
    height: 56,
    borderRadius: 27,
    backgroundColor: '#4A2A18',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  faceMarksRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: -8,
    marginBottom: 4,
  },
  markPip: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  eyesClosed: {
    width: 18,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  priestBeard: {
    position: 'absolute',
    bottom: -8,
    width: 28,
    height: 18,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  armSocket: {
    position: 'absolute',
    top: '36%',
    right: '26%',
    width: 22,
    height: 70,
    zIndex: 25,
  },
  armSleeve: {
    width: 22,
    height: 52,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DDD8CB',
  },
  handForearm: {
    position: 'absolute',
    bottom: -4,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4A2A18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  handPalm: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5A331D',
  },
  oponTray: {
    position: 'absolute',
    bottom: 24,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#261207',
    borderWidth: 6,
    borderColor: THEME.gold,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  oponInner: {
    width: 114,
    height: 114,
    borderRadius: 57,
    backgroundColor: '#170A04',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sacredPowder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(211, 179, 106, 0.35)',
  },
  cowrieShell: {
    position: 'absolute',
    width: 12,
    height: 18,
    borderRadius: 8,
    backgroundColor: '#FFF9EB',
    borderWidth: 1,
    borderColor: '#785A28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cowrieSlit: {
    width: 2.5,
    height: 10,
    borderRadius: 1.5,
    backgroundColor: '#785A28',
  },
});
