import React, { useMemo } from 'react';
import { Professor, Review } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, Users, Award, BookOpen, 
  CheckCircle, Clock, AlertTriangle 
} from 'lucide-react';

interface Props {
  professors: Professor[];
  reviews: Review[];
}

const COLORS = ['#d4ff00', '#e5e5e5', '#262626', '#525252', '#737373'];

export const Dashboard: React.FC<Props> = ({ professors, reviews }) => {
  
  const globalStats = useMemo(() => {
    const totalReviews = reviews.length;
    if (totalReviews === 0) return { avgRating: 0, avgDifficulty: 0, wouldTakeAgain: 0 };
    const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
    const totalDifficulty = reviews.reduce((acc, r) => acc + (r.difficulty || 3), 0);
    const takeAgainCount = reviews.filter(r => r.wouldTakeAgain).length;
    return {
      avgRating: (totalRating / totalReviews).toFixed(2),
      avgDifficulty: (totalDifficulty / totalReviews).toFixed(2),
      wouldTakeAgain: ((takeAgainCount / totalReviews) * 100).toFixed(0)
    };
  }, [reviews]);

  const departmentStats = useMemo(() => {
    const stats: Record<string, { totalRating: number, totalDifficulty: number, count: number }> = {};
    professors.forEach(p => {
      if (!stats[p.department]) stats[p.department] = { totalRating: 0, totalDifficulty: 0, count: 0 };
    });
    reviews.forEach(review => {
      const prof = professors.find(p => p.id === review.professorId);
      if (prof && stats[prof.department]) {
        stats[prof.department].totalRating += review.rating;
        stats[prof.department].totalDifficulty += (review.difficulty || 3);
        stats[prof.department].count += 1;
      }
    });
    return Object.keys(stats)
      .map(dept => ({
        name: dept.substring(0, 10), // Truncate for ASCII look
        Quality: stats[dept].count ? parseFloat((stats[dept].totalRating / stats[dept].count).toFixed(2)) : 0,
        Difficulty: stats[dept].count ? parseFloat((stats[dept].totalDifficulty / stats[dept].count).toFixed(2)) : 0,
        reviewCount: stats[dept].count
      }))
      .filter(s => s.reviewCount > 0)
      .sort((a, b) => b.Quality - a.Quality);
  }, [professors, reviews]);

  const gradeData = useMemo(() => {
    const counts: Record<string, number> = {};
    reviews.forEach(r => { const g = r.grade || 'N/A'; if (g !== 'N/A') counts[g] = (counts[g] || 0) + 1; });
    return ['A', 'B', 'C', 'D', 'F'].filter(g => counts[g]).map(g => ({ name: g, value: counts[g] }));
  }, [reviews]);

  const attendanceData = useMemo(() => {
    const counts: Record<string, number> = { 'Mandatory': 0, 'Optional': 0 };
    reviews.forEach(r => { if (counts[r.attendance] !== undefined) counts[r.attendance] += 1; });
    return Object.keys(counts).filter(k => counts[k] > 0).map(k => ({ name: k, value: counts[k] }));
  }, [reviews]);

  const topProfessors = useMemo(() => [...professors].filter(p => p.reviewCount > 0).sort((a, b) => b.averageRating - a.averageRating).slice(0, 5), [professors]);
  const difficultCourses = useMemo(() => {
    const stats: Record<string, { totalDiff: number, count: number }> = {};
    reviews.forEach(r => {
      if (!stats[r.courseCode]) stats[r.courseCode] = { totalDiff: 0, count: 0 };
      stats[r.courseCode].totalDiff += (r.difficulty || 3);
      stats[r.courseCode].count += 1;
    });
    return Object.entries(stats).map(([code, d]) => ({ code, avgDifficulty: parseFloat((d.totalDiff / d.count).toFixed(1)), count: d.count })).sort((a, b) => b.avgDifficulty - a.avgDifficulty).slice(0, 5);
  }, [reviews]);

  // Custom Tooltip for ASCII Look
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-terminal-black border border-terminal-light p-2 text-xs font-mono">
          <p className="text-terminal-accent uppercase">{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-terminal-black p-4 md:p-8 font-mono text-terminal-light">
      
      <div className="border-b-2 border-terminal-light mb-12 pb-4">
        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">System_Analytics</h1>
        <p className="text-terminal-gray mt-2 text-sm">// Real-time data visualization module.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'TOTAL_REVIEWS', val: reviews.length, icon: Users, color: 'text-terminal-light' },
          { label: 'AVG_QUALITY', val: globalStats.avgRating, icon: Award, color: 'text-terminal-accent' },
          { label: 'AVG_DIFFICULTY', val: globalStats.avgDifficulty, icon: AlertTriangle, color: 'text-red-500' },
          { label: 'RETAKE_RATE', val: `${globalStats.wouldTakeAgain}%`, icon: CheckCircle, color: 'text-green-500' }
        ].map((kpi) => (
          <div key={kpi.label} className="bg-terminal-dark border border-terminal-gray p-4 relative overflow-hidden group hover:border-terminal-light transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs text-terminal-gray font-bold">{kpi.label}</span>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div className="text-4xl font-bold">{kpi.val}</div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-terminal-gray group-hover:bg-terminal-accent transition-colors"></div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-terminal-dark border border-terminal-gray p-6">
          <h3 className="text-lg font-bold uppercase mb-6 border-b border-terminal-gray/50 pb-2">Performance_By_Dept</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={departmentStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="name" tick={{fill: '#737373', fontSize: 10}} axisLine={false} />
                <YAxis tick={{fill: '#737373', fontSize: 10}} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#262626'}} />
                <Legend />
                <Bar dataKey="Quality" fill="#d4ff00" radius={[0,0,0,0]} barSize={20} />
                <Bar dataKey="Difficulty" fill="#525252" radius={[0,0,0,0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-terminal-dark border border-terminal-gray p-6">
          <h3 className="text-lg font-bold uppercase mb-6 border-b border-terminal-gray/50 pb-2">Grade_Dist</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <AreaChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="name" tick={{fill: '#737373', fontSize: 10}} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="step" dataKey="value" stroke="#d4ff00" strokeWidth={2} fill="#d4ff00" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="bg-terminal-dark border border-terminal-gray p-6">
            <h3 className="text-lg font-bold uppercase mb-6 border-b border-terminal-gray/50 pb-2">Attendance</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={attendanceData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {attendanceData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} strokeWidth={0} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-terminal-dark border border-terminal-gray p-6">
            <h3 className="text-lg font-bold uppercase mb-6 border-b border-terminal-gray/50 pb-2">Hall_Of_Fame</h3>
            <div className="space-y-3">
              {topProfessors.map((p, i) => (
                <div key={p.id} className="flex justify-between items-center border-b border-terminal-gray/30 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-terminal-accent font-bold">#{i+1}</span>
                    <span className="text-xs uppercase">{p.name}</span>
                  </div>
                  <span className="bg-terminal-accent text-terminal-black px-2 text-xs font-bold">{p.averageRating.toFixed(1)}</span>
                </div>
              ))}
            </div>
         </div>

         <div className="bg-terminal-dark border border-terminal-gray p-6">
            <h3 className="text-lg font-bold uppercase mb-6 border-b border-terminal-gray/50 pb-2">Hardest_Courses</h3>
            <div className="space-y-3">
              {difficultCourses.map((c) => (
                <div key={c.code} className="flex justify-between items-center border-b border-terminal-gray/30 pb-2">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    <span className="text-xs uppercase font-bold">{c.code}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-red-500 font-bold text-sm">{c.avgDifficulty.toFixed(1)}</span>
                    <span className="text-[10px] text-terminal-gray block">DIFF</span>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
};