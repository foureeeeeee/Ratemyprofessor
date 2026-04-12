import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Course, Professor, Review, User } from '../types';
import { CourseCard } from './CourseCard';
import { DEPARTMENTS } from '../constants';
import { Filter, Search, Plus, X, Database } from 'lucide-react';

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
    const timer = setTimeout(() => setIsLoading(false), 600);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-terminal-black text-terminal-light">
        <div className="text-4xl animate-pulse mb-4">[ .... ]</div>
        <p className="text-sm font-bold text-terminal-gray">LOADING_COURSES...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terminal-black p-4 md:p-8">
      
      {/* Header */}
      <div className="border-b-2 border-terminal-light mb-8 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-terminal-light uppercase tracking-tighter">
            Course_Index
          </h2>
          <p className="text-terminal-gray mt-2 font-mono text-sm">
            // Accessing {courses.length} curriculum files...
          </p>
        </div>
        <div className="hidden md:block text-terminal-accent font-bold text-4xl opacity-20">
          C++
        </div>
      </div>
      
      {/* Toolbar */}
      <div className={`sticky top-20 z-30 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className={`bg-terminal-black border-2 border-terminal-gray p-2 flex flex-col lg:flex-row gap-4 ${isScrolled ? 'border-terminal-light shadow-[4px_4px_0_#fff]' : ''}`}>
          
          <div className="flex-grow relative">
             <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-accent">
                <Database className="w-4 h-4" />
             </div>
             <input 
                type="text" 
                placeholder="SEARCH_CODE_OR_NAME..."
                className="w-full pl-10 pr-4 py-2 bg-terminal-dark border border-terminal-gray text-terminal-light focus:border-terminal-accent focus:ring-0 outline-none uppercase placeholder:text-terminal-gray"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <select 
              className="px-4 py-2 bg-terminal-dark border border-terminal-gray text-terminal-light focus:border-terminal-accent outline-none uppercase cursor-pointer"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="All">ALL_DEPTS</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select 
              className="px-4 py-2 bg-terminal-dark border border-terminal-gray text-terminal-light focus:border-terminal-accent outline-none uppercase cursor-pointer"
              value={selectedProfId}
              onChange={(e) => setSelectedProfId(e.target.value)}
            >
              <option value="All">ALL_INSTRUCTORS</option>
              {professors.map(prof => (
                <option key={prof.id} value={prof.id}>{prof.name}</option>
              ))}
            </select>

            {onAddCourse && (
              <button 
                onClick={handleAddClick}
                className={`px-4 py-2 font-bold uppercase border-2 transition-all whitespace-nowrap ${
                  showAddForm 
                    ? "bg-terminal-light text-terminal-black border-terminal-light" 
                    : "bg-terminal-black text-terminal-accent border-terminal-accent hover:bg-terminal-accent hover:text-terminal-black"
                }`}
              >
                {showAddForm ? "CLOSE" : "NEW_COURSE"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && currentUser && (
        <div className="border-2 border-terminal-accent p-6 mb-12 bg-terminal-dark relative">
          <div className="absolute top-0 left-0 bg-terminal-accent text-terminal-black px-2 py-1 text-xs font-bold uppercase">
            NEW_COURSE_ENTRY
          </div>
          <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-terminal-gray uppercase">Course Code</label>
                <input type="text" required className="w-full p-2 bg-terminal-black border border-terminal-gray text-terminal-light focus:border-terminal-accent outline-none" 
                  value={newCourse.code} onChange={e => setNewCourse({...newCourse, code: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-terminal-gray uppercase">Course Name</label>
                <input type="text" required className="w-full p-2 bg-terminal-black border border-terminal-gray text-terminal-light focus:border-terminal-accent outline-none"
                  value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-terminal-gray uppercase">Department</label>
                <select className="w-full p-2 bg-terminal-black border border-terminal-gray text-terminal-light focus:border-terminal-accent outline-none"
                  value={newCourse.department} onChange={e => setNewCourse({...newCourse, department: e.target.value})}>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs text-terminal-gray uppercase">Description</label>
                <textarea className="w-full p-2 bg-terminal-black border border-terminal-gray text-terminal-light focus:border-terminal-accent outline-none resize-none h-20"
                  value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs text-terminal-gray uppercase">Instructors</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border border-terminal-gray p-2 bg-terminal-black max-h-40 overflow-y-auto">
                  {professors.map(prof => (
                    <label key={prof.id} className="flex items-center gap-2 cursor-pointer hover:bg-terminal-gray/20 p-1">
                      <input type="checkbox" checked={newCourse.professorIds.includes(prof.id)} onChange={() => toggleProfessorSelection(prof.id)}
                        className="accent-terminal-accent bg-terminal-black border-terminal-gray" />
                      <span className="text-xs uppercase truncate">{prof.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <button type="submit" className="w-full py-2 bg-terminal-accent text-terminal-black font-bold uppercase hover:opacity-90">
              [ INITIALIZE_COURSE ]
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
          <div className="col-span-full py-20 text-center border-2 border-dashed border-terminal-gray">
            <p className="text-terminal-gray uppercase font-bold">ERR: COURSE_NOT_FOUND</p>
          </div>
        )}
      </div>
    </div>
  );
};