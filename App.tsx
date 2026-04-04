
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProfessorList } from './components/ProfessorList';
import { CourseList } from './components/CourseList';
import { CourseDetails } from './components/CourseDetails';
import { ProfessorDetails } from './components/ProfessorDetails';
import { Dashboard } from './components/Dashboard';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
// import { ParticlesBackground } from './components/ParticlesBackground'; // Removed for academic look
import { StudentLoginModal } from './components/StudentLoginModal';
import { MOCK_PROFESSORS, MOCK_REVIEWS, MOCK_COURSES } from './constants';
import { Professor, Review, Course, User, Report } from './types';
import { Loader2, BookOpenCheck } from 'lucide-react';

export default function App() {
  // Centralized state to simulate a database
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reports, setReports] = useState<Report[]>([]); // New Reports State
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Simulate fetching data from an API
  useEffect(() => {
    const fetchData = async () => {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 800));
      setProfessors(MOCK_PROFESSORS);
      setReviews(MOCK_REVIEWS);
      setCourses(MOCK_COURSES);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Recalculate professor ratings when reviews change
  useEffect(() => {
    if (professors.length === 0) return;

    setProfessors(prevProfs => {
      const updated = prevProfs.map(prof => {
        const profReviews = reviews.filter(r => r.professorId === prof.id);
        if (profReviews.length === 0) return prof;

        const avg = profReviews.reduce((acc, curr) => acc + curr.rating, 0) / profReviews.length;
        const newAvg = parseFloat(avg.toFixed(1));
        
        // Only return new object if data changed
        if (prof.averageRating === newAvg && prof.reviewCount === profReviews.length) {
          return prof;
        }

        return {
          ...prof,
          averageRating: newAvg,
          reviewCount: profReviews.length
        };
      });
      
      const hasChanges = updated.some((p, i) => p !== prevProfs[i]);
      return hasChanges ? updated : prevProfs;
    });
  }, [reviews]);

  // --- CRUD Handlers ---

  const handleAddReview = (newReview: Review) => {
    setReviews(prev => [newReview, ...prev]);
  };

  const handleDeleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const handleAddProfessor = (newProfessor: Professor) => {
    setProfessors(prev => [newProfessor, ...prev]);
  };

  const handleUpdateProfessor = (updatedProfessor: Professor) => {
    setProfessors(prev => prev.map(p => p.id === updatedProfessor.id ? updatedProfessor : p));
  };

  const handleDeleteProfessor = (id: string) => {
    setProfessors(prev => prev.filter(p => p.id !== id));
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => [newCourse, ...prev]);
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  // --- Reporting Handlers ---
  const handleReportContent = (report: Omit<Report, 'id' | 'status' | 'timestamp'>) => {
    const newReport: Report = {
      ...report,
      id: Date.now().toString(),
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    setReports(prev => [newReport, ...prev]);
  };

  const handleResolveReport = (reportId: string, action: 'dismiss' | 'delete', adminMessage?: string) => {
    const report = reports.find(r => r.id === reportId);
    
    // Notify User
    if (report && report.reporterEmail) {
      const resolution = action === 'dismiss' ? 'Approved (Report Dismissed)' : 'Rejected (Content Removed)';
      
      let emailBody = `[SYSTEM NOTIFICATION]\n\nTo: ${report.reporterEmail}\nSubject: Update on your report regarding ${report.targetType}\n\n`;
      emailBody += `Your report has been reviewed by our administration team.\n\n`;
      emailBody += `Resolution: ${resolution}\n`;
      
      if (adminMessage) {
        emailBody += `\nMessage from Admin:\n"${adminMessage}"\n`;
      }
      
      emailBody += `\nThank you for helping keep our community safe and accurate.`;
      
      // Simulate Email/Notification
      alert(emailBody);
    }

    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return { ...r, status: action === 'dismiss' ? 'dismissed' : 'resolved' };
      }
      return r;
    }));
  };

  // --- Auth Handlers ---
  
  const handleLogin = () => setIsAdmin(true);
  const handleLogout = () => setIsAdmin(false);

  const handleStudentLogin = (email: string) => {
    const namePart = email.split('@')[0];
    const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    
    setCurrentUser({
      name: name,
      email: email,
      isVerified: true
    });
    setIsLoginModalOpen(false);
  };

  const handleRequireLogin = () => {
    setIsLoginModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 font-sans">
        <div className="relative z-10 flex flex-col items-center">
          <BookOpenCheck className="w-16 h-16 text-blue-800 mb-6 animate-pulse" />
          <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">UKM Academic Portal</h1>
          <p className="text-sm text-slate-500 font-medium">Loading System Data...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50 relative">
        
        <Navbar currentUser={currentUser} onTriggerLogin={handleRequireLogin} />
        
        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<Hero professors={professors} courses={courses} />} />
            <Route 
              path="/professors" 
              element={
                <ProfessorList 
                  professors={professors} 
                  reviews={reviews} 
                  onAddProfessor={handleAddProfessor}
                  currentUser={currentUser}
                  onRequireLogin={handleRequireLogin}
                />
              } 
            />
            <Route 
              path="/courses" 
              element={
                <CourseList 
                  courses={courses}
                  professors={professors} 
                  reviews={reviews} 
                  onAddCourse={handleAddCourse}
                  currentUser={currentUser}
                  onRequireLogin={handleRequireLogin}
                />
              } 
            />
            <Route 
              path="/courses/:id" 
              element={
                <CourseDetails 
                  courses={courses}
                  professors={professors} 
                  reviews={reviews}
                  onAddReview={handleAddReview} 
                  currentUser={currentUser}
                  onRequireLogin={handleRequireLogin}
                  onReport={handleReportContent}
                />
              } 
            />
            <Route 
              path="/professors/:id" 
              element={
                <ProfessorDetails 
                  professors={professors} 
                  reviews={reviews} 
                  onAddReview={handleAddReview}
                  currentUser={currentUser}
                  onRequireLogin={handleRequireLogin}
                  onReport={handleReportContent}
                />
              } 
            />
            <Route 
              path="/dashboard" 
              element={<Dashboard professors={professors} reviews={reviews} />} 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/login" 
              element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin onLogin={handleLogin} />} 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                isAdmin ? (
                  <AdminDashboard 
                    professors={professors}
                    courses={courses}
                    reviews={reviews}
                    reports={reports}
                    onAddProfessor={handleAddProfessor}
                    onUpdateProfessor={handleUpdateProfessor}
                    onDeleteProfessor={handleDeleteProfessor}
                    onAddCourse={handleAddCourse}
                    onUpdateCourse={handleUpdateCourse}
                    onDeleteCourse={handleDeleteCourse}
                    onDeleteReview={handleDeleteReview}
                    onResolveReport={handleResolveReport}
                    onLogout={handleLogout}
                  />
                ) : (
                  <Navigate to="/admin/login" replace />
                )
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {isLoginModalOpen && (
          <StudentLoginModal 
            onClose={() => setIsLoginModalOpen(false)}
            onLogin={handleStudentLogin}
          />
        )}

        <footer className="bg-white border-t border-slate-200 text-slate-500 py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
               <p className="font-serif font-bold text-slate-900">Universiti Kebangsaan Malaysia</p>
               <p className="text-xs mt-1">Management Information System &copy; 2025</p>
            </div>
            <div className="text-xs">
              <span className="hover:text-blue-700 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="mx-2">•</span>
              <span className="hover:text-blue-700 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}
