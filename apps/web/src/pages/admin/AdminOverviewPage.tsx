import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Users, Music, PlayCircle, DollarSign, Award } from 'lucide-react';

export const AdminOverviewPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, artistsRes] = await Promise.all([
          api.get('/admin/analytics/overview'),
          api.get('/admin/analytics/top-artists')
        ]);
        setData({
          overview: overviewRes.data,
          topArtists: artistsRes.data
        });
      } catch (error) {
        console.error('Failed to load admin analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-[#b3b3b3]">Loading overview data...</div>;
  }

  if (!data) return <div className="p-8 text-center text-[#e22134]">Failed to load data.</div>;

  const { overview, topArtists } = data;

  const stats = [
    { label: 'Total Users', value: overview.totalUsers, icon: Users, color: 'bg-blue-500' },
    { label: 'Premium Users', value: overview.premiumUsers, icon: Award, color: 'bg-[#1DB954]' },
    { label: 'Total Songs (Public)', value: overview.totalSongs, icon: Music, color: 'bg-purple-500' },
    { label: 'Total Streams', value: overview.totalPlays, icon: PlayCircle, color: 'bg-pink-500' },
    { label: 'Revenue (VND)', value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(overview.totalRevenue), icon: DollarSign, color: 'bg-yellow-500' },
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">System Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#181818] p-6 rounded-xl border border-[#282828] flex flex-col gap-4 relative overflow-hidden group hover:bg-[#202020] transition-colors">
            <div className={`p-3 rounded-xl inline-flex w-fit ${stat.color} bg-opacity-20`}>
              <stat.icon size={24} className={stat.color.replace('bg-', 'text-')} />
            </div>
            <div>
              <p className="text-3xl font-bold mb-1 tracking-tight">{stat.value}</p>
              <p className="text-sm font-medium text-[#b3b3b3] uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Award size={24} className="text-yellow-500" /> Top Artists by Activity
      </h3>
      <div className="bg-[#181818] rounded-xl border border-[#282828] overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#282828]/50 uppercase tracking-wider text-[#b3b3b3] text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold">Stage Name</th>
              <th className="px-6 py-4 font-semibold text-center">Verified</th>
              <th className="px-6 py-4 font-semibold text-right">Uploaded Songs</th>
              <th className="px-6 py-4 font-semibold text-right">Followers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#282828]">
            {topArtists.map((artist: any) => (
              <tr key={artist.id} className="hover:bg-[#282828]/30 transition-colors">
                <td className="px-6 py-4 font-bold text-base">{artist.stageName}</td>
                <td className="px-6 py-4 text-center">
                  {artist.isVerified ? (
                     <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-400">VERIFIED</span>
                  ) : (
                     <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-[#282828] text-[#888]">NO</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right font-mono text-[#b3b3b3]">{artist._count.songs}</td>
                <td className="px-6 py-4 text-right font-mono text-[#b3b3b3]">{artist._count.followedBy}</td>
              </tr>
            ))}
            {topArtists.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-[#b3b3b3]">Chưa có nghệ sĩ nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
