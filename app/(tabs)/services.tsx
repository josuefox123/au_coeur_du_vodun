import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';

const THEME = {
  black: '#111111',
  darkCard: '#1C1C1E',
  gold: '#C5A059',
  goldDark: '#9E7D3B',
  goldSoft: '#F9F5EC',
  goldHalo: 'rgba(197, 160, 89, 0.15)',
  white: '#FFFFFF',
  bg: '#F8F8FA',
  border: '#EBEBEB',
  text: '#111111',
  muted: '#7A7A7A',
};

interface ServiceItem {
  id: string;
  name: string;
  category: 'Fâ' | 'Vodun' | 'Bo' | 'Zannuyun' | 'Coaching';
  tag: string;
  description: string;
  modalities: string;
  duration: string;
  price: string;
  image: ImageSourcePropType;
  particulars?: string;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'fa-consultation',
    name: 'Consultation Fâ & Géomancie Sacrée',
    category: 'Fâ',
    tag: 'LE PLUS DEMANDÉ',
    description:
      'Interrogation approfondie des oracles du Fâ pour éclairer votre destinée, identifier les blocages et révéler vos opportunités de vie.',
    modalities: 'Sur place ou à distance',
    duration: '45 à 60 min',
    price: '25 000 FCFA',
    image: require('@/assets/images/fronton_soleil.jpg'),
    particulars: 'Nécessite le nom complet et l’intention du fidèle.',
  },
  {
    id: 'vodun-guidance',
    name: 'Guidance & Rituels Vodun',
    category: 'Vodun',
    tag: 'BÉNÉDICTION',
    description:
      'Connexion et intercession auprès des divinités tutélaires pour la paix intérieure, la bénédiction familiale et l’harmonie.',
    modalities: 'Sur place uniquement',
    duration: '1h30',
    price: 'Sur devis',
    image: require('@/assets/images/temple_facade.jpg'),
    particulars: 'Présence physique recommandée au temple.',
  },
  {
    id: 'bo-protection',
    name: 'Rituels de Protection (Bo)',
    category: 'Bo',
    tag: 'BOUCLIER SACRÉ',
    description:
      'Consécration et confection de protections traditionnelles contre les énergies négatives et les embûches.',
    modalities: 'Sur place ou à distance',
    duration: '2 à 3 jours',
    price: 'Sur devis',
    image: require('@/assets/images/embleme_officiel.png'),
    particulars: 'Rituels consacrés selon les prescriptions du Fâ.',
  },
  {
    id: 'zannuyun-purification',
    name: 'Bains de Purification (Zannuyun)',
    category: 'Zannuyun',
    tag: 'PURIFICATION',
    description:
      'Bains rituels à base de plantes sacrées et d’eaux bénites pour nettoyer l’aura et attirer la chance.',
    modalities: 'Sur place uniquement',
    duration: '1h00',
    price: '30 000 FCFA',
    image: require('@/assets/images/temple.jpg'),
    particulars: 'Prévoir des vêtements amples et clairs.',
  },
  {
    id: 'coaching-spirituel',
    name: 'Coaching de Vie & Orientation',
    category: 'Coaching',
    tag: 'ACCOMPAGNEMENT',
    description:
      'Accompagnement personnalisé avec le Bokonon pour aligner vos ambitions avec vos lois spirituelles.',
    modalities: 'Sur place ou à distance',
    duration: '1h15',
    price: '35 000 FCFA',
    image: require('@/assets/images/temple_facade.jpg'),
    particulars: 'Suivi sur mesure et plan d’action spirituel.',
  },
  {
    id: 'fa-fadu-signe',
    name: 'Analyse Approfondie d’un Signe (Kpoli)',
    category: 'Fâ',
    tag: 'SAGESSE DU FÂ',
    description:
      'Décryptage complet de votre signe natal ou révélé lors d’un Fâ : totems, interdits et forces protectrices.',
    modalities: 'Sur place ou à distance',
    duration: '1 heure',
    price: '20 000 FCFA',
    image: require('@/assets/images/emblem.jpg'),
    particulars: 'Remise d’une synthèse explicative.',
  },
];

const CATEGORIES = ['Tous', 'Fâ', 'Vodun', 'Bo', 'Zannuyun', 'Coaching'] as const;

export default function ServicesScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>('Tous');

  const list =
    selected === 'Tous'
      ? SERVICES_DATA
      : SERVICES_DATA.filter((s) => s.category === selected);

  return (
    <View style={styles.container}>
      <AppHeader title="Services & Rituels" subtitle="SANCTUAIRE SACRÉ" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {/* Bannière Prestige d'en-tête */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBannerContent}>
            <Text style={styles.heroTitle}>Rituels & Prestations</Text>
            <Text style={styles.heroSub}>
              Consultez les offices traditionnels dispensés par le Bokonon sous le sceau de la vérité du Fâ.
            </Text>
          </View>
        </View>

        {/* Filtres par catégories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsTrack}>
          {CATEGORIES.map((c) => {
            const active = selected === c;
            return (
              <Pressable
                key={c}
                onPress={() => setSelected(c)}
                style={[styles.chip, active && styles.chipActive]}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.countRow}>
          <Text style={styles.countText}>
            {list.length} prestation{list.length > 1 ? 's' : ''} sacrée{list.length > 1 ? 's' : ''}
          </Text>
          <View style={styles.secureBadge}>
            <MaterialIcons name="verified" size={13} color={THEME.goldDark} />
            <Text style={styles.secureText}>Authenticité garantie</Text>
          </View>
        </View>

        {/* Liste des cartes de services avec visuels soignés */}
        {list.map((s) => (
          <View key={s.id} style={styles.card}>
            {/* Visuel et badges */}
            <View style={styles.cardCoverWrap}>
              <Image source={s.image} style={styles.cardCover} resizeMode="cover" />
              <View style={styles.cardTagBadge}>
                <Text style={styles.cardTagBadgeText}>{s.tag}</Text>
              </View>
              <View style={styles.cardCategoryBadge}>
                <Text style={styles.cardCategoryBadgeText}>{s.category}</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.titlePriceRow}>
                <Text style={styles.serviceName}>{s.name}</Text>
                <Text style={styles.servicePrice}>{s.price}</Text>
              </View>

              <Text style={styles.serviceDesc}>{s.description}</Text>

              {/* Spécificités clés */}
              <View style={styles.specsRow}>
                <View style={styles.specItem}>
                  <MaterialIcons name="room" size={14} color={THEME.goldDark} />
                  <Text style={styles.specText}>{s.modalities}</Text>
                </View>
                <View style={styles.specItem}>
                  <MaterialIcons name="schedule" size={14} color={THEME.goldDark} />
                  <Text style={styles.specText}>{s.duration}</Text>
                </View>
              </View>

              {s.particulars ? (
                <View style={styles.noteBox}>
                  <MaterialIcons name="info-outline" size={14} color={THEME.gold} />
                  <Text style={styles.noteText}>{s.particulars}</Text>
                </View>
              ) : null}

              {/* Bouton de demande */}
              <Pressable
                style={({ pressed }) => [styles.ctaButton, pressed && { opacity: 0.85 }]}
                onPress={() =>
                  router.push({
                    pathname: '/consultation',
                    params: { serviceId: s.id, serviceName: s.name },
                  })
                }>
                <Text style={styles.ctaButtonText}>Faire une demande rituelle</Text>
                <View style={styles.ctaArrow}>
                  <MaterialIcons name="arrow-forward" size={15} color={THEME.black} />
                </View>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  content: {
    padding: 18,
    paddingBottom: 110,
  },
  heroBanner: {
    backgroundColor: THEME.black,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.35)',
    shadowColor: THEME.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  heroBannerContent: {
    alignItems: 'flex-start',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.3)',
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.gold,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.white,
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 18,
  },
  chipsTrack: {
    gap: 8,
    paddingBottom: 14,
  },
  chip: {
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 19,
    backgroundColor: THEME.white,
    borderWidth: 1,
    borderColor: THEME.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: THEME.black,
    borderColor: THEME.gold,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.muted,
  },
  chipTextActive: {
    color: THEME.gold,
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  countText: {
    fontSize: 12,
    color: THEME.muted,
    fontWeight: '700',
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  secureText: {
    fontSize: 11,
    color: THEME.goldDark,
    fontWeight: '600',
  },
  card: {
    backgroundColor: THEME.white,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  cardCoverWrap: {
    height: 145,
    backgroundColor: THEME.black,
    position: 'relative',
  },
  cardCover: {
    width: '100%',
    height: '100%',
  },
  cardTagBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: THEME.black,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.45)',
  },
  cardTagBadgeText: {
    color: THEME.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  cardCategoryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  cardCategoryBadgeText: {
    color: THEME.black,
    fontSize: 11,
    fontWeight: '800',
  },
  cardBody: {
    padding: 16,
  },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 10,
  },
  serviceName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: THEME.text,
    lineHeight: 20,
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: '900',
    color: THEME.goldDark,
  },
  serviceDesc: {
    fontSize: 13,
    color: THEME.muted,
    lineHeight: 18,
    marginBottom: 12,
  },
  specsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specText: {
    fontSize: 12,
    color: '#444444',
    fontWeight: '600',
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: THEME.goldSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.25)',
  },
  noteText: {
    flex: 1,
    fontSize: 11.5,
    color: THEME.goldDark,
    fontStyle: 'italic',
  },
  ctaButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 18,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.4)',
  },
  ctaButtonText: {
    color: THEME.white,
    fontSize: 13,
    fontWeight: '800',
  },
  ctaArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: THEME.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
