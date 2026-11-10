import React, { useState } from 'react';
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
import { MaterialIcons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { useApp } from '@/context/AppContext';

export default function EchangesScreen() {
  const { conversations, sendMessage } = useApp();
  const [selectedConvId, setSelectedConvId] = useState<string>(
    conversations[0]?.id || 'conv-fadu-8421'
  );
  const [inputText, setInputText] = useState<string>('');

  const currentConv =
    conversations.find((c) => c.id === selectedConvId) || conversations[0];

  const handleSendMessage = () => {
    if (!inputText.trim() || !currentConv) return;
    sendMessage(currentConv.id, inputText.trim());
    setInputText('');
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Échanges & Messages" subtitle="CANAL SÉCURISÉ" showBack />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Sélecteur de conversations en haut */}
        <View style={styles.convHeaderList}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.convListScroll}>
            {conversations.map((conv) => {
              const isSelected = conv.id === selectedConvId;
              return (
                <Pressable
                  key={conv.id}
                  style={[
                    styles.convTabChip,
                    isSelected && styles.convTabChipActive,
                  ]}
                  onPress={() => setSelectedConvId(conv.id)}>
                  <Text
                    style={[
                      styles.convTabTitle,
                      isSelected && styles.convTabTitleActive,
                    ]}>
                    {conv.title}
                  </Text>
                  <View style={styles.convTabTagRow}>
                    <Text
                      style={[
                        styles.convTabTag,
                        isSelected && styles.convTabTagActive,
                      ]}>
                      {conv.tag}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Bannière de la conversation active */}
        {currentConv && (
          <View style={styles.chatInfoBar}>
            <View style={styles.chatAvatar}>
              <Text style={styles.chatAvatarText}>
                {currentConv.title.includes('Bokonon') ? 'B' : 'T'}
              </Text>
            </View>
            <View style={styles.chatInfoTextWrap}>
              <Text style={styles.chatInfoName}>{currentConv.title}</Text>
              <Text style={styles.chatInfoTag}>
                {currentConv.tag} • Confidentiel et préservé
              </Text>
            </View>
          </View>
        )}

        {/* Messages */}
        <ScrollView
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}>
          {currentConv?.messages.map((msg) => {
            const isMe = msg.sender === 'USER';
            const isSystem = msg.sender === 'SYSTEM';

            if (isSystem) {
              return (
                <View key={msg.id} style={styles.systemRow}>
                  <View style={styles.systemBadge}>
                    <MaterialIcons name="security" size={13} color="#9E7D3B" />
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
                      color="#C5A059"
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
                      <Text style={styles.senderLabel}>
                        {msg.sender === 'BOKONON'
                          ? 'Bokonon • Prêtre de Fâ'
                          : 'Secrétariat du Sanctuaire'}
                      </Text>
                      <MaterialIcons name="verified" size={12} color="#9E7D3B" />
                    </View>
                  )}
                  <Text
                    style={[
                      styles.messageText,
                      isMe ? styles.textMe : styles.textOther,
                    ]}>
                    {msg.text}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text
                      style={[
                        styles.timestampText,
                        isMe ? styles.timeMe : styles.timeOther,
                      ]}>
                      {msg.timestamp}
                    </Text>
                    {isMe && (
                      <MaterialIcons name="done-all" size={13} color="#C5A059" />
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Zone de saisie */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.chatInput}
            placeholder="Écrivez votre message..."
            placeholderTextColor="#8C9A93"
            value={inputText}
            onChangeText={setInputText}
          />
          <Pressable
            style={({ pressed }) => [styles.sendButton, pressed && { opacity: 0.85 }]}
            onPress={handleSendMessage}>
            <MaterialIcons name="send" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  keyboardContainer: {
    flex: 1,
  },
  convHeaderList: {
    backgroundColor: '#FAF7F2',
    borderBottomWidth: 1,
    borderBottomColor: '#ECE6DA',
    paddingVertical: 10,
  },
  convListScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  convTabChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#ECE6DA',
  },
  convTabChipActive: {
    backgroundColor: '#1A2C23',
    borderColor: '#1A2C23',
  },
  convTabTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A2C23',
  },
  convTabTitleActive: {
    color: '#FFFFFF',
  },
  convTabTagRow: {
    marginTop: 2,
  },
  convTabTag: {
    fontSize: 11,
    color: '#6C7971',
  },
  convTabTagActive: {
    color: '#D4B36A',
  },
  chatInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECE6DA',
  },
  chatAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FAF7F2',
    borderWidth: 1.5,
    borderColor: '#D4B36A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chatAvatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A2C23',
  },
  chatInfoTextWrap: {
    flex: 1,
  },
  chatInfoName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A2C23',
  },
  chatInfoTag: {
    fontSize: 11,
    color: '#6C7971',
    marginTop: 1,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContainer: {
    padding: 18,
    paddingBottom: 24,
    gap: 12,
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
    color: '#9E7D3B',
    fontWeight: '600',
    textAlign: 'center',
  },
  systemTime: {
    fontSize: 9.5,
    color: '#8A968F',
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
    backgroundColor: '#111111',
    borderWidth: 1.5,
    borderColor: '#C5A059',
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
    backgroundColor: '#111111',
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  bubbleOther: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#ECE6DA',
    marginRight: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  senderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  senderLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9E7D3B',
    letterSpacing: 0.2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  textMe: {
    color: '#FFFFFF',
  },
  textOther: {
    color: '#111111',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  timestampText: {
    fontSize: 10,
  },
  timeMe: {
    color: 'rgba(255, 255, 255, 0.65)',
  },
  timeOther: {
    color: '#8A968F',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ECE6DA',
    gap: 10,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#ECE6DA',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1A2C23',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
