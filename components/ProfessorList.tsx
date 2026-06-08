import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Professor, Review, User } from '../types';
import { ProfessorCard } from './ProfessorCard';
import { DEPARTMENTS } from '../constants';
import { Search, Plus, X, Users } from 'lucide-react';

interface Props {
  professors: Professor[];
  reviews: Review[];
  onAddProfessor: (professor: Professor) => void;
  currentUser: User | null;
  onRequireLogin: () => void;
}

export const ProfessorList: React.FC<Props> = ({ professors, reviews, onAddProfessor, currentUser, onRequireLogin }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || "";

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedDept, setSelectedDept] = useState("All");
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProf, setNewProf] = useState({
    name: '',
    department: DEPARTMENTS[0],
    title: '',
    image: '',
    initialRating: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const filteredProfessors = useMemo(() => {
    return professors.filter(prof => {
      const term = searchTerm.toLowerCase();
      const matchesDept = selectedDept === "All" || prof.department === selectedDept;
      if (!matchesDept) return false;

      const matchesDetails = 
        prof.name.toLowerCase().includes(term) ||
        prof.title.toLowerCase().includes(term) ||
        prof.department.toLowerCase().includes(term);

      if (matchesDetails) return true;

      const profReviews = reviews.filter(r => r.professorId === prof.id);
      return profReviews.some(r => 
        r.courseCode.toLowerCase().includes(term) || 
        r.comment.toLowerCase().includes(term)
      );
    });
  }, [professors, reviews, searchTerm, selectedDept]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const professor: Professor = {
      id: crypto.randomUUID(),
      name: newProf.name,
      department: newProf.department,
      title: newProf.title,
      image: newProf.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(newProf.name)}&background=random`,
      averageRating: Number(newProf.initialRating),
      reviewCount: Number(newProf.initialRating) > 0 ? 1 : 0
    };
    onAddProfessor(professor);
    setShowAddForm(false);
    setNewProf({ name: '', department: DEPARTMENTS[0], title: '', image: '', initialRating: 0 });
  };

  const handleAddClick = () => {
    if (!currentUser) {
      onRequireLogin();
    } else {
      setShowAddForm(!showAddForm);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800">
        <div className="w-10 h-10 border-4 border-ukm-blue border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium text-slate-500">Loading Directory...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">
              Faculty Directory
            </h2>
            <p className="text-slate-500 mt-2 font-medium text-lg">
              Showing {filteredProfessors.length} academic instructors
            </p>
          </div>
        </div>
        
        {/* Toolbar */}
        <div className={`sticky top-20 z-30 transition-all duration-300 ${isScrolled ? 'py-2' : ''}`}>
          <div className={`bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-xl p-3 flex flex-col md:flex-row gap-3 shadow-sm transition-all duration-300 ${isScrolled ? 'shadow-md shadow-slate-200/50 bg-white/95' : ''}`}>
            
            <div className="flex-grow relative">
               <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                  <Search className="w-5 h-5" />
               </div>
               <input 
                  type="text" 
                  placeholder="Search by name, title, or department..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 focus:border-ukm-blue focus:ring-1 focus:ring-ukm-blue rounded-lg outline-none placeholder:text-slate-400 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            
            <div className="flex gap-3">
              <select 
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 focus:border-ukm-blue rounded-lg outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="All">All Departments</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <button 
                onClick={handleAddClick}
                className={`px-4 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center min-w-[3rem] ${
                  showAddForm 
                    ? "bg-slate-200 text-slate-700 hover:bg-slate-300" 
                    : "bg-ukm-blue text-white hover:bg-blue-900"
                }`}
              >
                {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && currentUser && (
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-2xl p-6 shadow-sm mb-8 animate-in slide-in-from-top-4 fade-in duration-300">
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-ukm-blue" />
              Add Professor to Directory
            </h3>
            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input type="text" required className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-ukm-blue outline-none shadow-sm" 
                    value={newProf.name} onChange={e => setNewProf({...newProf, name: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Department</label>
                  <select className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-ukm-blue outline-none shadow-sm"
                    value={newProf.department} onChange={e => setNewProf({...newProf, department: e.target.value})}>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Title</label>
                  <input type="text" required className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-ukm-blue outline-none shadow-sm"
                    value={newProf.title} onChange={e => setNewProf({...newProf, title: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Image URL</label>
                  <input type="url" className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-ukm-blue outline-none shadow-sm placeholder:text-slate-400"
                    placeholder="https://..."
                    value={newProf.image} onChange={e => setNewProf({...newProf, image: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-ukm-blue text-white rounded-lg font-bold hover:bg-blue-900 transition-colors shadow-sm">
                Save Record
              </button>
            </form>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
          {filteredProfessors.length > 0 ? (
            filteredProfessors.map(prof => (
              <ProfessorCard key={prof.id} professor={prof} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white/50 backdrop-blur-sm border border-slate-200 border-dashed rounded-2xl">
              <p className="text-slate-500 font-medium">No faculty members found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};