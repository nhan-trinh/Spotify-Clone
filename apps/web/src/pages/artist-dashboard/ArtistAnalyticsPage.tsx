import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Music, TrendingUp, Users, Play } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-[#181818] rounded-xl p-6 border border-[#282828] hover:border-[#383838] transition-colors">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-[#b3b3b3] mb-1">{label}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  </div>
);

export const ArtistAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [analyticsRes, songsRes] = await Promise.all([
          api.get('/artists/me/analytics') as any,
          api.get('/artists/me/songs') as any,
        ]);
        setAnalytics(analyticsRes.data);
        setSongs(songsRes.data?.slice(0, 5) || []);
      } catch (err) {
        console.error('Lỗi khi tải analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = analytics ? [
    { label: 'Tổng bài hát', value: analytics.totalBaseSongs?.toLocaleString() || '0', icon: Music, color: 'bg-[#1DB954]' },
    { label: 'Tổng lượt nghe', value: analytics.totalPlays?.toLocaleString() || '0', icon: Play, color: 'bg-blue-500' },
    { label: 'Người theo dõi', value: analytics.totalFollowers?.toLocaleString() || '0', icon: Users, color: 'bg-purple-500' },
    { label: 'Top bài hát', value: songs[0]?.title || '—', icon: TrendingUp, color: 'bg-orange-500' },
  ] : [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">Tổng quan</h2>
        <p className="text-[#b3b3b3] text-sm">Thống kê hoạt động của bạn</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#181818] rounded-xl p-6 border border-[#282828] animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/2 mb-3" />
              <div className="h-8 bg-white/10 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
        </div>
      )}

      {/* Top songs table */}
      <div className="bg-[#181818] rounded-xl border border-[#282828] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#282828]">
          <h3 className="font-bold">Bài hát của bạn</h3>
        </div>
        <div className="divide-y divide-[#282828]">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3 animate-pulse">
                <div className="w-8 h-8 bg-white/10 rounded" />
                <div className="flex-1 h-4 bg-white/10 rounded" />
                <div className="w-20 h-4 bg-white/10 rounded" />
                <div className="w-16 h-5 bg-white/10 rounded-full" />
              </div>
            ))
          ) : songs.length === 0 ? (
            <div className="px-6 py-8 text-center text-[#b3b3b3] text-sm">
              Bạn chưa có bài hát nào. Hãy tải lên bài hát đầu tiên!
            </div>
          ) : (
            songs.map((song, i) => (
              <div key={song.id} className="flex items-center gap-4 px-6 py-3 hover:bg-white/5 transition-colors">
                <span className="text-[#b3b3b3] text-sm w-5 text-center">{i + 1}</span>
                {song.coverUrl && (
                  <img src={song.coverUrl} alt={song.title} className="w-9 h-9 rounded object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{song.title}</p>
                  <p className="text-xs text-[#b3b3b3]">{song.playCount?.toLocaleString() || 0} lượt nghe</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  song.status === 'APPROVED' ? 'bg-[#1DB954]/20 text-[#1DB954]' :
                  song.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {song.status === 'APPROVED' ? 'Đã duyệt' : song.status === 'PENDING' ? 'Chờ duyệt' : 'Từ chối'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
