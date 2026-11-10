import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppHeader } from '@/components/AppHeader';
import { VodunPalette } from '@/constants/Colors';
import { useVodunAlert } from '@/components/VodunAlert';
import { notifyVodun } from '@/lib/vodunNotifications';

const SERVICES_OPTIONS = [
  'Consultation Fâ & Géomancie Sacrée',
  'Guidance & Rituels Vodun',
  'Rituels de Protection (Bo)',
  'Bains de Purification (Zannuyun)',
  'Coaching de Vie Spirituel',
  'Analyse Approfondie d\'un Signe (Kpoli)',
];

export default function ConsultationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ serviceId?: string; serviceName?: string }>();
  const { alert } = useVodunAlert();

  const [selectedService, setSelectedService] = useState<string>(
    params.serviceName || SERVICES_OPTIONS[0]
  );
  const [mode, setMode] = useState<'TEMPLE' | 'DISTANCE'>('TEMPLE');
  const [language, setLanguage] = useState<'FR' | 'FONG' | 'BOTH'>('FR');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [datePreference, setDatePreference] = useState('');
  const [motif, setMotif] = useState('');

  const handleSubmit = async () => {
    if (!fullName.trim() || !phone.trim() || !motif.trim()) {
      alert(
        'Champs Requis',
        'Veuillez renseigner votre nom, téléphone et le motif de votre démarche spirituelle.',
        [{ text: 'Compléter' }],
        { type: 'warning', icon: 'edit-note' }
      );
      return;
    }

    const consultationId = `#CONS-${Math.floor(1000 + Math.random() * 9000)}`;

    await notifyVodun(
      'consultation',
      `Votre démarche ${consultationId} (${selectedService}) a été reçue par le Temple.`
    );

    alert(
      'Demande Consacrée !',
      `Votre demande de consultation ${consultationId} a bien été transmise. Un responsable du Temple prendra contact avec vous dans les 24h.`,
      [
        {
          text: 'Voir mes démarches',
          onPress: () => router.push('/(tabs)/echanges'),
        },
        {
          text: 'Fermer',
          onPress: () => router.back(),
        },
      ],
      { type: 'success', icon: 'check-circle' }
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Demande de Consultation" subtitle="GUIDANCE DU FÂ" showBack />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
      {/* Service sélectionné */}
      <Text style={styles.sectionTitle}>1. Prestation demandée</Text>
      <View style={styles.card}>
        {SERVICES_OPTIONS.map((srv) => {
          const isSelected = selectedService === srv;
          return (
            <Pressable
              key={srv}
              style={[styles.serviceOption, isSelected && styles.serviceOptionSelected]}
              onPress={() =>setSelectedService(srv)}>
              <View style={[styles.serviceRadio, isSelected && styles.serviceRadioSelected]} />
              <Text style={[styles.serviceText, isSelected && styles.serviceTextSelected]}>
                {srv}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Mode de consultation */}
      <Text style={styles.sectionTitle}>2. Mode de consultation</Text>
      <View style={styles.modeRow}>
        <Pressable
          style={[styles.modeBtn, mode === 'TEMPLE' && styles.modeBtnActive]}
          onPress={() =>setMode('TEMPLE')}>
          <Text style={[styles.modeLabel, mode === 'TEMPLE' && styles.modeLabelActive]}>
            Au Temple (Calavi)
          </Text>
        </Pressable>

        <Pressable
          style={[styles.modeBtn, mode === 'DISTANCE' && styles.modeBtnActive]}
          onPress={() =>setMode('DISTANCE')}>
          <Text style={[styles.modeLabel, mode === 'DISTANCE' && styles.modeLabelActive]}>
            À Distance (Visio/Appel)
          </Text>
        </Pressable>
      </View>

      {/* Langue de communication */}
      <Text style={styles.sectionTitle}>3. Langue d'échange</Text>
      <View style={styles.langRow}>
        <Pressable
          style={[styles.langChip, language === 'FR' && styles.langChipActive]}
          onPress={() =>setLanguage('FR')}>
          <Text style={[styles.langChipText, language === 'FR' && styles.langChipTextActive]}>
            Français
          </Text>
        </Pressable>

        <Pressable
          style={[styles.langChip, language === 'FONG' && styles.langChipActive]}
          onPress={() =>setLanguage('FONG')}>
          <Text style={[styles.langChipText, language === 'FONG' && styles.langChipTextActive]}>
            Fɔngbè
          </Text>
        </Pressable>

        <Pressable
          style={[styles.langChip, language === 'BOTH' && styles.langChipActive]}
          onPress={() =>setLanguage('BOTH')}>
          <Text style={[styles.langChipText, language === 'BOTH' && styles.langChipTextActive]}>
            Français & Fɔngbè
          </Text>
        </Pressable>
      </View>

      {/* Coordonnées & Motif */}
      <Text style={styles.sectionTitle}>4. Vos informations</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Nom et Prénoms *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Akanni Dossou"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Téléphone / WhatsApp *</Text>
        <TextInput
          style={styles.input}
          placeholder="+229 ..."
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Adresse e-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="contact@exemple.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Période ou jour souhaité</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Samedi matin ou en semaine après 16h"
          value={datePreference}
          onChangeText={setDatePreference}
        />

        <Text style={styles.label}>Motif de la demande *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Décrivez votre situation ou vos interrogations..."
          multiline
          numberOfLines={4}
          value={motif}
          onChangeText={setMotif}
        />
      </View>

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Envoyer la Demande de Consultation</Text>
      </Pressable>
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: VodunPalette.primary,
    marginBottom: 8,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: VodunPalette.border,
    marginBottom: 14,
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F2EB',
  },
  serviceOptionSelected: {
    backgroundColor: '#FAF6ED',
    borderRadius: 14,
    paddingHorizontal: 6,
  },
  serviceRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: VodunPalette.border, marginRight: 10 },
  serviceRadioSelected: { borderColor: VodunPalette.primary, backgroundColor: VodunPalette.gold },
  serviceText: {
    fontSize: 13,
    color: VodunPalette.textPrimary,
    flex: 1,
  },
  serviceTextSelected: {
    fontWeight: 'bold',
    color: VodunPalette.primary,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  modeBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: VodunPalette.border,
  },
  modeBtnActive: {
    borderColor: VodunPalette.primary,
    backgroundColor: '#F0F6F3',
  },
  modeIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  modeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: VodunPalette.textMuted,
  },
  modeLabelActive: {
    color: VodunPalette.primary,
    fontWeight: 'bold',
  },
  langRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  langChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: VodunPalette.border,
  },
  langChipActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  langChipText: {
    fontSize: 12,
    color: '#111111',
    fontWeight: '600',
  },
  langChipTextActive: {
    color: '#FFFFFF',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F8F8FA',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111111',
    marginBottom: 10,
  },
  textArea: {
    height: 75,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#C5A059',
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#C5A059',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#111111',
    fontWeight: '800',
    fontSize: 15,
  },
});

