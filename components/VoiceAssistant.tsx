"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { fishCatalog } from "@/lib/data";
import type { ChatMessage, VoiceState, OllamaResponse } from "@/lib/voice-types";

const isSpeechSupported =
  typeof window !== "undefined" &&
  ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

export function VoiceAssistant() {
  const router = useRouter();
  const cart = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<VoiceState>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [textInput, setTextInput] = useState('');
  const recognitionRef = useRef<any>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const stopSpeakingRef = useRef<() => void>(() => {});
  const speakRef = useRef<(text: string) => void>(() => {});
  const processRef = useRef<(text: string) => Promise<void>>(
    async () => {}
  );

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setState((prev) => (prev === "speaking" ? "idle" : prev));
  }, []);

  const speak = useCallback((text: string) => {
    window.speechSynthesis?.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1;
    utterance.onstart = () => setState("speaking");
    utterance.onend = () => setState("idle");
    utterance.onerror = () => setState("idle");
    window.speechSynthesis.speak(utterance);
  }, []);

  const processMessage = useCallback(
    async (text: string) => {
      setMessages((prev) => [...prev, { role: "user", text }]);
      setState("processing");

      const cartItems = cart.items.map((item) => {
        const fish = fishCatalog.find((f) => f.id === item.fishId);
        return {
          fishId: item.fishId,
          englishName: fish?.englishName || item.fishId,
          quantityKg: item.quantityKg,
          packaging: item.packaging
        };
      });

      try {
        const res = await fetch("/api/voice/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, cart: cartItems })
        });

        if (!res.ok) throw new Error("API error");

        const data: OllamaResponse = await res.json();

        setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);

        switch (data.intent) {
          case "navigate": {
            const page = data.params.page;
            if (page && typeof page === "string") router.push(page);
            break;
          }
          case "add_to_cart": {
            const fishId = data.params.fishId;
            if (fishId) {
              const fish = fishCatalog.find((f) => f.id === fishId);
              if (fish) cart.addFish(fish);
            }
            break;
          }
          case "remove_from_cart": {
            const fishId = data.params.fishId;
            if (fishId) cart.removeItem(fishId);
            break;
          }
          case "clear_cart": {
            cart.clearCart();
            break;
          }
          case "go_to_order": {
            router.push("/order");
            break;
          }
        }

        speakRef.current(data.reply);
      } catch {
        const errMsg = "Sorry, I couldn't reach the server. Please check your connection.";
        setMessages((prev) => [...prev, { role: "assistant", text: errMsg }]);
        speakRef.current(errMsg);
      }
    },
    [cart, router]
  );

  stopSpeakingRef.current = stopSpeaking;
  speakRef.current = speak;
  processRef.current = processMessage;

  const handleTextSubmit = useCallback(() => {
    const trimmed = textInput.trim();
    if (!trimmed) return;
    setTextInput('');
    processRef.current(trimmed);
  }, [textInput]);

  const startListening = useCallback(() => {
    if (!isSpeechSupported) {
      const msg =
        "Speech recognition is not supported in this browser. Try Chrome or Edge.";
      setMessages((prev) => [...prev, { role: "assistant", text: msg }]);
      speakRef.current(msg);
      return;
    }

    if (state === "speaking") stopSpeakingRef.current();
    if (recognitionRef.current) recognitionRef.current.stop();

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setState("listening");
    recognition.onerror = () => {
      recognitionRef.current = null;
      setState("idle");
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) processRef.current(transcript);
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setState((prev) => (prev === "listening" ? "idle" : prev));
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [state]);

  const togglePanel = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <>
      {isOpen && (
        <div className="voice-panel voice-panel-animate">
          <div className="voice-panel-header">
            <span>Voice Assistant</span>
            <div className="voice-panel-actions">
              <span className={`voice-status-dot voice-status-${state}`} />
              <button className="voice-close-btn" onClick={togglePanel} aria-label="Close">
                ✕
              </button>
            </div>
          </div>

          <div className="voice-panel-body" ref={panelRef}>
            {messages.length === 0 && (
              <div className="voice-empty">
                <div className="voice-welcome-icon">🐟</div>
                <p><strong>Matsya Assistant</strong></p>
                <p>Ask me about fish species, export requirements, licenses, or say &ldquo;Show me the catalog&rdquo;</p>
                <p className="voice-hint">Type below or tap 🎤 to speak</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`voice-msg voice-msg-${msg.role}`}>
                <strong>{msg.role === "user" ? "You" : "Assistant"}</strong>
                <p>{msg.text}</p>
              </div>
            ))}
            {state === "processing" && (
              <div className="voice-msg voice-msg-assistant">
                <strong>Assistant</strong>
                <p className="voice-thinking">Thinking&hellip;</p>
              </div>
            )}
          </div>

          <div className="voice-panel-footer">
            {state === 'listening' && (
              <div className="voice-waveform">
                <span className="voice-wave-bar" />
                <span className="voice-wave-bar" />
                <span className="voice-wave-bar" />
                <span className="voice-wave-bar" />
                <span className="voice-wave-bar" />
              </div>
            )}
            <form className="voice-input-row" onSubmit={(e) => { e.preventDefault(); handleTextSubmit(); }}>
              <input
                type="text"
                className="voice-text-input"
                placeholder="Type a message..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={state === 'processing' || state === 'listening'}
              />
              <button
                type="submit"
                className="voice-send-btn"
                disabled={!textInput.trim() || state === 'processing' || state === 'listening'}
                aria-label="Send message"
              >
                ➤
              </button>
              <button
                type="button"
                className={`voice-mic-btn voice-mic-${state}`}
                onClick={startListening}
                disabled={state === 'processing'}
                aria-label="Start speaking"
              >
                🎤
              </button>
            </form>
          </div>
        </div>
      )}

      {!isOpen && (
        <button className="voice-fab" onClick={togglePanel} aria-label="Open voice assistant">
          🎤
        </button>
      )}
    </>
  );
}
