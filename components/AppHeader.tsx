import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  isHome?: boolean;
  rightAction?: 'notifications' | 'chat' | 'none';
}

const THEME = {
  text: '#111111',
  goldDark: '#9E7D3B',
  bg: '#F8F8FA',
  white: '#FFFFFF',
  border: '#EBEBEB',
};

export function AppHeader({
  title = 'Espace Sacré',
  showBack = false,
}: AppHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.topBar,
        { paddingTop: insets.top + (Platform.OS === 'ios' ? 8 : 12) },
      ]}>
      {showBack ? (
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
      ) : (
        <View style={{ width: 40 }} />
      )}

      <Text style={styles.topBarTitle} numberOfLines={1}>
        {title}
      </Text>

      <View style={{ width: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
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
    textAlign: 'center',
    flex: 1,
  },
});
