"use client";

import {
  Copy,
  Download,
  Mic,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Share,
  Sun,
  Trash2,
  Volume2,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const audioRef = useRef(null);
  const textareaRef = useRef(null);

  // Performance optimization using useCallback
  const handleConvert = useCallback(async () => {
    if (!text.trim()) {
      alert("Please enter text first");
      textareaRef.current?.focus();
      return;
    }

    setLoading(true);
    setAudioUrl("");
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      console.error("Conversion error:", err);
      alert("An error occurred during conversion. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [text]);

  const handleDownload = useCallback(() => {
    if (!audioUrl) return;

    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `voice-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [audioUrl]);

  const handleShare = useCallback(async () => {
    if (!audioUrl) return;

    if (navigator.share) {
      try {
        // Convert blob to file for sharing
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        const file = new File([blob], "voice.mp3", { type: "audio/mpeg" });

        await navigator.share({
          title: "Voice Response",
          text: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
          files: [file],
        });
      } catch (err) {
        console.error("Sharing error:", err);
        // Fallback to copying to clipboard
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  }, [audioUrl, text]);

  const handleCopyLink = useCallback(() => {
    if (navigator.clipboard && audioUrl) {
      navigator.clipboard
        .writeText(audioUrl)
        .then(() => alert("Link copied to clipboard"))
        .catch(() => alert("Failed to copy link"));
    }
  }, [audioUrl]);

  const handlePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const currentTime = audio.currentTime;
    const duration = audio.duration;

    setCurrentTime(currentTime);
    setProgress((currentTime / duration) * 100);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
    }
  }, []);

  const handleSeek = useCallback((e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * audio.duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percent * 100);
  }, []);

  const resetAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      setCurrentTime(0);
      setProgress(0);
      setIsPlaying(false);
    }
  }, []);

  const clearAll = useCallback(() => {
    setText("");
    setAudioUrl("");
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    textareaRef.current?.focus();
  }, []);

  // تنسيق الوقت
  const formatTime = useMemo(() => {
    return (time) => {
      if (isNaN(time)) return "0:00";
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };
  }, []);

  // Optimized character counter
  const characterInfo = useMemo(() => {
    const count = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const estimatedDuration = Math.ceil(words / 2.5); // Average 2.5 words per second

    return {
      characters: count,
      words,
      estimatedDuration:
        estimatedDuration > 60
          ? `${Math.floor(estimatedDuration / 60)}:${(estimatedDuration % 60)
              .toString()
              .padStart(2, "0")} min`
          : `${estimatedDuration} sec`,
    };
  }, [text]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // Theme classes
  const themeClasses = {
    background: isDarkMode
      ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      : "bg-gradient-to-br from-blue-50 via-white to-indigo-50",
    card: isDarkMode
      ? "bg-slate-800/50 backdrop-blur-xl border-slate-700/50"
      : "bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-xl",
    text: isDarkMode ? "text-white" : "text-slate-900",
    textSecondary: isDarkMode ? "text-slate-400" : "text-slate-600",
    input: isDarkMode
      ? "bg-slate-900/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400"
      : "bg-white/50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500",
    button: isDarkMode
      ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
    audioPlayer: isDarkMode
      ? "bg-slate-900/30 border-slate-700"
      : "bg-slate-50/50 border-slate-200",
  };

  return (
    <div
      className={`min-h-screen ${themeClasses.background} flex flex-col items-center justify-center p-4 ${themeClasses.text} transition-all duration-300`}
    >
      <div
        className={`w-full max-w-4xl ${themeClasses.card} rounded-2xl shadow-2xl p-6 lg:p-8 transition-all duration-300`}
      >
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-start mb-6">
          <div className="text-center flex-1">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
              <Mic className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Quick Voice Response
            </h1>
            <p className={`${themeClasses.textSecondary} text-lg`}>
              Transform your text into professional voice responses
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isDarkMode
                ? "bg-slate-700/50 hover:bg-slate-600/50 text-yellow-400"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Text Input Area */}
        <div className="mb-6">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="✍️ Write your response here... Use punctuation to control intonation"
              className={`w-full p-6 ${themeClasses.input} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 resize-none`}
              rows={6}
            />

            {/* Text Statistics */}
            <div
              className={`absolute bottom-4 left-4 flex items-center gap-4 text-sm ${themeClasses.textSecondary}`}
            >
              <span>{characterInfo.characters} chars</span>
              <span>•</span>
              <span>{characterInfo.words} words</span>
              <span>•</span>
              <span>≈ {characterInfo.estimatedDuration}</span>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={handleConvert}
            disabled={loading || !text.trim()}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
              loading || !text.trim()
                ? `${
                    isDarkMode ? "bg-slate-600" : "bg-slate-300"
                  } cursor-not-allowed opacity-50`
                : `${themeClasses.button} transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/25`
            } text-white`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Converting...</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                <span>Convert to Voice</span>
              </>
            )}
          </button>

          <button
            onClick={clearAll}
            disabled={loading}
            className={`px-4 py-2 ${
              isDarkMode
                ? "bg-slate-700 hover:bg-slate-600"
                : "bg-slate-200 hover:bg-slate-300"
            } rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50`}
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        </div>

        {/* Enhanced Audio Player */}
        {audioUrl && (
          <div
            className={`${themeClasses.audioPlayer} rounded-xl p-6 border transition-all duration-300`}
          >
            <audio
              ref={audioRef}
              src={audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              preload="metadata"
            />

            {/* Interactive Progress Bar */}
            <div className="mb-4">
              <div
                className={`w-full h-2 ${
                  isDarkMode ? "bg-slate-700" : "bg-slate-300"
                } rounded-full cursor-pointer relative overflow-hidden`}
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-100"
                  style={{ left: `calc(${progress}% - 8px)` }}
                />
              </div>
              <div
                className={`flex justify-between text-sm ${themeClasses.textSecondary} mt-2`}
              >
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Control Buttons */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={resetAudio}
                className={`p-2 ${
                  isDarkMode
                    ? "bg-slate-700 hover:bg-slate-600"
                    : "bg-slate-200 hover:bg-slate-300"
                } rounded-full transition-colors`}
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={handlePlayPause}
                className="p-4 bg-blue-500 hover:bg-blue-600 rounded-full transition-all duration-200 transform hover:scale-110 shadow-lg text-white"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-all duration-200 text-green-400 hover:text-green-300"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg transition-all duration-200 text-purple-400 hover:text-purple-300"
              >
                <Share className="w-4 h-4" />
                <span>Share</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-all duration-200 text-blue-400 hover:text-blue-300"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className={`mt-8 text-center ${themeClasses.textSecondary} text-sm`}>
        <p>💡 Tip: Use punctuation and commas to get better voice results</p>
      </div>
    </div>
  );
}


