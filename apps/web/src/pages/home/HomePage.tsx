import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { MediaCard } from '../../components/shared/MediaCard';
import { RecentCard } from '../../components/shared/RecentCard';
import { MediaCarousel } from '../../components/shared/MediaCarousel';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Database, Zap, Activity } from 'lucide-react';

export const HomePage = () => {
  const { data: feedData } = useQuery({
    queryKey: ['homeFeed'],
    queryFn: async () => {
      const res = await api.get('/home/feed') as any;
      return res.data;
    }
  });

  const { data: personalizedData } = useQuery({
    queryKey: ['personalizedFeed'],
    queryFn: async () => {
      try {
        const res = await api.get('/home/personalized') as any;
        return res.data;
      } catch (e) {
        return null;
      }
    }
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning_Archive';
    if (hour < 18) return 'Afternoon_Stream';
    return 'Evening_Session';
  };

  if (!feedData) {
    return (
      <div className="p-8 pt-24 min-h-full w-full bg-black text-white selection:bg-[#1db954] selection:text-black">
        <div className="flex flex-col gap-12 animate-pulse">
           <div className="h-20 w-64 bg-white/5" />
           <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 bg-white/5 border border-white/10" />
              ))}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full min-h-full bg-black overflow-y-auto no-scrollbar relative isolate selection:bg-[#1db954] selection:text-black">
      {/* Texture Layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-50 bg-noise" />

      <div className="px-6 lg:px-12 pt-20 pb-32 relative z-10 w-full max-w-screen-2xl mx-auto">
        
        {/* ── HERO SECTION (Refined) ── */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 border-b border-white/10 pb-12"
        >
          <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-[2px] bg-[#1db954]" />
             <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[#1db954]">System_Ready // {new Date().toLocaleTimeString()}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none italic">
             {getGreeting()}
          </h1>
          <div className="flex items-center gap-6 mt-6 opacity-30">
             <div className="flex items-center gap-2">
                <Cpu size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Neural_Sync</span>
             </div>
             <div className="flex items-center gap-2">
                <Database size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Archive_v4</span>
             </div>
          </div>
        </motion.section>

        {/* ── 01: RECENTLY PLAYED ── */}
        <Section title="Recently Played" index="01">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {feedData.recentlyPlayed?.map((item: any) => (
              <RecentCard
                key={item.id}
                id={item.id}
                title={item.title}
                coverUrl={item.coverUrl}
                type="playlist"
                songs={item.songs}
              />
            ))}
          </div>
        </Section>

        {/* ── 02: RECENTLY VISITED ── */}
        {personalizedData?.recentlyVisited?.length > 0 && (
          <Section title="Recently Visited" index="02">
            <MediaCarousel>
              {personalizedData.recentlyVisited.map((item: any) => (
                <MediaCard
                  key={`${item.type}-${item.id}`}
                  id={item.id}
                  title={item.title}
                  subtitle={item.subTitle || item.type}
                  coverUrl={item.coverUrl}
                  type={item.type?.toLowerCase() as any}
                  songs={item.type === 'SONG' ? [item] : item.songs}
                  isCircle={item.type === 'ARTIST'}
                />
              ))}
            </MediaCarousel>
          </Section>
        )}

        {/* ── 03: DAILY MIX ── */}
        {personalizedData?.dailyMix?.length > 0 && (
          <Section title="Daily Mix" index="03" showAllLink="/section/daily-mix">
            <MediaCarousel>
              {personalizedData.dailyMix.map((song: any) => (
                <MediaCard key={song.id} id={song.id} title={song.title} subtitle={song.artistName} coverUrl={song.coverUrl} type="song" songs={[song]} />
              ))}
            </MediaCarousel>
          </Section>
        )}

        {/* ── 04: LISTEN AGAIN ── */}
        {personalizedData?.listenAgain?.length > 0 && (
          <Section title="Listen Again" index="04" showAllLink="/section/listen-again">
            <MediaCarousel>
              {personalizedData.listenAgain.map((item: any) => (
                <MediaCard key={item.id} id={item.id} title={item.title} subtitle={item.artistName} coverUrl={item.coverUrl} type="song" songs={[item]} />
              ))}
            </MediaCarousel>
          </Section>
        )}

        {/* ── 05: MADE FOR YOU ── */}
        <Section title="Made For You" index="05" showAllLink="/section/made-for-you">
          <MediaCarousel>
            {feedData.madeForYou?.map((item: any) => (
              <MediaCard key={item.id} id={item.id} title={item.title} subtitle={item.description} coverUrl={item.coverUrl} songs={item.songs} isPublic={item.isPublic} ownerId={item.ownerId} />
            ))}
          </MediaCarousel>
        </Section>

        {/* ── 06: TRENDING ── */}
        {feedData.trending?.length > 0 && (
          <Section title="Trending" index="06" showAllLink="/section/trending">
            <MediaCarousel>
              {feedData.trending?.map((item: any) => (
                <MediaCard key={item.id} id={item.id} title={item.title} subtitle={item.description} coverUrl={item.coverUrl} songs={item.songs} isPublic={item.isPublic} ownerId={item.ownerId} />
              ))}
            </MediaCarousel>
          </Section>
        )}

        {/* ── 07: NEW RELEASES ── */}
        {feedData.newReleases?.length > 0 && (
          <Section title="New Releases" index="07" showAllLink="/section/new-releases">
            <MediaCarousel>
              {feedData.newReleases?.map((song: any) => (
                <MediaCard key={song.id} id={song.id} title={song.title} subtitle={song.artistName} coverUrl={song.coverUrl} type="song" songs={[song]} />
              ))}
            </MediaCarousel>
          </Section>
        )}

        {/* ── 08: TOP SONGS ── */}
        {feedData.topSongs?.length > 0 && (
          <Section title="Top Songs" index="08" showAllLink="/section/top-songs">
            <MediaCarousel>
              {feedData.topSongs?.map((song: any) => (
                <MediaCard key={song.id} id={song.id} title={song.title} subtitle={song.artistName} coverUrl={song.coverUrl} type="song" songs={[song]} />
              ))}
            </MediaCarousel>
          </Section>
        )}

        {/* ── 09: NEW ALBUMS ── */}
        {feedData.newAlbums?.length > 0 && (
          <Section title="New Albums" index="09" showAllLink="/section/new-albums">
            <MediaCarousel>
              {feedData.newAlbums?.map((album: any) => (
                <MediaCard key={album.id} id={album.id} title={album.title} subtitle={album.artistName} coverUrl={album.coverUrl} type="album" />
              ))}
            </MediaCarousel>
          </Section>
        )}

        {/* ── 10: RECOMMENDED ARTISTS ── */}
        {personalizedData?.recommendedArtists?.length > 0 && (
          <Section title="Recommended Artists" index="10">
            <MediaCarousel>
              {personalizedData.recommendedArtists.map((artist: any) => (
                <MediaCard key={artist.id} id={artist.id} title={artist.stageName} subtitle="Artist" coverUrl={artist.avatarUrl} type="artist" isCircle={true} />
              ))}
            </MediaCarousel>
          </Section>
        )}

        {/* ── SYSTEM STATUS ── */}
        <div className="mt-24 pt-8 border-t border-white/10 flex justify-between items-center opacity-20">
           <span className="text-[8px] font-black uppercase tracking-widest">Archive_Stream_End</span>
           <div className="flex gap-4">
              <Zap size={10} />
              <Activity size={10} />
           </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, index, showAllLink, children }: { title: string; index: string; showAllLink?: string; children: React.ReactNode }) => (
  <section className="mb-20 w-full">
    <div className="flex items-end justify-between mb-8 border-b border-white/5 pb-4">
      <div className="flex flex-col gap-1">
         <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-[#1db954]">{index}</span>
            <div className="w-4 h-[1px] bg-white/20" />
         </div>
         <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            {title}
         </h2>
      </div>
      {showAllLink && (
        <Link to={showAllLink} className="text-[10px] font-black text-[#555] hover:text-white transition-colors uppercase tracking-widest border border-white/10 px-4 py-1">
          View_All
        </Link>
      )}
    </div>
    {children}
  </section>
);
