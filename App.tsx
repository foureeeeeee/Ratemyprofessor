
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { CardNav } from './components/CardNav';
import { Hero } from './components/Hero';
import { ProfessorList } from './components/ProfessorList';
import { CourseList } from './components/CourseList';
import { CourseDetails } from './components/CourseDetails';
import { ProfessorDetails } from './components/ProfessorDetails';
import { Dashboard } from './components/Dashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentLoginModal } from './components/StudentLoginModal';
import { MOCK_PROFESSORS, MOCK_REVIEWS, MOCK_COURSES } from './constants';
import { Professor, Review, Course, User, Report } from './types';
import { Loader2, BookOpenCheck, X, Shield, FileText } from 'lucide-react';
import { supabase } from './services/supabase';

const STATIC_NAV_ITEMS = [
  {
    label: "Academic",
    bgColor: "#003366", // Navy Blue
    textColor: "#ffffff",
    links: [
      { label: "Faculty Directory", href: "/professors", ariaLabel: "Faculty Directory" },
      { label: "Courses Catalog", href: "/courses", ariaLabel: "Courses Catalog" }
    ]
  },
  {
    label: "Personal",
    bgColor: "#1e293b", // Slate-800
    textColor: "#ffffff",
    links: [
      { label: "My Learning", href: "/my-courses", ariaLabel: "My Learning Dashboard" },
      { label: "Analytics", href: "/dashboard", ariaLabel: "System Analytics" }
    ]
  },
  {
    label: "Administrator",
    bgColor: "#990000", // Classic Academic Red
    textColor: "#ffffff",
    links: [
      { label: "Admin Console", href: "/admin/login", ariaLabel: "Administrator Login" }
    ]
  }
];

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
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [professorsRes, coursesRes, reviewsRes, reportsRes] = await Promise.all([
          supabase.from('professors').select('*'),
          supabase.from('courses').select('*'),
          supabase.from('reviews').select('*'),
          supabase.from('reports').select('*')
        ]);

        if (professorsRes.error) throw professorsRes.error;
        if (coursesRes.error) throw coursesRes.error;
        if (reviewsRes.error) throw reviewsRes.error;
        if (reportsRes.error) throw reportsRes.error;

        // Map snake_case to camelCase
        const mappedProfessors = professorsRes.data.map(p => ({
          id: p.id,
          name: p.name,
          department: p.department,
          title: p.title,
          image: p.image,
          averageRating: p.average_rating,
          reviewCount: p.review_count
        }));

        const mappedCourses = coursesRes.data.map(c => ({
          id: c.id,
          code: c.code,
          name: c.name,
          department: c.department,
          description: c.description,
          professorIds: c.professor_ids || []
        }));

        const mappedReviews = reviewsRes.data.map(r => ({
          id: r.id,
          professorId: r.professor_id,
          studentName: r.student_name,
          rating: r.rating,
          difficulty: r.difficulty,
          tags: r.tags || [],
          comment: r.comment,
          courseCode: r.course_code,
          date: r.date,
          clarity: r.clarity,
          fairness: r.fairness,
          communication: r.communication,
          expertise: r.expertise,
          approachability: r.approachability,
          forCredit: r.for_credit,
          attendance: r.attendance,
          wouldTakeAgain: r.would_take_again,
          grade: r.grade,
          textbookUsed: r.textbook_used,
          verified: r.verified
        }));

        const mappedReports = reportsRes.data.map(r => ({
          id: r.id,
          targetId: r.target_id,
          targetType: r.target_type,
          reason: r.reason,
          details: r.details,
          status: r.status,
          timestamp: r.timestamp,
          reporterEmail: r.reporter_email
        }));

        // Auto-seed Supabase database if it is empty, to prevent foreign key errors when adding new data
        if (mappedProfessors.length === 0) {
          console.log("Seeding Supabase with initial mock data...");
          try {
            await supabase.from('professors').insert(MOCK_PROFESSORS.map(p => ({
              id: p.id,
              name: p.name,
              department: p.department,
              title: p.title,
              image: p.image,
              average_rating: p.averageRating,
              review_count: p.reviewCount
            })));
            
            await supabase.from('courses').insert(MOCK_COURSES.map(c => ({
              id: c.id,
              code: c.code,
              name: c.name,
              department: c.department,
              description: c.description,
              professor_ids: c.professorIds
            })));
            
            await supabase.from('reviews').insert(MOCK_REVIEWS.map(r => ({
              id: r.id,
              professor_id: r.professorId,
              student_name: r.studentName,
              rating: r.rating,
              difficulty: r.difficulty,
              tags: r.tags,
              comment: r.comment,
              course_code: r.courseCode,
              date: r.date,
              clarity: r.clarity,
              fairness: r.fairness,
              communication: r.communication,
              expertise: r.expertise,
              approachability: r.approachability,
              for_credit: r.forCredit,
              attendance: r.attendance,
              would_take_again: r.wouldTakeAgain,
              grade: r.grade,
              textbook_used: r.textbookUsed,
              verified: r.verified
            })));
          } catch (seedError) {
            console.error("Error auto-seeding database:", seedError);
          }
        }

        // Merge mock data with Supabase data to preserve initial mock state alongside new user-added data
        const mergedProfessors = [
          ...MOCK_PROFESSORS.filter(m => !mappedProfessors.some(p => p.id === m.id)), 
          ...mappedProfessors
        ];
        
        const mergedCourses = [
          ...MOCK_COURSES.filter(m => !mappedCourses.some(c => c.id === m.id)), 
          ...mappedCourses
        ];
        
        const mergedReviews = [
          ...MOCK_REVIEWS.filter(m => !mappedReviews.some(r => r.id === m.id)), 
          ...mappedReviews
        ];

        setProfessors(mergedProfessors);
        setCourses(mergedCourses);
        setReviews(mergedReviews);
        setReports(mappedReports);
      } catch (error) {
        console.error("Error fetching from Supabase:", error);
        // Fallback to mock data on error
        setProfessors(MOCK_PROFESSORS);
        setCourses(MOCK_COURSES);
        setReviews(MOCK_REVIEWS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    // Set up Supabase Auth Listener for Magic Link Logins
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        handleStudentLogin(session.user.email);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        handleStudentLogin(session.user.email);
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
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

  const handleAddReview = async (newReview: Review) => {
    setReviews(prev => [newReview, ...prev]);
    try {
      const { error } = await supabase.from('reviews').insert({
        id: newReview.id,
        professor_id: newReview.professorId,
        student_name: newReview.studentName,
        rating: newReview.rating,
        difficulty: newReview.difficulty,
        tags: newReview.tags,
        comment: newReview.comment,
        course_code: newReview.courseCode,
        date: newReview.date,
        clarity: newReview.clarity,
        fairness: newReview.fairness,
        communication: newReview.communication,
        expertise: newReview.expertise,
        approachability: newReview.approachability,
        for_credit: newReview.forCredit,
        attendance: newReview.attendance,
        would_take_again: newReview.wouldTakeAgain,
        grade: newReview.grade,
        textbook_used: newReview.textbookUsed,
        verified: newReview.verified
      });
      if (error) {
        console.error("Supabase insert review error:", error);
        setReviews(prev => prev.filter(r => r.id !== newReview.id));
      }
    } catch (error) {
      console.error("Error adding review:", error);
      setReviews(prev => prev.filter(r => r.id !== newReview.id));
    }
  };

  const handleDeleteReview = async (id: string) => {
    const reviewToDelete = reviews.find(r => r.id === id);
    setReviews(prev => prev.filter(r => r.id !== id));
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) {
        console.error("Supabase delete review error:", error);
        if (reviewToDelete) setReviews(prev => [reviewToDelete, ...prev]);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      if (reviewToDelete) setReviews(prev => [reviewToDelete, ...prev]);
    }
  };

  const handleAddProfessor = async (newProfessor: Professor) => {
    setProfessors(prev => [newProfessor, ...prev]);
    try {
      const { error } = await supabase.from('professors').insert({
        id: newProfessor.id,
        name: newProfessor.name,
        department: newProfessor.department,
        title: newProfessor.title,
        image: newProfessor.image,
        average_rating: newProfessor.averageRating,
        review_count: newProfessor.reviewCount
      });
      if (error) {
        console.error("Supabase insert professor error:", error);
        setProfessors(prev => prev.filter(p => p.id !== newProfessor.id));
      }
    } catch (error) {
      console.error("Error adding professor:", error);
      setProfessors(prev => prev.filter(p => p.id !== newProfessor.id));
    }
  };

  const handleUpdateProfessor = async (updatedProfessor: Professor) => {
    const originalProfessor = professors.find(p => p.id === updatedProfessor.id);
    setProfessors(prev => prev.map(p => p.id === updatedProfessor.id ? updatedProfessor : p));
    try {
      const { error } = await supabase.from('professors').update({
        name: updatedProfessor.name,
        department: updatedProfessor.department,
        title: updatedProfessor.title,
        image: updatedProfessor.image,
        average_rating: updatedProfessor.averageRating,
        review_count: updatedProfessor.reviewCount
      }).eq('id', updatedProfessor.id);
      if (error) {
        console.error("Supabase update professor error:", error);
        if (originalProfessor) setProfessors(prev => prev.map(p => p.id === updatedProfessor.id ? originalProfessor : p));
      }
    } catch (error) {
      console.error("Error updating professor:", error);
      if (originalProfessor) setProfessors(prev => prev.map(p => p.id === updatedProfessor.id ? originalProfessor : p));
    }
  };

  const handleDeleteProfessor = async (id: string) => {
    const professorToDelete = professors.find(p => p.id === id);
    setProfessors(prev => prev.filter(p => p.id !== id));
    try {
      const { error } = await supabase.from('professors').delete().eq('id', id);
      if (error) {
        console.error("Supabase delete professor error:", error);
        if (professorToDelete) setProfessors(prev => [professorToDelete, ...prev]);
      }
    } catch (error) {
      console.error("Error deleting professor:", error);
      if (professorToDelete) setProfessors(prev => [professorToDelete, ...prev]);
    }
  };

  const handleAddCourse = async (newCourse: Course) => {
    setCourses(prev => [newCourse, ...prev]);
    try {
      const { error } = await supabase.from('courses').insert({
        id: newCourse.id,
        code: newCourse.code,
        name: newCourse.name,
        department: newCourse.department,
        description: newCourse.description,
        professor_ids: newCourse.professorIds
      });
      if (error) {
        console.error("Supabase insert course error:", error);
        setCourses(prev => prev.filter(c => c.id !== newCourse.id));
      }
    } catch (error) {
      console.error("Error adding course:", error);
      setCourses(prev => prev.filter(c => c.id !== newCourse.id));
    }
  };

  const handleUpdateCourse = async (updatedCourse: Course) => {
    const originalCourse = courses.find(c => c.id === updatedCourse.id);
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    try {
      const { error } = await supabase.from('courses').update({
        code: updatedCourse.code,
        name: updatedCourse.name,
        department: updatedCourse.department,
        description: updatedCourse.description,
        professor_ids: updatedCourse.professorIds
      }).eq('id', updatedCourse.id);
      if (error) {
        console.error("Supabase update course error:", error);
        if (originalCourse) setCourses(prev => prev.map(c => c.id === updatedCourse.id ? originalCourse : c));
      }
    } catch (error) {
      console.error("Error updating course:", error);
      if (originalCourse) setCourses(prev => prev.map(c => c.id === updatedCourse.id ? originalCourse : c));
    }
  };

  const handleDeleteCourse = async (id: string) => {
    const courseToDelete = courses.find(c => c.id === id);
    setCourses(prev => prev.filter(c => c.id !== id));
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) {
        console.error("Supabase delete course error:", error);
        if (courseToDelete) setCourses(prev => [courseToDelete, ...prev]);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      if (courseToDelete) setCourses(prev => [courseToDelete, ...prev]);
    }
  };

  const handleSuggestProfessor = async (newProfessor: Professor) => {
    const newReport: Report = {
      id: crypto.randomUUID(),
      targetId: newProfessor.id,
      targetType: 'new_professor',
      reason: 'User Suggested Professor',
      details: JSON.stringify(newProfessor),
      status: 'pending',
      timestamp: new Date().toISOString(),
      reporterEmail: currentUser?.email
    };
    
    setReports(prev => [newReport, ...prev]);
    try {
      const { error } = await supabase.from('reports').insert({
        id: newReport.id,
        target_id: newReport.targetId,
        target_type: newReport.targetType,
        reason: newReport.reason,
        details: newReport.details,
        status: newReport.status,
        timestamp: newReport.timestamp,
        reporter_email: newReport.reporterEmail
      });
      if (error) {
        console.error("Supabase insert report error:", error);
        setReports(prev => prev.filter(r => r.id !== newReport.id));
      } else {
        alert("Thank you! Your professor suggestion has been submitted for admin approval.");
      }
    } catch (error) {
      console.error("Error adding report:", error);
      setReports(prev => prev.filter(r => r.id !== newReport.id));
    }
  };

  const handleSuggestCourse = async (newCourse: Course) => {
    const newReport: Report = {
      id: crypto.randomUUID(),
      targetId: newCourse.id,
      targetType: 'new_course',
      reason: 'User Suggested Course',
      details: JSON.stringify(newCourse),
      status: 'pending',
      timestamp: new Date().toISOString(),
      reporterEmail: currentUser?.email
    };
    
    setReports(prev => [newReport, ...prev]);
    try {
      const { error } = await supabase.from('reports').insert({
        id: newReport.id,
        target_id: newReport.targetId,
        target_type: newReport.targetType,
        reason: newReport.reason,
        details: newReport.details,
        status: newReport.status,
        timestamp: newReport.timestamp,
        reporter_email: newReport.reporterEmail
      });
      if (error) {
        console.error("Supabase insert report error:", error);
        setReports(prev => prev.filter(r => r.id !== newReport.id));
      } else {
        alert("Thank you! Your course suggestion has been submitted for admin approval.");
      }
    } catch (error) {
      console.error("Error adding report:", error);
      setReports(prev => prev.filter(r => r.id !== newReport.id));
    }
  };
  const handleReportContent = async (report: Omit<Report, 'id' | 'status' | 'timestamp'>) => {
    const newReport: Report = {
      ...report,
      id: crypto.randomUUID(), // Use UUID for Supabase
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    setReports(prev => [newReport, ...prev]);
    try {
      const { error } = await supabase.from('reports').insert({
        id: newReport.id,
        target_id: newReport.targetId,
        target_type: newReport.targetType,
        reason: newReport.reason,
        details: newReport.details,
        status: newReport.status,
        timestamp: newReport.timestamp,
        reporter_email: newReport.reporterEmail
      });
      if (error) {
        console.error("Supabase insert report error:", error);
        setReports(prev => prev.filter(r => r.id !== newReport.id));
      }
    } catch (error) {
      console.error("Error adding report:", error);
      setReports(prev => prev.filter(r => r.id !== newReport.id));
    }
  };

  const handleResolveReport = async (reportId: string, action: 'dismiss' | 'delete' | 'approve_new', adminMessage?: string) => {
    const report = reports.find(r => r.id === reportId);
    
    if (report && action === 'approve_new') {
      try {
        const itemData = JSON.parse(report.details);
        if (report.targetType === 'new_professor') {
          await handleAddProfessor(itemData);
        } else if (report.targetType === 'new_course') {
          await handleAddCourse(itemData);
        }
      } catch (err) {
        console.error("Error adding approved item:", err);
      }
    }
    
    // Notify User
    if (report && report.reporterEmail) {
      let resolution = '';
      if (action === 'dismiss') resolution = 'Approved (Report Dismissed)';
      else if (action === 'delete') resolution = 'Rejected (Content Removed)';
      else if (action === 'approve_new') resolution = 'Approved (Suggestion Accepted)';
      
      const subject = encodeURIComponent(`Update on your submission regarding ${report.targetType}`);
      let bodyText = `Your submission has been reviewed by our administration team.\n\n`;
      bodyText += `Resolution: ${resolution}\n`;
      
      if (adminMessage) {
        bodyText += `\nMessage from Admin:\n"${adminMessage}"\n`;
      }
      
      bodyText += `\nThank you for helping keep our community safe and accurate.`;
      
      const body = encodeURIComponent(bodyText);
      
      // Open default email client with pre-filled content
      window.location.href = `mailto:${report.reporterEmail}?subject=${subject}&body=${body}`;
    }

    const newStatus = action === 'dismiss' ? 'dismissed' : 'resolved';
    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return { ...r, status: newStatus };
      }
      return r;
    }));

    try {
      await supabase.from('reports').update({ status: newStatus }).eq('id', reportId);
    } catch (error) {
      console.error("Error updating report:", error);
    }
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

  const handleStudentLogout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [navbarTheme, setNavbarTheme] = useState<'light' | 'dark'>('light');
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    const interval = setInterval(handleHashChange, 100);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      clearInterval(interval);
    };
  }, []);

  const isHomePage = !currentHash || currentHash === '#/' || currentHash === '#';

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
      <div className={`${isHomePage ? 'h-screen overflow-hidden' : 'min-h-screen'} flex flex-col font-sans text-slate-800 ${isHomePage && navbarTheme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'} relative animate-fade-in transition-colors duration-500`}>
        
        {/* Blur overlay for the body of the page when the menu is expanded */}
        <div 
          className={`fixed inset-0 bg-slate-950/30 backdrop-blur-sm transition-opacity duration-300 z-[90] will-change-[opacity,backdrop-filter] ${
            isNavExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        />

        <CardNav 
          currentUser={currentUser} 
          onTriggerLogin={handleRequireLogin} 
          onLogout={handleStudentLogout}
          items={STATIC_NAV_ITEMS}
          baseColor={currentUser ? "#0f172a" : (navbarTheme === 'dark' ? "#020617" : "#ffffff")}
          menuColor={currentUser ? "#ffffff" : (navbarTheme === 'dark' ? "#ffffff" : "#1e293b")}
          buttonBgColor={currentUser ? "#334155" : (navbarTheme === 'dark' ? "#1e293b" : "#003366")}
          buttonTextColor="#ffffff"
          ease="power3.out"
          onExpandedChange={setIsNavExpanded}
        />
        
        <main className={`flex-grow relative z-10 pt-28 transition-colors duration-500 ${isHomePage && navbarTheme === 'dark' ? 'bg-slate-950 text-white' : 'bg-transparent text-slate-800'}`}>
          <Routes>
            <Route path="/" element={
              <Hero 
                professors={professors} 
                courses={courses} 
                onNavbarThemeChange={setNavbarTheme} 
                onOpenPrivacy={() => setPolicyType('privacy')}
                onOpenTerms={() => setPolicyType('terms')}
              />
            } />
            <Route 
              path="/professors" 
              element={
                <ProfessorList 
                  professors={professors} 
                  reviews={reviews} 
                  onAddProfessor={handleSuggestProfessor}
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
                  onAddCourse={handleSuggestCourse}
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
                  courses={courses}
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
            <Route 
              path="/my-courses" 
              element={<StudentDashboard currentUser={currentUser} courses={courses} reviews={reviews} professors={professors} />} 
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
        
        <AnimatePresence>
          {isLoginModalOpen && (
            <StudentLoginModal 
              onClose={() => setIsLoginModalOpen(false)}
              onLogin={handleStudentLogin}
            />
          )}

          {policyType && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
              >
                
                {/* Modal Header */}
                <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                      {policyType === 'privacy' ? <Shield className="w-6 h-6 animate-pulse" /> : <FileText className="w-6 h-6 animate-pulse" />}
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-slate-900">
                        {policyType === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Last updated: July 2026</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setPolicyType(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto font-sans text-sm text-slate-600 leading-relaxed space-y-6">
                  {policyType === 'privacy' ? (
                    <>
                      <div>
                        <h4 className="font-bold text-slate-800 text-base mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
                          1. verified Siswa identity protection
                        </h4>
                        <p className="pl-3.5">
                          Our system strictly uses <strong>siswa.ukm.edu.my</strong> account verification to authenticate active students. We do not store your name or ID alongside your published reviews. We believe in providing an honest space where constructive comments are fully anonymous to preserve academic review integrity.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-base mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
                          2. Data Security & Storage
                        </h4>
                        <p className="pl-3.5">
                          Your student email is encrypted and securely stored on our server database only for verification constraints. Reviews, courses, and department metrics are kept up to date using secure Cloud SQL infrastructures. We will never sell, lease, or distribute student telemetry data to external third parties.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-base mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
                          3. Telemetry and Cookies
                        </h4>
                        <p className="pl-3.5">
                          We use local session tokens to persist your verified student session so you do not need to sign in every time. We do not use persistent tracking cookies, ad networks, or external analytics integrations.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-base mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
                          4. Your Rights
                        </h4>
                        <p className="pl-3.5">
                          You have full control over the reviews you post. At any time, you can edit, update, or remove your academic reviews from your personal 'My Learning' dashboard.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h4 className="font-bold text-slate-800 text-base mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-6 bg-amber-600 rounded-full inline-block"></span>
                          1. Acceptable Usage Guidelines
                        </h4>
                        <p className="pl-3.5">
                          The UKM Rate My Professor is a peer platform designed for constructive educational evaluations. Users are required to submit reviews that are factual, respectful, and educational. Vulgarity, personal abuse, or targeted harassment of any member of the university community is strictly prohibited.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-base mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-6 bg-amber-600 rounded-full inline-block"></span>
                          2. Review Moderation & Deletions
                        </h4>
                        <p className="pl-3.5">
                          To maintain high-quality academic data, our student moderators and administrators reserve the right to review, edit, or delete any content that contains false claims, hate speech, or violates Universiti Kebangsaan Malaysia student code of ethics.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-base mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-6 bg-amber-600 rounded-full inline-block"></span>
                          3. Honest Rating Limitation
                        </h4>
                        <p className="pl-3.5">
                          You may only review courses you have personally attended or instructors who have taught you. Artificially manipulating rankings using multi-account automation or malicious spamming is a direct breach of these terms.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-base mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-6 bg-amber-600 rounded-full inline-block"></span>
                          4. Academic Disclaimer
                        </h4>
                        <p className="pl-3.5">
                          Ratings, feedback paragraphs, and department recommendations represent the subjective, compiled opinions of UKM students and do not represent official statements or policies of the Universiti Kebangsaan Malaysia administration.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-base mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-6 bg-amber-600 rounded-full inline-block"></span>
                          5. Simulated Data & Research Analytics
                        </h4>
                        <p className="pl-3.5 text-slate-600 leading-relaxed">
                          The statistical data and analytics presented within the &quot;Why Rate My Professor Matters&quot; interactive visualizations are simulated based on interviews, questionnaires, and online research conducted to showcase general educational trends and platform impact.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex justify-end shrink-0">
                  <button
                    onClick={() => setPolicyType(null)}
                    className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all focus:ring-4 focus:ring-slate-900/10 shadow-sm text-sm"
                  >
                    Acknowledge & Close
                  </button>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isHomePage && (
          <footer className="bg-white border-t border-slate-200 text-slate-500 py-8 relative z-10">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                 <p className="font-serif font-bold text-slate-900">Universiti Kebangsaan Malaysia</p>
                 <p className="text-xs mt-1">Management Information System &copy; 2025</p>
              </div>
              <div className="text-xs">
                <span onClick={() => setPolicyType('privacy')} className="hover:text-blue-700 cursor-pointer transition-colors">Privacy Policy</span>
                <span className="mx-2">•</span>
                <span onClick={() => setPolicyType('terms')} className="hover:text-blue-700 cursor-pointer transition-colors">Terms of Service</span>
              </div>
            </div>
          </footer>
        )}
      </div>
    </HashRouter>
  );
}
