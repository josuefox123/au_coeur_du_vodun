import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ImageSourcePropType,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { FEED_ITEMS } from '@/constants/FeedData';

const C = {
  black: '#0E0E0E',
  panel: '#1A1A1A',
  white: '#FFFFFF',
  cream: '#F7F4EE',
  border: '#E9E4DA',
  gold: '#C5A059',
  goldDark: '#9E7D3B',
  text: '#111111',
  muted: '#7A7A7A',
  light: '#EDEDED',
};

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

interface Service {
  id: string;
  name: string;
  desc: string;
  price: string;
  tag: string;
  cat: string;
  image: ImageSourcePropType;
}

const SERVICES: Service[] = [
  {
    id: 'fa-consultation',
    name: 'Consultation Fâ',
    desc: 'Oracle, destinée et guidance',
    price: '25 000 FCFA',
    tag: 'POPULAIRE',
    cat: 'fa',
    image: require('@/assets/images/fronton_soleil.jpg'),
  },
  {
    id: 'vodun-guidance',
    name: 'Guidance Vodun',
    desc: 'Rituels et bénédiction',
    price: 'Sur devis',
    tag: 'SUR PLACE',
    cat: 'vodun',
    image: require('@/assets/images/temple_facade.jpg'),
  },
  {
    id: 'bo-protection',
    name: 'Rituel de Protection',
    desc: 'Bo, consécration sacrée',
    price: 'Sur devis',
    tag: 'PROTECTION',
    cat: 'bo',
    image: require('@/assets/images/embleme_officiel.png'),
  },
  {
    id: 'zannuyun-purification',
    name: 'Bain de Purification',
    desc: 'Plantes sacrées, Zannuyun',
    price: '30 000 FCFA',
    tag: 'SUR PLACE',
    cat: 'zannuyun',
    image: require('@/assets/images/temple.jpg'),
  },
  {
    id: 'coaching-spirituel',
    name: 'Coaching Spirituel',
    desc: 'Orientation de vie avec le Bokonon',
    price: '35 000 FCFA',
    tag: 'CHOIX DU BOKONON',
    cat: 'coaching',
    image: require('@/assets/images/fronton_soleil.jpg'),
  },
];

interface PriestAudio {
  id: string;
  title: string;
  theme: string;
  duration: string;
  date: string;
  excerpt: string;
}

const PRIEST_AUDIOS: PriestAudio[] = [
  {
    id: 'audio-1',
    title: 'La paix du cœur avant la tempête',
    theme: 'ENSEIGNEMENT DU FÂ',
    duration: '03:45',
    date: "Aujourd'hui",
    excerpt: '« Écoutez le bruissement des feuilles et laissez le signe apaiser votre esprit. »',
  },
  {
    id: 'audio-2',
    title: 'Bénédiction ancestrale & clarté',
    theme: 'PRIÈRE AUX DISCIPLES',
    duration: '02:30',
    date: 'Hier',
    excerpt: '« Que la lumière d\'Orisha illumine votre route et fortifie vos démarches. »',
  },
  {
    id: 'audio-3',
    title: 'Humilité et lois de la prospérité',
    theme: 'PAROLE DU BOKONON',
    duration: '05:12',
    date: 'Cette semaine',
    excerpt: '« L\'arbre qui donne le plus d\'ombre est celui qui s\'enracine dans la sagesse. »',
  },
  {
    id: 'audio-4',
    title: 'Purification spirituelle du soir',
    theme: 'RITUEL QUOTIDIEN',
    duration: '04:20',
    date: 'Il y a 4 jours',
    excerpt: '« Libérez les tensions et confiez vos doutes aux ancêtres bienveillants. »',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [playingAudioId, setPlayingAudioId] = useState<string | null>('audio-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [feedFilter, setFeedFilter] = useState<'ALL' | 'ACTU' | 'VIDEO' | 'BLOG' | 'IMAGE'>('ALL');

  // Animations pour la bulle cauri : flottaison et aura divine sombre
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    floatLoop.start();
    glowLoop.start();

    return () => {
      floatLoop.stop();
      glowLoop.stop();
    };
  }, [floatAnim, glowAnim]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  const glowScaleOuter = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.14],
  });

  const glowOpacityOuter = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.75],
  });

  const glowScaleInner = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.07],
  });

  const glowOpacityInner = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0.85],
  });

  const list = SERVICES;

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}>
        {/* ===== ZONE NOIRE : header + recherche + hero ===== */}
        <View style={[styles.dark, { paddingTop: insets.top + 10 }]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>


          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.heroImageWrap}>
              <Image
                source={require('@/assets/images/temple.jpg')}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <View style={[styles.fade, { left: 0, width: 18, opacity: 0.95 }]} />
              <View style={[styles.fade, { left: 18, width: 18, opacity: 0.7 }]} />
              <View style={[styles.fade, { left: 36, width: 18, opacity: 0.4 }]} />
              <View style={[styles.fade, { left: 54, width: 18, opacity: 0.18 }]} />
            </View>

            <View style={styles.heroText}>
              <Text style={styles.heroScript}>Bienvenue</Text>
              <Text style={styles.heroTitle}>SAGESSE.</Text>
              <Text style={styles.heroTitle}>GUIDANCE.</Text>
              <Text style={[styles.heroTitle, { color: C.gold }]}>SÉRÉNITÉ.</Text>
              <Text style={styles.heroSub}>Consultations Fâ et{'\n'}accompagnement spirituel.</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Prendre rendez-vous"
                style={({ pressed }) => [styles.heroBtn, pressed && styles.pressed]}
                onPress={() => router.push('/(tabs)/rendez-vous' as any)}>
                <Text style={styles.heroBtnText}>PRENDRE RDV</Text>
                <View style={styles.heroBtnArrow}>
                  <MaterialIcons name="arrow-forward" size={14} color={C.black} />
                </View>
              </Pressable>
            </View>
          </View>

          <View style={styles.dots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* ===== ZONE CLAIRE ===== */}
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom + 24, 36) }]}>
          {/* Rubrique : Enseignements & Audios du Prêtre de Fâ */}
          <View style={styles.audioSectionHeader}>
            <View>
              <Text style={styles.audioSectionKicker}>PAROLES DU BOKONON</Text>
              <Text style={styles.audioSectionTitle}>Audios aux Disciples</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voir tous les audios et enseignements du Bokonon"
              style={({ pressed }) => [styles.audioViewMoreBtn, pressed && styles.pressed]}
              onPress={() => router.push('/enseignements' as any)}>
              <Text style={styles.audioViewMoreText}>Voir plus</Text>
              <MaterialIcons name="arrow-forward" size={14} color={C.goldDark} />
            </Pressable>
          </View>

          {/* Grille 2 par ligne (4 éléments au total) pour les Paroles du Bokonon */}
          <View style={styles.audioGrid}>
            {PRIEST_AUDIOS.slice(0, 4).map((item) => {
              const active = playingAudioId === item.id;
              const currentlyPlaying = active && isPlaying;
              return (
                <View
                  key={item.id}
                  style={[styles.audioGridCard, active && styles.audioGridCardActive]}>
                  {/* Entête */}
                  <View style={styles.audioTopRow}>
                    <View style={styles.audioThemeWrap}>
                      <MaterialIcons name="headphones" size={12} color={C.goldDark} />
                      <Text style={styles.audioThemeText} numberOfLines={1}>{item.theme}</Text>
                    </View>
                  </View>

                  {/* Titre & Extrait */}
                  <Text style={styles.audioGridTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.audioGridExcerpt} numberOfLines={2}>
                    {item.excerpt}
                  </Text>

                  {/* Contrôleur Audio compact */}
                  <View style={styles.audioGridPlayerRow}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={currentlyPlaying ? 'Mettre en pause' : 'Écouter l\'audio'}
                      style={({ pressed }) => [styles.audioGridPlayBtn, pressed && styles.pressed]}
                      onPress={() => {
                        if (active) {
                          setIsPlaying(!isPlaying);
                        } else {
                          setPlayingAudioId(item.id);
                          setIsPlaying(true);
                        }
                      }}>
                      <MaterialIcons
                        name={currentlyPlaying ? 'pause' : 'play-arrow'}
                        size={18}
                        color={C.gold}
                      />
                    </Pressable>

                    <View style={styles.audioGridInfo}>
                      <Text style={styles.audioGridDuration}>{item.duration}</Text>
                      <Text style={styles.audioGridDate}>{item.date}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Consultations populaires */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Consultations populaires</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voir tous les services"
              style={styles.viewAll}
              onPress={() => router.push('/(tabs)/services' as any)}>
              <Text style={styles.viewAllText}>Voir tout</Text>
              <MaterialIcons name="arrow-forward" size={15} color={C.goldDark} />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsTrack}>
            {list.map((s) => (
              <Pressable
                key={s.id}
                accessibilityRole="button"
                accessibilityLabel={`${s.name}, ${s.price}`}
                style={({ pressed }) => [styles.card, pressed && styles.pressed]}
                onPress={() =>
                  router.push({
                    pathname: '/consultation',
                    params: { serviceId: s.id, serviceName: s.name },
                  } as any)
                }>
                <View style={styles.cardImageWrap}>
                  <Image source={s.image} style={styles.cardImage} resizeMode="cover" />
                  <View style={styles.cardTag}>
                    <Text style={styles.cardTagText}>{s.tag}</Text>
                  </View>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{s.name}</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>{s.desc}</Text>
                  <View style={styles.cardBottom}>
                    <Text style={styles.cardPrice}>{s.price}</Text>
                    <View style={styles.cardAdd}>
                      <MaterialIcons name="add" size={18} color={C.white} />
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          {/* Bandeau Fadu */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Envoyer mon Fadu au Bokonon"
            style={({ pressed }) => [styles.promo, pressed && styles.pressed]}
            onPress={() => router.push('/(tabs)/fadu' as any)}>
            <View style={styles.promoText}>
              <Text style={styles.promoKicker}>CONSULTATION À DISTANCE</Text>
              <Text style={styles.promoTitle}>Envoyer mon Fadu</Text>
              <Text style={styles.promoSub}>Transmettez une photo au Bokonon,{'\n'}en toute confidentialité.</Text>
              <View style={styles.promoBtn}>
                <Text style={styles.promoBtnText}>ENVOYER</Text>
                <View style={styles.heroBtnArrow}>
                  <MaterialIcons name="arrow-forward" size={14} color={C.black} />
                </View>
              </View>
            </View>
            <View style={styles.promoBadge}>
              <MaterialIcons name="photo-camera" size={30} color={C.gold} />
            </View>
          </Pressable>

          {/* ======================================================== */}
          {/* SECTION EN BAS : CHRONIQUE, ACTUALITÉS & MÉDIAS DU BOKONON */}
          {/* ======================================================== */}
          <View style={styles.sectionRow}>
            <View>
              <Text style={styles.sectionTitle}>Chronique & Médias</Text>
              <Text style={styles.sectionSubtitle}>Actualités, vidéos & blog du Bokonon</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voir plus d'actualités et médias"
              style={styles.viewAll}
              onPress={() => router.push('/feed' as any)}>
              <Text style={styles.viewAllText}>Voir plus</Text>
              <MaterialIcons name="arrow-forward" size={15} color={C.goldDark} />
            </Pressable>
          </View>

          {/* Grille 2 par ligne (4 éléments au total) */}
          <View style={styles.homeGrid}>
            {FEED_ITEMS.slice(0, 4).map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [styles.homeGridCard, pressed && styles.pressed]}
                onPress={() =>
                  router.push({
                    pathname: '/feed-detail' as any,
                    params: { id: item.id },
                  })
                }>
                <View style={styles.homeGridImageWrap}>
                  <Image source={item.image} style={styles.homeGridImage} resizeMode="cover" />
                  <View style={styles.homeGridTypeBadge}>
                    <MaterialIcons
                      name={
                        item.type === 'VIDEO'
                          ? 'videocam'
                          : item.type === 'BLOG'
                          ? 'menu-book'
                          : item.type === 'IMAGE'
                          ? 'photo-camera'
                          : 'campaign'
                      }
                      size={11}
                      color={C.gold}
                      style={{ marginRight: 3 }}
                    />
                    <Text style={styles.homeGridTypeBadgeText}>
                      {item.type === 'VIDEO' ? 'Vidéo' : item.type === 'BLOG' ? 'Blog' : item.type === 'IMAGE' ? 'Galerie' : 'Actu'}
                    </Text>
                  </View>
                  {item.type === 'VIDEO' && (
                    <View style={styles.homeGridVideoOverlay}>
                      <MaterialIcons name="play-circle-fill" size={30} color={C.gold} />
                    </View>
                  )}
                </View>
                <View style={styles.homeGridBody}>
                  <Text style={styles.homeGridDate}>{item.date}</Text>
                  <Text style={styles.homeGridTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.homeGridFooter}>
                    <View style={styles.homeGridLikes}>
                      <MaterialIcons name="favorite" size={11} color={C.gold} />
                      <Text style={styles.homeGridLikesText}>{item.likes}</Text>
                    </View>
                    <Text style={styles.homeGridReadMore}>Lire ›</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.confRow}>
            <MaterialIcons name="lock-outline" size={13} color={C.muted} />
            <Text style={styles.confText}>Échanges et photographies strictement confidentiels.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bulle de service client flottante avec aura divine sombre */}
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.cowrieWrapper,
          {
            transform: [{ translateY }],
          },
        ]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Service client, ouvrir la messagerie"
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          style={({ pressed }) => [styles.cowrie, pressed && styles.pressed]}
          onPress={() => router.push('/modal' as any)}>
          {/* Halo divin mystique sombre (externe) */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.divineGlowOuter,
              {
                transform: [{ scale: glowScaleOuter }],
                opacity: glowOpacityOuter,
              },
            ]}
          />

          {/* Halo divin sombre intermédiaire */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.divineGlowInner,
              {
                transform: [{ scale: glowScaleInner }],
                opacity: glowOpacityInner,
              },
            ]}
          />

          {/* Corps du cauri sacré */}
          <View style={styles.cowrieBody}>
            <View style={styles.cowrieShine} />
            <View style={styles.cowrieSlit} />
            {[0, 1, 2, 3, 4].map((i) => (
              <React.Fragment key={i}>
                <View style={[styles.cowrieTooth, { top: 12 + i * 6, left: 11 }]} />
                <View style={[styles.cowrieTooth, { top: 12 + i * 6, right: 11 }]} />
              </React.Fragment>
            ))}
          </View>

          {/* Badge icône de messagerie */}
          <View style={styles.cowrieChat}>
            <MaterialIcons name="chat" size={12} color={C.gold} />
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.black },
  pressed: { opacity: 0.88 },

  cowrieWrapper: {
    position: 'absolute',
    right: 18,
    bottom: 20,
    zIndex: 9999,
    elevation: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cowrie: {
    width: 62,
    height: 74,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divineGlowOuter: {
    position: 'absolute',
    width: 60,
    height: 72,
    borderRadius: 34,
    backgroundColor: 'rgba(14, 14, 14, 0.72)',
    borderWidth: 1.2,
    borderColor: 'rgba(197, 160, 89, 0.45)',
    shadowColor: C.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 12,
  },
  divineGlowInner: {
    position: 'absolute',
    width: 52,
    height: 64,
    borderRadius: 28,
    backgroundColor: 'rgba(197, 160, 89, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.65)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  cowrieBody: {
    width: 44,
    height: 58,
    borderRadius: 29,
    backgroundColor: C.gold,
    borderWidth: 1.8,
    borderColor: C.goldDark,
    transform: [{ rotate: '-14deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 8,
  },
  cowrieShine: {
    position: 'absolute',
    top: 5,
    left: 7,
    width: 10,
    height: 22,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  cowrieSlit: {
    width: 7,
    height: 44,
    borderRadius: 4,
    backgroundColor: C.black,
  },
  cowrieTooth: {
    position: 'absolute',
    width: 6,
    height: 2,
    borderRadius: 1.5,
    backgroundColor: C.goldDark,
  },
  cowrieChat: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.black,
    borderWidth: 1.2,
    borderColor: C.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dark: { backgroundColor: C.black, paddingHorizontal: 18, paddingBottom: 34 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  brandCenter: { flex: 1, alignItems: 'center' },
  logo: { width: 280, height: 150 },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: C.gold,
  },

  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  search: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    backgroundColor: C.panel,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
  searchText: { fontSize: 14, color: '#B5B5B5', flex: 1 },
  filterBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    backgroundColor: C.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },

  hero: {
    height: 215,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.35)',
    flexDirection: 'row',
  },
  heroImageWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '58%',
  },
  heroImage: { width: '100%', height: '100%' },
  fade: { position: 'absolute', top: 0, bottom: 0, backgroundColor: C.panel },
  heroText: { flex: 1, padding: 18, justifyContent: 'center', maxWidth: '62%' },
  heroScript: {
    fontSize: 20,
    fontStyle: 'italic',
    color: C.gold,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: C.white,
    lineHeight: 25,
  },
  heroSub: { fontSize: 12, color: '#D6D6D6', lineHeight: 17, marginTop: 8, marginBottom: 12 },
  heroBtn: {
    alignSelf: 'flex-start',
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.gold,
    borderRadius: 22,
    paddingLeft: 16,
    paddingRight: 6,
  },
  heroBtnText: { fontSize: 12, fontWeight: '800', color: C.black, letterSpacing: 0.5 },
  heroBtnArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotActive: { backgroundColor: C.gold, width: 16 },

  sheet: {
    backgroundColor: C.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -18,
    paddingTop: 18,
    flexGrow: 1,
  },
  /* Rubrique Audios du Prêtre */
  audioSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  audioSectionKicker: {
    fontSize: 10,
    fontWeight: '800',
    color: C.goldDark,
    letterSpacing: 1,
  },
  audioSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: C.text,
    marginTop: 2,
  },
  audioViewMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  audioViewMoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.goldDark,
  },
  audioTrack: {
    paddingHorizontal: 18,
    gap: 12,
  },
  audioCard: {
    width: 250,
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  audioCardActive: {
    borderColor: C.gold,
    backgroundColor: '#FFFCF7',
  },
  audioTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  audioThemeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  audioThemeText: {
    fontSize: 10,
    fontWeight: '800',
    color: C.goldDark,
    letterSpacing: 0.6,
  },
  audioDate: {
    fontSize: 10.5,
    color: C.muted,
  },
  audioTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: C.text,
    marginBottom: 4,
  },
  audioExcerpt: {
    fontSize: 11.5,
    fontStyle: 'italic',
    color: C.muted,
    lineHeight: 16,
    minHeight: 32,
    marginBottom: 12,
  },
  audioPlayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3EFE7',
    paddingTop: 10,
  },
  audioPlayBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioWaveCol: {
    flex: 1,
  },
  audioProgressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EBE5D8',
    overflow: 'hidden',
    marginBottom: 4,
  },
  audioProgressFill: {
    height: '100%',
    backgroundColor: C.gold,
    borderRadius: 2,
  },
  audioTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audioTimeText: {
    fontSize: 10,
    color: C.goldDark,
    fontWeight: '700',
  },
  audioDurationText: {
    fontSize: 10,
    color: C.muted,
  },

  // Grille 2 par ligne pour Paroles du Bokonon
  audioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    gap: 12,
  },
  audioGridCard: {
    width: '48%',
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 4,
    justifyContent: 'space-between',
  },
  audioGridCardActive: {
    borderColor: C.gold,
    backgroundColor: '#FFFCF7',
  },
  audioGridTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: C.text,
    lineHeight: 16,
    marginBottom: 4,
    marginTop: 2,
  },
  audioGridExcerpt: {
    fontSize: 10.5,
    fontStyle: 'italic',
    color: C.muted,
    lineHeight: 14,
    marginBottom: 8,
  },
  audioGridPlayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F2EB',
    paddingTop: 8,
  },
  audioGridPlayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioGridInfo: {
    flex: 1,
  },
  audioGridDuration: {
    fontSize: 10,
    fontWeight: '700',
    color: C.goldDark,
  },
  audioGridDate: {
    fontSize: 9,
    color: C.muted,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: C.muted,
    marginTop: 2,
  },
  // Grille 2 par ligne en bas d'accueil
  homeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    gap: 12,
  },
  homeGridCard: {
    width: '48%',
    backgroundColor: C.white,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 4,
  },
  homeGridImageWrap: {
    height: 105,
    backgroundColor: C.panel,
    position: 'relative',
  },
  homeGridImage: {
    width: '100%',
    height: '100%',
  },
  homeGridTypeBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(14, 14, 14, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.4)',
  },
  homeGridTypeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: C.white,
  },
  homeGridVideoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  homeGridBody: {
    padding: 10,
  },
  homeGridDate: {
    fontSize: 10,
    color: C.muted,
    marginBottom: 4,
  },
  homeGridTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: C.text,
    lineHeight: 16,
    marginBottom: 6,
  },
  homeGridFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F5F2EB',
  },
  homeGridLikes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  homeGridLikesText: {
    fontSize: 10,
    color: C.muted,
    fontWeight: '600',
  },
  homeGridReadMore: {
    fontSize: 11,
    fontWeight: '800',
    color: C.goldDark,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: C.text },
  viewAll: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 36 },
  viewAllText: { fontSize: 13, fontWeight: '700', color: C.goldDark },

  cardsTrack: { paddingHorizontal: 18, gap: 12 },
  card: {
    width: 158,
    backgroundColor: C.white,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
  },
  cardImageWrap: { height: 100, backgroundColor: C.panel },
  cardImage: { width: '100%', height: '100%' },
  cardTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: C.black,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cardTagText: { fontSize: 10, fontWeight: '800', color: C.gold, letterSpacing: 0.4 },
  cardBody: { padding: 12 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: C.text },
  cardDesc: { fontSize: 12, color: C.muted, marginTop: 2, minHeight: 32 },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardPrice: { fontSize: 13, fontWeight: '800', color: C.text },
  cardAdd: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },

  promo: {
    marginHorizontal: 18,
    marginTop: 22,
    borderRadius: 20,
    backgroundColor: C.black,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.4)',
  },
  promoText: { flex: 1 },
  promoKicker: { fontSize: 11, fontWeight: '800', color: C.gold, letterSpacing: 1 },
  promoTitle: { fontSize: 20, fontWeight: '800', color: C.white, marginTop: 4 },
  promoSub: { fontSize: 12, color: '#D0D0D0', lineHeight: 17, marginTop: 4, marginBottom: 12 },
  promoBtn: {
    alignSelf: 'flex-start',
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.gold,
    borderRadius: 22,
    paddingLeft: 16,
    paddingRight: 6,
  },
  promoBtnText: { fontSize: 12, fontWeight: '800', color: C.black, letterSpacing: 0.5 },
  promoBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: C.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  confRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    paddingHorizontal: 18,
  },
  confText: { fontSize: 12, color: C.muted },
});
