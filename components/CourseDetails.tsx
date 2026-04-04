import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Course, Professor, Review, User } from '../types';
import { Star, MessageSquare, BookOpen, ArrowLeft, Loader2, Users, Filter, CheckCircle, Book, Clock, BarChart3, Wand2, ShieldCheck, Flag } from 'lucide-react';
import { ReviewForm } from './ReviewForm';
import { summarizeCourseReviews } from '../services/geminiService';
import { ReportModal } from './ReportModal';

interface Props {
  courses: Course[];
  professors: Professor[];
  reviews: Review[];
  onAddReview?: (review: Review) => void;
  currentUser?: User | null;
  onRequireLogin: () => void;
  onReport: (report: any) => void;
}

export const CourseDetails: React.FC<Props> = ({ courses, professors, reviews, onAddReview, currentUser, onRequireLogin, onReport }) => {
  const { id } = useParams<{ id: string }>();
  const course = courses.find(c => c.id === id);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProfFilter, setSelectedProfFilter] = useState<string>("All");
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // AI Summary State
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  
  // Reporting State
  const [reportConfig, setReportConfig] = useState<{id: string, type: 'review'|'course', name?: string} | null>(null);

  // Simulate fetching details
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [id]);

  const courseReviews = useMemo(() => 
    reviews.filter(r => r.courseCode === course?.code).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [reviews, course]);

  const filteredReviews = useMemo(() => {
    if (selectedProfFilter === "All") return courseReviews;
    return courseReviews.filter(r => r.professorId === selectedProfFilter);
  }, [courseReviews, selectedProfFilter]);

  const teachingProfessors = useMemo(() => 
    professors.filter(p => course?.professorIds.includes(p.id)),
  [professors, course]);

  // Calculate Course Stats
  const stats = useMemo(() => {
    if (courseReviews.length === 0) return null;
    const count = courseReviews.length;
    
    const avgRating = courseReviews.reduce((acc, r) => acc + r.rating, 0) / count;
    const avgDifficulty = courseReviews.reduce((acc, r) => acc + (r.difficulty || 3), 0) / count;
    const wouldTakeAgainCount = courseReviews.filter(r => r.wouldTakeAgain).length;
    const textbookUsedCount = courseReviews.filter(r => r.textbookUsed).length;
    
    // Calculate most common attendance type
    const attendanceCounts = courseReviews.reduce<Record<string, number>>((acc, r) => {
      const att = r.attendance;
      acc[att] = (acc[att] || 0) + 1;
      return acc;
    }, {});
    
    const commonAttendance = Object.entries(attendanceCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || 'N/A';

    return {
      avgRating,
      avgDifficulty,
      wouldTakeAgainPct: Math.round((wouldTakeAgainCount / count) * 100),
      textbookUsedPct: Math.round((textbookUsedCount / count) * 100),
      commonAttendance,
      count
    };
  }, [courseReviews]);

  const handleGenerateSummary = async () => {
    if (!course) return;
    setLoadingAi(true);
    const summary = await summarizeCourseReviews(course.name, course.code, courseReviews);
    setAiSummary(summary);
    setLoadingAi(false);
  };

  const handleReviewClick = () => {
    if (!currentUser) {
      onRequireLogin();
    } else {
      setShowReviewForm(!showReviewForm);
    }
  };

  const openReportModal = (id: string, type: 'review' | 'course', name?: string) => {
    if (!currentUser) {
      onRequireLogin();
    } else {
      setReportConfig({ id, type, name });
    }
  };

  const handleReportSubmit = (reason: string, details: string) => {
    if (reportConfig) {
      onReport({
        targetId: reportConfig.id,
        targetType: reportConfig.type,
        reason,
        details,
        reporterEmail: currentUser?.email
      });
      setReportConfig(null);
      alert('Report submitted successfully. Administrators will review the content.');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen py-20 flex flex-col items-center justify-start">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Fetching course data...</p>
      </div>
    );
  }

  if (!course) {
    return <div className="p-10 text-center text-slate-500 font-medium">Course not found.</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/courses" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Course List
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative group/card">
          
           {/* Report Button for Course Info */}
           <button 
            onClick={() => openReportModal(course.id, 'course', course.name)}
            className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Report Inaccurate Information"
          >
            <Flag className="w-4 h-4" />
            <span className="hidden sm:inline">Report Issue</span>
          </button>

          <div className="p-8 border-b border-slate-100">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-bold uppercase tracking-wide">
                    {course.code}
                  </span>
                  <span className="text-slate-400 text-sm flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" /> {course.department}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{course.name}</h1>
                <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">{course.description}</p>
              </div>
              
              {stats && (
                <div className="flex gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center min-w-[120px]">
                    <div className="text-4xl font-extrabold text-slate-900 mb-1">{stats.avgRating.toFixed(1)}</div>
                    <div className="flex text-yellow-400 mb-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-4 h-4 ${star <= Math.round(stats.avgRating) ? 'fill-current' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Quality</span>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center min-w-[120px]">
                    <div className="text-4xl font-extrabold text-slate-900 mb-1">{stats.avgDifficulty.toFixed(1)}</div>
                    <div className="text-xs font-bold uppercase text-slate-400 mb-2">out of 5</div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Difficulty</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/50">
              <div className="p-6 flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{stats.wouldTakeAgainPct}%</div>
                  <div className="text-sm text-slate-500 font-medium">Would take again</div>
                </div>
              </div>
              <div className="p-6 flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 capitalize">{stats.commonAttendance}</div>
                  <div className="text-sm text-slate-500 font-medium">Attendance</div>
                </div>
              </div>
              <div className="p-6 flex items-center gap-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                  <Book className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{stats.textbookUsedPct}%</div>
                  <div className="text-sm text-slate-500 font-medium">Used Textbook</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 italic">
              No reviews yet. Be the first to review this course!
            </div>
          )}
          
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
             <div className="text-sm text-slate-500 hidden sm:block">
               Have you taken {course.code}? Help others by sharing your experience.
             </div>
             <button 
               onClick={handleReviewClick}
               className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto"
             >
               {currentUser ? (showReviewForm ? "Cancel Review" : "Write a Review") : "Login to Verify & Review"}
             </button>
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && onAddReview && currentUser && (
          <div className="mb-8">
            <ReviewForm 
              courseCode={course.code}
              availableProfessors={teachingProfessors}
              currentUser={currentUser}
              onClose={() => setShowReviewForm(false)}
              onSubmit={onAddReview}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Professors */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Instructors
              </h3>
              <div className="space-y-4">
                {teachingProfessors.map(prof => (
                  <Link 
                    key={prof.id} 
                    to={`/professors/${prof.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group"
                  >
                    <img src={prof.image} alt={prof.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 truncate">{prof.name}</p>
                      <p className="text-xs text-slate-500 truncate">{prof.title}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end text-xs font-bold text-slate-700">
                        <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                        {prof.averageRating.toFixed(1)}
                      </div>
                    </div>
                  </Link>
                ))}
                {teachingProfessors.length === 0 && (
                  <p className="text-sm text-slate-400 italic">No instructor data linked.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Reviews */}
          <div className="lg:col-span-2">
            {/* AI Summary Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                   <Wand2 className="w-5 h-5 text-purple-600" />
                   AI Course Summary
                 </h3>
                 <button 
                    onClick={handleGenerateSummary} 
                    disabled={loadingAi}
                    className="text-sm text-purple-600 font-medium hover:underline disabled:opacity-50 flex items-center gap-2"
                 >
                    {loadingAi ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Summary"
                    )}
                 </button>
               </div>
               
               {loadingAi ? (
                 <div className="p-8 flex justify-center items-center bg-purple-50/30 rounded-lg border border-purple-100 border-dashed">
                    <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                 </div>
               ) : aiSummary ? (
                 <div className="p-4 bg-purple-50 rounded-lg text-purple-900 text-sm leading-relaxed border border-purple-100 animate-in fade-in duration-300">
                   {aiSummary}
                 </div>
               ) : (
                 <p className="text-slate-500 text-sm">
                   Click "Generate Summary" to get an AI-powered overview of what students think about {course.code}.
                 </p>
               )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                Course Reviews ({filteredReviews.length})
              </h3>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <select 
                  className="pl-9 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                  value={selectedProfFilter}
                  onChange={(e) => setSelectedProfFilter(e.target.value)}
                >
                  <option value="All">All Professors</option>
                  {teachingProfessors.map(prof => (
                    <option key={prof.id} value={prof.id}>{prof.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredReviews.length > 0 ? (
                filteredReviews.map(review => {
                  const reviewProf = professors.find(p => p.id === review.professorId);
                  return (
                    <div key={review.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 transition-shadow hover:shadow-md relative group/review">
                       {/* Flag Button */}
                       <button 
                        onClick={() => openReportModal(review.id, 'review')}
                        className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors z-10"
                        title="Report this review"
                      >
                        <Flag className="w-3 h-3" />
                        <span className="hidden group-hover/review:inline">Report</span>
                      </button>

                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-bold flex items-center">
                            <span className="text-lg mr-1">{review.rating.toFixed(1)}</span>
                            <Star className="w-3 h-3 fill-current" />
                          </div>
                          <div className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-sm font-bold flex items-center ml-2" title="Difficulty">
                            <BarChart3 className="w-3 h-3 mr-1" />
                            <span className="text-xs">{review.difficulty || 3}.0</span>
                          </div>
                          <span className="text-slate-300 mx-1">|</span>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                              <Link to={`/professors/${review.professorId}`}>
                                {reviewProf ? reviewProf.name : "Unknown Professor"}
                              </Link>
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 mr-6"> {/* mr-6 to avoid overlap with flag */}
                          {review.grade && review.grade !== 'N/A' && (
                            <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-xs font-medium text-slate-600">
                              Grade: {review.grade}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {review.wouldTakeAgain !== undefined && (
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${review.wouldTakeAgain ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {review.wouldTakeAgain ? 'Take Again' : 'No Take Again'}
                          </span>
                        )}
                        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-slate-50 text-slate-500">
                          {review.attendance} Attendance
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-slate-50 text-slate-500">
                          Textbook: {review.textbookUsed ? 'Yes' : 'No'}
                        </span>
                      </div>

                      <p className="text-slate-700 text-sm leading-relaxed mb-3">
                        "{review.comment}"
                      </p>

                      <div className="flex justify-between items-center">
                        {review.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {review.tags.map(tag => (
                              <span key={tag} className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {review.verified && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 ml-auto">
                            <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
                  <p className="text-slate-500">No reviews found for this filter.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Report Modal */}
        {reportConfig && (
          <ReportModal 
            targetId={reportConfig.id}
            targetType={reportConfig.type}
            targetName={reportConfig.name}
            onClose={() => setReportConfig(null)}
            onSubmit={handleReportSubmit}
          />
        )}
      </div>
    </div>
  );
};