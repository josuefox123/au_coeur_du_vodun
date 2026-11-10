import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from '@/components/AppHeader';
import { VodunPalette } from '@/constants/Colors';

interface QAItem {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
  actionText?: string;
  actionRoute?: string;
}

const FAQ_DATABASE: QAItem[] = [
  {
    id: 'q-location',
    question: 'Où se situe exactement le temple ?',
    keywords: ['où', 'lieu', 'adresse', 'localisation', 'situe', 'calavi', 'zoundja'],
    answer:
      'Le temple Au Cœur du Vodun est situé en République du Bénin, dans la commune d\'Abomey-Calavi, plus précisément au quartier Zoundja. Les visites se font sur rendez-vous confirmé.',
    actionText: 'Voir la fiche du temple',
    actionRoute: '/temple',
  },
  {
    id: 'q-fadu',
    question: 'Comment transmettre mon Fadu par photo ?',
    keywords: ['fadu', 'photo', 'signe', 'fa', 'transmission', 'image'],
    answer:
      'Vous pouvez prendre une photo nette du signe tracé (vue verticale avec bon éclairage) et l\'envoyer avec votre question via le bouton dédié. Le Bokonon examine personnellement chaque transmission dans la plus stricte discrétion.',
    actionText: 'Transmettre un Fadu',
    actionRoute: '/fadu',
  },
  {
    id: 'q-horaires',
    question: 'Quels sont les horaires d\'ouverture ?',
    keywords: ['horaires', 'heures', 'ouverture', 'jours', 'quand'],
    answer:
      'Le temple accueille les fidèles du Lundi au Samedi, de 09h00 à 18h30 (GMT+1 Bénin). Les dimanches sont généralement réservés aux cérémonies internes et méditations sacrées.',
    actionText: 'Prendre un rendez-vous',
    actionRoute: '/(tabs)/rendez-vous',
  },
  {
    id: 'q-distance',
    question: 'Puis-je consulter si je vis à l\'étranger ?',
    keywords: ['distance', 'étranger', 'diaspora', 'france', 'canada', 'visio', 'whatsapp', 'téléphone'],
    answer:
      'Oui, absolument. Le temple accompagne de nombreux membres de la diaspora africaine et internationale. Les consultations se déroulent par appel audio ou vidéo sécurisé WhatsApp / visio.',
    actionText: 'Réserver à distance',
    actionRoute: '/(tabs)/rendez-vous',
  },
  {
    id: 'q-tarifs',
    question: 'Quels sont les tarifs des consultations ?',
    keywords: ['tarif', 'prix', 'coût', 'combien', 'fcfa', 'payer', 'devis'],
    answer:
      'La consultation Fâ standard est fixée à 25 000 FCFA. Les rituels de protection (Bo) et travaux spécifiques font l\'objet d\'un devis personnalisé selon les prescriptions du Fâ.',
    actionText: 'Consulter le catalogue',
    actionRoute: '/(tabs)/services',
  },
];

interface ChatMessage {
  id: string;
  sender: 'BOT' | 'USER';
  text: string;
  actionText?: string;
  actionRoute?: string;
}

export default function AssistantScreen() {
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'BOT',
      text: 'Bienvenue sur l\'assistant du Temple Au Cœur du Vodun. Je réponds aux questions fréquentes relatives aux horaires, rituels, consultations et transmissions de Fadu.',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleAskQuestion = (qa: QAItem) => {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'USER',
      text: qa.question,
    };
    const botMsg: ChatMessage = {
      id: `b-${Date.now() + 1}`,
      sender: 'BOT',
      text: qa.answer,
      actionText: qa.actionText,
      actionRoute: qa.actionRoute,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const handleCustomSubmit = () => {
    if (!inputText.trim()) return;

    const query = inputText.trim().toLowerCase();
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'USER',
      text: inputText.trim(),
    };

    // Recherche par mot clé
    const match = FAQ_DATABASE.find((qa) =>
      qa.keywords.some((k) =>query.includes(k))
    );

    let botMsg: ChatMessage;
    if (match) {
      botMsg = {
        id: `b-${Date.now() + 1}`,
        sender: 'BOT',
        text: match.answer,
        actionText: match.actionText,
        actionRoute: match.actionRoute,
      };
    } else {
      botMsg = {
        id: `b-${Date.now() + 1}`,
        sender: 'BOT',
        text: 'Je n\'ai pas trouvé de réponse automatique pour cette question précise. Les questions spirituelles relèvent directement du Bokonon ou du secrétariat du temple.',
        actionText: 'Écrire au Secrétariat',
        actionRoute: '/(tabs)/echanges',
      };
    }

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputText('');
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Assistant du Temple" subtitle="RÉPONSES PRÉDÉFINIES" showBack rightAction="none" />
      {/* Disclaimer bot */}
      <View style={styles.disclaimerBar}>
        <Text style={styles.disclaimerText}>
           Assistant automatique à réponses préétablies. Ne produit aucune interprétation spirituelle directe.
        </Text>
      </View>

      {/* Raccourcis FAQ */}
      <View style={styles.faqShortcuts}>
        <Text style={styles.faqShortcutsTitle}>Questions fréquentes :</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.faqScroll}>
          {FAQ_DATABASE.map((qa) => (
            <Pressable
              key={qa.id}
              style={styles.faqChip}
              onPress={() =>handleAskQuestion(qa)}>
              <Text style={styles.faqChipText}>{qa.question}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Chat messages */}
      <ScrollView
        style={styles.chatScroll}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}>
        {messages.map((m) => {
          const isUser = m.sender === 'USER';
          return (
            <View
              key={m.id}
              style={[
                styles.messageRow,
                isUser ? styles.messageRowMe : styles.messageRowBot,
              ]}>
              <View
                style={[
                  styles.bubble,
                  isUser ? styles.bubbleMe : styles.bubbleBot,
                ]}>
                <Text style={[styles.bubbleText, isUser ? styles.bubbleTextMe : styles.bubbleTextBot]}>
                  {m.text}
                </Text>
                {m.actionText && m.actionRoute && (
                  <Pressable
                    style={styles.actionBtn}
                    onPress={() =>router.push(m.actionRoute as any)}>
                    <Text style={styles.actionBtnText}>{m.actionText}</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Posez votre question (ex: horaires, tarifs, lieu)..."
          placeholderTextColor="#8C9A93"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleCustomSubmit}
        />
        <Pressable style={styles.sendBtn} onPress={handleCustomSubmit}>
          <Text style={styles.sendBtnText}>Envoyer</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: VodunPalette.ivory,
  },
  disclaimerBar: {
    backgroundColor: '#FAF5EA',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: VodunPalette.border,
  },
  disclaimerText: {
    fontSize: 11,
    color: VodunPalette.terracotta,
    fontWeight: '600',
    textAlign: 'center',
  },
  faqShortcuts: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: VodunPalette.border,
  },
  faqShortcutsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: VodunPalette.primary,
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  faqScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  faqChip: {
    backgroundColor: '#F3EFE6',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: VodunPalette.border,
  },
  faqChipText: {
    fontSize: 12,
    color: VodunPalette.textPrimary,
    fontWeight: '500',
  },
  chatScroll: {
    flex: 1,
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 20,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowBot: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 22,
  },
  bubbleMe: {
    backgroundColor: VodunPalette.primary,
    borderBottomRightRadius: 2,
  },
  bubbleBot: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: VodunPalette.border,
    borderBottomLeftRadius: 2,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 18,
  },
  bubbleTextMe: {
    color: '#FFFFFF',
  },
  bubbleTextBot: {
    color: VodunPalette.textPrimary,
  },
  actionBtn: {
    marginTop: 8,
    backgroundColor: '#FAF4E8',
    borderColor: VodunPalette.gold,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: VodunPalette.primary,
  },
  inputBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: VodunPalette.border,
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#FAF8F3',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: VodunPalette.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: VodunPalette.textPrimary,
  },
  sendBtn: {
    backgroundColor: VodunPalette.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 18,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

