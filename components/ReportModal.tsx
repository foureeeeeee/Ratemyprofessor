
import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  targetId: string;
  targetType: 'review' | 'professor' | 'course';
  targetName?: string;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}

export const ReportModal: React.FC<Props> = ({ targetId, targetType, targetName, onClose, onSubmit }) => {
  const [reason, setReason] = useState('Inappropriate Content');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reason, details);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-red-50">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-lg">Report Issue</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-sm text-slate-600">
            You are reporting <span className="font-bold capitalize">{targetType}</span>: <br/>
            <span className="italic text-slate-800">"{targetName || targetId}"</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
            <select 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
            >
              <option>Inappropriate Content</option>
              <option>Information Inaccurate</option>
              <option>Spam / Bot Activity</option>
              <option>Harassment</option>
              <option>Duplicate Entry</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Additional Details</label>
            <textarea 
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none"
              placeholder="Please provide specific details..."
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 shadow-md">
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
