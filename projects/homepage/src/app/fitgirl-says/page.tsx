'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const FITGIRL_IMG = 'https://belcourt-production.s3.amazonaws.com/wp-content/uploads/2024/01/18120708/Amelie-web.jpg';
const AUDIO_ID = 'fitgirl-music-player';

const messages = [
  "Don't panic if it looks stuck.",
  "If buying isn't owning, then is piracy stealing?",
  "The easiest way to stop piracy is not by putting antipiracy technology to work. It's by giving those people a service that's better than what they're receiving from the pirates.",
  'Piracy is almost always a service problem and not a pricing problem.',
  'To download is human, to share is divine.',
  "I'd rather be heard than paid.",
  'Piracy often reflects market failures on the part of producers rather than moral failures on the part of consumers.',
  'If you have an apple and I have an apple and we exchange these apples then you and I will still each have one apple. But if you have an idea and I have an idea and we exchange these ideas, then each of us will have two ideas.',
];

const useMessage = () => {
  const [index, setIndex] = useState(Math.floor(Math.random() * messages.length));
  const next = () => setIndex((index + 1) % messages.length);
  return { message: messages[index], next };
};

const useMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initializeAudio = useCallback(() => {
    if (typeof window === 'undefined') return;
    let audio = document.getElementById(AUDIO_ID) as HTMLAudioElement;
    if (!audio) {
      audio = document.createElement('audio');
      audio.id = AUDIO_ID;
      audio.src = 'fitgirl.mp3';
      audio.loop = true;
      audio.style.display = 'none';
      document.body.appendChild(audio);
    }
    audioRef.current = audio;
  }, []);

  // Only play if audio is paused
  const playMusic = useCallback(() => {
    initializeAudio();
    if (audioRef.current?.paused) {
      audioRef.current.play().catch((error) => {
        console.log('Playback prevented by browser', error);
      });
    }
  }, [initializeAudio]);

  useEffect(() => {
    initializeAudio();
    playMusic();
    return () => {
      audioRef.current?.pause();
    };
  }, [initializeAudio, playMusic]);

  return { playMusic, audioRef };
};

export default function FitGirl() {
  const { message, next } = useMessage();
  const { playMusic, audioRef } = useMusic();

  const handleClick = useCallback(() => {
    next();
    if (audioRef.current?.paused) {
      playMusic();
    }
  }, [next, playMusic, audioRef]);

  return (
    <div className='mx-auto grid h-svh w-svw select-none grid-cols-1 items-center bg-black text-center lg:grid-cols-2'>
      <div>
        <img src={FITGIRL_IMG} alt='FitGirl' />
      </div>
      <div className='grid h-auto grid-cols-1 gap-4 text-center' onClick={handleClick} onKeyDown={handleClick}>
        <div>
          <h1 className='whitespace-nowrap font-bold text-4xl text-pink-500 sm:text-6xl'>FitGirl says...</h1>
        </div>
        <div className='h-0'>
          <p className='mx-12 font-mono text-white text-xs sm:text-base lg:text-lg'>&quot;{message}&quot;</p>
        </div>
      </div>
    </div>
  );
}
