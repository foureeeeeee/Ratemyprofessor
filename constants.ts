import { Professor, Review, Course } from './types';

export const DEPARTMENTS = [
  "Computer Science",
  "Software Engineering",
  "Information Technology",
  "Data Science",
  "Multimedia"
];

export const MOCK_PROFESSORS: Professor[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Dr. Aishah binti Ahmad",
    department: "Software Engineering",
    title: "Senior Lecturer",
    image: "https://picsum.photos/seed/prof1/200/200",
    averageRating: 4.5,
    reviewCount: 12
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Prof. Tan Wei Ming",
    department: "Computer Science",
    title: "Associate Professor",
    image: "https://picsum.photos/seed/prof2/200/200",
    averageRating: 3.8,
    reviewCount: 8
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Dr. Sarah Johnson",
    department: "Data Science",
    title: "Lecturer",
    image: "https://picsum.photos/seed/prof3/200/200",
    averageRating: 4.9,
    reviewCount: 25
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    name: "Mr. Raj Kumar",
    department: "Information Technology",
    title: "Tutor",
    image: "https://picsum.photos/seed/prof4/200/200",
    averageRating: 2.5,
    reviewCount: 5
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    name: "Dr. Lee Siew Lin",
    department: "Software Engineering",
    title: "Senior Lecturer",
    image: "https://picsum.photos/seed/prof5/200/200",
    averageRating: 4.2,
    reviewCount: 15
  },
  {
    id: "66666666-6666-6666-6666-666666666666",
    name: "Prof. Michael Chen",
    department: "Multimedia",
    title: "Professor",
    image: "https://picsum.photos/seed/prof6/200/200",
    averageRating: 3.5,
    reviewCount: 10
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: "c1111111-1111-1111-1111-111111111111",
    code: "SE2023",
    name: "Software Design Patterns",
    department: "Software Engineering",
    professorIds: ["11111111-1111-1111-1111-111111111111", "55555555-5555-5555-5555-555555555555"],
    description: "Introduction to GOF patterns and architectural principles."
  },
  {
    id: "c2222222-2222-2222-2222-222222222222",
    code: "CS1010",
    name: "Programming Fundamentals",
    department: "Computer Science",
    professorIds: ["22222222-2222-2222-2222-222222222222", "44444444-4444-4444-4444-444444444444"],
    description: "Basic algorithm logic and C++ implementation."
  },
  {
    id: "c3333333-3333-3333-3333-333333333333",
    code: "DS3001",
    name: "Machine Learning Basics",
    department: "Data Science",
    professorIds: ["33333333-3333-3333-3333-333333333333"],
    description: "Supervised and unsupervised learning algorithms."
  },
  {
    id: "c4444444-4444-4444-4444-444444444444",
    code: "MM2001",
    name: "Digital Media Production",
    department: "Multimedia",
    professorIds: ["66666666-6666-6666-6666-666666666666"],
    description: "Video editing and sound engineering fundamentals."
  },
  {
    id: "c5555555-5555-5555-5555-555555555555",
    code: "IT1005",
    name: "Web Systems",
    department: "Information Technology",
    professorIds: ["44444444-4444-4444-4444-444444444444", "11111111-1111-1111-1111-111111111111"],
    description: "Full stack web development using modern frameworks."
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "f1111111-1111-1111-1111-111111111111",
    professorId: "11111111-1111-1111-1111-111111111111",
    studentName: "Anonymous",
    rating: 5,
    difficulty: 3,
    tags: ["Inspirational", "Clear Grading"],
    comment: "Dr. Aishah is amazing. She explains complex software architecture concepts very clearly. Highly recommended for Software Design patterns.",
    courseCode: "SE2023",
    date: "2024-12-10",
    clarity: 5,
    fairness: 5,
    communication: 5,
    expertise: 5,
    approachability: 5,
    forCredit: true,
    attendance: 'Mandatory',
    wouldTakeAgain: true,
    grade: 'A',
    textbookUsed: false
  },
  {
    id: "f2222222-2222-2222-2222-222222222222",
    professorId: "11111111-1111-1111-1111-111111111111",
    studentName: "Zu Kaiquan",
    rating: 4,
    difficulty: 4,
    tags: ["Heavy Homework"],
    comment: "Great lecturer but the assignments are quite tough. You learn a lot though.",
    courseCode: "SE2023",
    date: "2024-11-05",
    clarity: 4,
    fairness: 4,
    communication: 5,
    expertise: 5,
    approachability: 4,
    forCredit: true,
    attendance: 'Optional',
    wouldTakeAgain: true,
    grade: 'B+',
    textbookUsed: true
  },
  {
    id: "f3333333-3333-3333-3333-333333333333",
    professorId: "22222222-2222-2222-2222-222222222222",
    studentName: "Anonymous",
    rating: 3,
    difficulty: 5,
    tags: ["Tough Grader"],
    comment: "He knows his stuff but his exams are very hard compared to what is taught in class.",
    courseCode: "CS1010",
    date: "2024-10-20",
    clarity: 3,
    fairness: 2,
    communication: 3,
    expertise: 5,
    approachability: 3,
    forCredit: true,
    attendance: 'Mandatory',
    wouldTakeAgain: false,
    grade: 'C+',
    textbookUsed: true
  },
  {
    id: "f4444444-4444-4444-4444-444444444444",
    professorId: "33333333-3333-3333-3333-333333333333",
    studentName: "Sarah M.",
    rating: 5,
    difficulty: 2,
    tags: ["Caring", "Accessible"],
    comment: "Best professor I've had at UKM. She really cares about student success.",
    courseCode: "DS3001",
    date: "2025-01-15",
    clarity: 5,
    fairness: 5,
    communication: 5,
    expertise: 5,
    approachability: 5,
    forCredit: true,
    attendance: 'Not Recorded',
    wouldTakeAgain: true,
    grade: 'A+',
    textbookUsed: false
  }
];