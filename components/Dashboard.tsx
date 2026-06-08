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

const COLORS = ['#1e3a8a', '#3b82f6', '#93c5fd', '#bfdbfe', '#eff6ff']; // UKM blue variations

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
        name: dept.substring(0, 10), // Truncate
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

  // Clean Tooltip for Academic Look
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-xl p-3 rounded-lg text-sm text-slate-800">
          <p className="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-2">{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ color: p.color }} className="font-medium">
              {p.name}: <span className="font-bold">{p.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-12 text-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="border-b border-slate-200 mb-10 pb-6">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 tracking-tight">System Analytics</h1>
          <p className="text-slate-500 mt-2 text-lg">Real-time academic data visualization.</p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Reviews', val: reviews.length, icon: Users, color: 'text-ukm-blue' },
            { label: 'Avg Quality', val: globalStats.avgRating, icon: Award, color: 'text-amber-500' },
            { label: 'Avg Difficulty', val: globalStats.avgDifficulty, icon: AlertTriangle, color: 'text-rose-500' },
            { label: 'Retake Rate', val: `${globalStats.wouldTakeAgain}%`, icon: CheckCircle, color: 'text-emerald-500' }
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-blue-200 hover:bg-white/95 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm text-slate-500 font-medium">{kpi.label}</span>
                <div className={`p-2 rounded-lg bg-slate-50 group-hover:bg-blue-50 transition-colors`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </div>
              <div className="text-4xl font-bold text-slate-900">{kpi.val}</div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-ukm-blue transition-colors"></div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-6 pb-2 border-b border-slate-100">Performance By Department</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={departmentStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="Quality" fill="#1e3a8a" radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="Difficulty" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-6 pb-2 border-b border-slate-100">Grade Distribution</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <AreaChart data={gradeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#1e3a8a" strokeWidth={3} fill="#bfdbfe" fillOpacity={0.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-xl font-bold font-serif text-slate-900 mb-6 pb-2 border-b border-slate-100">Attendance Policies</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={attendanceData} innerRadius={65} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                      {attendanceData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-xl font-bold font-serif text-slate-900 mb-6 pb-2 border-b border-slate-100">Top Rated Faculty</h3>
              <div className="space-y-4">
                {topProfessors.map((p, i) => (
                  <div key={p.id} className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {i+1}
                      </span>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-ukm-blue transition-colors">{p.name}</span>
                    </div>
                    <span className="font-bold text-ukm-blue bg-blue-50 px-2 py-1 rounded text-sm">{p.averageRating.toFixed(1)}</span>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-xl font-bold font-serif text-slate-900 mb-6 pb-2 border-b border-slate-100">Most Difficult Courses</h3>
              <div className="space-y-4">
                {difficultCourses.map((c) => (
                  <div key={c.code} className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-md bg-rose-50 text-rose-500">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-slate-700 group-hover:text-rose-600 transition-colors">{c.code}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-rose-600 font-bold">{c.avgDifficulty.toFixed(1)}</span>
                      <span className="text-xs text-slate-400 ml-1 font-medium">DIFF</span>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};