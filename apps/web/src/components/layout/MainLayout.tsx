
import { Sidebar } from '../layout/Sidebar';
import { Topbar } from '../layout/Topbar';
import { PlayerBar } from '../player/PlayerBar';
import { Outlet } from 'react-router-dom';
import { GlobalBanner } from './GlobalBanner';

export const MainLayout = () => {
  return (
    <div className="flex h-screen w-full flex-col bg-[#000000] overflow-hidden text-white">
      <GlobalBanner />
      {/* Top Section: Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden p-2 gap-2 pb-0">
        <Sidebar className="w-[300px] shrink-0" />

        <main className="relative flex flex-1 flex-col overflow-hidden rounded-lg bg-[#121212] isolate">
          {/* Topbar float over content */}
          <div className="absolute top-0 left-0 w-full z-50 pointer-events-none">
            <div className="pointer-events-auto">
              <Topbar />
            </div>
          </div>
          {/* Scrollable Container */}
          <div id="main-scroll" className="flex-1 overflow-y-auto w-full h-full relative z-0">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom Section: Player Bar */}
      <div className="h-[90px] w-full shrink-0 flex items-center bg-black px-4">
        <PlayerBar />
      </div>
    </div>
  );
};
