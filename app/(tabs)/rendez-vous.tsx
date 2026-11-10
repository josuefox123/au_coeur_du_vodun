import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { useApp } from '@/context/AppContext';
import { useVodunAlert } from '@/components/VodunAlert';
import { notifyVodun } from '@/lib/vodunNotifications';

type AppointmentMode = 'TEMPLE' | 'DISTANCE';

const AVAILABLE_DAYS = [
  { label: 'Lun 16 Nov', date: '2026-11-16' },
  { label: 'Mar 17 Nov', date: '2026-11-17' },
  { label: 'Mer 18 Nov', date: '2026-11-18' },
  { label: 'Jeu 19 Nov', date: '2026-11-19' },
  { label: 'Ven 20 Nov', date: '2026-11-20' },
  { label: 'Sam 21 Nov', date: '2026-11-21' },
];

const TIME_SLOTS = [
  { time: '09:00', available: true },
  { time: '10:30', available: true },
  { time: '12:00', available: false },
  { time: '14:30', available: true },
  { time: '16:00', available: true },
  { time: '17:30', available: true },
];

export default function AppointmentsScreen() {
  const { appointments, addAppointment } = useApp();
  const { alert } = useVodunAlert();
  const [activeTab, setActiveTab] = useState<'NEW' | 'HISTORY'>('NEW');

  // Formulaire de réservation
  const [mode, setMode] = useState<AppointmentMode>('TEMPLE');
  const [selectedDate, setSelectedDate] = useState<string>(AVAILABLE_DAYS[0].date);
  const [selectedTime, setSelectedTime] = useState<string>('09:00');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const handleBookAppointment = async () => {
    if (!fullName.trim() || !phone.trim()) {
      alert(
        'Champs Requis',
        'Veuillez renseigner votre nom et votre numéro de téléphone pour que le secrétariat puisse vous joindre.',
        [{ text: 'Compléter' }],
        { type: 'warning', icon: 'person-outline' }
      );
      return;
    }

    const dayObj = AVAILABLE_DAYS.find((d) => d.date === selectedDate);
    const newId = addAppointment({
      service: reason.trim() ? reason.trim() : 'Consultation Temple & Fâ',
      date: dayObj ? dayObj.label : selectedDate,
      time: `${selectedTime} (GMT+1 Bénin)`,
      mode,
    });

    await notifyVodun(
      'rendezvous',
      `Votre rendez-vous ${newId} (${dayObj ? dayObj.label : selectedDate} à ${selectedTime}) est enregistré.`
    );

    alert(
      'Demande Enregistrée !',
      `Votre rendez-vous ${newId} a été déposé et est en attente de validation par le secrétariat du Temple.`,
      [{ text: 'Voir mes rendez-vous', onPress: () => setActiveTab('HISTORY') }],
      { type: 'success', icon: 'event-available' }
    );

    setReason('');
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Prise de Rendez-vous" subtitle="CALENDRIER DU TEMPLE" />
      {/* Switcher d'onglets épuré */}
      <View style={styles.tabBarWrapper}>
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tabButton, activeTab === 'NEW' && styles.tabButtonActive]}
            onPress={() => setActiveTab('NEW')}>
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'NEW' && styles.tabButtonTextActive,
              ]}>
              Nouveau Rendez-vous
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabButton, activeTab === 'HISTORY' && styles.tabButtonActive]}
            onPress={() => setActiveTab('HISTORY')}>
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'HISTORY' && styles.tabButtonTextActive,
              ]}>
              Mes Rendez-vous ({appointments.length})
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {activeTab === 'NEW' ? (
          <>
            {/* Modalité */}
            <Text style={styles.sectionTitle}>1. Mode de consultation</Text>
            <View style={styles.modeContainer}>
              <Pressable
                style={[
                  styles.modeCard,
                  mode === 'TEMPLE' && styles.modeCardSelected,
                ]}
                onPress={() => setMode('TEMPLE')}>
                <View
                  style={[
                    styles.modeIconCircle,
                    mode === 'TEMPLE' && styles.modeIconCircleSelected,
                  ]}>
                  <MaterialIcons
                    name="account-balance"
                    size={22}
                    color={mode === 'TEMPLE' ? '#D97232' : '#6C7971'}
                  />
                </View>
                <Text
                  style={[
                    styles.modeTitle,
                    mode === 'TEMPLE' && styles.modeTitleSelected,
                  ]}>
                  Au Temple
                </Text>
                <Text style={styles.modeDesc}>Abomey-Calavi, Quartier Zoundja</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.modeCard,
                  mode === 'DISTANCE' && styles.modeCardSelected,
                ]}
                onPress={() => setMode('DISTANCE')}>
                <View
                  style={[
                    styles.modeIconCircle,
                    mode === 'DISTANCE' && styles.modeIconCircleSelected,
                  ]}>
                  <MaterialIcons
                    name="phone-iphone"
                    size={22}
                    color={mode === 'DISTANCE' ? '#D97232' : '#6C7971'}
                  />
                </View>
                <Text
                  style={[
                    styles.modeTitle,
                    mode === 'DISTANCE' && styles.modeTitleSelected,
                  ]}>
                  À Distance
                </Text>
                <Text style={styles.modeDesc}>Appel Visio / WhatsApp sécurisé</Text>
              </Pressable>
            </View>

            {/* Date */}
            <Text style={styles.sectionTitle}>2. Choisissez la date</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.datesScroll}>
              {AVAILABLE_DAYS.map((d) => {
                const isSelected = selectedDate === d.date;
                return (
                  <Pressable
                    key={d.date}
                    style={[
                      styles.dateChip,
                      isSelected && styles.dateChipSelected,
                    ]}
                    onPress={() => setSelectedDate(d.date)}>
                    <Text
                      style={[
                        styles.dateChipText,
                        isSelected && styles.dateChipTextSelected,
                      ]}>
                      {d.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Heure */}
            <Text style={styles.sectionTitle}>3. Créneaux disponibles (GMT+1)</Text>
            <View style={styles.slotsGrid}>
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <Pressable
                    key={slot.time}
                    disabled={!slot.available}
                    style={[
                      styles.slotChip,
                      !slot.available && styles.slotChipDisabled,
                      isSelected && styles.slotChipSelected,
                    ]}
                    onPress={() => setSelectedTime(slot.time)}>
                    <Text
                      style={[
                        styles.slotText,
                        !slot.available && styles.slotTextDisabled,
                        isSelected && styles.slotTextSelected,
                      ]}>
                      {slot.time}
                    </Text>
                    <Text
                      style={[
                        styles.slotSub,
                        !slot.available && styles.slotTextDisabled,
                        isSelected && styles.slotSubSelected,
                      ]}>
                      {slot.available ? 'Libre' : 'Réservé'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Coordonnées */}
            <Text style={styles.sectionTitle}>4. Vos coordonnées</Text>
            <View style={styles.formCard}>
              <Text style={styles.inputLabel}>Nom & Prénoms *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Koffi Mensah"
                placeholderTextColor="#8C9A93"
                value={fullName}
                onChangeText={setFullName}
              />

              <Text style={styles.inputLabel}>Téléphone / WhatsApp *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: +229 97 00 00 00"
                placeholderTextColor="#8C9A93"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />

              <Text style={styles.inputLabel}>Motif ou question (optionnel)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Précisez brièvement l'objet de la consultation..."
                placeholderTextColor="#8C9A93"
                multiline
                numberOfLines={3}
                value={reason}
                onChangeText={setReason}
              />
            </View>

            <Pressable style={styles.submitBtn} onPress={handleBookAppointment}>
              <Text style={styles.submitBtnText}>Confirmer la demande de RDV</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
            </Pressable>
          </>
        ) : (
          /* Historique des rendez-vous */
          <View style={styles.historyList}>
            {appointments.map((item) => (
              <View key={item.id} style={styles.historyCard}>
                <View style={styles.historyCardTop}>
                  <Text style={styles.historyId}>{item.id}</Text>
                  <View
                    style={[
                      styles.statusPill,
                      item.status === 'Confirmé' && styles.statusConfirmed,
                      item.status === 'En attente' && styles.statusPending,
                      item.status === 'Terminé' && styles.statusFinished,
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        item.status === 'Confirmé' && { color: '#2E7D32' },
                        item.status === 'En attente' && { color: '#D97232' },
                      ]}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.historyService}>{item.service}</Text>

                <View style={styles.historyRow}>
                  <MaterialIcons name="calendar-today" size={15} color="#6C7971" style={{ marginRight: 6 }} />
                  <Text style={styles.historyValue}>{item.date}</Text>
                </View>

                <View style={styles.historyRow}>
                  <MaterialIcons name="access-time" size={15} color="#6C7971" style={{ marginRight: 6 }} />
                  <Text style={styles.historyValue}>{item.time}</Text>
                </View>

                <View style={styles.historyRow}>
                  <MaterialIcons name="place" size={15} color="#6C7971" style={{ marginRight: 6 }} />
                  <Text style={styles.historyValue}>
                    {item.mode === 'TEMPLE'
                      ? 'Au Temple (Abomey-Calavi)'
                      : 'À distance (Appel / Visio)'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  tabBarWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FAF7F2',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#EFE9DE',
    borderRadius: 24,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C7971',
  },
  tabButtonTextActive: {
    color: '#1A2C23',
    fontWeight: '800',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A2C23',
    marginTop: 8,
    marginBottom: 10,
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  modeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#ECE6DA',
    alignItems: 'center',
  },
  modeCardSelected: {
    borderColor: '#C5A059',
    backgroundColor: '#FFFCF7',
  },
  modeIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F8FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modeIconCircleSelected: {
    backgroundColor: '#F9F5EC',
  },
  modeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },
  modeTitleSelected: {
    color: '#111111',
  },
  modeDesc: {
    fontSize: 11,
    color: '#7A7A7A',
    textAlign: 'center',
    marginTop: 2,
  },
  datesScroll: {
    gap: 8,
    paddingBottom: 16,
  },
  dateChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  dateChipSelected: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  dateChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
  },
  dateChipTextSelected: {
    color: '#FFFFFF',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  slotChip: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  slotChipDisabled: {
    backgroundColor: '#F5F5F7',
    borderColor: '#EBEBEB',
    opacity: 0.45,
  },
  slotChipSelected: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  slotText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },
  slotTextDisabled: {
    color: '#9E9E9E',
  },
  slotTextSelected: {
    color: '#C5A059',
  },
  slotSub: {
    fontSize: 10,
    color: '#7A7A7A',
    marginTop: 2,
  },
  slotSubSelected: {
    color: '#FFFFFF',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8F8FA',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 14,
    color: '#111111',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#C5A059',
    height: 54,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#C5A059',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ECE6DA',
  },
  historyCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyId: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D97232',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#ECECEC',
  },
  statusConfirmed: {
    backgroundColor: '#E8F5E9',
  },
  statusPending: {
    backgroundColor: '#FDF1E7',
  },
  statusFinished: {
    backgroundColor: '#EFEBE9',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1A2C23',
  },
  historyService: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A2C23',
    marginBottom: 10,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C7971',
    flex: 1,
  },
});
