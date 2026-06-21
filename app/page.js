'use client'
import { createClient } from '@/utils/supabase/client'
import styles from '../styles/Home.module.css';
import Grid, { GameState } from "./grid"
import StatWrapper from './statWrapper';
import { useState, useEffect, useRef } from "react";
import OptionsWrapper from './optionsWrapper';
import { LogOut, LogIn, Trophy } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [moves, setMoves] = useState(0);
  const [user, setUser] = useState(null);
  const [time, setTime] = useState(0);
  const [size, setSize] = useState(3);
  const [shuffle, setShuffle] = useState(false);
  const [state, setState] = useState(GameState.PLAYING);
  const pausedRef = useRef(state);
  pausedRef.current = state !== GameState.PLAYING;

  // Toast notifications state
  const [toast, setToast] = useState({ message: "", visible: false, type: "success" });
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = "success") => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, visible: true, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  // Timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (pausedRef.current) return;
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [])

  // Track auth status
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then((res) => {
      setUser(res.data.user);
    })

    const { data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    })

    return () => subscription.unsubscribe();
  }, [])

  // Auto-save pending score when user logs in (e.g. after Google OAuth redirect)
  useEffect(() => {
    const savePendingScore = async () => {
      if (!user) return;
      
      const pendingScoreStr = localStorage.getItem("pending_score");
      if (!pendingScoreStr) return;

      // Remove the key immediately to prevent duplicate runs
      localStorage.removeItem("pending_score");

      try {
        const pendingScore = JSON.parse(pendingScoreStr);
        const supabase = createClient();
        const { error } = await supabase.from('games').insert({
          user_id: user.id,
          grid_size: pendingScore.size,
          moves: pendingScore.moves,
          time_seconds: pendingScore.time,
        });

        if (error) {
          console.error("Failed to save pending score:", error.message);
          showToast(`Failed to save pending score: ${error.message}`, "error");
        } else {
          showToast("Score saved!");
        }
      } catch (err) {
        console.error("Failed to parse pending score from localStorage:", err);
      }
    };

    savePendingScore();
  }, [user]);

  // Google login pop up when puzzle is solved and user is not logged in
  const handleGoogleLogin = async () => {
    // Save current game score details to localStorage before redirecting
    // ONLY if the game is finished
    if (state === GameState.SOLVED) {
      const pendingScore = {
        moves: moves,
        time: time,
        size: size
      };
      localStorage.setItem("pending_score", JSON.stringify(pendingScore));
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
  }

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      showToast(`Failed to log out: ${error.message}`, "error");
    } else {
      showToast("Logged out!");
    }
  };

  const handleSaveScore = async () => {
    if (!user) return;

    const supabase = createClient();
    const { error } = await supabase.from('games').insert({
      user_id: user.id,
      grid_size: size,
      moves: moves,
      time_seconds: time,
    })   

    if (error) {
      console.error("Supabase Error: ", error.message, error.details, error.hint);
      showToast(`Failed to save score: ${error.message}`, "error");
    }
  }

  // Auto-save score when the game is solved and the user is logged in
  useEffect(() => {
    if (state === GameState.SOLVED && user) {
      handleSaveScore();
    }
  }, [state, user]);

  const handleNewGame = () => {
    setMoves(0);
    setTime(0);
    setState(GameState.PLAYING);
    setShuffle(true);
  };

  return (
    <div className={styles.container}>
      {/* Auth Bar in Top Right Corner */}
      <div className={styles.authBar}>
        <Link href="/leaderboard" className={styles.authBtn} style={{ textDecoration: 'none' }}>
          <Trophy size={16} />
          <span>Leaderboard</span>
        </Link>
        {user ? (
          <>
            <span className={styles.userName}>{user.user_metadata.full_name}</span>
            {user.user_metadata.avatar_url && (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Avatar" 
                className={styles.avatar} 
              />
            )}
            <button 
              onClick={handleLogout} 
              className={styles.iconBtn} 
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <button onClick={handleGoogleLogin} className={styles.authBtn}>
            <LogIn size={16} />
            <span>Login</span>
          </button>
        )}
      </div>
      {/* Victory Screen Prompt */}
      {state === GameState.SOLVED && (
        <div className={styles.modalOverlay}>
          <div className={styles.saveScoreModal}>
            <h2>Puzzle Solved!</h2>
            <p>Moves: {moves} | Time: {time}s</p>
            
            {!user ? (
              <button onClick={handleGoogleLogin} className={styles.loginBtn}>
                Login with Google to Save Score
              </button>
            ) : (
              <button onClick={handleNewGame} className={styles.saveBtn}>
                New Game
              </button>
            )}
          </div>
        </div>
      )}
      <div className={styles.gridWrapper}>
        <div className={styles.stats}>
          <StatWrapper type={"time"} value={time} />
          <StatWrapper type={"moves"} value={moves} />
        </div>
        <div className={styles.gameplayArea}>
          <OptionsWrapper
            size={size}
            setSize={setSize}
            shuffle={shuffle}
            setShuffle={setShuffle}
          />
          <Grid
            shuffle={shuffle}
            setShuffle={setShuffle}
            size={size}
            moves={moves}
            setMoves={setMoves}
            setTime={setTime}
            setState={setState}
          />
        </div>
      </div>

      {/* Toast Notifications */}
      {toast.visible && (
        <div className={`${styles.toast} ${styles[`toast__${toast.type}`]}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
