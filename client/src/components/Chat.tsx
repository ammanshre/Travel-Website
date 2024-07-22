'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import DOMPurify from 'dompurify';
import { chatWithAi } from '@/services/ai'; // Ensure the path is correct
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const formatResponse = (response: string): string => {
    return response.replace(/\n/g, '<br/>').replace(/ {2}/g, '&nbsp;&nbsp;');
  };

  const submitMessage = async (event: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    setLoading(true);

    try {
      const response = await chatWithAi(input);
      const formattedResponse = formatResponse(DOMPurify.sanitize(response));
      const aiResponse: Message = { role: 'assistant', content: formattedResponse };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: Message = { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <Card>
        <header className="flex items-center justify-between px-4 py-2 border-b">
          <h1 className="text-lg font-semibold">AI Travel Planner</h1>
        
        </header>
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, index) => (
            <div key={index} className="flex items-end space-x-2">
              <Avatar>
                <AvatarImage src={m.role === 'assistant' ? '/placeholder-assistant.jpg' : '/placeholder-user.jpg'} />
                <AvatarFallback>{m.role === 'assistant' ? 'A' : 'U'}</AvatarFallback>
              </Avatar>
              <div className={`p-2 rounded-lg ${m.role === 'assistant' ? 'bg-gray-100 dark:bg-gray-800' : 'bg-blue-500 text-white'}`}>
                {m.role === 'assistant' ? (
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: m.content }}></p>
                ) : (
                  <p className="text-sm">{m.content}</p>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-end space-x-2">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          )}
        </main>
        <footer className="flex items-center space-x-2 p-2 border-t">
          <form className="flex flex-1 space-x-2" onSubmit={submitMessage}>
            <Input
              className="flex-1"
              placeholder="Type a message"
              value={input}
              onChange={handleInputChange}
            />
            <Button variant="outline" size="sm" type="submit" onClick={submitMessage}>
              Send
            </Button>
          </form>
        </footer>
      </Card>
    </div>
  );
}
