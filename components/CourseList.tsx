import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Course, Professor, Review, User } from '../types';
import { CourseCard } from './CourseCard';
import { DEPARTMENTS } from '../constants';
import { Search, Plus, X, BookOpen, Filter } from 'lucide-react';

interface Props {
  courses: Course[];
  professors: Professor[];
  reviews: Review[];
  onAddCourse?: (course: Course) => void;
  currentUser: User | null;
  onRequireLogin: () => void;
}

export const CourseList: React.FC<Props> = ({ courses, professors, reviews, onAddCourse, currentUser, onRequireLogin }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || "";

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedProfId, setSelectedProfId] = useState("All");
  const [isScrolled, setIsScrolled] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    department: DEPARTMENTS[0],
    description: '',
    professorIds: [] as string[]
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

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const term = searchTerm.toLowerCase();
      const matchesDept = selectedDept === "All" || course.department === selectedDept;
      const matchesProf = selectedProfId === "All" || course.professorIds.includes(selectedProfId);

      if (!matchesDept || !matchesProf) return false;

      const matchesDetails = 
        course.name.toLowerCase().includes(term) ||
        course.code.toLowerCase().includes(term);

      if (matchesDetails) return true;

      const taughtBy = professors.filter(p => course.professorIds.includes(p.id));
      return taughtBy.some(p => p.name.toLowerCase().includes(term));
    });
  }, [courses, professors, searchTerm, selectedDept, selectedProfId]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddCourse) return;
    const course: Course = {
      id: crypto.randomUUID(),
      code: newCourse.code,
      name: newCourse.name,
      department: newCourse.department,
      description: newCourse.description,
      professorIds: newCourse.professorIds
    };
    onAddCourse(course);
    setShowAddForm(false);
    setNewCourse({ code: '', name: '', department: DEPARTMENTS[0], description: '', professorIds: [] });
  };

  const toggleProfessorSelection = (profId: string) => {
    setNewCourse(prev => {
      if (prev.professorIds.includes(profId)) {
        return { ...prev, professorIds: prev.professorIds.filter(id => id !== profId) };
      } else {
        return { ...prev, professorIds: [...prev.professorIds, profId] };
      }
    });
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
        <p className="text-sm font-medium text-slate-500">Loading Course Catalog...</p>
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
              Course Catalog
            </h2>
            <p className="text-slate-500 mt-2 font-medium text-lg">
              Showing {filteredCourses.length} registered academic courses
            </p>
          </div>
        </div>
        
        {/* Toolbar */}
        <div className={`sticky top-20 z-30 transition-all duration-300 ${isScrolled ? 'py-2' : ''}`}>
          <div className={`bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-xl p-3 flex flex-col lg:flex-row gap-3 shadow-sm transition-all duration-300 ${isScrolled ? 'shadow-md shadow-slate-200/50 bg-white/95' : ''}`}>
            
            <div className="flex-grow relative">
               <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                  <Search className="w-5 h-5" />
               </div>
               <input 
                  type="text" 
                  placeholder="Search by course code or name..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 focus:border-ukm-blue focus:ring-1 focus:ring-ukm-blue rounded-lg outline-none placeholder:text-slate-400 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
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

              <select 
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 focus:border-ukm-blue rounded-lg outline-none cursor-pointer hover:bg-slate-100 transition-colors max-w-[200px]"
                value={selectedProfId}
                onChange={(e) => setSelectedProfId(e.target.value)}
              >
                <option value="All">All Instructors</option>
                {professors.map(prof => (
                  <option key={prof.id} value={prof.id}>{prof.name}</option>
                ))}
              </select>

              {onAddCourse && (
                <button 
                  onClick={handleAddClick}
                  className={`px-4 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center min-w-[3rem] whitespace-nowrap ${
                    showAddForm 
                      ? "bg-slate-200 text-slate-700 hover:bg-slate-300" 
                      : "bg-ukm-blue text-white hover:bg-blue-900"
                  }`}
                >
                  {showAddForm ? <X className="w-5 h-5" /> : "New Course"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && currentUser && (
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-2xl p-6 shadow-sm mb-8 animate-in slide-in-from-top-4 fade-in duration-300">
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-ukm-blue" />
              Register New Course
            </h3>
            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Course Code</label>
                  <input type="text" required className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-ukm-blue outline-none shadow-sm placeholder:text-slate-400" 
                    placeholder="e.g. CS101"
                    value={newCourse.code} onChange={e => setNewCourse({...newCourse, code: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Course Name</label>
                  <input type="text" required className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-ukm-blue outline-none shadow-sm"
                    value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Department</label>
                  <select className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-ukm-blue outline-none shadow-sm"
                    value={newCourse.department} onChange={e => setNewCourse({...newCourse, department: e.target.value})}>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <textarea className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-ukm-blue outline-none shadow-sm resize-none h-24"
                    value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Instructors</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border border-slate-200 rounded-lg p-4 bg-slate-50 max-h-48 overflow-y-auto">
                    {professors.map(prof => (
                      <label key={prof.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-md transition-colors border border-transparent hover:border-slate-200">
                        <input type="checkbox" checked={newCourse.professorIds.includes(prof.id)} onChange={() => toggleProfessorSelection(prof.id)}
                          className="w-4 h-4 text-ukm-blue rounded focus:ring-ukm-blue" />
                        <span className="text-sm font-medium text-slate-700 truncate">{prof.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-ukm-blue text-white rounded-lg font-bold hover:bg-blue-900 transition-colors shadow-sm">
                Save Course
              </button>
            </form>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
                professors={professors}
                reviews={reviews}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white/50 backdrop-blur-sm border border-slate-200 border-dashed rounded-2xl">
              <p className="text-slate-500 font-medium">No courses found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};