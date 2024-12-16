// app/page.tsx

'use client';

import {useState, useEffect, useRef} from 'react';
import Image from 'next/image';

interface Message {
  id: number;
  text?: string;
  gif?: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [urls_gif, setUrls] = useState<Array<[string, string]>>([]);
  const [input, setInput] = useState('');
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (elementRef.current) {
        elementRef.current.scroll(0, elementRef.current.scrollHeight)
    }},
    [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessage: Message = { id: Date.now(), text: input };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');
  };

  const handleSendGif = async (url: string) => {
    const newMessage: Message = { id: Date.now(), gif: url };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');
  };

  useEffect(() => {
    console.log(input.substring(5))
    if (elementRef.current) {
      if (input.startsWith('/gif ') && input.substring(5)) {
          const query = input.substring(5);
          getUrlGif(query);
          elementRef.current.className = "picker_frame";
      } else {
          setUrls([]);
          elementRef.current.className = "messenger_frame";
    }}}, [input]);

  const getUrlGif = async (query: string) => {
    const url_gif: Array<[string, string]> = await request(query);
    setUrls(url_gif);
    console.log(urls_gif);
  }

  const request = async (query: string) => {
    console.log(query)
    const res = await fetch(`/api/searchGif?q=${encodeURIComponent(query)}`);
    const data = await res.json();
  
    return data.results.map((result: any) => [result.media_formats.nanogif.url, result.media_formats.gif.url]);
  }

  return (
    <div className="window">
      <div className="messenger_frame" ref={elementRef}>
        {Boolean(urls_gif.length) && ( urls_gif.map((gif) => (
            <div key={gif[1]} className='imageContainer'>
                <Image className='image'
                src={gif[0]} 
                alt="gif" 
                width='0'
                height='0'
                sizes='100vh'
                onClick={() => {handleSendGif(gif[1])}}/>
            </div>
            )))}
        {(!urls_gif.length) && messages.map((msg) => (
            <div key={msg.id} className="message_box">
                {msg.gif && (<Image className='message_image'
                src={msg.gif} 
                alt="gif" 
                width='0'
                height='0'
                sizes='50%'/>)}
                {msg.text && (<p className="message">{msg.text}</p>)}
                <p className="message_time">{new Date(msg.id).toTimeString().substring(0, 5)}</p>
            </div>
        ))}
      </div>
      <div className="bottom_bar">
        {Boolean(urls_gif.length) && <div className="colored_gif_div"><span className="colored_gif" >/gif</span></div>}
        <input
          type="text"
          value={input}
          onChange={(e) => {setInput(e.target.value)}}
          placeholder="Напишите сообщение..."
          className="bottom_bar_input"
          onKeyDown={(e) => {if (e.key === 'Enter') {handleSend()}}}
        />
      </div>
    </div>
  );
}