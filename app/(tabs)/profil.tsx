import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  Linking,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { VodunPalette } from '@/constants/Colors';
import { useApp } from '@/context/AppContext';
import { useVodunAlert } from '@/components/VodunAlert';
import { notifyVodun } from '@/lib/vodunNotifications';

export default function ProfilScreen() {
  const router = useRouter();
  const { user, appointments, faduRequests, logout } = useApp();
  const { alert, confirm, ensurePermission } = useVodunAlert();

  const [pushNotifs, setPushNotifs] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [faduAlerts, setFaduAlerts] = useState(true);

  // Avatar photo URI
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  // Expo push token
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer le token si permission accordée
    (async () => {
      try {
        const { status: notifStatus } = await Notifications.getPermissionsAsync();
        if (notifStatus === 'granted') {
          const tokenData = await Notifications.getExpoPushTokenAsync();
          setExpoPushToken(tokenData.data);
        }
      } catch (e) {
        // Ignorer en mode dev / Expo Go
      }
    })();
  }, []);

  const handleOpenSite = () => {
    Linking.openURL('https://aucoeurduvodun.com/');
  };

  const handleOpenLegal = () => {
    alert(
      'Protection des Données',
      'Conformément aux lois béninoises et aux règles ancestrales du Temple, les photographies de Fadu et les échanges spirituels sont strictement confidentiels et protégés par le sceau du secret.',
      [{ text: 'Respecter le secret' }],
      { type: 'info', icon: 'verified-user' }
    );
  };

  const pickAvatar = async (source: 'camera' | 'library') => {
    const granted = await ensurePermission(source);
    if (!granted) return;

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    };
    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
      alert(
        'Cliché Sacré Enregistré',
        'Votre visage / symbole de profil est désormais reconnu par le Temple.',
        [{ text: 'Parfait' }],
        { type: 'success', icon: 'photo-camera' }
      );
    }
  };

  const handleChangeAvatar = () => {
    alert(
      'Photo de Profil & Sceau',
      'Choisissez comment transmettre votre image au Temple :',
      [
        { text: 'Prendre une photo', onPress: () => pickAvatar('camera') },
        { text: 'Depuis la galerie', onPress: () => pickAvatar('library') },
        { text: 'Annuler', style: 'cancel' },
      ],
      { type: 'permission', icon: 'camera-alt' }
    );
  };

  const handleLogout = async () => {
    if (user.isLoggedIn) {
      const confirmed = await confirm(
        'Clôture de Session',
        'Souhaitez-vous quitter votre sanctuaire personnel ?',
        'Déconnexion',
        { type: 'warning', icon: 'logout', cancelText: 'Demeurer' }
      );
      if (confirmed) {
        logout();
        alert('Session Clôturée', 'Vous êtes à présent en mode visiteur.', [{ text: 'Continuer' }], { type: 'info' });
      }
    } else {
      router.push('/auth');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Mon Espace Fidèle" subtitle="COMPTE PERSONNEL" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* En-tête Profil */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarCircle}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarInitial}>
                {user.isLoggedIn ? user.fullName.charAt(0) : 'V'}
              </Text>
            )}
            <Pressable style={styles.avatarChangeBtn} onPress={handleChangeAvatar}>
              <MaterialIcons name="photo-camera" size={14} color="#C5A059" />
            </Pressable>
          </View>
          <Text style={styles.userName}>
            {user.isLoggedIn ? user.fullName : 'Visiteur'}
          </Text>
          <Text style={styles.userRole}>
            {user.isLoggedIn ? 'Utilisateur Inscrit • Fidèle du Temple' : 'Non connecté'}
          </Text>
          <View style={styles.userBadge}>
            <Text style={styles.userBadgeText}>
              {user.isLoggedIn ? 'Membre Actif' : 'Mode Visiteur'}
            </Text>
          </View>
        </View>

        {/* Résumé de mes démarches */}
        <Text style={styles.groupTitle}>Mes Activités au Temple</Text>
        <View style={styles.statsRow}>
          <Pressable
            style={styles.statBox}
            onPress={() => router.push('/(tabs)/rendez-vous')}>
            <Text style={styles.statNumber}>{appointments.length}</Text>
            <Text style={styles.statLabel}>RDV Enregistrés</Text>
          </Pressable>

          <Pressable
            style={styles.statBox}
            onPress={() => router.push('/(tabs)/fadu')}>
            <Text style={styles.statNumber}>{faduRequests.length}</Text>
            <Text style={styles.statLabel}>Fadu Analysés</Text>
          </Pressable>

          <Pressable
            style={styles.statBox}
            onPress={() => router.push('/(tabs)/services')}>
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>Services Suivis</Text>
          </Pressable>
        </View>

        {/* Préférences de notifications */}
        <Text style={styles.groupTitle}>Notifications & Alertes</Text>
        <View style={styles.cardSettings}>
          <View style={styles.settingItem}>
            <View style={styles.settingTextWrap}>
              <Text style={styles.settingTitle}>Réponses du Bokonon</Text>
              <Text style={styles.settingDesc}>
                Alerte immédiate lors du décryptage de votre Fadu
              </Text>
            </View>
            <Switch
              value={faduAlerts}
              onValueChange={setFaduAlerts}
              trackColor={{ false: '#DFD8CC', true: '#D97232' }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingTextWrap}>
              <Text style={styles.settingTitle}>Rappels de Rendez-vous</Text>
              <Text style={styles.settingDesc}>
                Notification 24h et 2h avant votre consultation
              </Text>
            </View>
            <Switch
              value={appointmentReminders}
              onValueChange={setAppointmentReminders}
              trackColor={{ false: '#DFD8CC', true: '#D97232' }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingTextWrap}>
              <Text style={styles.settingTitle}>Annonces du Temple</Text>
              <Text style={styles.settingDesc}>
                Cérémonies traditionnelles et fêtes sacrées
              </Text>
            </View>
            <Switch
              value={pushNotifs}
              onValueChange={setPushNotifs}
              trackColor={{ false: '#DFD8CC', true: '#D97232' }}
            />
          </View>
        </View>

        {/* Le Temple & Liens */}
        <Text style={styles.groupTitle}>À Propos & Institutionnel</Text>
        <View style={styles.cardSettings}>
          <Pressable style={styles.linkRow} onPress={() => router.push('/temple')}>
            <View style={styles.linkLeftRow}>
              <MaterialIcons name="account-balance" size={18} color="#D97232" style={{ marginRight: 10 }} />
              <Text style={styles.linkTitle}>Histoire du Temple & Bokonon</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#A7B3AB" />
          </Pressable>

          <Pressable style={styles.linkRow} onPress={handleOpenSite}>
            <View style={styles.linkLeftRow}>
              <MaterialIcons name="language" size={18} color="#D97232" style={{ marginRight: 10 }} />
              <Text style={styles.linkTitle}>Site Web Officiel (aucoeurduvodun.com)</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#A7B3AB" />
          </Pressable>

          <Pressable style={styles.linkRow} onPress={handleOpenLegal}>
            <View style={styles.linkLeftRow}>
              <MaterialIcons name="security" size={18} color="#2F7B59" style={{ marginRight: 10 }} />
              <Text style={styles.linkTitle}>Confidentialité & Données Spirituelles</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#A7B3AB" />
          </Pressable>
        </View>

        {/* Bouton de déconnexion / connexion */}
        <Pressable
          style={styles.logoutBtn}
          onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>
            {user.isLoggedIn ? 'Se déconnecter' : 'Se connecter / S\'inscrire'}
          </Text>
        </Pressable>

        <Text style={styles.versionText}>AU COEUR DU VODUN • Version 1.0 Mobile</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  profileHeaderCard: {
    backgroundColor: '#111111',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.35)',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#C5A059',
  },
  avatarInitial: {
    color: '#C5A059',
    fontSize: 24,
    fontWeight: '800',
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  avatarChangeBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 5,
    borderWidth: 1,
    borderColor: '#C5A059',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userRole: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 3,
  },
  userBadge: {
    marginTop: 10,
    backgroundColor: '#C5A059',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  userBadgeText: {
    color: '#111111',
    fontSize: 11,
    fontWeight: '800',
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 10,
    marginTop: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#C5A059',
  },
  statLabel: {
    fontSize: 11,
    color: '#7A7A7A',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  cardSettings: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F2EB',
  },
  settingTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A2C23',
  },
  settingDesc: {
    fontSize: 11,
    color: '#6C7971',
    marginTop: 2,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F2EB',
  },
  linkLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A2C23',
  },
  logoutBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8C5BE',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoutBtnText: {
    color: '#C62828',
    fontWeight: '800',
    fontSize: 14,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#8A968F',
  },
});
