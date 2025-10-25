import React, { useState, useEffect } from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';

interface CelebrationAnimationProps {
  isVisible: boolean;
  type: 'confetti' | 'checkmark' | 'sparkles';
  onComplete: () => void;
}

export default function CelebrationAnimation({ 
  isVisible, 
  type, 
  onComplete 
}: CelebrationAnimationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!show) return null;

  const renderConfetti = () => (
    <div className="celebration-confetti">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );

  const renderCheckmark = () => (
    <div className="celebration-checkmark">
      <CheckCircle className="w-12 h-12" />
    </div>
  );

  const renderSparkles = () => (
    <div className="celebration-confetti">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-yellow-400 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1}s`,
          }}
        >
          <Sparkles className="w-4 h-4" />
        </div>
      ))}
    </div>
  );

  return (
    <>
      {type === 'confetti' && renderConfetti()}
      {type === 'checkmark' && renderCheckmark()}
      {type === 'sparkles' && renderSparkles()}
    </>
  );
}
