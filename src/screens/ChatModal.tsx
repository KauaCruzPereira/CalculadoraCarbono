import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";
import { colors, spacing, radius, typography } from "../theme";
import ChatBotIcon from "../assets/svg/chatbot";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
}

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
  mathContext?: string;
}

function nowTime() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const INITIAL_MSG: Message = {
  id: "0",
  role: "assistant",
  text: "Olá!, Sou seu assistente de pegada de carbono. Posso ajudar a entender seus resultados, explicar como as emissões são calculadas, dar dicas para reduzir seu impacto ambiental e responder dúvidas sobre energia, transporte, resíduos, alimentação e sustentabilidade.",
  time: nowTime(),
};

export default function ChatModal({
  visible,
  onClose,
  mathContext,
}: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const historyRef = useRef<{ role: string; content: string }[]>([]);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
      time: nowTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    historyRef.current.push({ role: "user", content: text });
    setLoading(true);
    scrollToEnd();

    const systemPrompt =
      `
    Você é o assistente da Calculadora de Emissões de Carbono.
    
    Sua função é:
    - Explicar os resultados exibidos no aplicativo.
    - Interpretar os valores calculados.
    - Comparar emissões entre diferentes atividades.
    - Responder dúvidas sobre sustentabilidade.
    - Sugerir ações para reduzir emissões.
    
    Ao analisar os dados:
    1. Identifique as maiores fontes de emissão.
    2. Explique o impacto de cada categoria.
    3. Sugira melhorias práticas.
    4. Use linguagem simples e amigável.
    
    Nunca invente valores que não estejam presentes nos dados fornecidos.
    ` + (mathContext ? `\n\nResultado atual do usuário:\n${mathContext}` : "");

    try {
      const response = await fetch(
        "https://calculadora-carbono-cedup.vercel.app/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              ...historyRef.current,
            ],
          }),
        },
      );
      const data = await response.json();

      const reply = data.reply ?? "Não consegui responder. Tente novamente.";

      historyRef.current.push({ role: "assistant", content: reply });

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: reply,
        time: nowTime(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: "Erro ao conectar. Verifique sua conexão e a chave de API.",
          time: nowTime(),
        },
      ]);
    } finally {
      setLoading(false);
      scrollToEnd();
    }
  }, [input, loading, mathContext, scrollToEnd]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarDot}>
                <ChatBotIcon color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Assistente IA</Text>
                <Text style={styles.headerSub}>Matemática passo a passo</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollRef}
            style={styles.messages}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={scrollToEnd}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.msgWrapper,
                  msg.role === "user"
                    ? styles.msgWrapperUser
                    : styles.msgWrapperAi,
                ]}
              >
                {msg.role === "assistant" && (
                  <Text style={styles.msgLabel}>Assistente</Text>
                )}
                <View
                  style={[
                    styles.bubble,
                    msg.role === "user" ? styles.bubbleUser : styles.bubbleAi,
                  ]}
                >
                  <Text
                    style={
                      msg.role === "user"
                        ? styles.bubbleTextUser
                        : styles.bubbleTextAi
                    }
                  >
                    {msg.text}
                  </Text>
                </View>
                <Text style={styles.msgTime}>{msg.time}</Text>
              </View>
            ))}

            {loading && (
              <View style={[styles.msgWrapper, styles.msgWrapperAi]}>
                <Text style={styles.msgLabel}>Assistente</Text>
                <View style={styles.typingBubble}>
                  <ActivityIndicator size="small" color={colors.textMuted} />
                  <Text style={styles.typingText}>Digitando...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Pergunte sobre matemática..."
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={500}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              blurOnSubmit
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                (!input.trim() || loading) && styles.sendBtnDisabled,
              ]}
              onPress={sendMessage}
              disabled={!input.trim() || loading}
            >
              <Text style={styles.sendBtnText}>↑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatarDot: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  headerSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  contextPill: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  contextText: {
    fontSize: 12,
    color: "#1D4ED8",
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  msgWrapper: {
    maxWidth: "85%",
    gap: spacing.xs,
  },
  msgWrapperUser: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  msgWrapperAi: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  msgLabel: {
    fontSize: 11,
    color: colors.textMuted,
    paddingHorizontal: spacing.xs,
  },
  bubble: {
    padding: spacing.md,
    borderRadius: radius.md,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: radius.sm ?? 4,
  },
  bubbleAi: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: radius.sm ?? 4,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  bubbleTextUser: {
    fontSize: 15,
    color: "#FFFFFF",
    lineHeight: 22,
  },
  bubbleTextAi: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  msgTime: {
    fontSize: 11,
    color: colors.textMuted,
    paddingHorizontal: spacing.xs,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderBottomLeftRadius: radius.sm ?? 4,
    padding: spacing.md,
  },
  typingText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.textPrimary,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  sendBtnDisabled: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  sendBtnText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
