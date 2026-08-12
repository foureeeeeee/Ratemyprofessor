import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
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

      const findProfessorCourseCodes = () => {
        const targetProf = professors.find(p => p.name === targetProfessorName);
        if (!targetProf) return [];
        return courses.filter(c => c.professorIds.includes(targetProf.id)).map(c => c.code);
      };

      if (!isSupabaseConfigured()) {
        const profCourseCodes = findProfessorCourseCodes();
        setIsAuthorized(profCourseCodes.length > 0);
        setValidCourseCodes(profCourseCodes);
        setIsLoading(false);
        return;
      }

      try {
        const { data: enrollments, error } = await supabase
          .from('mock_smp_enrollments')
          .select('course_code')
          .eq('student_email', studentEmail);

        if (error || !enrollments || enrollments.length === 0) {
          // Fallback to local course codes for verified student
          const profCourseCodes = findProfessorCourseCodes();
          setIsAuthorized(profCourseCodes.length > 0);
          setValidCourseCodes(profCourseCodes);
          return;
        }

        const enrolledCodes = enrollments.map(e => e.course_code);
        const validCodes: string[] = [];

        enrolledCodes.forEach(code => {
          const course = courses.find(c => c.code === code);
          if (course) {
            const courseProfessors = course.professorIds.map(id => professors.find(p => p.id === id));
            if (courseProfessors.some(p => p && p.name === targetProfessorName)) {
              validCodes.push(code);
            }
          }
        });

        if (validCodes.length > 0) {
          setIsAuthorized(true);
          setValidCourseCodes(validCodes);
        } else {
          const profCourseCodes = findProfessorCourseCodes();
          setIsAuthorized(profCourseCodes.length > 0);
          setValidCourseCodes(profCourseCodes);
        }
      } catch (err) {
        const profCourseCodes = findProfessorCourseCodes();
        setIsAuthorized(profCourseCodes.length > 0);
        setValidCourseCodes(profCourseCodes);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [studentEmail, targetProfessorName, courses, professors]);

  return { isAuthorized, validCourseCodes, isLoading };
}

