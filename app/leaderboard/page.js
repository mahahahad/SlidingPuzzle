"use client"
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/Leaderboard.module.css";
import { ArrowLeft, Trophy, Clock, Milestone } from "lucide-react";

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export default function LeaderboardPage() {
  const supabase = createClient();
  const [data, setData] = useState([]);
  const [activeSize, setActiveSize] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      const { data: scores, error } = await supabase
        .from('leaderboard')
        .select()
        .order('moves', { ascending: true })
        .order('time_seconds', { ascending: true });
        
      if (!error && scores) {
        setData(scores);
      }

      console.log(scores);
    };

    fetchData();
  }, []);

  const sizeOptions = ["all", 3, 4, 5, 6];

  const filteredData = activeSize === "all"
    ? data
    : data.filter((entry) => entry.grid_size === activeSize);

  // Sort: grid_size (if all), then moves, then time
  const sortedData = [...filteredData].sort((a, b) => {
    if (a.grid_size !== b.grid_size) {
      return a.grid_size - b.grid_size;
    }
    if (a.moves !== b.moves) {
      return a.moves - b.moves;
    }
    return a.time_seconds - b.time_seconds;
  });

  return (
    <div className={styles.leaderboardContainer}>
      <Link href="/" className={styles.backBtn}>
        <ArrowLeft size={16} />
        <span>Back to Game</span>
      </Link>

      <div className={styles.leaderboardHeader}>
        <Trophy size={32} className={styles.leaderboardIcon} />
        <h1>Leaderboard</h1>
      </div>

      <div className={styles.filterBar}>
        {sizeOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setActiveSize(opt)}
            className={`${styles.filterBtn} ${activeSize === opt ? styles.filterBtnActive : ""}`}
          >
            {opt === "all" ? "All Sizes" : `${opt}x${opt}`}
          </button>
        ))}
      </div>

      {sortedData.length > 0 ? (
        <table className={styles.leaderboardTable}>
          <thead>
            <tr>
              <th className={styles.thRank}>Rank</th>
              <th className={styles.thPlayer}>Player</th>
              <th className={styles.thSize}>Size</th>
              <th className={styles.thMoves}>Moves</th>
              <th className={styles.thTime}>Time</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((entry, index) => (
              <tr key={entry.game_id} className={styles.tableRow}>
                <td className={styles.tdRank}>{index + 1}</td>
                <td className={styles.tdPlayer}>
                  <div className={styles.playerCell}>
                    {entry.avatar_url ? (
                      <img src={entry.avatar_url} alt="" className={styles.tableAvatar} />
                    ) : (
                      <div className={styles.tableAvatarPlaceholder}>
                        {entry.player_name ? entry.player_name[0].toUpperCase() : "?"}
                      </div>
                    )}
                    <span>{entry.player_name || "Anonymous"}</span>
                  </div>
                </td>
                <td className={styles.tdSize}>{entry.grid_size}x{entry.grid_size}</td>
                <td className={styles.tdMoves}>{entry.moves}</td>
                <td className={styles.tdTime}>{formatTime(entry.time_seconds)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.emptyState}>
          No scores saved yet for this size. Be the first!
        </div>
      )}
    </div>
  );
}