"use client"
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "./profile.module.css";

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export default function ProfilePage({ params }) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getData = async () => {
      try {
        const { username } = await params;
        const decodedUsername = decodeURIComponent(username);
        const { data, error } = await supabase
          .from("profiles")
          .select()
          .eq("full_name", decodedUsername)
          .single();

        const { data: gameData, error: gameDataError } = await supabase
        .from("games")
        .select()
        .eq("user_id", data.id);

        if (data) {
          setProfile(data);
          setGames(gameData || []);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [params]);

  if (loading) {
    return <div className={styles.loadingWrapper}>Loading profile...</div>;
  }

  if (!profile) {
    return (
      <div className={styles.profileContainer}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div className={styles.profileCard}>
          <div className={styles.avatarPlaceholder}>?</div>
          <h1 className={styles.username}>Profile Not Found</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            The requested user profile does not exist or has not been registered.
          </p>
        </div>
      </div>
    );
  }

  const initials = profile.full_name
    ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "?";

  return (
    <div className={styles.profileContainer}>
      <button onClick={() => router.back()} className={styles.backBtn}>
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div className={styles.profileCard}>
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="" className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>{initials}</div>
        )}
        <h1 className={styles.username}>{profile.full_name}</h1>
        
        <div className={styles.profileMeta}>
          {profile.updated_at && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Last Active</span>
              <span className={styles.metaValue}>
                {new Date(profile.updated_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.gamesSection}>
        <h2 className={styles.sectionTitle}>Recent Games</h2>
        {games.length > 0 ? (
          <table className={styles.gamesTable}>
            <thead>
              <tr>
                <th className={styles.thSize}>Size</th>
                <th className={styles.thMoves}>Moves</th>
                <th className={styles.thTime}>Time</th>
                <th className={styles.thDate}>Date</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.game_id || game.id} className={styles.tableRow}>
                  <td className={styles.tdSize}>{game.grid_size}x{game.grid_size}</td>
                  <td className={styles.tdMoves}>{game.moves}</td>
                  <td className={styles.tdTime}>{formatTime(game.time_seconds)}</td>
                  <td className={styles.tdDate}>
                    {game.completed_at ? new Date(game.completed_at).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noGames}>No games completed yet.</p>
        )}
      </div>
    </div>
  );
}