import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../store/authStore";
import { Github, Twitter, Linkedin, Edit2, Save, X } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const ProfileWidget = ({ profile, userId, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [links, setLinks] = useState({
    githubUrl: "",
    twitterUrl: "",
    linkedinUrl: ""
  });

  useEffect(() => {
    if (profile) {
      setLinks({
        githubUrl: profile.githubUrl || "",
        twitterUrl: profile.twitterUrl || "",
        linkedinUrl: profile.linkedinUrl || ""
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/user/profile/${userId}`, links);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const SocialIcon = ({ type, url }) => {
    if (!url && !isEditing) return null;
    
    const icons = {
      github: <Github size={18} />,
      twitter: <Twitter size={18} />,
      linkedin: <Linkedin size={18} />
    };

    return (
      <div className="flex items-center gap-3 w-full">
        <div className="w-9 h-9 rounded-md bg-secondary/80 flex items-center justify-center text-muted-foreground border border-border flex-shrink-0">
          {icons[type]}
        </div>
        {isEditing ? (
          <Input 
            type="url" 
            placeholder={`https://${type}.com/...`}
            className="py-1 bg-background border-border text-xs"
            value={links[`${type}Url`]}
            onChange={(e) => setLinks({...links, [`${type}Url`]: e.target.value})}
          />
        ) : (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:text-primary transition-colors truncate">
            {url.replace(/^https?:\/\/(www\.)?/, '')}
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-display text-foreground">Profile & Links</h2>
        {!isEditing ? (
          <Button variant="ghost" size="icon-sm" onClick={() => setIsEditing(true)} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <Edit2 size={16} />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon-sm" onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
              <X size={16} />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={handleSave} className="text-primary hover:text-primary/80 cursor-pointer">
              <Save size={16} />
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xl font-display shadow-md">
          {profile?.name?.charAt(0).toUpperCase() || profile?.username?.charAt(0).toUpperCase() || "?"}
        </div>
        <div>
          <h3 className="font-bold text-base text-foreground">{profile?.name || profile?.username}</h3>
          <p className="text-xs text-muted-foreground">{profile?.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">Social Profiles</h4>
        
        {(!isEditing && !profile?.githubUrl && !profile?.twitterUrl && !profile?.linkedinUrl) ? (
          <p className="text-xs text-muted-foreground italic">No social links added yet.</p>
        ) : (
          <motion.div layout className="flex flex-col gap-3">
            <SocialIcon type="github" url={profile?.githubUrl} />
            <SocialIcon type="twitter" url={profile?.twitterUrl} />
            <SocialIcon type="linkedin" url={profile?.linkedinUrl} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfileWidget;
