import { useEffect } from 'react';
import { useSystemStore } from '../../stores/system.store';
import { Bell, X } from 'lucide-react';
import { useState } from 'react';

export const GlobalBanner = () => {
  const { settings, fetchSettings } = useSystemStore();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  if (!settings?.global_banner_enabled || !settings.global_banner_text || dismissed) {
    return null;
  }

  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-[#1DB954] px-6 py-2.5 sm:px-3.5 sm:before:flex-1 animate-in slide-in-from-top duration-500">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm leading-6 text-black flex items-center gap-2">
          <Bell size={16} className="animate-bounce" />
          <strong className="font-bold">RingBeat Announcement:</strong>
          <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
            <circle cx="1" cy="1" r="1" />
          </svg>
          {settings.global_banner_text}
        </p>
      </div>
      <div className="flex flex-1 justify-end">
        <button 
          type="button" 
          onClick={() => setDismissed(true)}
          className="-m-3 p-3 focus-visible:outline-offset-[-4px] hover:bg-black/10 rounded-full transition-colors"
        >
          <span className="sr-only">Dismiss</span>
          <X className="h-5 w-5 text-black" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
