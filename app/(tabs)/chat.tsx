import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { sendToAroha } from '@/lib/aroha';
import { saveMessages, loadMessages, ChatMessage, loadProfile } from '@/lib/storage';
import { addEntry } from '@/memory/timeline';
import { buildTimelineEvents } from '@/memory/extractor';
import { buildContext } from '@/memory/contextBuilder';

function getWelcome(name?: string): ChatMessage {
  if (name) {
    return {
      role: 'assistant',
      content: `Hello, ${name}! I am Aroha. I remember your conditions and medications. How are you feeling today?`,
    };
  }
  return {
    role: 'assistant',
    content: 'Hello! I am Aroha. How are you feeling today?',
  };
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    (async () => {
      const saved = await loadMessages();
      if (saved.length > 0) {
        setMessages(saved);
      } else {
        const profile = await loadProfile();
        setMessages([getWelcome(profile?.name)]);
      }
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (ready && messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages, ready]);

  const onSend = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;

    const nextHistory: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(nextHistory);
    setInput('');
    setBusy(true);

    try {
      const context = await buildContext();
      const reply = await sendToAroha(text, messages, context);
      const withReply: ChatMessage[] = [...nextHistory, { role: 'assistant', content: reply }];
      setMessages(withReply);

      const events = buildTimelineEvents(text, reply);
      for (const ev of events) {
        addEntry({
          date: new Date().toISOString(),
          type: ev.type,
          event: ev.event,
        });
      }
    } catch {
      const errorReply: ChatMessage[] = [
        ...nextHistory,
        {
          role: 'assistant',
          content:
            'Sorry, I could not reach my brain just now. Please check your connection and try again.',
        },
      ];
      setMessages(errorReply);
    } finally {
      setBusy(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    }
  }, [input, busy, messages]);

  if (!ready) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.centered}>
          <ActivityIndicator color="#0E7C7B" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.role === 'user' ? styles.userBubble : styles.arohaBubble,
              ]}
            >
              <Text style={item.role === 'user' ? styles.userText : styles.arohaText}>
                {item.content}
              </Text>
            </View>
          )}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        {busy && (
          <View style={styles.typing}>
            <ActivityIndicator color="#0E7C7B" />
            <Text style={styles.typingText}>Aroha is thinking…</Text>
          </View>
        )}

        <View style={styles.inputRow}>
          <Pressable
            style={styles.camBtn}
            onPress={() => router.push('/add-medication')}
          >
            <Text style={styles.camText}>📷</Text>
          </Pressable>
          <Pressable
            style={styles.camBtn}
            onPress={() => router.push('/add-symptom')}
          >
            <Text style={styles.camText}>🩹</Text>
          </Pressable>
          <TextInput
            style={styles.input}
            placeholder="Type a message…"
            placeholderTextColor="#889"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <Pressable style={styles.sendBtn} onPress={onSend} disabled={busy}>
            <Text style={styles.sendText}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, gap: 12 },
  bubble: { maxWidth: '85%', borderRadius: 18, padding: 14 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#0E7C7B' },
  arohaBubble: { alignSelf: 'flex-start', backgroundColor: '#EAF3F3' },
  userText: { color: '#fff', fontSize: 18 },
  arohaText: { color: '#123', fontSize: 18 },
  typing: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 6 },
  typingText: { color: '#556', fontSize: 15 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    fontSize: 18,
    maxHeight: 120,
    borderWidth: 1.5,
    borderColor: '#cdd',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#111',
  },
  sendBtn: {
    backgroundColor: '#0E7C7B',
    borderRadius: 14,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  sendText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  camBtn: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  camText: { fontSize: 24 },
});
