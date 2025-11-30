'use client';

import ChatPage from '@/components/Chat';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Session {
  sessionId: string;
  createdAt: string;
}

export default function ChatRoute() {
  const [sessionId, setSessionId] = useState<string>('');
  const [sessions, setSessions] = useState<Session[]>([]);

  // Load sessions list from DB
  useEffect(() => {
    fetch('/api/sessions')
      .then(res => res.json())
      .then(data => setSessions(data.sessions || []));
  }, []);

  // Load or create session ID on mount
  useEffect(() => {
    const existing = localStorage.getItem('sessionId');
    if (existing) {
      setSessionId(existing);
    } else {
      const newId = uuidv4();
      localStorage.setItem('sessionId', newId);
      setSessionId(newId);
    }
  }, []);

  const handleNewChat = () => {
    const newId = uuidv4();
    localStorage.setItem('sessionId', newId);
    setSessionId(newId);
  };

  const handleSessionSelect = (id: string) => {
    localStorage.setItem('sessionId', id);
    setSessionId(id);
  };

  return (
    <div className="flex h-[calc(92vh-16px)] mt-[6%] overflow-hidden bg-white">

      {/* 🔹 Sidebar/Drawer Section (Desktop) */}
      <div className="hidden lg:block w-[22%] border-r px-4 py-6 bg-gray-100">
        <ul className="space-y-3">
          <li>
            <button onClick={handleNewChat} className="hover:text-emerald-600">
              🆕 New Chat
            </button>
          </li>
          <li className="mt-4 text-sm text-gray-500">🕒 History</li>
          {sessions.map((s) => (
            <li key={s.sessionId}>
              <button
                onClick={() => handleSessionSelect(s.sessionId)}
                className={`text-left w-full truncate hover:text-emerald-600 ${
                  s.sessionId === sessionId ? 'font-bold text-emerald-600' : ''
                }`}
              >
                {new Date(s.createdAt).toLocaleString()}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 🔹 Mobile Drawer */}
      <div className="block lg:hidden absolute left-4 top-4 z-50">
        <Drawer direction="left">
          <DrawerTrigger asChild>
            <button className="p-2 rounded-md bg-gray-100 hover:bg-gray-200">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </DrawerTrigger>
          <DrawerContent className="p-6 max-w-xs w-full bg-white">
            <h2 className="text-xl font-bold mb-4">Doctor AI</h2>
            <ul className="space-y-3">
              <li>
                <button onClick={handleNewChat} className="text-left w-full hover:text-emerald-600">
                  🆕 New Chat
                </button>
              </li>
              <li className="text-sm text-gray-500">🕒 History</li>
              {sessions.map((s) => (
                <li key={s.sessionId}>
                  <button
                    onClick={() => handleSessionSelect(s.sessionId)}
                    className={`text-left w-full truncate hover:text-emerald-600 ${
                      s.sessionId === sessionId ? 'font-bold text-emerald-600' : ''
                    }`}
                  >
                    {new Date(s.createdAt).toLocaleString()}
                  </button>
                </li>
              ))}
            </ul>
          </DrawerContent>
        </Drawer>
      </div>

      {/* 🔹 Main Chat Area */}
      <div className="flex-1 overflow-hidden">
        <ChatPage sessionId={sessionId} />
      </div>
    </div>
  );
}
