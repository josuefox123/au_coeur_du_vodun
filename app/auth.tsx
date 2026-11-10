import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from '@/components/AppHeader';
import { useApp } from '@/context/AppContext';
import { VodunPalette } from '@/constants/Colors';
import { useVodunAlert } from '@/components/VodunAlert';

export default function AuthScreen() {
  const router = useRouter();
  const { login } = useApp();
  const { alert } = useVodunAlert();
  const [isLogin, setIsLogin] = useState(true);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (!phoneOrEmail.trim() || !password.trim()) {
      alert('Identifiants Requis', 'Veuillez remplir vos identifiants pour accéder au sanctuaire.', [{ text: 'Corriger' }], { type: 'warning' });
      return;
    }

    if (!isLogin) {
      if (!fullName.trim()) {
        alert('Nom Requis', 'Veuillez saisir votre nom complet.', [{ text: 'Corriger' }], { type: 'warning' });
        return;
      }
      if (password !== confirmPassword) {
        alert('Divergence de Mots de Passe', 'Les mots de passe ne correspondent pas.', [{ text: 'Réessayer' }], { type: 'error' });
        return;
      }
      login(fullName.trim(), phoneOrEmail.trim());
      alert(
        'Compte Consacré',
        `Bienvenue ${fullName} au Temple Au Cœur du Vodun. Vos données sont préservées en toute sécurité.`,
        [{ text: 'Accéder à mon espace', onPress: () => router.replace('/(tabs)/profil') }],
        { type: 'success', icon: 'verified' }
      );
    } else {
      login('Fidèle du Temple', phoneOrEmail.trim());
      alert(
        'Porte Ouverte',
        'Bienvenue dans votre espace spirituel personnel.',
        [{ text: 'Pénétrer dans le sanctuaire', onPress: () => router.replace('/(tabs)/profil') }],
        { type: 'success', icon: 'vpn-key' }
      );
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title={isLogin ? 'Connexion' : 'Inscription'} subtitle="ESPACE FIDÈLE" showBack rightAction="none" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Espace Fidèle & Visiteur</Text>
        </View>
        <Text style={styles.title}>
          {isLogin ? 'Connexion au Temple' : 'Créer un Compte'}
        </Text>
        <Text style={styles.subtitle}>
          {isLogin
            ? 'Accédez au suivi de vos Fadu, consultations et rendez-vous.'
            : 'Rejoignez la communauté du Temple pour échanger avec le Bokonon.'}
        </Text>
      </View>

      {/* Switch Connexion / Inscription */}
      <View style={styles.switchContainer}>
        <Pressable
          style={[styles.switchBtn, isLogin && styles.switchBtnActive]}
          onPress={() =>setIsLogin(true)}>
          <Text style={[styles.switchText, isLogin && styles.switchTextActive]}>
            Connexion
          </Text>
        </Pressable>
        <Pressable
          style={[styles.switchBtn, !isLogin && styles.switchBtnActive]}
          onPress={() =>setIsLogin(false)}>
          <Text style={[styles.switchText, !isLogin && styles.switchTextActive]}>
            Inscription
          </Text>
        </Pressable>
      </View>

      {/* Formulaire */}
      <View style={styles.formCard}>
        {!isLogin && (
          <>
            <Text style={styles.label}>Nom & Prénoms *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Dossou Akanni"
              value={fullName}
              onChangeText={setFullName}
            />
          </>
        )}

        <Text style={styles.label}>Téléphone WhatsApp ou E-mail *</Text>
        <TextInput
          style={styles.input}
          placeholder="+229 ... ou adresse@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={phoneOrEmail}
          onChangeText={setPhoneOrEmail}
        />

        <Text style={styles.label}>Mot de passe *</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {!isLogin && (
          <>
            <Text style={styles.label}>Confirmer le mot de passe *</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </>
        )}

        <Pressable style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>
            {isLogin ? 'Se connecter' : 'Créer mon compte'}
          </Text>
        </Pressable>
      </View>

      {/* Mention de confidentialité */}
      <View style={styles.securityNote}>
        <Text style={styles.securityText}>
           Vos informations personnelles et spirituelles sont strictement protégées et chiffrées selon les normes du Temple et les lois béninoises.
        </Text>
      </View>
    </ScrollView>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: VodunPalette.ivory,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginVertical: 16,
  },
  badge: {
    backgroundColor: '#FAF5EA',
    borderWidth: 1,
    borderColor: VodunPalette.gold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 18,
    marginBottom: 8,
  },
  badgeText: {
    color: VodunPalette.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: VodunPalette.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: VodunPalette.textMuted,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  switchContainer: {
    flexDirection: 'row',
    backgroundColor: '#EAE5D8',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  switchBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 14,
  },
  switchBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  switchText: {
    fontSize: 13,
    fontWeight: '600',
    color: VodunPalette.textMuted,
  },
  switchTextActive: {
    color: VodunPalette.primary,
    fontWeight: 'bold',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: VodunPalette.border,
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: VodunPalette.primary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FAF8F3',
    borderWidth: 1,
    borderColor: VodunPalette.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: VodunPalette.textPrimary,
    marginBottom: 14,
  },
  submitBtn: {
    backgroundColor: VodunPalette.primary,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  securityNote: {
    backgroundColor: '#FAF5EA',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: VodunPalette.border,
  },
  securityText: {
    fontSize: 11,
    color: VodunPalette.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});

