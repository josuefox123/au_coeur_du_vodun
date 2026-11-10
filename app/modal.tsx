import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { useApp } from '@/context/AppContext';

const THEME = {
  black: '#111111',
  darkCard: '#1C1C1E',
  gold: '#C5A059',
  goldSoft: '#F9F5EC',
  goldDark: '#9E7D3B',
  white: '#FFFFFF',
  bg: '#F8F8FA',
  border: '#EBEBEB',
  text: '#111111',
  muted: '#7A7A7A',
};

const QUICK_PROMPTS = [
  'Je souhaite prendre un rendez-vous',
  'Comment envoyer mon Fadu ?',
  'Quels sont vos horaires et adresse ?',
  'Renseignements sur les rituels de protection',
];

export default function MessagerieModalScreen() {
  const router = useRouter();
  const { conversations, sendMessage } = useApp();
  const scrollViewRef = useRef<any>(null);

  const [selectedConvId, setSelectedConvId] = useState<string>(
    conversations[0]?.id || 'conv-fadu-8421'
  );
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const currentConv =
    conversations.find((c) => c.id === selectedConvId) || conversations[0];

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 120);
  }, [currentConv?.messages.length, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !currentConv) return;

    sendMessage(currentConv.id, text, 'USER');
    setInputText('');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const autoReplies = [
        'Merci pour votre message. Le secrétariat du temple a bien pris en compte votre demande. Nous traitons votre requête avec la plus haute discrétion.',
        'Que les bénédictions soient sur vous. Votre message a été transmis au Bokonon. Un retour vous sera apporté sous peu.',
        'Bien reçu. Si votre demande concerne un rendez-vous urgent, nos portes sont ouvertes du lundi au samedi à Abomey-Calavi.',
      ];
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      const replySender = currentConv.id.includes('fadu') ? 'BOKONON' : 'TEMPLE';
      sendMessage(currentConv.id, reply, replySender);
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Messagerie du Sanctuaire"
        subtitle="SERVICE CLIENT & GUIDANCE"
        showBack
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>

        {/* Sélecteur des canaux de discussion */}
        <View style={styles.channelsBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.channelsTrack}>
            {conversations.map((conv) => {
              const active = conv.id === selectedConvId;
              return (
                <Pressable
                  key={conv.id}
                  accessibilityRole="button"
                  style={[styles.channelChip, active && styles.channelChipActive]}
                  onPress={() => setSelectedConvId(conv.id)}>
                  <View style={[styles.channelDot, active && styles.channelDotActive]} />
                  <Text style={[styles.channelTitle, active && styles.channelTitleActive]}>
                    {conv.title}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Bannière de statut de disponibilité active */}
        <View style={styles.statusBar}>
          <View style={styles.statusAvatar}>
            <MaterialIcons name="support-agent" size={20} color={THEME.gold} />
          </View>
          <View style={styles.statusTextCol}>
            <Text style={styles.statusTitle}>
              {currentConv?.title || 'Service Client du Temple'}
            </Text>
            <View style={styles.statusRow}>
              <View style={styles.liveIndicator} />
              <Text style={styles.statusSubtitle}>En ligne • Réponse rapide garantie</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            style={styles.actionShortcut}
            onPress={() => router.push('/(tabs)/rendez-vous' as any)}>
            <MaterialIcons name="event" size={16} color={THEME.white} />
            <Text style={styles.actionShortcutText}>RDV</Text>
          </Pressable>
        </View>

        {/* Liste des messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}>

          <View style={styles.introCard}>
            <MaterialIcons name="security" size={18} color={THEME.gold} />
            <Text style={styles.introText}>
              Canal officiel et confidentiel du Sanctuaire Au Cœur du Vodun. Vos échanges sont strictement privés.
            </Text>
          </View>

          {currentConv?.messages.map((msg) => {
            const isMe = msg.sender === 'USER';
            const isSystem = msg.sender === 'SYSTEM';

            if (isSystem) {
              return (
                <View key={msg.id} style={styles.systemRow}>
                  <View style={styles.systemBadge}>
                    <MaterialIcons name="security" size={13} color={THEME.goldDark} />
                    <Text style={styles.systemText}>{msg.text}</Text>
                  </View>
                  <Text style={styles.systemTime}>{msg.timestamp}</Text>
                </View>
              );
            }

            return (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  isMe ? styles.messageRowMe : styles.messageRowOther,
                ]}>
                {!isMe && (
                  <View style={styles.senderAvatar}>
                    <MaterialIcons
                      name={msg.sender === 'BOKONON' ? 'auto-awesome' : 'account-balance'}
                      size={15}
                      color={THEME.gold}
                    />
                  </View>
                )}

                <View
                  style={[
                    styles.messageBubble,
                    isMe ? styles.bubbleMe : styles.bubbleOther,
                  ]}>
                  {!isMe && (
                    <View style={styles.senderHeader}>
                      <Text style={styles.senderName}>
                        {msg.sender === 'BOKONON'
                          ? 'Bokonon • Prêtre de Fâ'
                          : 'Secrétariat du Sanctuaire'}
                      </Text>
                      <MaterialIcons name="verified" size={12} color={THEME.goldDark} />
                    </View>
                  )}
                  <Text style={[styles.messageText, isMe ? styles.textMe : styles.textOther]}>
                    {msg.text}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text style={[styles.timeText, isMe ? styles.timeMe : styles.timeOther]}>
                      {msg.timestamp}
                    </Text>
                    {isMe && (
                      <MaterialIcons name="done-all" size={13} color={THEME.gold} />
                    )}
                  </View>
                </View>
              </View>
            );
          })}

          {isTyping && (
            <View style={[styles.messageRow, styles.messageRowOther]}>
              <View style={styles.senderAvatar}>
                <MaterialIcons
                  name={currentConv?.id.includes('fadu') ? 'auto-awesome' : 'account-balance'}
                  size={15}
                  color={THEME.gold}
                />
              </View>
              <View style={[styles.messageBubble, styles.bubbleOther, styles.typingBubble]}>
                <Text style={styles.typingText}>
                  {currentConv?.id.includes('fadu')
                    ? 'Le Bokonon vous répond...'
                    : 'Le temple vous répond...'}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Suggestions rapides cliquables */}
        <View style={styles.quickPromptsWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickPromptsTrack}>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <Pressable
                key={idx}
                accessibilityRole="button"
                style={({ pressed }) => [styles.quickPromptChip, pressed && { opacity: 0.8 }]}
                onPress={() => handleSend(prompt)}>
                <Text style={styles.quickPromptText}>{prompt}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Barre de saisie de message */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Écrivez votre message au temple..."
            placeholderTextColor="#8C9A93"
            value={inputText}
            onChangeText={setInputText}
            multiline={false}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Envoyer le message"
            style={({ pressed }) => [
              styles.sendBtn,
              !inputText.trim() && styles.sendBtnDisabled,
              pressed && { opacity: 0.85 },
            ]}
            disabled={!inputText.trim()}
            onPress={() => handleSend()}>
            <MaterialIcons name="send" size={19} color={THEME.white} />
          </Pressable>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  keyboardContainer: {
    flex: 1,
  },
  channelsBar: {
    backgroundColor: THEME.white,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    paddingVertical: 10,
  },
  channelsTrack: {
    paddingHorizontal: 16,
    gap: 8,
  },
  channelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.bg,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  channelChipActive: {
    backgroundColor: THEME.black,
    borderColor: THEME.black,
  },
  channelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.muted,
    marginRight: 6,
  },
  channelDotActive: {
    backgroundColor: THEME.gold,
  },
  channelTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.text,
  },
  channelTitleActive: {
    color: THEME.white,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  statusAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statusTextCol: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.text,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  liveIndicator: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#2E7D32',
    marginRight: 5,
  },
  statusSubtitle: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '600',
  },
  actionShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.gold,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  actionShortcutText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.black,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
    gap: 12,
  },
  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    maxWidth: '92%',
    gap: 8,
    backgroundColor: '#F5EFE3',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.35)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 8,
  },
  introText: {
    flex: 1,
    fontSize: 11,
    color: THEME.goldDark,
    lineHeight: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  systemRow: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 6,
  },
  systemBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5EFE3',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    maxWidth: '90%',
  },
  systemText: {
    fontSize: 11.5,
    color: THEME.goldDark,
    fontWeight: '600',
    textAlign: 'center',
  },
  systemTime: {
    fontSize: 9.5,
    color: THEME.muted,
    marginTop: 2,
  },
  messageRow: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: 4,
  },
  messageRowMe: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap: 8,
  },
  senderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.black,
    borderWidth: 1.5,
    borderColor: THEME.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleMe: {
    backgroundColor: THEME.black,
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  bubbleOther: {
    backgroundColor: THEME.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    marginRight: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  typingBubble: {
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: THEME.muted,
  },
  senderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  senderName: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.goldDark,
    letterSpacing: 0.2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  textMe: {
    color: THEME.white,
  },
  textOther: {
    color: THEME.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
  },
  timeMe: {
    color: 'rgba(255, 255, 255, 0.65)',
  },
  timeOther: {
    color: THEME.muted,
  },
  quickPromptsWrap: {
    backgroundColor: THEME.white,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    paddingVertical: 8,
  },
  quickPromptsTrack: {
    paddingHorizontal: 14,
    gap: 8,
  },
  quickPromptChip: {
    backgroundColor: THEME.bg,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  quickPromptText: {
    fontSize: 11.5,
    color: THEME.text,
    fontWeight: '600',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    gap: 10,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    backgroundColor: THEME.bg,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 13.5,
    color: THEME.text,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#CCCCCC',
  },
});
