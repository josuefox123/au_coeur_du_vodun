import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

/**
 * Alertes, avertissements et demandes de permission au style Vodun
 * (Noir, Blanc & Doré, identique à l'Accueil).
 * Chaque alerte est ornée d'un signe du Fâ (Mêji) : 4 lignes, 2 colonnes identiques,
 * marque simple (I) ou double (II).
 */

const THEME = {
  black: '#111111',
  surface: '#1C1C1E',
  gold: '#C5A059',
  goldDark: '#9E7D3B',
  goldHalo: 'rgba(197, 160, 89, 0.15)',
  white: '#FFFFFF',
  muted: 'rgba(255,255,255,0.72)',
  danger: '#E07A6B',
};

export type VodunAlertType = 'info' | 'success' | 'warning' | 'error' | 'permission';

export type VodunAlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

export type VodunAlertOptions = {
  type?: VodunAlertType;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

export type PermissionKind = 'camera' | 'library' | 'location' | 'notifications';

type AlertRequest = {
  id: number;
  title: string;
  message?: string;
  buttons: VodunAlertButton[];
  type: VodunAlertType;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

type VodunAlertContextValue = {
  /** Même signature que Alert.alert, avec un 4e paramètre optionnel pour le type. */
  alert: (
    title: string,
    message?: string,
    buttons?: VodunAlertButton[],
    options?: VodunAlertOptions
  ) => void;
  /** Demande de confirmation : résout true si l'utilisateur accepte. */
  confirm: (
    title: string,
    message: string,
    confirmText?: string,
    options?: VodunAlertOptions & { cancelText?: string }
  ) => Promise<boolean>;
  /** Explique la permission au style Vodun, puis déclenche la demande système. */
  ensurePermission: (kind: PermissionKind) => Promise<boolean>;
};

// Signes du Fâ (1 = marque simple I, 2 = marque double II), de haut en bas.
const FA_SIGNS: Record<VodunAlertType, { name: string; rows: (1 | 2)[] }> = {
  success: { name: 'Gbé-Mêji', rows: [1, 1, 1, 1] },
  info: { name: 'Woli-Mêji', rows: [2, 1, 1, 2] },
  permission: { name: 'Di-Mêji', rows: [1, 2, 2, 1] },
  warning: { name: 'Loso-Mêji', rows: [1, 1, 2, 2] },
  error: { name: 'Yèkú-Mêji', rows: [2, 2, 2, 2] },
};

const DEFAULT_ICONS: Record<VodunAlertType, keyof typeof MaterialIcons.glyphMap> = {
  success: 'check-circle-outline',
  info: 'info-outline',
  permission: 'verified-user',
  warning: 'report-problem',
  error: 'error-outline',
};

type PermissionResult = { granted: boolean; canAskAgain: boolean };

const PERMISSIONS: Record<
  PermissionKind,
  {
    title: string;
    message: string;
    blockedLabel: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    get: () => Promise<PermissionResult>;
    request: () => Promise<PermissionResult>;
  }
> = {
  camera: {
    title: "Ouvrir l'œil du Fâ",
    message:
      "Pour photographier votre plateau, votre signe ou votre visage, l'application a besoin de votre caméra. Rien n'est capturé sans votre geste.",
    blockedLabel: "L'accès à la caméra",
    icon: 'photo-camera',
    get: () => ImagePicker.getCameraPermissionsAsync(),
    request: () => ImagePicker.requestCameraPermissionsAsync(),
  },
  library: {
    title: 'Accès à vos images',
    message:
      "Pour choisir le cliché de votre signe ou votre photo de profil, autorisez l'accès à votre galerie. Seule l'image choisie est utilisée.",
    blockedLabel: "L'accès à la galerie",
    icon: 'photo-library',
    get: () => ImagePicker.getMediaLibraryPermissionsAsync(),
    request: () => ImagePicker.requestMediaLibraryPermissionsAsync(),
  },
  location: {
    title: 'Connaître votre chemin',
    message:
      "Pour afficher votre position dans votre espace fidèle, l'application a besoin de votre localisation. Elle n'est lue que lorsque vous le demandez.",
    blockedLabel: "L'accès à votre position",
    icon: 'place',
    get: () => Location.getForegroundPermissionsAsync(),
    request: () => Location.requestForegroundPermissionsAsync(),
  },
  notifications: {
    title: 'Recevoir la voix du Temple',
    message:
      'Autorisez les notifications pour être averti dès que le Bokonon a reçu ou interprété votre signe, et pour recevoir les messages du Temple.',
    blockedLabel: "L'envoi de notifications",
    icon: 'notifications-active',
    get: () => Notifications.getPermissionsAsync(),
    request: () => Notifications.requestPermissionsAsync(),
  },
};

const VodunAlertContext = createContext<VodunAlertContextValue | null>(null);

function FaSign({ rows }: { rows: (1 | 2)[] }) {
  return (
    <View style={styles.faSign}>
      {[0, 1].map((col) => (
        <View key={col} style={styles.faColumn}>
          {rows.map((marks, i) => (
            <View key={i} style={styles.faRow}>
              <View style={styles.faMark} />
              {marks === 2 && <View style={styles.faMark} />}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

export function VodunAlertProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<AlertRequest[]>([]);
  const idRef = useRef(0);
  const closingRef = useRef(false);
  const anim = useRef(new Animated.Value(0)).current;
  const current = queue[0];

  useEffect(() => {
    if (!current) return;
    closingRef.current = false;
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [current?.id]);

  const alert = useCallback<VodunAlertContextValue['alert']>((title, message, buttons, options) => {
    idRef.current += 1;
    const request: AlertRequest = {
      id: idRef.current,
      title,
      message,
      buttons: buttons && buttons.length > 0 ? buttons : [{ text: 'Compris' }],
      type: options?.type ?? 'info',
      icon: options?.icon,
    };
    setQueue((q) => [...q, request]);
  }, []);

  const confirm = useCallback<VodunAlertContextValue['confirm']>(
    (title, message, confirmText = 'Confirmer', options) =>
      new Promise<boolean>((resolve) => {
        alert(
          title,
          message,
          [
            { text: options?.cancelText ?? 'Plus tard', style: 'cancel', onPress: () => resolve(false) },
            { text: confirmText, onPress: () => resolve(true) },
          ],
          options
        );
      }),
    [alert]
  );

  const ensurePermission = useCallback<VodunAlertContextValue['ensurePermission']>(
    async (kind) => {
      const p = PERMISSIONS[kind];

      const showBlocked = () =>
        alert(
          'Accès refusé',
          `${p.blockedLabel} a été refusé. Vous pouvez le réactiver dans les réglages de votre téléphone.`,
          [
            { text: 'Fermer', style: 'cancel' },
            { text: 'Ouvrir les réglages', onPress: () => Linking.openSettings() },
          ],
          { type: 'warning', icon: p.icon }
        );

      const current = await p.get();
      if (current.granted) return true;
      if (!current.canAskAgain) {
        showBlocked();
        return false;
      }

      const accepted = await confirm(p.title, p.message, 'Autoriser', {
        type: 'permission',
        icon: p.icon,
      });
      if (!accepted) return false;

      const result = await p.request();
      if (result.granted) return true;
      if (!result.canAskAgain) showBlocked();
      return false;
    },
    [alert, confirm]
  );

  const close = (button?: VodunAlertButton) => {
    if (closingRef.current) return;
    closingRef.current = true;
    Animated.timing(anim, {
      toValue: 0,
      duration: 160,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setQueue((q) => q.slice(1));
      if (button?.onPress) {
        // iOS : laisser la modale se fermer avant d'ouvrir caméra / galerie / dialogue système.
        setTimeout(button.onPress, Platform.OS === 'ios' ? 350 : 0);
      }
    });
  };

  // Bouton retour Android : équivaut au bouton « annuler » (ou au bouton unique).
  const handleBack = () => {
    if (!current) return;
    const cancel = current.buttons.find((b) => b.style === 'cancel');
    if (cancel) close(cancel);
    else if (current.buttons.length === 1) close(current.buttons[0]);
  };

  const sign = current ? FA_SIGNS[current.type] : FA_SIGNS.info;
  const stacked = current ? current.buttons.length > 2 : false;
  // En ligne : « annuler » à gauche. En colonne : « annuler » en bas.
  const orderedButtons = current
    ? [...current.buttons].sort((a, b) => {
        const wa = a.style === 'cancel' ? (stacked ? 1 : -1) : 0;
        const wb = b.style === 'cancel' ? (stacked ? 1 : -1) : 0;
        return wa - wb;
      })
    : [];
  const firstDefault = orderedButtons.find((b) => b.style !== 'cancel' && b.style !== 'destructive');

  return (
    <VodunAlertContext.Provider value={{ alert, confirm, ensurePermission }}>
      {children}
      <Modal
        visible={!!current}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={handleBack}>
        <Animated.View style={[styles.backdrop, { opacity: anim }]}>
          {current && (
            <Animated.View
              style={[
                styles.card,
                {
                  transform: [
                    { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) },
                  ],
                },
              ]}>
              <FaSign rows={sign.rows} />
              <Text style={styles.faName}>{sign.name}</Text>

              <View style={styles.iconHalo}>
                <View style={styles.iconCircle}>
                  <MaterialIcons
                    name={current.icon ?? DEFAULT_ICONS[current.type]}
                    size={26}
                    color={current.type === 'error' ? THEME.danger : THEME.gold}
                  />
                </View>
              </View>

              <Text style={styles.title}>{current.title}</Text>
              {!!current.message && <Text style={styles.message}>{current.message}</Text>}

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <View style={styles.cowrie} />
                <View style={[styles.cowrie, styles.cowrieCenter]} />
                <View style={styles.cowrie} />
                <View style={styles.dividerLine} />
              </View>

              <View style={[styles.buttons, stacked && styles.buttonsStacked]}>
                {orderedButtons.map((b, i) => {
                  const isPrimary = b === firstDefault;
                  const isCancel = b.style === 'cancel';
                  const isDestructive = b.style === 'destructive';
                  return (
                    <Pressable
                      key={`${b.text}-${i}`}
                      accessibilityRole="button"
                      onPress={() => close(b)}
                      style={({ pressed }) => [
                        styles.btn,
                        !stacked && styles.btnRow,
                        isPrimary && styles.btnPrimary,
                        isDestructive && styles.btnDestructive,
                        isCancel && styles.btnCancel,
                        pressed && { opacity: 0.75 },
                      ]}>
                      <Text
                        style={[
                          styles.btnText,
                          isPrimary && styles.btnTextPrimary,
                          isDestructive && styles.btnTextDestructive,
                          isCancel && styles.btnTextCancel,
                        ]}>
                        {b.text}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Animated.View>
          )}
        </Animated.View>
      </Modal>
    </VodunAlertContext.Provider>
  );
}

export function useVodunAlert() {
  const ctx = useContext(VodunAlertContext);
  if (!ctx) throw new Error('useVodunAlert doit être utilisé dans <VodunAlertProvider>');
  return ctx;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: THEME.black,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.45)',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 18,
    alignItems: 'center',
    shadowColor: THEME.gold,
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  faSign: {
    flexDirection: 'row',
    gap: 16,
  },
  faColumn: {
    alignItems: 'center',
  },
  faRow: {
    flexDirection: 'row',
    gap: 3,
    height: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faMark: {
    width: 3,
    height: 8,
    borderRadius: 2,
    backgroundColor: THEME.gold,
  },
  faName: {
    marginTop: 6,
    fontSize: 9,
    letterSpacing: 2,
    color: THEME.goldDark,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  iconHalo: {
    marginTop: 14,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: THEME.goldHalo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: THEME.surface,
    borderWidth: 1.5,
    borderColor: THEME.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '800',
    color: THEME.white,
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    fontSize: 13.5,
    lineHeight: 20,
    color: THEME.muted,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 6,
    alignSelf: 'stretch',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(197, 160, 89, 0.3)',
  },
  // Cauris stylisés
  cowrie: {
    width: 6,
    height: 9,
    borderRadius: 4,
    backgroundColor: THEME.goldDark,
  },
  cowrieCenter: {
    width: 7,
    height: 11,
    backgroundColor: THEME.gold,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'stretch',
  },
  buttonsStacked: {
    flexDirection: 'column',
  },
  btn: {
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.55)',
  },
  btnRow: {
    flex: 1,
  },
  btnPrimary: {
    backgroundColor: THEME.gold,
    borderColor: THEME.gold,
  },
  btnDestructive: {
    borderColor: THEME.danger,
  },
  btnCancel: {
    borderColor: 'rgba(255,255,255,0.18)',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.gold,
  },
  btnTextPrimary: {
    color: THEME.black,
    fontWeight: '800',
  },
  btnTextDestructive: {
    color: THEME.danger,
  },
  btnTextCancel: {
    color: 'rgba(255,255,255,0.7)',
  },
});

