
export interface Professor {
  id: string;
  name: string;
  department: string;
  title: string;
  image: string;
  averageRating: number;
  reviewCount: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  professorIds: string[];
  description?: string;
}

export interface User {
  name: string;
  email: string;
  isVerified: boolean;
}

export interface Review {
  id: string;
  professorId: string;
  studentName: string; // Anonymous or Name
  rating: number; // 1-5
  difficulty: number; // 1-5 (1 = Very Easy, 5 = Very Hard)
  tags: string[]; // e.g., "Tough Grader", "Inspirational"
  comment: string;
  courseCode: string;
  date: string;
  // Detailed criteria mentioned in thesis
  clarity: number;
  fairness: number;
  communication: number;
  expertise: number;
  approachability: number;
  
  // New Metadata Fields
  forCredit: boolean;
  attendance: 'Mandatory' | 'Optional' | 'Not Recorded' | 'N/A';
  wouldTakeAgain: boolean;
  grade: string; // A+, A, A-, B+, ... N/A
  textbookUsed: boolean;
  
  // Verification
  verified?: boolean;
}

export interface DepartmentStats {
  name: string;
  avgRating: number;
  professorCount: number;
}

export interface Report {
  id: string;
  targetId: string;
  targetType: 'review' | 'professor' | 'course';
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  timestamp: string;
  reporterEmail?: string;
}
