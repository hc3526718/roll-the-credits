'use client';

interface SettingsPanelProps {
  onClose: () => void;
  onReset: () => void;
}

export default function SettingsPanel({ onClose, onReset }: SettingsPanelProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="pixel-border bg-slate-800 p-6 max-w-md w-full">
        <h2 className="text-3xl font-bold pixel-text mb-6 text-center text-purple-300">⚙️ SETTINGS</h2>
        
        <div className="space-y-4">
          {/* Sound Toggle (placeholder) */}
          <div className="pixel-border bg-slate-900 p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm pixel-text text-slate-300">🔊 SOUND</span>
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded pixel-text text-sm">
                ON
              </button>
            </div>
          </div>
          
          {/* Wipe Save */}
          <div className="pixel-border bg-slate-900 p-4">
            <p className="text-sm pixel-text text-slate-300 mb-2">🗑️ WIPE SAVE</p>
            <button
              onClick={() => {
                if (confirm('Delete all save data? This cannot be undone!')) {
                  onReset();
                }
              }}
              className="w-full py-2 bg-red-600 hover:bg-red-700 rounded pixel-text font-bold"
            >
              DELETE SAVE
            </button>
          </div>
          
          {/* Credits */}
          <div className="pixel-border bg-slate-900 p-4">
            <p className="text-sm pixel-text text-purple-300 mb-2">👨‍💻 CREDITS</p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Roll the Credits</p>
              <p>A film studio tycoon inspired by Game Dev Tycoon</p>
              <p className="pt-2 text-slate-500">Built with Next.js + TypeScript + SVG</p>
            </div>
          </div>
          
          {/* Close */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded pixel-text font-bold"
          >
            BACK TO GAME
          </button>
        </div>
      </div>
    </div>
  );
}
