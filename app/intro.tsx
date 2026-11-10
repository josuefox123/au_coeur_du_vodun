import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  Pressable,
  Easing,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { BokononSprite, BokononPose } from '@/components/BokononSprite';

const { width, height } = Dimensions.get('window');

// CHARTE NOIR ET BLANC & OR SACRÉ
const THEME = {
  black: '#0A0A0A',
  doorBlack: '#121212',
  doorInnerBlack: '#1A1A1A',
  doorBorderWhite: '#FFFFFF',
  doorBorderMuted: '#666666',
  metalHinge: '#2A2A2A',
  metalHighlight: '#CCCCCC',
  gold: '#C5A059',
  goldLight: '#F3E5C2',
  goldHalo: 'rgba(197, 160, 89, 0.22)',
  white: '#FFFFFF',
};

export default function IntroVodunScreen() {
  const router = useRouter();

  // Étape affichée
  const [stepText, setStepText] = useState('Le Bokonon interroge les Esprits...');
  const [currentPose, setCurrentPose] = useState<BokononPose>('idle');

  // Animations du Bokonon (scène 1)
  const auraScale = useRef(new Animated.Value(1)).current;
  const handSparkleAnim = useRef(new Animated.Value(0)).current;
  const speechAnim = useRef(new Animated.Value(0)).current;
  const scenePriestFade = useRef(new Animated.Value(1)).current;

  // Animations des Portes Noir & Blanc 3D (scène 2)
  const doorsEnterAnim = useRef(new Animated.Value(0)).current;
  const doorRotateLeft = useRef(new Animated.Value(0)).current;
  const doorRotateRight = useRef(new Animated.Value(0)).current;
  const sanctuaryGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Aura dorée pulsante en boucle (scale 1 -> 1.08)
    const auraLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(auraScale, {
          toValue: 1.08,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(auraScale, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    auraLoop.start();

    // Séquence synchronisée en 3 actes :
    // 0 -> 1s : Pose idle (respiration)
    // T + 1.0s : Pose throw (le Bokonon jette son Fâ)
    const t1 = setTimeout(() => {
      setStepText('Le Bokonon lance le Fâ sacré...');
      setCurrentPose('throw');
    }, 1000);

    // T + 2.4s : Pose point (main tendue, étincelle et cri d'incantation)
    const t2 = setTimeout(() => {
      setStepText('« Porte, ouvre-toi ! »');
      setCurrentPose('point');

      Animated.parallel([
        Animated.spring(handSparkleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(speechAnim, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2400);

    // T + 4.2s : Fade out du personnage et apparition de la porte 3D
    const t3 = setTimeout(() => {
      Animated.timing(scenePriestFade, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Apparition de la Porte
        Animated.timing(doorsEnterAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          // Les gonds 3D pivotent et les portes s'ouvrent en perspective 3D
          setStepText('Les portes sacrées s’ouvrent...');
          Animated.parallel([
            Animated.timing(doorRotateLeft, {
              toValue: 1,
              duration: 1500,
              easing: Easing.inOut(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(doorRotateRight, {
              toValue: 1,
              duration: 1500,
              easing: Easing.inOut(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(sanctuaryGlow, {
              toValue: 1,
              duration: 1400,
              useNativeDriver: true,
            }),
          ]).start(() => {
            // Entrée vers l'accueil
            router.replace('/(tabs)/accueil');
          });
        });
      });
    }, 4200);

    return () => {
      auraLoop.stop();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [auraScale, handSparkleAnim, speechAnim, scenePriestFade, doorsEnterAnim, doorRotateLeft, doorRotateRight, sanctuaryGlow, router]);

  const handleSkip = () => {
    router.replace('/(tabs)/accueil');
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* ======================================================== */}
      {/* 1. SCÈNE DU BOKONON : SPRITE 2D JEU VIDÉO DÉTOURÉ SANS CADRE */}
      {/* ======================================================== */}
      <Animated.View style={[styles.priestSceneContainer, { opacity: scenePriestFade }]}>
        {/* Aura dorée pulsante derrière le personnage */}
        <Animated.View
          style={[
            styles.priestAura,
            {
              transform: [{ scale: auraScale }],
            },
          ]}
        />

        {/* Bulle d'incantation parlée */}
        <Animated.View
          style={[
            styles.speechBox,
            {
              transform: [
                { scale: speechAnim },
                {
                  translateY: speechAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
              opacity: speechAnim,
            },
          ]}>
          <Text style={styles.speechText}>« PORTE, OUVRE-TOI ! »</Text>
          <View style={styles.speechPointer} />
        </Animated.View>

        {/* Personnage Sprite 2D de jeu vidéo (fond transparent, sans cadre) */}
        <View style={styles.spriteHolder}>
          <BokononSprite pose={currentPose} size={width * 0.85} />

          {/* Étincelle magique dorée au bout de la main tendue */}
          <Animated.View
            style={[
              styles.sparkleHandSpot,
              {
                opacity: handSparkleAnim,
                transform: [
                  {
                    scale: handSparkleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1.25],
                    }),
                  },
                ],
              },
            ]}>
            <MaterialIcons name="auto-awesome" size={40} color={THEME.gold} />
          </Animated.View>
        </View>

        {/* Sous-titre explicatif en bas */}
        <View style={styles.subtitleCapsule}>
          <Text style={styles.subtitleText}>{stepText}</Text>
        </View>
      </Animated.View>

      {/* ======================================================== */}
      {/* 2. PORTE VODOUN NOIR & BLANC AVEC GONDS 3D RÉALISTES     */}
      {/* ======================================================== */}
      <Animated.View
        style={[
          styles.doorsLayer,
          {
            opacity: doorsEnterAnim,
            transform: [
              {
                scale: doorsEnterAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.94, 1],
                }),
              },
            ],
          },
        ]}>
        {/* Lumière éblouissante de l'Accueil révélée derrière */}
        <Animated.View style={[styles.sanctuaryGlowBehind, { opacity: sanctuaryGlow }]}>
          <MaterialIcons name="wb-sunny" size={130} color={THEME.white} />
          <Text style={styles.sanctuaryRevealedTitle}>AU CŒUR DU VODUN</Text>
          <Text style={styles.sanctuaryRevealedSub}>Bienvenue au Sanctuaire</Text>
        </Animated.View>

        {/* ENCADREMENT ET GONDS 3D EN MÉTAL ÉTINCELANT */}
        <View style={styles.doorFrameBorder}>
          {/* GONDS 3D - CÔTÉ GAUCHE (Haut, Milieu, Bas) */}
          <View style={[styles.hinge3D, { top: 70, left: -10 }]}>
            <View style={styles.hingeBasePlate} />
            <View style={styles.hingeCylinder}>
              <View style={styles.hingeCylinderLight} />
              <View style={styles.hingeCylinderCore} />
            </View>
            <View style={styles.hingeLeafPlate} />
          </View>
          <View style={[styles.hinge3D, { top: height * 0.44, left: -10 }]}>
            <View style={styles.hingeBasePlate} />
            <View style={styles.hingeCylinder}>
              <View style={styles.hingeCylinderLight} />
              <View style={styles.hingeCylinderCore} />
            </View>
            <View style={styles.hingeLeafPlate} />
          </View>
          <View style={[styles.hinge3D, { bottom: 70, left: -10 }]}>
            <View style={styles.hingeBasePlate} />
            <View style={styles.hingeCylinder}>
              <View style={styles.hingeCylinderLight} />
              <View style={styles.hingeCylinderCore} />
            </View>
            <View style={styles.hingeLeafPlate} />
          </View>

          {/* GONDS 3D - CÔTÉ DROIT (Haut, Milieu, Bas) */}
          <View style={[styles.hinge3D, { top: 70, right: -10, transform: [{ scaleX: -1 }] }]}>
            <View style={styles.hingeBasePlate} />
            <View style={styles.hingeCylinder}>
              <View style={styles.hingeCylinderLight} />
              <View style={styles.hingeCylinderCore} />
            </View>
            <View style={styles.hingeLeafPlate} />
          </View>
          <View style={[styles.hinge3D, { top: height * 0.44, right: -10, transform: [{ scaleX: -1 }] }]}>
            <View style={styles.hingeBasePlate} />
            <View style={styles.hingeCylinder}>
              <View style={styles.hingeCylinderLight} />
              <View style={styles.hingeCylinderCore} />
            </View>
            <View style={styles.hingeLeafPlate} />
          </View>
          <View style={[styles.hinge3D, { bottom: 70, right: -10, transform: [{ scaleX: -1 }] }]}>
            <View style={styles.hingeBasePlate} />
            <View style={styles.hingeCylinder}>
              <View style={styles.hingeCylinderLight} />
              <View style={styles.hingeCylinderCore} />
            </View>
            <View style={styles.hingeLeafPlate} />
          </View>

          {/* BATTANT GAUCHE - NOIR ET BLANC 3D */}
          <Animated.View
            style={[
              styles.doorLeaf3D,
              styles.doorLeafLeft,
              {
                transform: [
                  { perspective: 900 },
                  {
                    rotateY: doorRotateLeft.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '-82deg'],
                    }),
                  },
                  {
                    translateX: doorRotateLeft.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -width * 0.1],
                    }),
                  },
                ],
              },
            ]}>
            <View style={styles.doorPanelBW}>
              {/* Motifs traditionnels Noir & Blanc sculptés */}
              <View style={styles.reliefHeaderBW}>
                <View style={styles.whiteCircleBadge} />
                <View style={styles.reliefLinesGroup}>
                  <View style={styles.lineWhite} />
                  <View style={styles.lineWhite} />
                </View>
              </View>

              {/* Médaillon central : Dan le Serpent Sacré */}
              <View style={styles.medallionBW}>
                <MaterialIcons name="gesture" size={54} color={THEME.white} />
                <Text style={styles.medallionLabelBW}>DAN</Text>
              </View>

              {/* Lignes rituelles inférieures */}
              <View style={styles.reliefFooterBW}>
                <View style={styles.lineWhiteWide} />
                <View style={styles.lineWhiteWide} />
                <View style={styles.lineWhiteWide} />
              </View>

              {/* Anneau de poignée métallique 3D */}
              <View style={styles.ringHandleLeft}>
                <View style={styles.handleShadow} />
                <View style={styles.metalRing3D} />
              </View>
            </View>
          </Animated.View>

          {/* BATTANT DROIT - NOIR ET BLANC 3D */}
          <Animated.View
            style={[
              styles.doorLeaf3D,
              styles.doorLeafRight,
              {
                transform: [
                  { perspective: 900 },
                  {
                    rotateY: doorRotateRight.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '82deg'],
                    }),
                  },
                  {
                    translateX: doorRotateRight.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, width * 0.1],
                    }),
                  },
                ],
              },
            ]}>
            <View style={styles.doorPanelBW}>
              {/* Motifs traditionnels Noir & Blanc sculptés */}
              <View style={styles.reliefHeaderBW}>
                <View style={styles.whiteCircleBadge} />
                <View style={styles.reliefLinesGroup}>
                  <View style={styles.lineWhite} />
                  <View style={styles.lineWhite} />
                </View>
              </View>

              {/* Médaillon central : Fâ Sacré */}
              <View style={styles.medallionBW}>
                <MaterialIcons name="wb-sunny" size={50} color={THEME.white} />
                <Text style={styles.medallionLabelBW}>FÂ</Text>
              </View>

              {/* Lignes rituelles inférieures */}
              <View style={styles.reliefFooterBW}>
                <View style={styles.lineWhiteWide} />
                <View style={styles.lineWhiteWide} />
                <View style={styles.lineWhiteWide} />
              </View>

              {/* Anneau de poignée métallique 3D */}
              <View style={styles.ringHandleRight}>
                <View style={styles.handleShadow} />
                <View style={styles.metalRing3D} />
              </View>
            </View>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Bouton Passer */}
      <Pressable style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>Passer</Text>
        <MaterialIcons name="chevron-right" size={16} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.black,
    overflow: 'hidden',
  },

  // 1. SCÈNE DU PRÊTRE (BOKONON) EN PREMIER PLAN DIRECT
  priestSceneContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  priestAura: {
    position: 'absolute',
    width: 290,
    height: 290,
    borderRadius: 145,
    backgroundColor: THEME.goldHalo,
    top: height * 0.20,
  },

  // Bulle de commande
  speechBox: {
    position: 'absolute',
    top: height * 0.14,
    backgroundColor: THEME.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: THEME.gold,
    shadowColor: THEME.gold,
    shadowOpacity: 0.8,
    shadowRadius: 18,
    elevation: 12,
    zIndex: 60,
  },
  speechText: {
    color: '#0A0A0A',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 2,
  },
  speechPointer: {
    position: 'absolute',
    bottom: -9,
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderTopWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: THEME.white,
  },

  // Support du Sprite (sans aucun cadre ni fond rectangulaire)
  spriteHolder: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 10,
  },
  sparkleHandSpot: {
    position: 'absolute',
    top: '36%',
    right: '18%',
    shadowColor: THEME.gold,
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 35,
  },

  subtitleCapsule: {
    marginTop: 26,
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  subtitleText: {
    color: THEME.white,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
  },

  // 2. PORTES VODOUN NOIR & BLANC 3D
  doorsLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sanctuaryGlowBehind: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  sanctuaryRevealedTitle: {
    color: THEME.white,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 4,
    marginTop: 18,
  },
  sanctuaryRevealedSub: {
    color: THEME.goldLight,
    fontSize: 14,
    letterSpacing: 2,
    marginTop: 6,
  },
  doorFrameBorder: {
    width: width,
    height: height,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // GONDS 3D EN RELIEF ET MÉTAL ÉTINCELANT
  hinge3D: {
    position: 'absolute',
    width: 22,
    height: 38,
    zIndex: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hingeBasePlate: {
    width: 7,
    height: 34,
    backgroundColor: THEME.metalHinge,
    borderWidth: 1,
    borderColor: THEME.metalHighlight,
    borderRadius: 2,
  },
  hingeCylinder: {
    width: 8,
    height: 38,
    backgroundColor: '#3A3A3A',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#777777',
    overflow: 'hidden',
    position: 'relative',
  },
  hingeCylinderLight: {
    position: 'absolute',
    top: 0,
    left: 1,
    width: 2,
    bottom: 0,
    backgroundColor: THEME.white,
    opacity: 0.6,
  },
  hingeCylinderCore: {
    position: 'absolute',
    top: 0,
    right: 1,
    width: 2,
    bottom: 0,
    backgroundColor: '#111111',
  },
  hingeLeafPlate: {
    width: 7,
    height: 34,
    backgroundColor: THEME.metalHinge,
    borderWidth: 1,
    borderColor: THEME.metalHighlight,
    borderRadius: 2,
  },

  // BATTANTS 3D EN NOIR ET BLANC
  doorLeaf3D: {
    position: 'absolute',
    width: width * 0.5,
    height: height * 0.9,
    top: height * 0.05,
    backgroundColor: THEME.doorBlack,
    borderColor: THEME.doorBorderWhite,
    borderWidth: 3,
  },
  doorLeafLeft: {
    left: 0,
    borderRightWidth: 1.5,
  },
  doorLeafRight: {
    right: 0,
    borderLeftWidth: 1.5,
  },
  doorPanelBW: {
    flex: 1,
    backgroundColor: THEME.doorInnerBlack,
    margin: 6,
    borderWidth: 1.5,
    borderColor: THEME.doorBorderMuted,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 12,
  },
  reliefHeaderBW: {
    alignItems: 'center',
    gap: 8,
  },
  whiteCircleBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: THEME.white,
    borderWidth: 2,
    borderColor: THEME.gold,
  },
  reliefLinesGroup: {
    gap: 4,
    alignItems: 'center',
  },
  lineWhite: {
    width: 48,
    height: 2,
    backgroundColor: THEME.white,
    opacity: 0.8,
  },
  medallionBW: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: THEME.white,
    backgroundColor: '#141414',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.gold,
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  medallionLabelBW: {
    color: THEME.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 4,
  },
  reliefFooterBW: {
    gap: 5,
    alignItems: 'center',
    width: '100%',
  },
  lineWhiteWide: {
    width: '75%',
    height: 2,
    backgroundColor: THEME.white,
    opacity: 0.7,
  },
  ringHandleLeft: {
    position: 'absolute',
    right: 12,
    top: height * 0.42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringHandleRight: {
    position: 'absolute',
    left: 12,
    top: height * 0.42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleShadow: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    opacity: 0.6,
    top: 4,
  },
  metalRing3D: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: THEME.gold,
    backgroundColor: 'transparent',
    shadowColor: THEME.gold,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 6,
  },
  skipButton: {
    position: 'absolute',
    top: 48,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 100,
  },
  skipButtonText: {
    color: THEME.white,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
