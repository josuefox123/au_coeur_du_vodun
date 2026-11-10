import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Alert,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { FEED_ITEMS } from '@/constants/FeedData';

const THEME = {
  black: '#111111',
  darkCard: '#1C1C1E',
  gold: '#C5A059',
  goldDark: '#9E7D3B',
  white: '#FFFFFF',
  bg: '#F8F8FA',
  border: '#EBEBEB',
  text: '#111111',
  muted: '#7A7A7A',
};

export default function FeedDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);

  const item = FEED_ITEMS.find((i) => i.id === params.id) || FEED_ITEMS[0];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${item.title}\n\nRetrouvez cette chronique sur l'application Au Cœur du Vodun : https://aucoeurduvodun.com/`,
      });
    } catch (e) {
      // Ignorer
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title={item.tag} subtitle="CHRONIQUE DU TEMPLE" showBack />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Média principal (Image ou Lecteur Vidéo simulé) */}
        <View style={styles.mediaContainer}>
          <Image source={item.image} style={styles.mediaImage} resizeMode="cover" />

          {item.type === 'VIDEO' && (
            <Pressable
              style={styles.videoPlayerBox}
              onPress={() => setIsPlaying(!isPlaying)}>
              <View style={styles.playButtonCircle}>
                <MaterialIcons
                  name={isPlaying ? 'pause' : 'play-arrow'}
                  size={36}
                  color={THEME.black}
                />
              </View>
              <Text style={styles.videoStatusText}>
                {isPlaying ? 'Lecture en cours (01:24 / ' + item.duration + ')' : 'Appuyez pour lancer la vidéo'}
              </Text>
            </Pressable>
          )}

          <View style={styles.mediaBadge}>
            <Text style={styles.mediaBadgeText}>{item.tag}</Text>
          </View>
        </View>

        {/* Corps de l'article */}
        <View style={styles.articleCard}>
          <View style={styles.metaRow}>
            <View style={styles.authorBadge}>
              <MaterialIcons name="account-circle" size={16} color={THEME.gold} />
              <Text style={styles.authorName}>{item.author}</Text>
            </View>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>

          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.desc}>{item.desc}</Text>

          <View style={styles.divider} />

          {/* Contenu complet */}
          <Text style={styles.content}>{item.content}</Text>

          {/* Barre d'action : Partage & Likes */}
          <View style={styles.actionsBar}>
            <Pressable
              style={[styles.actionBtn, liked && styles.actionBtnLiked]}
              onPress={() => setLiked(!liked)}>
              <MaterialIcons
                name={liked ? 'favorite' : 'favorite-border'}
                size={18}
                color={liked ? '#E04A3A' : THEME.goldDark}
              />
              <Text style={[styles.actionBtnText, liked && { color: '#E04A3A' }]}>
                {item.likes + (liked ? 1 : 0)} J'aime
              </Text>
            </Pressable>

            <Pressable style={styles.actionBtn} onPress={handleShare}>
              <MaterialIcons name="share" size={18} color={THEME.goldDark} />
              <Text style={styles.actionBtnText}>Partager</Text>
            </Pressable>
          </View>
        </View>

        {/* Bouton de consultation relié */}
        <Pressable
          style={styles.consultBanner}
          onPress={() => router.push('/(tabs)/fadu' as any)}>
          <View style={{ flex: 1 }}>
            <Text style={styles.consultKicker}>BESOIN DE CLARTÉ ?</Text>
            <Text style={styles.consultTitle}>Interroger le Bokonon</Text>
            <Text style={styles.consultSub}>Envoyez votre plateau ou posez votre question rituelle.</Text>
          </View>
          <MaterialIcons name="chevron-right" size={26} color={THEME.gold} />
        </Pressable>
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
    padding: 16,
    paddingBottom: 50,
  },
  mediaContainer: {
    height: 220,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: THEME.black,
    position: 'relative',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  videoPlayerBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: THEME.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.gold,
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
  },
  videoStatusText: {
    color: THEME.white,
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  mediaBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(17,17,17,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.4)',
  },
  mediaBadgeText: {
    color: THEME.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  articleCard: {
    backgroundColor: THEME.white,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.goldDark,
  },
  dateText: {
    fontSize: 11,
    color: THEME.muted,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.text,
    lineHeight: 24,
    marginBottom: 10,
  },
  desc: {
    fontSize: 13,
    color: THEME.muted,
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F2EB',
    marginBottom: 14,
  },
  content: {
    fontSize: 14,
    lineHeight: 22,
    color: '#2A2A2A',
    marginBottom: 20,
  },
  actionsBar: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F2EB',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#FAF8F4',
    borderWidth: 1,
    borderColor: '#EFEBE1',
  },
  actionBtnLiked: {
    backgroundColor: '#FDEEEB',
    borderColor: '#F6CAC1',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.goldDark,
  },
  consultBanner: {
    backgroundColor: THEME.black,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.4)',
  },
  consultKicker: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.gold,
    letterSpacing: 1,
    marginBottom: 3,
  },
  consultTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.white,
    marginBottom: 2,
  },
  consultSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
});

