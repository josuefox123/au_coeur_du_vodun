import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';

const THEME = {
  black: '#111111',
  darkCard: '#1C1C1E',
  gold: '#C5A059',
  goldSoft: '#F9F5EC',
  goldDark: '#9E7D3B',
  white: '#FFFFFF',
  bg: '#F8F8FA',
  border: '#EBEBEB',
  text: '#111111',
  muted: '#7A7A7A',
};

interface AudioItem {
  id: string;
  title: string;
  theme: string;
  duration: string;
  date: string;
  description: string;
  quote: string;
}

const ALL_AUDIOS: AudioItem[] = [
  {
    id: 'audio-1',
    title: 'La paix du cœur avant la tempête',
    theme: 'FÂ & SAGESSE',
    duration: '03:45',
    date: "Aujourd'hui",
    description: 'Enseignement fondamental sur la maîtrise de soi et la sérénité face aux aléas de la vie.',
    quote: '« Écoutez le bruissement des feuilles et laissez le signe apaiser votre esprit. »',
  },
  {
    id: 'audio-2',
    title: 'Bénédiction ancestrale & clarté de route',
    theme: 'PRIÈRE SACRÉE',
    duration: '02:30',
    date: 'Hier',
    description: 'Prière matinale pour fortifier l’aura, dissiper la confusion et attirer la protection des ancêtres.',
    quote: '« Que la lumière d’Orisha illumine votre route et fortifie vos démarches. »',
  },
  {
    id: 'audio-3',
    title: 'Humilité et lois de la prospérité',
    theme: 'CONSEIL AUX DISCIPLES',
    duration: '05:12',
    date: 'Cette semaine',
    description: 'Leçon sur les vertus de l’humilité, le don désintéressé et l’abondance spirituelle et matérielle.',
    quote: '« L’arbre qui donne le plus d’ombre est celui qui s’enracine dans la sagesse. »',
  },
  {
    id: 'audio-4',
    title: 'Les secrets de l’offrande au lever du jour',
    theme: 'RITES VODUN',
    duration: '04:18',
    date: 'Semaine dernière',
    description: 'Explication des gestes rituels matinaux pour s’aligner avec les énergies du cosmos.',
    quote: '« La première goutte d’eau offerte à la terre réveille les esprits protecteurs. »',
  },
  {
    id: 'audio-5',
    title: 'Protection de la maison et de la famille',
    theme: 'PROTECTION (BO)',
    duration: '06:05',
    date: 'Octobre 2026',
    description: 'Directives sacrées pour sanctifier son foyer et repousser les énergies négatives.',
    quote: '« Un foyer béni par les ancêtres est un rempart que nulle ombre ne traverse. »',
  },
  {
    id: 'audio-6',
    title: 'Purification de l’aura par les plantes sacrées',
    theme: 'ZANNUYUN',
    duration: '03:50',
    date: 'Octobre 2026',
    description: 'Enseignement sur les bains rituels Zannuyun et le renouvellement de la force vitale.',
    quote: '« L’eau et les feuilles sacrées lavent le fardeau invisible que l’homme porte sans savoir. »',
  },
];

const FILTER_THEMES = ['Tous', 'Fâ', 'Prières', 'Vodun', 'Protection', 'Purification'] as const;

export default function EnseignementsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedTheme, setSelectedTheme] = useState<string>('Tous');
  const [currentAudio, setCurrentAudio] = useState<AudioItem>(ALL_AUDIOS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const filteredAudios =
    selectedTheme === 'Tous'
      ? ALL_AUDIOS
      : ALL_AUDIOS.filter((a) =>
          a.theme.toLowerCase().includes(selectedTheme.toLowerCase())
        );

  const togglePlayAudio = (item: AudioItem) => {
    if (currentAudio.id === item.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentAudio(item);
      setIsPlaying(true);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Paroles du Bokonon"
        subtitle="AUDIOS & ENSEIGNEMENTS SACRÉS"
        showBack
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 24, 40) },
        ]}>

        {/* ======================================================== */}
        {/* 1. LECTEUR PRINCIPAL MIS EN AVANT (Hero Player)           */}
        {/* ======================================================== */}
        <View style={styles.featuredPlayerCard}>
          {/* Tag en-tête */}
          <View style={styles.playerTopRow}>
            <View style={styles.livePill}>
              <View style={[styles.liveDot, isPlaying && styles.liveDotPlaying]} />
              <Text style={styles.liveText}>
                {isPlaying ? 'LECTURE EN COURS' : 'EN LECTURE'}
              </Text>
            </View>
            <Text style={styles.playerDate}>{currentAudio.date}</Text>
          </View>

          {/* Titre et thème */}
          <Text style={styles.playerTheme}>{currentAudio.theme}</Text>
          <Text style={styles.playerTitle}>{currentAudio.title}</Text>

          {/* Citation / Sagesse */}
          <View style={styles.quoteBox}>
            <MaterialIcons name="format-quote" size={20} color={THEME.gold} style={{ marginRight: 4 }} />
            <Text style={styles.quoteText}>{currentAudio.quote}</Text>
          </View>

          {/* Barre d'onde et progression */}
          <View style={styles.progressContainer}>
            <View style={styles.waveformRow}>
              {[12, 24, 18, 32, 40, 28, 16, 36, 44, 30, 20, 38, 26, 14, 34, 42, 22, 16, 28].map(
                (h, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.waveBar,
                      {
                        height: isPlaying ? h : Math.max(h * 0.45, 8),
                        backgroundColor: idx < 10 ? THEME.gold : 'rgba(255,255,255,0.25)',
                      },
                    ]}
                  />
                )
              )}
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: isPlaying ? '55%' : '15%' },
                ]}
              />
            </View>

            <View style={styles.timeRow}>
              <Text style={styles.timeCurrent}>
                {isPlaying ? '01:45' : '00:00'}
              </Text>
              <Text style={styles.timeTotal}>{currentAudio.duration}</Text>
            </View>
          </View>

          {/* Boutons de contrôle */}
          <View style={styles.controlsRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Audio précédent"
              style={styles.secondaryControlBtn}
              onPress={() => {
                const currentIndex = ALL_AUDIOS.findIndex((a) => a.id === currentAudio.id);
                const prevIndex = (currentIndex - 1 + ALL_AUDIOS.length) % ALL_AUDIOS.length;
                setCurrentAudio(ALL_AUDIOS[prevIndex]);
                setIsPlaying(true);
              }}>
              <MaterialIcons name="skip-previous" size={26} color={THEME.white} />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? 'Pause' : 'Lecture'}
              style={({ pressed }) => [styles.mainPlayBtn, pressed && { opacity: 0.85 }]}
              onPress={() => setIsPlaying(!isPlaying)}>
              <MaterialIcons
                name={isPlaying ? 'pause' : 'play-arrow'}
                size={32}
                color={THEME.black}
              />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Audio suivant"
              style={styles.secondaryControlBtn}
              onPress={() => {
                const currentIndex = ALL_AUDIOS.findIndex((a) => a.id === currentAudio.id);
                const nextIndex = (currentIndex + 1) % ALL_AUDIOS.length;
                setCurrentAudio(ALL_AUDIOS[nextIndex]);
                setIsPlaying(true);
              }}>
              <MaterialIcons name="skip-next" size={26} color={THEME.white} />
            </Pressable>
          </View>
        </View>

        {/* ======================================================== */}
        {/* 2. FILTRES THÉMATIQUES                                   */}
        {/* ======================================================== */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsTrack}>
          {FILTER_THEMES.map((theme) => {
            const active = selectedTheme === theme;
            return (
              <Pressable
                key={theme}
                accessibilityRole="button"
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedTheme(theme)}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {theme}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ======================================================== */}
        {/* 3. LISTE COMPLÈTE DE TOUS LES AUDIOS                    */}
        {/* ======================================================== */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listSectionTitle}>Tous les Enseignements</Text>
          <Text style={styles.listCountBadge}>
            {filteredAudios.length} enregistrement{filteredAudios.length > 1 ? 's' : ''}
          </Text>
        </View>

        <View style={styles.audiosList}>
          {filteredAudios.map((item, index) => {
            const isCurrent = currentAudio.id === item.id;
            const itemPlaying = isCurrent && isPlaying;

            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={`Écouter ${item.title}`}
                style={({ pressed }) => [
                  styles.audioRowCard,
                  isCurrent && styles.audioRowCardCurrent,
                  pressed && { opacity: 0.88 },
                ]}
                onPress={() => togglePlayAudio(item)}>
                {/* Numéro ou icône animé */}
                <View style={[styles.indexCircle, isCurrent && styles.indexCircleCurrent]}>
                  {itemPlaying ? (
                    <MaterialIcons name="graphic-eq" size={18} color={THEME.gold} />
                  ) : (
                    <Text style={[styles.indexText, isCurrent && styles.indexTextCurrent]}>
                      {String(index + 1).padStart(2, '0')}
                    </Text>
                  )}
                </View>

                {/* Infos textuelles */}
                <View style={styles.audioInfoCol}>
                  <View style={styles.audioRowTop}>
                    <Text style={styles.audioRowTheme}>{item.theme}</Text>
                    <Text style={styles.audioRowDuration}>
                      <MaterialIcons name="schedule" size={11} color={THEME.muted} />{' '}
                      {item.duration}
                    </Text>
                  </View>

                  <Text
                    style={[styles.audioRowTitle, isCurrent && styles.audioRowTitleCurrent]}
                    numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.audioRowDesc} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>

                {/* Bouton de lecture rapide */}
                <View style={[styles.rowPlayBtn, isCurrent && styles.rowPlayBtnCurrent]}>
                  <MaterialIcons
                    name={itemPlaying ? 'pause' : 'play-arrow'}
                    size={20}
                    color={isCurrent ? THEME.gold : THEME.text}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Message d'accompagnement spirituel */}
        <View style={styles.footerNoteCard}>
          <MaterialIcons name="auto-awesome" size={20} color={THEME.gold} />
          <Text style={styles.footerNoteText}>
            Les enseignements du Bokonon sont renouvelés régulièrement selon les oracles sacrés du Fâ et les cycles lunaires.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  scrollContent: {
    padding: 18,
  },

  /* ======================================================== */
  /* 1. Lecteur Principal (Hero Player)                        */
  /* ======================================================== */
  featuredPlayerCard: {
    backgroundColor: THEME.black,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.35)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  playerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(197, 160, 89, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.gold,
  },
  liveDotPlaying: {
    backgroundColor: '#4CAF50',
  },
  liveText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: THEME.gold,
    letterSpacing: 0.8,
  },
  playerDate: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  playerTheme: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.gold,
    letterSpacing: 0.8,
    marginTop: 4,
  },
  playerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.white,
    lineHeight: 26,
    marginTop: 4,
    marginBottom: 10,
  },
  quoteBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: THEME.gold,
    marginBottom: 16,
  },
  quoteText: {
    flex: 1,
    fontSize: 12,
    fontStyle: 'italic',
    color: '#DEDEDE',
    lineHeight: 18,
  },

  /* Forme d'onde & Barre de progression */
  progressContainer: {
    marginBottom: 16,
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    marginBottom: 10,
    paddingHorizontal: 6,
  },
  waveBar: {
    width: 3.5,
    borderRadius: 2,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.gold,
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeCurrent: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.gold,
  },
  timeTotal: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
  },

  /* Contrôles */
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  secondaryControlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainPlayBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: THEME.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },

  /* ======================================================== */
  /* 2. Filtres thématiques                                    */
  /* ======================================================== */
  chipsTrack: {
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    backgroundColor: THEME.white,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  chipActive: {
    backgroundColor: THEME.black,
    borderColor: THEME.black,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.text,
  },
  chipTextActive: {
    color: THEME.white,
  },

  /* ======================================================== */
  /* 3. Liste des Audios                                       */
  /* ======================================================== */
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.text,
  },
  listCountBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.goldDark,
  },
  audiosList: {
    gap: 10,
    marginBottom: 16,
  },
  audioRowCard: {
    backgroundColor: THEME.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  audioRowCardCurrent: {
    borderColor: THEME.gold,
    backgroundColor: '#FFFCF7',
  },
  indexCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexCircleCurrent: {
    backgroundColor: THEME.black,
  },
  indexText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.muted,
  },
  indexTextCurrent: {
    color: THEME.gold,
  },
  audioInfoCol: {
    flex: 1,
  },
  audioRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  audioRowTheme: {
    fontSize: 9.5,
    fontWeight: '800',
    color: THEME.goldDark,
    letterSpacing: 0.6,
  },
  audioRowDuration: {
    fontSize: 10.5,
    color: THEME.muted,
  },
  audioRowTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: THEME.text,
    marginBottom: 2,
  },
  audioRowTitleCurrent: {
    color: THEME.black,
  },
  audioRowDesc: {
    fontSize: 11.5,
    color: THEME.muted,
    lineHeight: 16,
  },
  rowPlayBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: THEME.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowPlayBtnCurrent: {
    backgroundColor: THEME.black,
  },

  /* Note bas de page */
  footerNoteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: THEME.goldSoft,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.3)',
    borderRadius: 16,
    padding: 14,
  },
  footerNoteText: {
    flex: 1,
    fontSize: 11.5,
    color: THEME.goldDark,
    lineHeight: 16,
    fontWeight: '500',
  },
});

