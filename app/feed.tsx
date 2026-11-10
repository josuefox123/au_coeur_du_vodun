import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { FEED_ITEMS, FeedType } from '@/constants/FeedData';

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

export default function FeedListScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'ALL' | FeedType>('ALL');

  const filtered = FEED_ITEMS.filter((i) => filter === 'ALL' || i.type === filter);

  return (
    <View style={styles.container}>
      <AppHeader title="Chronique & Médias" subtitle="BLOG & ACTUALITÉS DU BOKONON" showBack />

      {/* Barre de filtres */}
      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersTrack}>
          {[
            { key: 'ALL', label: 'Tout' },
            { key: 'ACTU', label: 'Actualités' },
            { key: 'VIDEO', label: 'Vidéos' },
            { key: 'BLOG', label: 'Blog' },
            { key: 'IMAGE', label: 'Galerie' },
          ].map((f) => (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key as any)}
              style={[styles.filterPill, filter === f.key && styles.filterPillActive]}>
              <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Grille 2 par ligne */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {filtered.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.gridCard, pressed && styles.pressed]}
              onPress={() =>
                router.push({
                  pathname: '/feed-detail' as any,
                  params: { id: item.id },
                })
              }>
              <View style={styles.imageWrap}>
                <Image source={item.image} style={styles.image} resizeMode="cover" />
                <View style={styles.typeBadge}>
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
                    color={THEME.gold}
                    style={{ marginRight: 3 }}
                  />
                  <Text style={styles.typeBadgeText}>{item.tag.split(' ')[0]}</Text>
                </View>

                {item.type === 'VIDEO' && (
                  <View style={styles.videoOverlay}>
                    <MaterialIcons name="play-circle-fill" size={32} color={THEME.gold} />
                    {item.duration && (
                      <Text style={styles.durationBadge}>{item.duration}</Text>
                    )}
                  </View>
                )}
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardDate}>{item.date}</Text>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {item.desc}
                </Text>

                <View style={styles.cardFooter}>
                  <View style={styles.likesRow}>
                    <MaterialIcons name="favorite" size={12} color={THEME.gold} />
                    <Text style={styles.likesText}>{item.likes}</Text>
                  </View>
                  <Text style={styles.readMoreText}>Lire ›</Text>
                </View>
              </View>
            </Pressable>
          ))}
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
    padding: 16,
    paddingBottom: 40,
  },
  filtersWrapper: {
    backgroundColor: THEME.bg,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    paddingVertical: 10,
  },
  filtersTrack: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: THEME.white,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  filterPillActive: {
    backgroundColor: THEME.black,
    borderColor: THEME.gold,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.muted,
  },
  filterTextActive: {
    color: THEME.gold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    backgroundColor: THEME.white,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 4,
  },
  imageWrap: {
    height: 110,
    backgroundColor: THEME.black,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  typeBadge: {
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
  typeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.white,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.75)',
    color: THEME.white,
    fontSize: 9,
    fontWeight: '700',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardBody: {
    padding: 10,
  },
  cardDate: {
    fontSize: 10,
    color: THEME.muted,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.text,
    lineHeight: 16,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 11,
    color: THEME.muted,
    lineHeight: 14,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F5F2EB',
  },
  likesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  likesText: {
    fontSize: 10,
    color: THEME.muted,
    fontWeight: '600',
  },
  readMoreText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.goldDark,
  },
  pressed: {
    opacity: 0.85,
  },
});

