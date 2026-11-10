import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

/**
 * Notifications locales au style Vodun.
 * Canal Android dédié : lumière dorée et vibration en 4 battements
 * (les 4 marques d'un signe du Fâ).
 */

export const VODUN_CHANNEL_ID = 'vodun-temple';
const GOLD = '#C5A059';

// Afficher les notifications même lorsque l'application est ouverte.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export type VodunNotificationKind = 'fadu' | 'rendezvous' | 'consultation' | 'temple';

const TITLES: Record<VodunNotificationKind, string> = {
  fadu: '🐚 Votre signe est entre les mains du Bokonon',
  rendezvous: '🕯️ Rendez-vous déposé au Temple',
  consultation: '🌿 Demande de consultation reçue',
  temple: '🥁 Le Temple vous salue',
};

export async function setupVodunNotificationChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(VODUN_CHANNEL_ID, {
    name: 'Messages du Temple',
    description: 'Réponses du Bokonon, rendez-vous et annonces du Temple',
    importance: Notifications.AndroidImportance.HIGH,
    lightColor: GOLD,
    vibrationPattern: [0, 140, 90, 140, 90, 140, 90, 140],
    sound: 'default',
  });
}

/** Affiche immédiatement une notification Vodun (sans effet si la permission n'est pas accordée). */
export async function notifyVodun(kind: VodunNotificationKind, body: string) {
  try {
    const { granted } = await Notifications.getPermissionsAsync();
    if (!granted) return;
    await setupVodunNotificationChannel();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: TITLES[kind],
        body,
        color: GOLD,
        data: { kind },
      },
      trigger: Platform.OS === 'android' ? { channelId: VODUN_CHANNEL_ID } : null,
    });
  } catch (e) {
    console.warn('Notification Vodun impossible :', e);
  }
}

