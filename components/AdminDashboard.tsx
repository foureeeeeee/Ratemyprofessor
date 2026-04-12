
import React, { useState, useMemo } from 'react';
import { Professor, Course, Review, Report } from '../types';
import { 
  LayoutDashboard, Users, BookOpen, MessageSquare, LogOut, 
  Plus, Edit2, Trash2, Search, Save, X, AlertCircle, ShieldAlert, Check, XCircle, Send,
  BarChart3, Download, Calendar, PieChart as PieChartIcon, TrendingUp, Award
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { DEPARTMENTS } from '../constants';

interface Props {
  professors: Professor[];
  courses: Course[];
  reviews: Review[];
  reports: Report[];
  onAddProfessor: (p: Professor) => void;
  onUpdateProfessor: (p: Professor) => void;
  onDeleteProfessor: (id: string) => void;
  onAddCourse: (c: Course) => void;
  onUpdateCourse: (c: Course) => void;
  onDeleteCourse: (id: string) => void;
  onDeleteReview: (id: string) => void;
  onResolveReport: (id: string, action: 'dismiss' | 'delete', message?: string) => void;
  onLogout: () => void;
}

type Tab = 'analytics' | 'professors' | 'courses' | 'reviews' | 'moderation';
type TimeRange = 'all' | 'last_semester' | 'last_30_days';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const AdminDashboard: React.FC<Props> = ({
  professors, courses, reviews, reports,
  onAddProfessor, onUpdateProfessor, onDeleteProfessor,
  onAddCourse, onUpdateCourse, onDeleteCourse,
  onDeleteReview, onResolveReport, onLogout
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('analytics'); // Default to Analytics per UC-05
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Analytics State
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  
  // Generic Editing State
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  // Delete State
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Moderation Resolution State
  const [resolutionData, setResolutionData] = useState<{ report: Report, action: 'approve' | 'reject' } | null>(null);
  const [adminMessage, setAdminMessage] = useState('');

  // --- Analytics Logic (UC-05) ---
  
  const filteredReviewsByDate = useMemo(() => {
    const now = new Date();
    return reviews.filter(r => {
      const reviewDate = new Date(r.date);
      if (timeRange === 'last_30_days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return reviewDate >= thirtyDaysAgo;
      }
      if (timeRange === 'last_semester') {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);
        return reviewDate >= sixMonthsAgo;
      }
      return true;
    });
  }, [reviews, timeRange]);

  const analyticsData = useMemo(() => {
    if (filteredReviewsByDate.length === 0) return null;

    // 1. Top Rated Professors
    const profMap = new Map<string, {name: string, total: number, count: number}>();
    filteredReviewsByDate.forEach(r => {
      const p = professors.find(prof => prof.id === r.professorId);
      if (p) {
        const current = profMap.get(p.id) || { name: p.name, total: 0, count: 0 };
        profMap.set(p.id, { name: p.name, total: current.total + r.rating, count: current.count + 1 });
      }
    });
    const topProfessors = Array.from(profMap.values())
      .map(p => ({ name: p.name, rating: parseFloat((p.total / p.count).toFixed(2)) }))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    // 2. Department Performance
    const deptMap = new Map<string, {total: number, count: number}>();
    filteredReviewsByDate.forEach(r => {
      const p = professors.find(prof => prof.id === r.professorId);
      if (p) {
        const current = deptMap.get(p.department) || { total: 0, count: 0 };
        deptMap.set(p.department, { total: current.total + r.rating, count: current.count + 1 });
      }
    });
    const deptPerformance = Array.from(deptMap.entries())
      .map(([name, data]) => ({ name, value: parseFloat((data.total / data.count).toFixed(2)) }));

    // 3. Rating Trends Over Time
    const trendMap = new Map<string, {total: number, count: number}>();
    filteredReviewsByDate.forEach(r => {
      const dateKey = new Date(r.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }); // e.g., "Jan 24"
      const current = trendMap.get(dateKey) || { total: 0, count: 0 };
      trendMap.set(dateKey, { total: current.total + r.rating, count: current.count + 1 });
    });
    // Sort chronologically (rough sort based on date parsing, sufficiently accurate for demo mock data)
    const trends = Array.from(trendMap.entries())
      .map(([date, data]) => ({ date, rating: parseFloat((data.total / data.count).toFixed(2)) }))
      .reverse(); // Mock data usually newest first, we want line chart left-to-right

    return { topProfessors, deptPerformance, trends };
  }, [filteredReviewsByDate, professors]);

  const handleExport = (format: 'csv' | 'pdf') => {
    if (format === 'pdf') {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert("Please allow popups to generate the PDF report.");
        return;
      }

      const dateStr = new Date().toLocaleDateString();
      const totalAvg = (filteredReviewsByDate.reduce((a,b) => a+b.rating, 0) / filteredReviewsByDate.length || 0).toFixed(2);
      const activeProfs = new Set(filteredReviewsByDate.map(r => r.professorId)).size;
      
      const htmlContent = `
        <html>
          <head>
            <title>System Intelligence Report - ${dateStr}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; mx-auto; }
              .header { border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 40px; }
              h1 { margin: 0; font-size: 28px; color: #0f172a; }
              .meta { color: #64748b; font-size: 14px; margin-top: 5px; }
              h2 { margin-top: 40px; color: #334155; font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
              
              .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
              .kpi { background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
              .kpi-label { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 5px; }
              .kpi-value { font-size: 32px; font-weight: 800; color: #0f172a; }
              
              table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
              th { text-align: left; padding: 12px; background-color: #f1f5f9; color: #475569; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
              td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #334155; }
              tr:last-child td { border-bottom: none; }
              
              .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 600; background: #e0f2fe; color: #0284c7; }
              
              .footer { margin-top: 60px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
              
              @media print {
                body { padding: 0; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>System Intelligence Report</h1>
              <div class="meta">
                Generated: ${dateStr} • Time Range: ${timeRange.replace(/_/g, ' ').toUpperCase()}
              </div>
            </div>

            <div class="summary-grid">
              <div class="kpi">
                <div class="kpi-label">Total Reviews</div>
                <div class="kpi-value">${filteredReviewsByDate.length}</div>
              </div>
               <div class="kpi">
                <div class="kpi-label">Average Rating</div>
                <div class="kpi-value">${totalAvg}</div>
              </div>
              <div class="kpi">
                <div class="kpi-label">Active Professors</div>
                <div class="kpi-value">${activeProfs}</div>
              </div>
            </div>

            ${analyticsData ? `
              <h2>Top Performing Professors</h2>
              <table>
                <thead>
                  <tr>
                    <th width="10%">Rank</th>
                    <th>Professor Name</th>
                    <th width="20%">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  ${analyticsData.topProfessors.map((p, i) => `
                    <tr>
                      <td><span class="badge">#${i+1}</span></td>
                      <td><strong>${p.name}</strong></td>
                      <td>${p.rating} / 5.0</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <h2>Department Analysis</h2>
              <table>
                <thead>
                  <tr>
                    <th>Department</th>
                    <th width="20%">Avg Score</th>
                  </tr>
                </thead>
                <tbody>
                  ${analyticsData.deptPerformance.map(d => `
                    <tr>
                      <td>${d.name}</td>
                      <td><strong>${d.value}</strong></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<p>No data available for this period.</p>'}
            
            <div class="footer">
              CONFIDENTIAL • UKM MANAGEMENT INFORMATION SYSTEM • DO NOT DISTRIBUTE WITHOUT AUTHORIZATION
            </div>
            
            <script>
              window.onload = function() { 
                setTimeout(function() { window.print(); }, 500);
              }
            </script>
          </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      return;
    }

    // CSV Export Logic
    const headers = "ReviewID,Professor,Course,Rating,Date,Comment\n";
    const rows = filteredReviewsByDate.map(r => {
      const pName = professors.find(p => p.id === r.professorId)?.name || "Unknown";
      return `${r.id},"${pName}",${r.courseCode},${r.rating},${r.date},"${r.comment.replace(/"/g, '""')}"`;
    }).join("\n");
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mis_report_${timeRange}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Filter Logic for CRUD Tables ---
  const filteredData = () => {
    const term = searchTerm.toLowerCase();
    if (activeTab === 'professors') {
      return professors.filter(p => p.name.toLowerCase().includes(term) || p.department.toLowerCase().includes(term));
    }
    if (activeTab === 'courses') {
      return courses.filter(c => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term));
    }
    if (activeTab === 'reviews') {
      return reviews.filter(r => r.comment.toLowerCase().includes(term) || r.courseCode.toLowerCase().includes(term));
    }
    if (activeTab === 'moderation') {
      return reports.filter(r => r.status === 'pending');
    }
    return [];
  };

  // --- Handlers (Existing) ---
  const handleEdit = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'professors') {
      setImagePreview(item.image || '');
    }
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null); // null means creating new
    if (activeTab === 'professors') {
      setImagePreview('');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    if (activeTab === 'professors') {
      const prof: Professor = {
        id: editingItem ? editingItem.id : crypto.randomUUID(),
        name: formData.get('name') as string,
        title: formData.get('title') as string,
        department: formData.get('department') as string,
        image: formData.get('image') as string || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.get('name') as string)}`,
        averageRating: editingItem ? editingItem.averageRating : 0,
        reviewCount: editingItem ? editingItem.reviewCount : 0,
      };
      editingItem ? onUpdateProfessor(prof) : onAddProfessor(prof);
    } 
    else if (activeTab === 'courses') {
        const course: Course = {
            id: editingItem ? editingItem.id : crypto.randomUUID(),
            code: formData.get('code') as string,
            name: formData.get('name') as string,
            department: formData.get('department') as string,
            description: formData.get('description') as string,
            professorIds: editingItem ? editingItem.professorIds : [] 
        };
        editingItem ? onUpdateCourse(course) : onAddCourse(course);
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
        if (activeTab === 'professors') onDeleteProfessor(itemToDelete);
        if (activeTab === 'courses') onDeleteCourse(itemToDelete);
        if (activeTab === 'reviews') onDeleteReview(itemToDelete);
        setItemToDelete(null);
    }
  };

  const handleModerationAction = (report: Report, action: 'approve' | 'reject') => {
    setResolutionData({ report, action });
    setAdminMessage('');
  };

  const confirmResolution = () => {
    if (!resolutionData) return;
    const { report, action } = resolutionData;
    
    if (action === 'approve') {
      onResolveReport(report.id, 'dismiss', adminMessage);
    } 
    else {
      onResolveReport(report.id, 'delete', adminMessage);
      if (report.targetType === 'review') onDeleteReview(report.targetId);
      if (report.targetType === 'professor') onDeleteProfessor(report.targetId);
      if (report.targetType === 'course') onDeleteCourse(report.targetId);
    }
    
    setResolutionData(null);
  };

  const getContentPreview = (targetId: string, type: string) => {
    if (type === 'review') {
      const r = reviews.find(rev => rev.id === targetId);
      return r ? `"${r.comment}"` : "[Content deleted or not found]";
    }
    if (type === 'professor') {
      const p = professors.find(prof => prof.id === targetId);
      return p ? p.name : "[Professor not found]";
    }
    if (type === 'course') {
      const c = courses.find(course => course.id === targetId);
      return c ? `${c.code} - ${c.name}` : "[Course not found]";
    }
    return "Unknown Content";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">System Administration</h1>
              <p className="text-xs text-slate-500">Management Information System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">Admin: A199710</span>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tabs & Toolbar */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8">
          <div className="flex p-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto w-full xl:w-auto">
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'analytics' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <BarChart3 className="w-4 h-4 mr-2" /> Analytics
            </button>
            <button 
              onClick={() => setActiveTab('professors')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'professors' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Users className="w-4 h-4 mr-2" /> Professors
            </button>
            <button 
              onClick={() => setActiveTab('courses')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'courses' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <BookOpen className="w-4 h-4 mr-2" /> Courses
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'reviews' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <MessageSquare className="w-4 h-4 mr-2" /> Reviews
            </button>
            <button 
              onClick={() => setActiveTab('moderation')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'moderation' ? 'bg-red-50 text-red-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <ShieldAlert className="w-4 h-4 mr-2" /> Moderation
              {reports.filter(r => r.status === 'pending').length > 0 && (
                <span className="ml-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {reports.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'analytics' && (
             <div className="flex gap-3 w-full xl:w-auto">
               <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2">
                 <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                 <select 
                  className="bg-transparent text-sm font-medium text-slate-700 outline-none"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                 >
                   <option value="all">All Time</option>
                   <option value="last_semester">Last Semester</option>
                   <option value="last_30_days">Last 30 Days</option>
                 </select>
               </div>
               <button onClick={() => handleExport('csv')} className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                 <Download className="w-4 h-4" /> CSV
               </button>
               <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                 <Download className="w-4 h-4" /> PDF
               </button>
             </div>
          )}

          {activeTab !== 'moderation' && activeTab !== 'analytics' && (
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search records..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
                />
              </div>
              {activeTab !== 'reviews' && (
                <button 
                  onClick={handleAddNew}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> Add New
                </button>
              )}
            </div>
          )}
        </div>

        {/* --- ANALYTICS DASHBOARD CONTENT --- */}
        {activeTab === 'analytics' && (
          <div>
            {!analyticsData ? (
              <div className="bg-white rounded-2xl p-16 text-center border border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Insufficient Data</h3>
                <p className="text-slate-500 mt-2">Not enough reviews found for the selected time range to generate trends.</p>
                <button 
                  onClick={() => setTimeRange('all')}
                  className="mt-6 text-blue-600 font-medium hover:underline"
                >
                  View All Time Data
                </button>
              </div>
            ) : (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Total Reviews</div>
                    <div className="text-3xl font-bold text-slate-900">{filteredReviewsByDate.length}</div>
                    <div className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Updated just now
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Avg Rating</div>
                    <div className="text-3xl font-bold text-slate-900">
                      {(filteredReviewsByDate.reduce((a,b) => a+b.rating, 0) / filteredReviewsByDate.length || 0).toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                     <div className="text-xs font-bold text-slate-500 uppercase mb-1">Active Professors</div>
                     <div className="text-3xl font-bold text-slate-900">
                        {new Set(filteredReviewsByDate.map(r => r.professorId)).size}
                     </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                     <div className="text-xs font-bold text-slate-500 uppercase mb-1">Active Courses</div>
                     <div className="text-3xl font-bold text-slate-900">
                       {new Set(filteredReviewsByDate.map(r => r.courseCode)).size}
                     </div>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Rating Trends */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                       <TrendingUp className="w-5 h-5 text-blue-600" /> Rating Trends Over Time
                    </h3>
                    <div className="h-64">
                       <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={analyticsData.trends}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} />
                           <XAxis dataKey="date" tick={{fontSize: 12}} />
                           <YAxis domain={[0, 5]} tick={{fontSize: 12}} />
                           <Tooltip />
                           <Line type="monotone" dataKey="rating" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                         </LineChart>
                       </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top Professors */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                       <Award className="w-5 h-5 text-amber-500" /> Top Rated Professors
                    </h3>
                    <div className="h-64">
                       <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={analyticsData.topProfessors} layout="vertical">
                           <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                           <XAxis type="number" domain={[0, 5]} hide />
                           <YAxis type="category" dataKey="name" width={120} tick={{fontSize: 11}} />
                           <Tooltip />
                           <Bar dataKey="rating" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
                         </BarChart>
                       </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Dept Performance */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
                     <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <PieChartIcon className="w-5 h-5 text-green-600" /> Department Performance (Avg Rating)
                     </h3>
                     <div className="h-64">
                       <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={analyticsData.deptPerformance}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} />
                           <XAxis dataKey="name" tick={{fontSize: 12}} />
                           <YAxis domain={[0, 5]} tick={{fontSize: 12}} />
                           <Tooltip />
                           <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                         </BarChart>
                       </ResponsiveContainer>
                     </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Moderation Tab Content */}
        {activeTab === 'moderation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData().map((item: any) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-red-100 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                   <div className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                     {item.targetType} Report
                   </div>
                   <span className="text-xs text-slate-400">
                     {new Date(item.timestamp).toLocaleDateString()}
                   </span>
                </div>
                
                <h4 className="font-bold text-slate-800 mb-1">{item.reason}</h4>
                <p className="text-sm text-slate-600 mb-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  "{item.details}"
                </p>
                
                <div className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                  <span className="font-semibold">Reporter:</span> 
                  {item.reporterEmail ? item.reporterEmail : <span className="italic">Anonymous</span>}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2">Flagged Content</div>
                  <p className="text-sm text-slate-800 font-medium italic mb-6 line-clamp-3">
                    {getContentPreview(item.targetId, item.targetType)}
                  </p>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleModerationAction(item, 'approve')}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-sm font-bold transition-colors"
                      title="Keep Content (Dismiss Report)"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button 
                      onClick={() => handleModerationAction(item, 'reject')}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-bold transition-colors"
                      title="Delete Content (Resolve Report)"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredData().length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">All Clear!</h3>
                <p className="text-slate-500">No pending reports in the queue.</p>
              </div>
            )}
          </div>
        )}

        {/* Regular Data Tables (Professors, Courses, Reviews) */}
        {activeTab !== 'moderation' && activeTab !== 'analytics' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">
                      {activeTab === 'professors' ? 'Name & Title' : activeTab === 'courses' ? 'Course Name' : 'Review Content'}
                    </th>
                    <th className="px-6 py-4">
                      {activeTab === 'professors' ? 'Department' : activeTab === 'courses' ? 'Code' : 'Course'}
                    </th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {filteredData().map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-slate-400 text-xs">{item.id.slice(0,8)}...</td>
                      <td className="px-6 py-4">
                        {activeTab === 'professors' && (
                          <div className="flex items-center gap-3">
                            <img src={item.image} className="w-8 h-8 rounded-full object-cover" alt="" />
                            <div>
                              <div className="font-semibold text-slate-900">{item.name}</div>
                              <div className="text-xs text-slate-500">{item.title}</div>
                            </div>
                          </div>
                        )}
                        {activeTab === 'courses' && (
                          <span className="font-semibold text-slate-900">{item.name}</span>
                        )}
                        {activeTab === 'reviews' && (
                          <div>
                            <div className="line-clamp-1 font-medium text-slate-800">"{item.comment}"</div>
                            <div className="text-xs text-slate-500 mt-1">Rating: {item.rating}/5 • By {item.studentName}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {activeTab === 'professors' ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                            {item.department}
                          </span>
                        ) : activeTab === 'courses' ? (
                          <span className="font-mono font-medium text-blue-600">{item.code}</span>
                        ) : (
                          <span className="font-mono font-medium text-slate-600">{item.courseCode}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          {activeTab !== 'reviews' && (
                            <button 
                              onClick={() => handleEdit(item)}
                              className="p-2 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => setItemToDelete(item.id)}
                            className="p-2 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredData().length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                        No records found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-900">
                {editingItem ? 'Edit Record' : 'Create New Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {activeTab === 'professors' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input name="name" defaultValue={editingItem?.name} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input name="title" defaultValue={editingItem?.title} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                    <select name="department" defaultValue={editingItem?.department || DEPARTMENTS[0]} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                    <div className="flex gap-3">
                      <input 
                        name="image" 
                        defaultValue={editingItem?.image} 
                        onChange={(e) => setImagePreview(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                        {imagePreview ? (
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-full h-full object-cover" 
                                onError={(e) => e.currentTarget.style.display = 'none'} 
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">?</div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'courses' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Course Code</label>
                    <input name="code" defaultValue={editingItem?.code} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Course Name</label>
                    <input name="name" defaultValue={editingItem?.name} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                    <select name="department" defaultValue={editingItem?.department || DEPARTMENTS[0]} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea name="description" defaultValue={editingItem?.description} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                  </div>
                </>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Are you sure?</h3>
            <p className="text-slate-500 text-sm mb-6">
              You are about to delete this item. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setItemToDelete(null)}
                  className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 shadow-md transition-colors"
                >
                  Delete Item
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolution Confirmation Modal */}
      {resolutionData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
               <h3 className="font-bold text-lg text-slate-900">Resolve Report</h3>
               <button onClick={() => setResolutionData(null)} className="text-slate-400 hover:text-slate-600">
                 <X className="w-5 h-5" />
               </button>
             </div>
             
             <div className="p-6">
               <p className="text-sm text-slate-600 mb-4">
                 You are about to <span className={`font-bold uppercase ${resolutionData.action === 'approve' ? 'text-green-600' : 'text-red-600'}`}>
                   {resolutionData.action}
                 </span> this report.
                 {resolutionData.action === 'reject' && " This will remove the reported content permanently."}
               </p>

               <div className="mb-6">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                   Message to Reporter (Optional)
                 </label>
                 <textarea
                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                   rows={3}
                   placeholder="Explain why the report was approved or rejected..."
                   value={adminMessage}
                   onChange={(e) => setAdminMessage(e.target.value)}
                 />
                 <p className="text-xs text-slate-400 mt-1">This message will be sent to {resolutionData.report.reporterEmail || 'the user'}.</p>
               </div>

               <div className="flex justify-end gap-3">
                 <button 
                    onClick={() => setResolutionData(null)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                    onClick={confirmResolution}
                    className={`px-4 py-2 text-white rounded-lg font-medium shadow-md flex items-center gap-2 ${
                      resolutionData.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                    }`}
                 >
                   <Send className="w-4 h-4" /> Confirm & Notify
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};
