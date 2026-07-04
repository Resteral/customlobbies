"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Heart, Share2 } from "lucide-react";
import { useState } from "react";
import { toggleLikeSite, incrementShare } from "@/app/devspace/actions";

export function DevSpaceSiteCard({ 
  site, 
  sponsored = false,
  isLikedByMe = false
}: { 
  site: any, 
  sponsored?: boolean,
  isLikedByMe?: boolean
}) {
  const [liked, setLiked] = useState(isLikedByMe);
  const [likesCount, setLikesCount] = useState(site.likes_count || 0);
  const [sharesCount, setSharesCount] = useState(site.shares_count || 0);

  const handleLike = async () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    const result = await toggleLikeSite(site.id);
    if (result.error) {
      alert(result.error);
      setLiked(liked); // revert on error
      setLikesCount(liked ? likesCount : likesCount - 1);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`https://${site.url}`);
      alert("Link copied to clipboard!");
      setSharesCount(sharesCount + 1);
      await incrementShare(site.id);
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };

  // Generate a random gradient for the mock image if not provided
  const imageClass = site.image || "bg-gradient-to-br from-indigo-500 to-purple-600";

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`group rounded-2xl overflow-hidden border bg-secondary/20 flex flex-col ${sponsored ? 'border-primary/30' : 'border-border'}`}
    >
      <div className={`h-40 w-full ${imageClass} relative`}>
        {sponsored && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md font-medium border border-white/10">
            Sponsored
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{site.name}</h3>
        </div>
        <a href={`/site/${site.url}`} target="_blank" className="text-sm text-primary hover:underline mb-4 block truncate">
          {site.url}
        </a>
        
        {/* Social Actions */}
        <div className="flex gap-4 mb-4">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'}`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
            {likesCount}
          </button>
          
          <button 
            onClick={handleShare}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-blue-500 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            {sharesCount}
          </button>
        </div>

        <div className="mt-auto flex justify-between items-center">
          <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
            {site.industry || site.category || 'Website'}
          </span>
          <a href={`/site/${site.url}`} target="_blank" className="text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors">
            Visit Site
          </a>
        </div>
      </div>
    </motion.div>
  );
}
