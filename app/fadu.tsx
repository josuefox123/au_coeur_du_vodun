import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '@/context/AppContext';
import { useVodunAlert } from '@/components/VodunAlert';
import { notifyVodun } from '@/lib/vodunNotifications';

// CHARTE OFFICIELLE NOIR, BLANC & DORÉ (Identique à l'Accueil)
const THEME = {
  black: '#111111',              // Noir profond principal
  darkSurface: '#1C1C1E',        // Noir carte premium
  white: '#FFFFFF',              // Blanc pur
  bg: '#F8F8FA',                 // Fond gris-blanc épuré
  border: '#EBEBEB',             // Bordure discrète
  borderDark: '#262626',

  gold: '#C5A059',               // Doré signature
  goldDark: '#9E7D3B',           // Doré profond
  goldSoft: '#F9F5EC',           // Fond doré très doux (sélection active)
  goldHalo: 'rgba(197, 160, 89, 0.15)', // Halo doré

  text: '#111111',               // Titres sombres
  muted: '#7A7A7A',              // Textes secondaires gris
};

type RestitutionFormat = 'VOCAL' | 'TEXT';

export default function FaduScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addFaduRequest } = useApp();
  const { alert, ensurePermission } = useVodunAlert();

  const [hasPhoto, setHasPhoto] = useState<boolean>(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoSource, setPhotoSource] = useState<'CAMERA' | 'GALLERY' | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [format, setFormat] = useState<RestitutionFormat>('VOCAL');

  const handlePickPhoto = async (source: 'CAMERA' | 'GALLERY') => {
    const granted = await ensurePermission(source === 'CAMERA' ? 'camera' : 'library');
    if (!granted) return;

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.85,
    };

    const result =
      source === 'CAMERA'
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
      setHasPhoto(true);
      setPhotoSource(source);
      alert(
        'Cliché Sacré Prêt',
        source === 'CAMERA'
          ? 'La photo de votre plateau / signe Fâ a été capturée avec netteté.'
          : 'L’image du signe a été importée depuis votre galerie.',
        [{ text: 'Poursuivre la consultation' }],
        { type: 'success', icon: 'check-circle' }
      );
    }
  };

  const handleSubmit = async () => {
    if (!hasPhoto) {
      alert(
        'Signe Sacré Requis',
        'Veuillez capturer ou sélectionner une photo de votre plateau ou signe Fâ avant transmission.',
        [{ text: 'Compris' }],
        { type: 'warning', icon: 'photo-camera' }
      );
      return;
    }

    const newId = addFaduRequest(
      question.trim() || 'Examen rituel du signe Fâ',
      `Format souhaité : ${format === 'VOCAL' ? 'Note vocale du Bokonon' : 'Texte écrit détaillé'}`
    );

    // Déclencher la notification push / interne au format Vodoun
    await notifyVodun(
      'fadu',
      `Votre signe ${newId} est déposé. Le Bokonon prépare votre restitution (${format === 'VOCAL' ? 'Note vocale' : 'Texte écrit'}).`
    );

    alert(
      'Transmission Sacrée Réussie !',
      `Votre signe a été transmis en toute sérénité au Bokonon sous la référence ${newId}. Vous recevrez le message du Temple dès décryptage.`,
      [
        {
          text: 'Voir mon suivi',
          onPress: () => router.push('/modal' as any),
        },
        {
          text: 'Retour à l’autel',
          onPress: () => router.back(),
        },
      ],
      { type: 'success', icon: 'verified' }
    );
  };

  return (
    <View style={styles.container}>
      {/* Barre supérieure discrète */}
      <View style={[styles.topBar, { paddingTop: insets.top + (Platform.OS === 'ios' ? 8 : 12) }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retour"
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/(tabs)/accueil' as any);
            }
          }}>
          <MaterialIcons name="arrow-back" size={22} color={THEME.text} />
        </Pressable>
        <Text style={styles.topBarTitle}>Espace Sacré Fâ</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 28, 44) },
        ]}>

        {/* ======================================================== */}
        {/* TITRE & SOUS-TITRE                                       */}
        {/* ======================================================== */}
        <View style={styles.headerBlock}>
          <Text style={styles.mainTitle}>Transmission du Fâ</Text>
          <Text style={styles.mainSubtitle}>
            Envoyez la photo de votre plateau ou signe au Bokonon en toute sérénité.
          </Text>
        </View>

        {/* ======================================================== */}
        {/* CARTE 1 : CLICHÉ DU KPÊ OU PLATEAU                       */}
        {/* ======================================================== */}
        <View style={styles.photoCard}>
          {/* Halo externe doré + Cercle caméra noir liseré or + Badge + */}
          {hasPhoto && photoUri ? (
            <View style={{ marginBottom: 12, alignItems: 'center' }}>
              <Image
                source={{ uri: photoUri }}
                style={{ width: 140, height: 140, borderRadius: 16, borderWidth: 2, borderColor: THEME.gold }}
              />
            </View>
          ) : (
            <View style={styles.cameraHalo}>
              <View style={styles.cameraCircle}>
                <MaterialIcons name="photo-camera" size={30} color={THEME.gold} />
              </View>
              <View style={styles.plusBadge}>
                <MaterialIcons name="add" size={13} color={THEME.goldDark} />
              </View>
            </View>
          )}

          {/* Intitulé et recommandation */}
          <Text style={styles.photoCardTitle}>Cliché du Kpê ou Plateau</Text>
          <Text style={styles.photoCardDesc}>
            Placez le signe au centre du cadre pour une lecture rituelle limpide.
          </Text>

          {/* Statut si photo déjà sélectionnée */}
          {hasPhoto && (
            <View style={styles.photoReadyBadge}>
              <MaterialIcons name="check-circle" size={17} color="#2E7D32" />
              <Text style={styles.photoReadyText}>
                Cliché prêt ({photoSource === 'CAMERA' ? 'Caméra' : 'Galerie'})
              </Text>
            </View>
          )}

          {/* Bouton 1 : Prendre une photo (Noir & Doré) */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Prendre une photo du plateau"
            style={({ pressed }) => [styles.btnPrimaryPhoto, pressed && styles.pressed]}
            onPress={() => handlePickPhoto('CAMERA')}>
            <MaterialIcons name="photo-camera" size={19} color={THEME.gold} style={{ marginRight: 8 }} />
            <Text style={styles.btnPrimaryPhotoText}>Prendre une photo</Text>
          </Pressable>

          {/* Bouton 2 : Choisir depuis la galerie (Blanc & bordure subtile) */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choisir depuis la galerie"
            style={({ pressed }) => [styles.btnSecondaryPhoto, pressed && styles.pressed]}
            onPress={() => handlePickPhoto('GALLERY')}>
            <MaterialIcons name="image" size={19} color={THEME.text} style={{ marginRight: 8 }} />
            <Text style={styles.btnSecondaryPhotoText}>Choisir depuis la galerie</Text>
          </Pressable>

          {/* Conseils de prise de vue */}
          <View style={styles.tipsRow}>
            <View style={styles.tipItem}>
              <MaterialIcons name="wb-sunny" size={14} color={THEME.goldDark} style={{ marginRight: 5 }} />
              <Text style={styles.tipText}>Lumière naturelle</Text>
            </View>
            <View style={styles.tipDot} />
            <View style={styles.tipItem}>
              <MaterialIcons name="crop-free" size={14} color={THEME.goldDark} style={{ marginRight: 5 }} />
              <Text style={styles.tipText}>Cadrage net</Text>
            </View>
          </View>
        </View>

        {/* ======================================================== */}
        {/* CARTE 2 : VOTRE INTENTION OU QUESTION                    */}
        {/* ======================================================== */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionHeaderLeft}>
            <MaterialIcons name="edit-note" size={21} color={THEME.gold} style={{ marginRight: 6 }} />
            <Text style={styles.sectionHeaderTitle}>Votre intention ou question</Text>
          </View>
          <Text style={styles.optionalBadge}>Facultatif</Text>
        </View>

        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInputArea}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholder="Ex: Éclaircissement sur un projet, voyage, santé ou harmonie familiale..."
            placeholderTextColor="#9E9E9E"
            value={question}
            onChangeText={setQuestion}
          />
        </View>

        {/* ======================================================== */}
        {/* CARTE 3 : FORMAT DE RESTITUTION SOUHAITÉ                 */}
        {/* ======================================================== */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionHeaderLeft}>
            <MaterialIcons name="chat" size={18} color={THEME.gold} style={{ marginRight: 6 }} />
            <Text style={styles.sectionHeaderTitle}>Format de restitution souhaité</Text>
          </View>
        </View>

        <View style={styles.restitutionRow}>
          {/* Option 1 : Note vocale */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Format Note vocale, Paroles du Bokonon"
            style={({ pressed }) => [
              styles.restitutionCard,
              format === 'VOCAL' ? styles.restitutionCardActive : styles.restitutionCardInactive,
              pressed && styles.pressed,
            ]}
            onPress={() => setFormat('VOCAL')}>
            <View style={styles.restitutionTop}>
              <View style={[styles.restitutionIconCircle, { backgroundColor: THEME.black }]}>
                <MaterialIcons name="mic" size={19} color={THEME.gold} />
              </View>
              {format === 'VOCAL' && (
                <View style={styles.checkBadge}>
                  <MaterialIcons name="check" size={13} color={THEME.black} />
                </View>
              )}
            </View>
            <Text style={styles.restitutionTitle}>Note vocale</Text>
            <Text style={styles.restitutionSub}>Paroles du Bokonon</Text>
          </Pressable>

          {/* Option 2 : Texte écrit */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Format Texte écrit, Interprétation détaillée"
            style={({ pressed }) => [
              styles.restitutionCard,
              format === 'TEXT' ? styles.restitutionCardActive : styles.restitutionCardInactive,
              pressed && styles.pressed,
            ]}
            onPress={() => setFormat('TEXT')}>
            <View style={styles.restitutionTop}>
              <View style={[
                styles.restitutionIconCircle,
                { backgroundColor: format === 'TEXT' ? THEME.black : '#F0F0F2' }
              ]}>
                <MaterialIcons
                  name="description"
                  size={19}
                  color={format === 'TEXT' ? THEME.gold : THEME.text}
                />
              </View>
              {format === 'TEXT' && (
                <View style={styles.checkBadge}>
                  <MaterialIcons name="check" size={13} color={THEME.black} />
                </View>
              )}
            </View>
            <Text style={styles.restitutionTitle}>Texte écrit</Text>
            <Text style={styles.restitutionSub}>Interprétation détaillée</Text>
          </Pressable>
        </View>

        {/* ======================================================== */}
        {/* BOUTON D'ENVOI FINAL (Doré signature prestigieux)        */}
        {/* ======================================================== */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Envoyer au Bokonon"
          style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}
          onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Envoyer au Bokonon</Text>
          <MaterialIcons name="arrow-forward" size={19} color={THEME.black} />
        </Pressable>

        {/* Pied de page : Confidentialité & Discrétion */}
        <View style={styles.securityRow}>
          <MaterialIcons name="verified-user" size={15} color={THEME.goldDark} style={{ marginRight: 6 }} />
          <Text style={styles.securityText}>
            Confidentialité rituelle & discrétion garanties
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: THEME.bg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  topBarTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.goldDark,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  pressed: {
    opacity: 0.88,
  },

  /* Titre principal */
  headerBlock: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: THEME.text,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  mainSubtitle: {
    fontSize: 14,
    color: THEME.muted,
    lineHeight: 20,
  },

  /* Carte 1 : Photo */
  photoCard: {
    backgroundColor: THEME.white,
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cameraHalo: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: THEME.goldHalo,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  cameraCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: THEME.black,
    borderWidth: 1.5,
    borderColor: THEME.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  plusBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: THEME.goldSoft,
    borderWidth: 1.5,
    borderColor: THEME.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.text,
    marginBottom: 4,
  },
  photoCardDesc: {
    fontSize: 12,
    color: THEME.muted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  photoReadyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EAF6EC',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 14,
  },
  photoReadyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },
  btnPrimaryPhoto: {
    width: '100%',
    height: 48,
    backgroundColor: THEME.black,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  btnPrimaryPhotoText: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.gold,
  },
  btnSecondaryPhoto: {
    width: '100%',
    height: 48,
    backgroundColor: THEME.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: THEME.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  btnSecondaryPhotoText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.text,
  },
  tipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    fontSize: 11.5,
    color: THEME.muted,
    fontWeight: '500',
  },
  tipDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#C8BEAF',
  },

  /* Section Intention / Question */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.text,
  },
  optionalBadge: {
    fontSize: 11,
    color: THEME.muted,
    fontWeight: '500',
  },
  inputCard: {
    backgroundColor: THEME.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 14,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  textInputArea: {
    minHeight: 90,
    fontSize: 13.5,
    color: THEME.text,
    lineHeight: 20,
  },

  /* Section Restitution */
  restitutionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 26,
  },
  restitutionCard: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  restitutionCardActive: {
    backgroundColor: THEME.goldSoft,
    borderWidth: 1.5,
    borderColor: THEME.gold,
  },
  restitutionCardInactive: {
    backgroundColor: THEME.white,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  restitutionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  restitutionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: THEME.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restitutionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: THEME.text,
    marginBottom: 2,
  },
  restitutionSub: {
    fontSize: 11,
    color: THEME.muted,
  },

  /* Bouton d'envoi */
  submitBtn: {
    height: 54,
    backgroundColor: THEME.gold,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
    shadowColor: THEME.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.black,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  securityText: {
    fontSize: 11.5,
    color: THEME.muted,
  },
});
