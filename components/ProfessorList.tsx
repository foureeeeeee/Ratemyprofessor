import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Professor, Review, User } from '../types';
import { ProfessorCard } from './ProfessorCard';
import { DEPARTMENTS } from '../constants';
import { Search, Plus, X, Terminal } from 'lucide-react';

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
    const timer = setTimeout(() => setIsLoading(false), 600);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-terminal-black text-terminal-light">
        <div className="text-4xl animate-spin mb-4">|/-\|</div>
        <p className="text-sm font-bold text-terminal-gray">LOADING_DIRECTORY...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terminal-black p-4 md:p-8">
      
      {/* Header */}
      <div className="border-b-2 border-terminal-light mb-8 pb-4">
        <h2 className="text-3xl md:text-5xl font-bold text-terminal-light uppercase tracking-tighter">
          Faculty_Directory
        </h2>
        <p className="text-terminal-gray mt-2 font-mono text-sm">
          // Indexing {professors.length} academic records...
        </p>
      </div>
      
      {/* Toolbar */}
      <div className={`sticky top-20 z-30 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className={`bg-terminal-black border-2 border-terminal-gray p-2 flex flex-col md:flex-row gap-4 ${isScrolled ? 'border-terminal-light shadow-[4px_4px_0_#fff]' : ''}`}>
          
          <div className="flex-grow relative">
             <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-accent">
                <Terminal className="w-4 h-4" />
             </div>
             <input 
                type="text" 
                placeholder="QUERY DATABASE..."
                className="w-full pl-10 pr-4 py-2 bg-terminal-dark border border-terminal-gray text-terminal-light focus:border-terminal-accent focus:ring-0 outline-none uppercase placeholder:text-terminal-gray"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          
          <div className="flex gap-2">
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

            <button 
              onClick={handleAddClick}
              className={`px-4 py-2 font-bold uppercase border-2 transition-all ${
                showAddForm 
                  ? "bg-terminal-light text-terminal-black border-terminal-light" 
                  : "bg-terminal-black text-terminal-accent border-terminal-accent hover:bg-terminal-accent hover:text-terminal-black"
              }`}
            >
              {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && currentUser && (
        <div className="border-2 border-terminal-accent p-6 mb-12 bg-terminal-dark relative">
          <div className="absolute top-0 left-0 bg-terminal-accent text-terminal-black px-2 py-1 text-xs font-bold uppercase">
            NEW_ENTRY_FORM
          </div>
          <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-terminal-gray uppercase">Full Name</label>
                <input type="text" required className="w-full p-2 bg-terminal-black border border-terminal-gray text-terminal-light focus:border-terminal-accent outline-none" 
                  value={newProf.name} onChange={e => setNewProf({...newProf, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-terminal-gray uppercase">Department</label>
                <select className="w-full p-2 bg-terminal-black border border-terminal-gray text-terminal-light focus:border-terminal-accent outline-none"
                  value={newProf.department} onChange={e => setNewProf({...newProf, department: e.target.value})}>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-terminal-gray uppercase">Title</label>
                <input type="text" required className="w-full p-2 bg-terminal-black border border-terminal-gray text-terminal-light focus:border-terminal-accent outline-none"
                  value={newProf.title} onChange={e => setNewProf({...newProf, title: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-terminal-gray uppercase">Image URL</label>
                <input type="url" className="w-full p-2 bg-terminal-black border border-terminal-gray text-terminal-light focus:border-terminal-accent outline-none"
                  value={newProf.image} onChange={e => setNewProf({...newProf, image: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="w-full py-2 bg-terminal-accent text-terminal-black font-bold uppercase hover:opacity-90">
              [ COMMIT_TO_DB ]
            </button>
          </form>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {filteredProfessors.length > 0 ? (
          filteredProfessors.map(prof => (
            <ProfessorCard key={prof.id} professor={prof} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-terminal-gray">
            <p className="text-terminal-gray uppercase font-bold">ERR: NO_MATCHES_FOUND</p>
          </div>
        )}
      </div>
    </div>
  );
};