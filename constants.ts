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
    id: "1",
    name: "Dr. Aishah binti Ahmad",
    department: "Software Engineering",
    title: "Senior Lecturer",
    image: "https://picsum.photos/seed/prof1/200/200",
    averageRating: 4.5,
    reviewCount: 12
  },
  {
    id: "2",
    name: "Prof. Tan Wei Ming",
    department: "Computer Science",
    title: "Associate Professor",
    image: "https://picsum.photos/seed/prof2/200/200",
    averageRating: 3.8,
    reviewCount: 8
  },
  {
    id: "3",
    name: "Dr. Sarah Johnson",
    department: "Data Science",
    title: "Lecturer",
    image: "https://picsum.photos/seed/prof3/200/200",
    averageRating: 4.9,
    reviewCount: 25
  },
  {
    id: "4",
    name: "Mr. Raj Kumar",
    department: "Information Technology",
    title: "Tutor",
    image: "https://picsum.photos/seed/prof4/200/200",
    averageRating: 2.5,
    reviewCount: 5
  },
  {
    id: "5",
    name: "Dr. Lee Siew Lin",
    department: "Software Engineering",
    title: "Senior Lecturer",
    image: "https://picsum.photos/seed/prof5/200/200",
    averageRating: 4.2,
    reviewCount: 15
  },
  {
    id: "6",
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
    id: "c1",
    code: "SE2023",
    name: "Software Design Patterns",
    department: "Software Engineering",
    professorIds: ["1", "5"],
    description: "Introduction to GOF patterns and architectural principles."
  },
  {
    id: "c2",
    code: "CS1010",
    name: "Programming Fundamentals",
    department: "Computer Science",
    professorIds: ["2", "4"],
    description: "Basic algorithm logic and C++ implementation."
  },
  {
    id: "c3",
    code: "DS3001",
    name: "Machine Learning Basics",
    department: "Data Science",
    professorIds: ["3"],
    description: "Supervised and unsupervised learning algorithms."
  },
  {
    id: "c4",
    code: "MM2001",
    name: "Digital Media Production",
    department: "Multimedia",
    professorIds: ["6"],
    description: "Video editing and sound engineering fundamentals."
  },
  {
    id: "c5",
    code: "IT1005",
    name: "Web Systems",
    department: "Information Technology",
    professorIds: ["4", "1"],
    description: "Full stack web development using modern frameworks."
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    professorId: "1",
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
    id: "r2",
    professorId: "1",
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
    id: "r3",
    professorId: "2",
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
    id: "r4",
    professorId: "3",
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