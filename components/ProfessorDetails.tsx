import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Professor, Review, User } from '../types';
import { Star, MessageSquare, BookOpen, ThumbsUp, ArrowLeft, Wand2, Loader2, ShieldCheck, Flag } from 'lucide-react';
import { ReviewForm } from './ReviewForm';
import { summarizeReviews } from '../services/geminiService';
import { ReportModal } from './ReportModal';

interface Props {
  professors: Professor[];
  reviews: Review[];
  onAddReview: (review: Review) => void;
  currentUser?: User | null;
  onRequireLogin: () => void;
  onReport: (report: any) => void;
}

export const ProfessorDetails: React.FC<Props> = ({ professors, reviews, onAddReview, currentUser, onRequireLogin, onReport }) => {
  const { id } = useParams<{ id: string }>();
  const professor = professors.find(p => p.id === id);
  const [showForm, setShowForm] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Reporting State
  const [reportConfig, setReportConfig] = useState<{id: string, type: 'review'|'professor', name?: string} | null>(null);

  // Simulate fetching details for this professor
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [id]);

  const professorReviews = useMemo(() => 
    reviews.filter(r => r.professorId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [reviews, id]);

  const stats = useMemo(() => {
    if (professorReviews.length === 0) return null;
    const count = professorReviews.length;
    const calcAvg = (key: keyof Review) => professorReviews.reduce((acc, r) => acc + (r[key] as number), 0) / count;
    
    return {
      clarity: calcAvg('clarity'),
      fairness: calcAvg('fairness'),
      communication: calcAvg('communication'),
      expertise: calcAvg('expertise'),
      approachability: calcAvg('approachability'),
    };
  }, [professorReviews]);

  const handleGenerateSummary = async () => {
    if (!professor) return;
    setLoadingAi(true);
    const summary = await summarizeReviews(professor.name, professorReviews);
    setAiSummary(summary);
    setLoadingAi(false);
  };

  const handleRateClick = () => {
    if (!currentUser) {
      onRequireLogin();
    } else {
      setShowForm(!showForm);
    }
  };

  const openReportModal = (id: string, type: 'review' | 'professor', name?: string) => {
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
        <p className="text-slate-500 font-medium">Fetching professor details...</p>
      </div>
    );
  }

  if (!professor) {
    return <div className="p-10 text-center text-slate-500 font-medium">Professor not found.</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/professors" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative group/card">
          {/* Report Button for Professor Info */}
          <button 
            onClick={() => openReportModal(professor.id, 'professor', professor.name)}
            className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Report Inaccurate Information"
          >
            <Flag className="w-4 h-4" />
            <span className="hidden sm:inline">Report Issue</span>
          </button>

          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
            <img 
              src={professor.image} 
              alt={professor.name} 
              className="w-32 h-32 rounded-xl object-cover shadow-sm"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{professor.name}</h1>
                  <p className="text-lg text-slate-600">{professor.title}</p>
                  <div className="mt-2 flex items-center text-slate-500">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>{professor.department}</span>
                  </div>
                </div>
                <div className="text-center pr-8 md:pr-0">
                  <div className="bg-blue-50 px-4 py-2 rounded-lg inline-flex flex-col items-center">
                    <span className="text-3xl font-bold text-blue-700">{professor.averageRating.toFixed(1)}</span>
                    <div className="flex items-center text-blue-600 text-sm">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <span>/ 5</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{professor.reviewCount} reviews</p>
                </div>
              </div>

              {stats && (
                 <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                   {[
                     { label: 'Clarity', val: stats.clarity },
                     { label: 'Fairness', val: stats.fairness },
                     { label: 'Comms', val: stats.communication },
                     { label: 'Expertise', val: stats.expertise },
                     { label: 'Friendly', val: stats.approachability },
                   ].map((stat) => (
                     <div key={stat.label} className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                        <div className="text-xs text-slate-500 uppercase font-semibold">{stat.label}</div>
                        <div className="font-bold text-slate-800">{stat.val.toFixed(1)}</div>
                     </div>
                   ))}
                 </div>
              )}
            </div>
          </div>
          
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
             <div className="text-sm text-slate-500">
               Have you taken a course with {professor.name.split(' ')[1]}?
             </div>
             <button 
               onClick={handleRateClick}
               className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
             >
               {currentUser ? (showForm ? "Cancel Review" : "Rate This Professor") : "Login to Verify & Rate"}
             </button>
          </div>
        </div>

        {/* Add Review Form */}
        {showForm && currentUser && (
          <div className="mb-6">
             <ReviewForm 
               professorId={professor.id} 
               currentUser={currentUser}
               onClose={() => setShowForm(false)} 
               onSubmit={onAddReview} 
             />
          </div>
        )}

        {/* AI Summary Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
               <Wand2 className="w-5 h-5 text-purple-600" />
               AI Review Summary
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
               Click "Generate Summary" to get an AI-powered overview of what students think about {professor.name}.
             </p>
           )}
        </div>

        {/* Reviews List */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
             <MessageSquare className="w-5 h-5 mr-2" />
             Student Reviews ({professorReviews.length})
          </h3>
          
          <div className="space-y-4">
            {professorReviews.map(review => (
              <div key={review.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group/review relative">
                 
                 {/* Flag Button */}
                 <button 
                   onClick={() => openReportModal(review.id, 'review')}
                   className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors z-10"
                   title="Report this review"
                 >
                   <Flag className="w-3 h-3" />
                   <span className="hidden group-hover/review:inline">Report</span>
                 </button>

                 <div className="flex flex-col md:flex-row">
                   {/* Left Rating Box */}
                   <div className="bg-slate-50 p-6 flex flex-col items-center justify-center min-w-[120px] border-b md:border-b-0 md:border-r border-slate-100">
                      <div className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Rating</div>
                      <div className="text-4xl font-extrabold text-slate-900 mb-2">{review.rating.toFixed(1)}</div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} 
                          />
                        ))}
                      </div>
                   </div>

                   {/* Main Content */}
                   <div className="p-6 flex-1">
                     <div className="flex justify-between items-start mb-4">
                       <div>
                         <div className="flex items-center gap-2 mb-1">
                           <span className="font-bold text-lg text-slate-900">{review.courseCode}</span>
                           <span className="text-slate-300">•</span>
                           <span className="text-sm text-slate-500 font-medium">
                             {review.forCredit ? "For Credit" : "No Credit"}
                           </span>
                           <span className="text-slate-300">•</span>
                           <span className="text-sm text-slate-500">{new Date(review.date).toLocaleDateString()}</span>
                         </div>
                       </div>
                     </div>

                     {/* Metadata Badges */}
                     <div className="flex flex-wrap gap-2 mb-4">
                        {review.wouldTakeAgain !== undefined && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded font-medium text-xs ${review.wouldTakeAgain ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {review.wouldTakeAgain ? "Would Take Again: Yes" : "Would Take Again: No"}
                          </span>
                        )}
                        
                        {review.grade && review.grade !== 'N/A' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded font-medium text-xs bg-slate-100 text-slate-700">
                            Grade: <strong className="ml-1">{review.grade}</strong>
                          </span>
                        )}

                        {review.attendance && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded font-medium text-xs bg-slate-100 text-slate-700">
                            Attendance: <strong className="ml-1">{review.attendance}</strong>
                          </span>
                        )}

                        <span className="inline-flex items-center px-2.5 py-0.5 rounded font-medium text-xs bg-slate-100 text-slate-700">
                          Textbook: <strong className="ml-1">{review.textbookUsed ? "Yes" : "N/A"}</strong>
                        </span>
                     </div>
                     
                     <p className="text-slate-700 text-sm leading-relaxed mb-4">
                       "{review.comment}"
                     </p>

                     <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex gap-2">
                          {review.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="font-medium text-slate-400 italic flex items-center">
                            By {review.studentName}
                            {review.verified && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 ml-2">
                                <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                              </span>
                            )}
                          </span>
                          <button className="flex items-center hover:text-blue-600 transition-colors font-medium">
                            <ThumbsUp className="w-3 h-3 mr-1" /> Helpful
                          </button>
                        </div>
                     </div>
                   </div>
                 </div>
              </div>
            ))}
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