import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Course, Professor } from '../types';

export function useReviewAuthorizationByName(
  studentEmail: string | undefined,
  targetProfessorName: string,
  courses: Course[],
  professors: Professor[]
) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [validCourseCodes, setValidCourseCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!studentEmail || !targetProfessorName || courses.length === 0 || professors.length === 0) {
        setIsAuthorized(false);
        setValidCourseCodes([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const { data: enrollments, error } = await supabase
          .from('mock_smp_enrollments')
          .select('course_code')
          .eq('student_email', studentEmail);

        if (error || !enrollments) {
          setIsAuthorized(false);
          setValidCourseCodes([]);
          return;
        }

        const enrolledCodes = enrollments.map(e => e.course_code);
        const validCodes: string[] = [];

        // For each enrolled course, check if the target professor teaches it
        enrolledCodes.forEach(code => {
          const course = courses.find(c => c.code === code);
          if (course) {
            // Check if any professor for this course matches the target name
            const courseProfessors = course.professorIds.map(id => professors.find(p => p.id === id));
            if (courseProfessors.some(p => p && p.name === targetProfessorName)) {
              validCodes.push(code);
            }
          }
        });

        setIsAuthorized(validCodes.length > 0);
        setValidCourseCodes(validCodes);
      } catch (err) {
        console.error("Error checking review authorization:", err);
        setIsAuthorized(false);
        setValidCourseCodes([]);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [studentEmail, targetProfessorName, courses, professors]);

  return { isAuthorized, validCourseCodes, isLoading };
}
