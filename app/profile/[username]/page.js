"use client"
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "./profile.module.css";

export default function ProfilePage({ params }) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
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

        if (data) {
          setProfile(data);
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
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Status</span>
            <span className={styles.metaValue}>Registered Player</span>
          </div>
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
    </div>
  );
}