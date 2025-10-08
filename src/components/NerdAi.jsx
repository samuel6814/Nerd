import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Send, CornerDownLeft, BrainCircuit, MessageSquarePlus, Trash2, Menu, X, Home } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// --- Keyframes for Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;
const loadingSpinner = keyframes`
  to { transform: rotate(360deg); }
`;
const subtleFloat = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// --- Creative Background ---
const BackgroundShapes = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;

  &::before, &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(142, 68, 173, 0.3), transparent 60%);
    animation: ${subtleFloat} 20s ease-in-out infinite;
  }

  &::before {
    width: 400px;
    height: 400px;
    top: 10%;
    left: 10%;
  }

  &::after {
    width: 300px;
    height: 300px;
    bottom: 5%;
    right: 5%;
    animation-duration: 25s;
    animation-delay: -5s;
  }
`;

// --- Main Layout Components ---
const PageLayout = styled.div`
  display: flex;
  height: 100vh;
  padding-top: 80px;
  background-color: #1e193b;
  position: relative;
`;

const SidebarToggle = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1100;
    background: rgba(42, 33, 90, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 45px;
    height: 45px;
    color: white;
    cursor: pointer;
  }
`;

const Sidebar = styled.aside`
  width: 280px;
  background: rgba(28, 22, 60, 0.8);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.4s cubic-bezier(0.86, 0, 0.07, 1);

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    height: 100vh;
    z-index: 1050;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SidebarButton = styled.button`
  background: ${props => props.primary ? 'linear-gradient(45deg, #e779c1, #d946ef)' : 'transparent'};
  border: ${props => props.primary ? 'none' : '1px solid #9b59b6'};
  color: ${props => props.primary ? 'white' : '#d1c4e9'};
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  }
`;

const HistoryList = styled.ul`
  list-style: none;
  overflow-y: auto;
  flex-grow: 1;
  padding-top: 20px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb {
    background-color: #5e3a8a;
    border-radius: 2px;
  }
`;

const HistoryItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #d1c4e9;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid transparent;
  background-color: ${props => props.isActive ? 'rgba(155, 89, 182, 0.2)' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(155, 89, 182, 0.1);
    border-color: rgba(155, 89, 182, 0.5);
  }
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #d1c4e9;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  opacity: 0.5;
  transition: all 0.2s ease;

  ${HistoryItem}:hover & {
    opacity: 1;
    background-color: rgba(255,255,255,0.1);
  }
`;

// --- Chat Interface Components ---
const ChatInterface = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 20px;
`;

const WelcomeOverlay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: auto;
  color: #d1c4e9;
  padding: 20px;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: 700;
    color: #f0e6ff;
    background: linear-gradient(90deg, #e779c1, #d946ef);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  p {
    max-width: 400px;
  }
`;

const MessageArea = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb {
    background-color: #5e3a8a;
    border-radius: 3px;
  }
`;

const MessageBubble = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  max-width: 85%;
  align-self: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
  animation: ${fadeIn} 0.5s ease-out forwards;

  .content {
    background-color: ${props => (props.isUser ? '#9b59b6' : 'rgba(0,0,0,0.2)')};
    color: white;
    padding: 15px 20px;
    border-radius: ${props => (props.isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px')};
    line-height: 1.6;
    white-space: pre-wrap;
    word-wrap: break-word;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  }
  
  .avatar {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => (props.isUser ? '#8e44ad' : '#5e3a8a')};
    box-shadow: 0 0 10px ${props => (props.isUser ? 'rgba(142, 68, 173, 0.5)' : 'rgba(94, 58, 138, 0.5)')};
  }
`;

const InputArea = styled.form`
  display: flex;
  padding: 0 20px;
  background-color: transparent;
  position: relative;
`;

const ChatInput = styled.input`
  flex-grow: 1;
  background-color: rgba(28, 22, 60, 0.8);
  border: 1px solid #5e3a8a;
  border-radius: 12px;
  padding: 15px 20px;
  font-size: 1rem;
  color: #f0e6ff;
  outline: none;
  transition: all 0.3s;
  &:focus {
    border-color: #e779c1;
    box-shadow: 0 0 15px rgba(231, 121, 193, 0.3);
  }
`;

const SendButton = styled.button`
  background: linear-gradient(45deg, #e779c1, #d946ef);
  border: none;
  border-radius: 12px;
  padding: 0 20px;
  margin-left: 10px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:hover:not(:disabled) { 
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(231, 121, 193, 0.5);
  }
`;

const LoadingIndicator = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${loadingSpinner} 0.8s linear infinite;
`;

// --- The Main Component Logic ---
const NerdAI = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [allChats, setAllChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messageAreaRef = useRef(null);

  // Initial load from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('nerd-ai-username') || '';
    setUserName(savedName);

    const savedChats = JSON.parse(localStorage.getItem('nerd-ai-chats')) || [];
    if (savedChats.length > 0) {
      setAllChats(savedChats);
      setActiveChatId(savedChats[0].id);
    } else {
      handleNewChat(savedName, false);
    }
  }, []);

  // Save all chats whenever they change
  useEffect(() => {
    if (allChats.length > 0) {
      localStorage.setItem('nerd-ai-chats', JSON.stringify(allChats));
    } else {
      localStorage.removeItem('nerd-ai-chats');
    }
  }, [allChats]);

  // Auto-scroll logic
  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [allChats, activeChatId]);

  const handleNewChat = (name = userName, save = true) => {
    const newChat = {
      id: Date.now(),
      title: 'New Conversation',
      messages: name ? [
        { role: 'bot', content: `Alright ${name}, let's start a fresh topic! What's on your mind?` }
      ] : [
        { role: 'bot', content: "Hey there! I'm Nerd, your personal AI companion. Quaigraine asked me to help you learn. To make things a bit more friendly, what's your name?" }
      ]
    };
    if (save) {
      setAllChats([newChat, ...allChats]);
    } else {
      setAllChats([newChat]);
    }
    setActiveChatId(newChat.id);
    setIsSidebarOpen(false);
  };

  const handleDeleteChat = (e, chatIdToDelete) => {
    e.stopPropagation();
    const remainingChats = allChats.filter(chat => chat.id !== chatIdToDelete);
    setAllChats(remainingChats);

    if (activeChatId === chatIdToDelete) {
      if (remainingChats.length > 0) {
        setActiveChatId(remainingChats[0].id);
      } else {
        handleNewChat(userName);
      }
    }
  };

  const handleNameSubmission = (name) => {
    let nickname = name.trim();
    if (nickname.toLowerCase() === 'derborah') nickname = 'Derby';
    if (nickname.toLowerCase() === 'blessing') nickname = 'lessy';
    
    setUserName(nickname);
    localStorage.setItem('nerd-ai-username', nickname);

    const greeting = `Hey ${nickname}! It's so nice to meet you. What programming topic is on your mind today?`;
    updateActiveChat(activeChatId, { role: 'bot', content: greeting });
  };

  const updateActiveChat = (chatId, newMessage, newTitle = null) => {
    setAllChats(prevChats => {
        const newChats = prevChats.map(chat => {
            if (chat.id === chatId) {
                const updatedMessages = newMessage ? [...chat.messages, newMessage] : chat.messages;
                return {
                    ...chat,
                    title: newTitle || chat.title,
                    messages: updatedMessages,
                };
            }
            return chat;
        });
        return newChats;
    });
};


  const handleSendMessage = async () => {
    setIsLoading(true);

    const userMessage = { role: 'user', content: userInput };
    const activeChat = allChats.find(chat => chat.id === activeChatId);
    if (!activeChat) return;

    const isFirstUserMessage = activeChat.messages.filter(m => m.role === 'user').length === 0;
    const newTitle = isFirstUserMessage ? userInput.substring(0, 30) + (userInput.length > 30 ? '...' : '') : null;

    updateActiveChat(activeChatId, userMessage, newTitle);
    
    const currentConversation = [...activeChat.messages, userMessage];

    try {
      const systemPrompt = `You are Nerd AI, a friendly and encouraging programming tutor. You were created by Quaigraine. You are currently chatting with ${userName}. Always address them by their name. Keep your tone patient, welcoming, and slightly informal. Break down complex topics into simple, bite-sized pieces.`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: currentConversation.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          })),
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);
      
      const data = await response.json();
      const botResponse = data.candidates[0].content.parts[0].text;
      updateActiveChat(activeChatId, { role: 'bot', content: botResponse });

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      updateActiveChat(activeChatId, { role: 'bot', content: `Oh no, ${userName}! Something went wrong on my end. Please check the console for errors.` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    if (!userName) {
      handleNameSubmission(userInput);
    } else {
      handleSendMessage();
    }
    setUserInput('');
  };

  const activeMessages = allChats.find(chat => chat.id === activeChatId)?.messages || [];

  return (
    <PageLayout>
      <BackgroundShapes />
      <SidebarToggle onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <X size={20}/> : <Menu size={20}/>}
      </SidebarToggle>
      
      <Sidebar isOpen={isSidebarOpen}>
        <SidebarHeader>
          <SidebarButton primary onClick={() => handleNewChat()}>
            <MessageSquarePlus size={20} />
            New Chat
          </SidebarButton>
          <SidebarButton onClick={() => navigate('/')}>
            <Home size={20} />
            Home
          </SidebarButton>
        </SidebarHeader>
        <HistoryList>
          {allChats.map(chat => (
            <HistoryItem 
              key={chat.id} 
              isActive={chat.id === activeChatId} 
              onClick={() => {setActiveChatId(chat.id); setIsSidebarOpen(false);}}
            >
              <span>{chat.title}</span>
              <DeleteButton onClick={(e) => handleDeleteChat(e, chat.id)}>
                <Trash2 size={16} />
              </DeleteButton>
            </HistoryItem>
          ))}
        </HistoryList>
      </Sidebar>

      <ChatInterface>
        <ChatContainer>
          {activeMessages.length > 0 ? (
            <MessageArea ref={messageAreaRef}>
              {activeMessages.map((msg, index) => (
                <MessageBubble key={index} isUser={msg.role === 'user'}>
                  <div className="avatar">
                    {msg.role === 'user' ? <CornerDownLeft size={20} /> : <BrainCircuit size={20} />}
                  </div>
                  <div className="content">{msg.content}</div>
                </MessageBubble>
              ))}
            </MessageArea>
          ) : (
             <WelcomeOverlay>
                <h2>Welcome, {userName || 'Friend'}!</h2>
                <p>Your cosmic library of knowledge awaits. Ask me anything to start a new conversation!</p>
             </WelcomeOverlay>
          )}

          <InputArea onSubmit={handleSubmit}>
            <ChatInput
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={!userName ? "Type your name to begin..." : "Ask a question..."}
              disabled={isLoading}
            />
            <SendButton type="submit" disabled={isLoading || !userInput.trim()}>
              {isLoading ? <LoadingIndicator /> : <Send size={20} />}
            </SendButton>
          </InputArea>
        </ChatContainer>
      </ChatInterface>
    </PageLayout>
  );
};

export default NerdAI;