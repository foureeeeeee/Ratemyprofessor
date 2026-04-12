import React, { useState } from 'react';
import { Review, Professor, User } from '../types';
import { Star, CheckCircle2, Circle, BarChart3, ShieldCheck, AlertCircle } from 'lucide-react';

interface Props {
  professorId?: string;
  courseCode?: string;
  availableProfessors?: Professor[]; // For selecting professor when reviewing a course
  currentUser?: User | null;
  onClose: () => void;
  onSubmit: (review: Review) => void;
}

const GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', 'N/A'];
const ATTENDANCE_OPTIONS = ['Mandatory', 'Optional', 'Not Recorded'];

export const ReviewForm: React.FC<Props> = ({ professorId, courseCode = '', availableProfessors = [], currentUser, onClose, onSubmit }) => {
  const [selectedProfessorId, setSelectedProfessorId] = useState(professorId || '');
  const [formData, setFormData] = useState({
    courseCode: courseCode,
    comment: '',
    clarity: 5,
    fairness: 5,
    communication: 5,
    expertise: 5,
    approachability: 5,
    difficulty: 3, // Default difficulty
    forCredit: true,
    attendance: 'Mandatory' as const,
    wouldTakeAgain: true,
    grade: 'N/A',
    textbookUsed: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert("You must be logged in and verified to submit a review.");
      return;
    }

    // If no professor ID was passed prop, use the selected one
    const finalProfessorId = professorId || selectedProfessorId;
    
    if (!finalProfessorId) {
      alert("Please select a professor.");
      return;
    }

    const overallRating = Math.round(
      (formData.clarity + formData.fairness + formData.communication + formData.expertise + formData.approachability) / 5
    );

    const newReview: Review = {
      id: crypto.randomUUID(),
      professorId: finalProfessorId,
      studentName: currentUser.name, // Enforce verified name
      rating: overallRating,
      tags: [],
      date: new Date().toISOString(),
      verified: true, // Always true as we enforce login
      ...formData
    };

    onSubmit(newReview);
    onClose();
  };

  const RatingInput = ({ label, value, field }: { label: string, value: number, field: keyof typeof formData }) => (
    <div className="flex items-center justify-between mb-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, [field]: star }))}
            className={`p-1 transition-colors ${value >= star ? 'text-yellow-400' : 'text-slate-200'}`}
          >
            <Star className="w-5 h-5 fill-current" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 animate-in fade-in slide-in-from-top-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900">Write a Review</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <span className="sr-only">Close</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {currentUser ? (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-full text-blue-600 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-900">Verified Student Identity</h4>
            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
              You are currently logged in as <span className="font-semibold">{currentUser.name}</span>. 
              Your review will be posted with a "Verified" badge. We value authentic feedback from our student community.
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <p className="text-sm text-red-800">You must be verified to post reviews.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* Left Column: Ratings */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Rating Metrics</h4>
            
            {/* If professorId is not provided (e.g. reviewing from course page), allow selection */}
            {!professorId && availableProfessors.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Instructor</label>
                <select
                  required
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
                  value={selectedProfessorId}
                  onChange={(e) => setSelectedProfessorId(e.target.value)}
                >
                  <option value="">-- Choose Professor --</option>
                  {availableProfessors.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}

            <RatingInput label="Clarity" value={formData.clarity} field="clarity" />
            <RatingInput label="Fairness" value={formData.fairness} field="fairness" />
            <RatingInput label="Communication" value={formData.communication} field="communication" />
            <RatingInput label="Expertise" value={formData.expertise} field="expertise" />
            <RatingInput label="Approachability" value={formData.approachability} field="approachability" />
            
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-700 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-1 text-slate-500" />
                  Difficulty Level
                </label>
                <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded text-slate-600">
                  {formData.difficulty === 1 ? "Very Easy" : 
                   formData.difficulty === 2 ? "Easy" : 
                   formData.difficulty === 3 ? "Moderate" : 
                   formData.difficulty === 4 ? "Hard" : "Very Hard"}
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, difficulty: level }))}
                    className={`flex-1 py-2 rounded text-sm font-bold transition-all border ${
                      formData.difficulty === level 
                        ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105' 
                        : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Logistics */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Course Logistics</h4>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Course Code</label>
              <input 
                type="text" 
                required
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                placeholder="e.g., CS101"
                value={formData.courseCode}
                onChange={e => setFormData(prev => ({...prev, courseCode: e.target.value}))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Grade Received</label>
                <select 
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
                  value={formData.grade}
                  onChange={e => setFormData(prev => ({...prev, grade: e.target.value}))}
                >
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Attendance</label>
                <select 
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
                  value={formData.attendance}
                  onChange={e => setFormData(prev => ({...prev, attendance: e.target.value as any}))}
                >
                  {ATTENDANCE_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">For Credit?</span>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, forCredit: true}))}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${formData.forCredit ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    Yes
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, forCredit: false}))}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${!formData.forCredit ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Textbook Required?</span>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, textbookUsed: true}))}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${formData.textbookUsed ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    Yes
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, textbookUsed: false}))}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${!formData.textbookUsed ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">Would Take Again?</span>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, wouldTakeAgain: true}))}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${formData.wouldTakeAgain ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    Yes
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, wouldTakeAgain: false}))}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${!formData.wouldTakeAgain ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Written Feedback</h4>
          <textarea 
            required
            rows={4}
            className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border flex-grow resize-none"
            placeholder="Share your experience with this professor..."
            value={formData.comment}
            onChange={e => setFormData(prev => ({...prev, comment: e.target.value}))}
          />
           <p className="text-xs text-slate-500 mt-2">
            Please keep your review constructive and respectful. All reviews are subject to moderation.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={!currentUser}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Verified Review
          </button>
        </div>
      </form>
    </div>
  );
};