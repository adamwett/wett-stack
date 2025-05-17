'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// Initialize Ruffle for autoplay
const loadRuffle = (
  ruffleRef: React.RefObject<HTMLDivElement | null>,
  playerInitializedRef: React.RefObject<boolean | null>,
) => {
  if (window.RufflePlayer && ruffleRef.current) {
    // Clear any existing content first
    while (ruffleRef.current.firstChild) {
      ruffleRef.current.removeChild(ruffleRef.current.firstChild);
    }

    const ruffle = window.RufflePlayer.newest();
    const player = ruffle.createPlayer();
    player.config = {
      autoplay: true,
      base: window.location.href,
      quality: 'high',
      wmode: 'direct',
      menu: false,
    };
    // Apply styles to the player to make it fill the viewport
    player.style.width = '100vw';
    player.style.height = '100vh';
    player.style.position = 'absolute';
    player.style.top = '0';
    player.style.left = '0';

    ruffleRef.current.appendChild(player as unknown as Node);
    player.load('orca.swf');
    playerInitializedRef.current = true;
  }
};

// Load Ruffle script if needed
const loadRuffleScript = (
  ruffleRef: React.RefObject<HTMLDivElement | null>,
  playerInitializedRef: React.RefObject<boolean | null>,
) => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@ruffle-rs/ruffle';
  script.addEventListener('load', () => loadRuffle(ruffleRef, playerInitializedRef));
  document.head.appendChild(script);
};

export default function OrcaPage() {
  const youtubeRef = useRef<HTMLIFrameElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const ruffleRef = useRef<HTMLDivElement>(null);
  const playerInitializedRef = useRef(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // Initialize Ruffle with autoplay - separate effect with no dependencies to run once
  useEffect(() => {
    // Skip if already initialized
    if (playerInitializedRef.current) return;

    // Check if Ruffle is already loaded
    if (window.RufflePlayer) {
      loadRuffle(ruffleRef, playerInitializedRef);
    } else {
      loadRuffleScript(ruffleRef, playerInitializedRef);
    }
  }, []);

  // Get current origin for YouTube API
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  // Initialize YouTube API and handle key events
  useEffect(() => {
    // Load YouTube API if needed
    let tag: HTMLScriptElement | null = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');

    if (!tag) {
      tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag) {
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
    }

    // Function to try to play the video - will be called in multiple scenarios
    const tryPlayVideo = () => {
      if (youtubeRef.current?.contentWindow) {
        try {
          youtubeRef.current.contentWindow.postMessage(
            JSON.stringify({
              event: 'command',
              func: 'playVideo',
            }),
            '*',
          );
        } catch (e) {
          console.error('Error playing video', e);
        }
      }
    };

    const handleClick = () => {
      if (!userInteracted) {
        setUserInteracted(true);
        // Try to play on first interaction
        tryPlayVideo();
      }

      if (youtubeRef.current?.contentWindow) {
        try {
          youtubeRef.current.contentWindow.postMessage(
            JSON.stringify({
              event: 'command',
              func: 'seekTo',
              args: [25, true], // Seek to 0:25 (25 seconds)
            }),
            '*',
          );
        } catch (e) {
          console.error('Error seeking video', e);
        }
      }
    };

    // Try to play when user has interacted
    if (userInteracted) {
      tryPlayVideo();
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        setIsMuted((prev) => !prev);

        if (youtubeRef.current?.contentWindow) {
          try {
            youtubeRef.current.contentWindow.postMessage(
              JSON.stringify({
                event: 'command',
                func: isMuted ? 'unMute' : 'mute',
              }),
              '*',
            );
          } catch (e) {
            console.error('Error toggling mute', e);
          }
        }
      }
    };

    // Wait a moment for iframe to load, then play
    const timer = setTimeout(() => {
      tryPlayVideo();
    }, 1000);

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isMuted, userInteracted]);

  return (
    <>
      {/* Orca SWF */}
      <div
        ref={ruffleRef}
        className='h-svh w-svw'
        onClick={() => setUserInteracted(true)}
        onKeyPress={() => setUserInteracted(true)}
        tabIndex={0}
        role='button'
        aria-label='Interact with animation'
      />

      {/* YouTube embed for audio */}
      <div className='fixed right-0 bottom-0 h-1 w-1 overflow-hidden'>
        <iframe
          ref={youtubeRef}
          id='youtube-player'
          width='1'
          height='1'
          src={`https://www.youtube.com/embed/IYH7_GzP4Tg?autoplay=1&loop=1&playlist=IYH7_GzP4Tg&enablejsapi=1&origin=${origin}&playsinline=1&mute=0&controls=0`}
          title='YouTube video player'
          allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
        />
      </div>

      {/* Click instructions */}
      <div className='fixed top-0 left-0 flex flex-row gap-4 p-4 font-bold text-black text-lg'>
        <div>
          Left click:
          <br />
          &#39;M&#39; key:
          <br />
          Vibe coded on{' '}
          <Link href='https://wett.dev' className='underline'>
            wett.dev
          </Link>
        </div>
        <div>
          Get low, get low, get low...
          <br />
          Toggle mute
        </div>
      </div>

      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src='https://unpkg.com/@ruffle-rs/ruffle' />
    </>
  );
}

// Add TypeScript declaration for Ruffle
declare global {
  interface Window {
    RufflePlayer?: {
      newest: () => {
        createPlayer: () => {
          config: {
            autoplay: boolean;
            base: string;
            quality: string;
            wmode: string;
            menu: boolean;
          };
          load: (url: string) => void;
          ruffle: () => unknown;
          style: CSSStyleDeclaration;
        };
      };
    };
  }
}
