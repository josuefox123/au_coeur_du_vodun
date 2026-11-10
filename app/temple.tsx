import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from '@/components/AppHeader';
import { VodunPalette } from '@/constants/Colors';

export default function TempleScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <AppHeader title="Le Temple & Le Bokonon" subtitle="HÉRITAGE ANCESTRAL" showBack />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

      {/* Photo nette du bâtiment */}
      <View style={styles.card}>
        <Image
          source={require('@/assets/images/temple.jpg')}
          style={styles.imageTemple}
          resizeMode="cover"
        />
        <View style={styles.cardBody}>
          <Text style={styles.kicker}>Héritage et tradition</Text>
          <Text style={styles.title}>Le Temple Au Cœur du Vodun</Text>
          <Text style={styles.desc}>
            Un sanctuaire dédié à la préservation des traditions authentiques du Vodoun et de la géomancie du Fâ au Bénin.
          </Text>
        </View>
      </View>

      {/* Photo nette du symbole sur le fronton */}
      <View style={styles.card}>
        <Image
          source={require('@/assets/images/emblem.jpg')}
          style={styles.imageEmblem}
          resizeMode="cover"
        />
        <View style={styles.cardBody}>
          <Text style={styles.kicker}>Symbole sacré</Text>
          <Text style={styles.title}>Le soleil et les cauris</Text>
          <Text style={styles.desc}>
            Gravé au fronton du temple : le soleil rayonnant, les chapelets de cauris et les couteaux rituels croisés, symboles de clarté, de guidance et de protection.
          </Text>
        </View>
      </View>

      {/* Le Bokonon */}
      <View style={styles.card}>
        <View style={styles.bokononTop}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>B</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.kicker}>Prêtre et devin du Fâ</Text>
            <Text style={styles.title}>Le Bokonon Certifié</Text>
            <Text style={styles.location}>Abomey-Calavi, Bénin</Text>
          </View>
        </View>
        <Text style={styles.desc}>
          Initié dans les règles séculaires de la tradition béninoise, le Bokonon met son écoute, son discernement et sa maîtrise des arcanes du Fâ au service de votre bien-être, de votre protection et de votre alignement spirituel.
        </Text>
      </View>

      {/* Mission & Valeurs */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Notre Mission & Nos Valeurs</Text>

        <View style={styles.valueRow}>
          <View style={styles.bullet} />
          <View style={{ flex: 1 }}>
            <Text style={styles.valueTitle}>Authenticité & Rigueur Traditionnelle</Text>
            <Text style={styles.valueDesc}>
              Tous nos rituels, consultations et bains de purification respectent scrupuleusement les ordonnances du Fâ et la pureté des cultes ancestraux.
            </Text>
          </View>
        </View>

        <View style={styles.valueRow}>
          <View style={styles.bullet} />
          <View style={{ flex: 1 }}>
            <Text style={styles.valueTitle}>Discrétion & Secret Spirituel</Text>
            <Text style={styles.valueDesc}>
              Vos échanges, motifs de consultation et transmissions de signes demeurent sous le sceau de la confidentialité la plus totale.
            </Text>
          </View>
        </View>

        <View style={styles.valueRow}>
          <View style={styles.bullet} />
          <View style={{ flex: 1 }}>
            <Text style={styles.valueTitle}>Orientation & Clarté de Vie</Text>
            <Text style={styles.valueDesc}>
              Le Fâ n'est pas une fatalité mais une boussole sacrée pour surmonter les obstacles et harmoniser votre destinée.
            </Text>
          </View>
        </View>
      </View>

      {/* Localisation */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Localisation & Visites</Text>
        <Text style={styles.infoLine}>
          <Text style={styles.infoBold}>Commune : </Text>Abomey-Calavi, République du Bénin
        </Text>
        <Text style={styles.infoLine}>
          <Text style={styles.infoBold}>Quartier : </Text>Zoundja
        </Text>
        <Text style={styles.infoLine}>
          <Text style={styles.infoBold}>Horaires : </Text>Du Lundi au Samedi (09h00 - 18h30)
        </Text>
        <Text style={styles.infoLine}>
          <Text style={styles.infoBold}>Modalités : </Text>Réception physique sur rendez-vous confirmé
        </Text>

        <View style={styles.actionRow}>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => router.push('/(tabs)/rendez-vous')}>
            <Text style={styles.primaryBtnText}>Prendre Rendez-vous</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryBtn}
            onPress={() => Linking.openURL('https://aucoeurduvodun.com/')}>
            <Text style={styles.secondaryBtnText}>Site Web</Text>
          </Pressable>
        </View>
      </View>

    </ScrollView>
  </View>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8FA' },
  scrollContent: { padding: 20, paddingBottom: 40 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  imageTemple: { width: '100%', height: 210, borderRadius: 16, marginBottom: 14 },
  imageEmblem: { width: '100%', height: 260, borderRadius: 16, marginBottom: 14 },
  cardBody: {},
  kicker: {
    color: '#C5A059',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: { fontSize: 19, fontWeight: '800', color: '#111111', marginBottom: 6 },
  desc: { fontSize: 13, color: '#7A7A7A', lineHeight: 19 },
  location: { fontSize: 12, color: '#7A7A7A', marginTop: 2 },

  bokononTop: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  avatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#111111',
    borderWidth: 2,
    borderColor: '#C5A059',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#C5A059', fontSize: 22, fontWeight: '800' },

  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#111111', marginBottom: 14 },

  valueRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C5A059',
    marginTop: 6,
  },
  valueTitle: { fontSize: 14, fontWeight: '700', color: '#111111', marginBottom: 2 },
  valueDesc: { fontSize: 12, color: '#7A7A7A', lineHeight: 17 },

  infoLine: { fontSize: 13, color: '#111111', marginBottom: 6 },
  infoBold: { fontWeight: '700', color: '#111111' },

  actionRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  primaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#C5A059', fontWeight: '800', fontSize: 14 },
  secondaryBtn: {
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F8FA',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { color: '#111111', fontWeight: '700', fontSize: 14 },
});
