"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

// Define types
type Sender = "user" | "bot";

interface ChatMessage {
  sender: Sender;
  text: string;
  type: "text" | "doctor-suggestion";
}


const userAvatar = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
const botAvatar = "https://tse2.mm.bing.net/th?id=OIP.kWo69De_KFmNS3z_HXslTAHaHa&pid=Api&P=0&h=220";

export default function ChatPage({sessionId}: { sessionId: string }) {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
  // const [sessionId, setSessionId] = useState<string>("");

  // useEffect(() => {
  //   const existing = localStorage.getItem("sessionId");
  //   if (existing) {
  //     setSessionId(existing);
  //   } else {
  //     const newId = uuidv4();
  //     localStorage.setItem("sessionId", newId);
  //     setSessionId(newId);
  //   }
  // }, []);

  useEffect(() => {
    if (!sessionId) return;

    const loadMessages = async () => {
      try {
        const res = await fetch(`/api/loadchat?sessionId=${sessionId}`);
        const data = await res.json();
        setChatHistory(data.messages || []);
      } catch (err) {
        console.error("Failed to load chat:", err);
      }
    };

    loadMessages();
  }, [sessionId]);


  // Scroll tracking
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  };

  // Send message to backend
  const sendMessage = async () => {
    if (!message.trim()) return;

    const newUserMsg: ChatMessage = { sender: "user", text: message, type: "text" };
    const updatedHistory = [...chatHistory, newUserMsg];
    setChatHistory(updatedHistory);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          conversation: updatedHistory.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
          latitude: location?.lat,
          longitude: location?.lng,
          sessionId
        }),
      });

      const data = await response.json();
      console.log("Data: ", data);
      const formatted = formatBotReply(data.response);
      const newBotMsg: ChatMessage = { sender: "bot", text: formatted, type: data?.type || "text" };
      setChatHistory((prev) => [...prev, newBotMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format bot message (bold doctor names + line breaks)
  const formatBotReply = (text: string): string => {
    return text
      .split("\n")
      .map((line) =>
        line.match(/^(\d+\.\s)(Dr\.?\s?[A-Za-z\s]+)(.*)/)
          ? `<b>${line}</b>`
          : line
      )
      .join("<br>");
  };

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Location error:", err.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (isAtBottom) scrollToBottom();
  }, [chatHistory]);


  return (
    <div className="flex justify-center items-center h-full bg-white">
      <div className="w-full max-w-2xl h-full rounded-xl p-6 flex flex-col">
        {chatHistory.length === 0 ? (
          // 🟢 Empty State UI
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 bg-clip-text text-transparent mb-6">
              Doctor AI
            </h1>
            <div className="w-full relative mt-4">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your symptoms..."
                className="pr-20 py-6 text-base rounded-full shadow-sm"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button
                onClick={sendMessage}
                disabled={message.length === 0 || loading}
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full px-5 py-2 bg-black text-white hover:bg-gray-800 transition"
              >
                {loading ? "..." : "Send"}
              </Button>
            </div>
          </div>
        ) : (
          // 🟢 Chat History UI
          <>
            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="flex flex-col h-[88%] overflow-y-auto p-4 rounded-md"
            >
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 my-2 ${msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  {msg.sender === "bot" && (
                    <img
                      src={botAvatar}
                      alt="Bot"
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <Card
                    className={`p-3 max-w-[80%] whitespace-pre-line ${msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                      }`}
                  >
                    <span
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                    />
                  </Card>
                  {msg.sender === "user" && (
                    <img
                      src={userAvatar}
                      alt="User"
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                </div>
              ))}
            </div>
            {loading && (
              <div className="flex items-start gap-3 my-2">
                <img src={botAvatar} alt="Bot" className="w-10 h-10 rounded-full" />
                <div className="bg-gray-200 px-4 py-3 rounded-xl max-w-fit">
                  <div className="flex space-x-1">
                    <span className="dot bg-gray-500"></span>
                    <span className="dot bg-gray-500"></span>
                    <span className="dot bg-gray-500"></span>
                  </div>
                </div>
              </div>
            )}


            {/* Input Box */}
            <div className="relative mt-4">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your symptoms..."
                className="pr-20 py-6 text-base rounded-full shadow-sm"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button
                onClick={sendMessage}
                disabled={message.length === 0 || loading}
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full px-5 py-2 bg-black text-white hover:bg-gray-800 transition"
              >
                {loading ? "..." : "Send"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}