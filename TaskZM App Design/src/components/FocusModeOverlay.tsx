import React from 'react';

interface FocusModeOverlayProps {
  isActive: boolean;
  focusArea: 'week' | 'agenda' | 'task' | null;
  onClose: () => void;
}

export default function FocusModeOverlay({ 
  isActive, 
  focusArea, 
  onClose 
}: FocusModeOverlayProps) {
  if (!isActive) return null;

  return (
    <div className="focus-overlay">
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={onClose}
          className="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="Exit Focus Mode"
        >
          Exit Focus
        </button>
      </div>
    </div>
  );
}
