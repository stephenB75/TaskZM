import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { getPomodoroPhase, getPomodoroTimeRemaining } from '../lib/adhd';

interface PomodoroTimerProps {
  workDuration: number;
  breakDuration: number;
  isVisible: boolean;
  onToggle: () => void;
}

export default function PomodoroTimer({ 
  workDuration, 
  breakDuration, 
  isVisible, 
  onToggle 
}: PomodoroTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(workDuration * 60 * 1000);
  const [phase, setPhase] = useState<'work' | 'break' | 'long-break'>('work');
  const [sessions, setSessions] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isRunning && startTime) {
      intervalRef.current = setInterval(() => {
        const remaining = getPomodoroTimeRemaining(startTime, workDuration, breakDuration);
        const currentPhase = getPomodoroPhase(startTime, workDuration, breakDuration);
        
        setTimeRemaining(remaining);
        setPhase(currentPhase);
        
        if (remaining <= 0) {
          handleTimerComplete();
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, startTime, workDuration, breakDuration]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    setSessions(prev => prev + 1);
    
    // Play completion sound
    if (audioRef.current) {
      audioRef.current.play().catch(console.warn);
    }
    
    // Show notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(
        phase === 'work' ? 'Work session complete!' : 'Break time!',
        {
          body: phase === 'work' 
            ? 'Time for a break. You earned it!' 
            : 'Break is over. Ready to focus?',
          icon: '/favicon.ico'
        }
      );
    }
  };

  const startTimer = () => {
    if (!isRunning) {
      setStartTime(new Date());
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setStartTime(null);
    setTimeRemaining(workDuration * 60 * 1000);
    setPhase('work');
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPhaseInfo = () => {
    switch (phase) {
      case 'work':
        return { label: 'Focus Time', color: 'text-green-600', bgColor: 'bg-green-50' };
      case 'break':
        return { label: 'Short Break', color: 'text-orange-600', bgColor: 'bg-orange-50' };
      case 'long-break':
        return { label: 'Long Break', color: 'text-purple-600', bgColor: 'bg-purple-50' };
      default:
        return { label: 'Focus Time', color: 'text-green-600', bgColor: 'bg-green-50' };
    }
  };

  const phaseInfo = getPhaseInfo();

  if (!isVisible) return null;

  return (
    <div className={`pomodoro-timer ${phase}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${phaseInfo.bgColor}`} />
          <span className={`text-sm font-medium ${phaseInfo.color}`}>
            {phaseInfo.label}
          </span>
        </div>
        <button
          onClick={onToggle}
          className="text-gray-500 hover:text-gray-700 text-sm"
          title="Hide Pomodoro Timer"
        >
          ×
        </button>
      </div>
      
      <div className="text-center mb-3">
        <div className="text-2xl font-mono font-bold text-gray-800">
          {formatTime(timeRemaining)}
        </div>
        <div className="text-xs text-gray-500">
          Session {sessions + 1}
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-2">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
          >
            <Play className="w-3 h-3" />
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="flex items-center gap-1 px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors"
          >
            <Pause className="w-3 h-3" />
            Pause
          </button>
        )}
        
        <button
          onClick={resetTimer}
          className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>
      
      <audio ref={audioRef} preload="auto">
        <source src="/notification.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
