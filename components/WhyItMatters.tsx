import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  Sparkles, 
  TrendingUp, 
  ThumbsUp, 
  BookOpen, 
  UserCheck, 
  HelpCircle, 
  GraduationCap, 
  Layers,
  Award,
  Compass
} from 'lucide-react';

export const WhyItMatters: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blind' | 'informed'>('informed');
  const [selectedBenefit, setSelectedBenefit] = useState<number>(0);
  const [parallaxY, setParallaxY] = useState(0);

  // Simple parallax listener for floating shapes
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setParallaxY(scrolled * 0.15); // subtle parallax factor
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const benefits = [
    {
      title: "Strategic Semester Planning",
      subtitle: "Balance your academic workload intelligently",
      description: "Avoid overloading yourself with three project-heavy courses in the same semester. Reviews outline clear expectations regarding attendance, homework volume, and project weights, enabling you to curate a healthy and balanced timetable.",
      metric: "88% of users feel less stressed during exam seasons",
      color: "from-blue-500 to-indigo-600",
      icon: Compass,
      points: ["Visualize weekly assignment distribution", "Read exam-vs-coursework ratios", "Understand textbook usage necessity"]
    },
    {
      title: "Diverse Learning Style Matching",
      subtitle: "Learn from instructors who teach the way you learn",
      description: "Every student processes information differently. Some excel under hands-on, practical project structures, while others thrive with deep-dive theory and structured lectures. Our index reveals each professor's authentic teaching style.",
      metric: "94% report higher comprehension and engagement",
      color: "from-emerald-500 to-teal-600",
      icon: Layers,
      points: ["Practical labs vs. theoretical papers", "Grading speed & feedback quality metrics", "Availability during office hours"]
    },
    {
      title: "Elevating Academic Standards",
      subtitle: "Constructive feedback that drives positive change",
      description: "Your reviews are more than just ratings; they are active contributions to the UKM community. Highlighting outstanding mentors rewards stellar pedagogy, while constructive feedback helps departments fine-tune course content and delivery.",
      metric: "78% of UKM faculty adapt materials based on feedback",
      color: "from-amber-500 to-orange-600",
      icon: Award,
      points: ["Encourages educational transparency", "Highlights excellent university mentors", "Signals when curriculum updates are needed"]
    }
  ];

  return (
    <section 
      id="why-it-matters-section" 
      className="relative bg-slate-950 text-white py-16 md:py-24 px-6 overflow-hidden border-t border-slate-900 snap-start min-h-full flex flex-col justify-center scroll-mt-0"
    >
      {/* Decorative Parallax Background Objects */}
      <div 
        className="absolute top-1/4 left-10 text-slate-800 pointer-events-none select-none opacity-20 hidden lg:block"
        style={{ transform: `translateY(${parallaxY * 0.4}px)` }}
      >
        <GraduationCap size={160} />
      </div>
      <div 
        className="absolute bottom-1/4 right-10 text-slate-800 pointer-events-none select-none opacity-20 hidden lg:block"
        style={{ transform: `translateY(${-parallaxY * 0.3}px)` }}
      >
        <BookOpen size={180} />
      </div>

      <div className="absolute top-10 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold tracking-wider uppercase text-blue-400 mb-4 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Empowering Your Journey</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 tracking-tight">
            Why Rate My Professor Matters
          </h2>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            Selecting a course is more than checking off a graduation requirement. It's about matching with the right pedagogy, balancing your mental workload, and taking control of your learning.
          </p>
        </div>

        {/* 1. INTERACTIVE COMPARISON WIDGET (Before vs After) */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-10 mb-20 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            
            {/* Left Info Column */}
            <div className="w-full lg:w-1/2 space-y-6">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-white">
                Interactive Path Simulator
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Toggle the switch to compare how selecting classes blind vs. using real student evaluations affects your college success rate, anxiety levels, and grade alignment.
              </p>

              {/* Toggle Switch */}
              <div className="flex p-1.5 bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-sm">
                <button
                  type="button"
                  onClick={() => setActiveTab('blind')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'blind' 
                      ? 'bg-red-500/20 border border-red-500/30 text-red-300 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  Enrolling Blind
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('informed')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'informed' 
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  Informed Decision
                </button>
              </div>

              {/* Key takeaways */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold">Primary Outcome</h4>
                <AnimatePresence mode="wait">
                  {activeTab === 'blind' ? (
                    <motion.div
                      key="blind-takeaway"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-red-950 text-red-400 mt-1">
                          <span className="text-sm font-bold">✗</span>
                        </div>
                        <p className="text-slate-300 text-sm">
                          <strong>High Academic Burnout:</strong> Discovering halfway through that coursework assignments take 30+ hours a week alongside other intense classes.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-red-950 text-red-400 mt-1">
                          <span className="text-sm font-bold">✗</span>
                        </div>
                        <p className="text-slate-300 text-sm">
                          <strong>Mismatched Expectation:</strong> Anticipating active group-based coding, but facing only abstract mathematics and textbook memorization.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="informed-takeaway"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-emerald-950 text-emerald-400 mt-1">
                          <span className="text-sm font-bold">✓</span>
                        </div>
                        <p className="text-slate-300 text-sm">
                          <strong>Optimized Timetable:</strong> Aligning demanding technical modules with highly flexible, practical coursework electives.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-emerald-950 text-emerald-400 mt-1">
                          <span className="text-sm font-bold">✓</span>
                        </div>
                        <p className="text-slate-300 text-sm">
                          <strong>Syllabus Confidence:</strong> Knowing precisely whether evaluations rest on midterms or a structured group project beforehand.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Right Simulator Card Column */}
            <div className="w-full lg:w-1/2">
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 md:p-8 border border-slate-800/60 relative overflow-hidden shadow-2xl h-[380px] flex flex-col justify-between">
                
                {/* Clean soft ambient glow instead of hard cyber grids */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

                <AnimatePresence mode="wait">
                  {activeTab === 'blind' ? (
                    <motion.div
                      key="blind-sim"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5 relative z-10 h-full flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] uppercase font-bold text-red-400 tracking-wider">
                          Scenario A: Pure Chance
                        </span>
                      </div>

                      {/* Simulator Body */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400 font-medium">Estimated GPA Outcome</span>
                          <span className="text-xl font-bold text-red-400 font-mono">2.82 / 4.00</span>
                        </div>
                        {/* Interactive gauge */}
                        <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "65%" }}
                            className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-1">
                          <div className="p-3.5 bg-slate-950/55 border border-slate-800/60 rounded-2xl hover:border-slate-800 transition-colors">
                            <span className="block text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Anxiety Level</span>
                            <span className="text-sm md:text-base font-bold text-red-300">Extreme (89%)</span>
                          </div>
                          <div className="p-3.5 bg-slate-950/55 border border-slate-800/60 rounded-2xl hover:border-slate-800 transition-colors">
                            <span className="block text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Course Match</span>
                            <span className="text-sm md:text-base font-bold text-amber-300">Poor Match</span>
                          </div>
                        </div>
                      </div>

                      {/* Softer student quote box */}
                      <div className="bg-slate-950/45 border border-slate-850 p-4 rounded-2xl flex gap-3 items-start shadow-inner">
                        <span className="text-2xl text-red-400/80 font-serif leading-none mt-0.5 select-none">&ldquo;</span>
                        <p className="text-xs text-slate-300 leading-relaxed italic">
                          Syllabus was completely different from what I expected. Exams were extremely heavy on memorization.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="informed-sim"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5 relative z-10 h-full flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                          Scenario B: Academic Index Active
                        </span>
                      </div>

                      {/* Simulator Body */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400 font-medium">Estimated GPA Outcome</span>
                          <span className="text-xl font-bold text-emerald-400 font-mono">3.74 / 4.00</span>
                        </div>
                        {/* Interactive gauge */}
                        <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "93%" }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-1">
                          <div className="p-3.5 bg-slate-950/55 border border-slate-800/60 rounded-2xl hover:border-slate-800 transition-colors">
                            <span className="block text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Anxiety Level</span>
                            <span className="text-sm md:text-base font-bold text-emerald-300">Very Low (15%)</span>
                          </div>
                          <div className="p-3.5 bg-slate-950/55 border border-slate-800/60 rounded-2xl hover:border-slate-800 transition-colors">
                            <span className="block text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Course Match</span>
                            <span className="text-sm md:text-base font-bold text-emerald-300">Perfect Fit</span>
                          </div>
                        </div>
                      </div>

                      {/* Softer student quote box */}
                      <div className="bg-slate-950/45 border border-slate-850 p-4 rounded-2xl flex gap-3 items-start shadow-inner">
                        <span className="text-2xl text-emerald-400/80 font-serif leading-none mt-0.5 select-none">&ldquo;</span>
                        <p className="text-xs text-slate-300 leading-relaxed italic">
                          Exams exactly mirrored the reviews. Understood the project weights early and managed my team perfectly.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

          </div>
        </div>


        {/* 2. THE THREE CORE PILLARS OF STUDENT SUCCESS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Navigation panel or benefits cards list */}
          <div className="lg:col-span-1 space-y-4">
            <div className="space-y-2 mb-6">
              <h3 className="text-2xl font-serif font-bold text-white">Three Pillars</h3>
              <p className="text-slate-400 text-sm">
                Explore the key dimensions of student-focused transparency.
              </p>
            </div>

            <div className="space-y-3">
              {benefits.map((b, idx) => {
                const IconComp = b.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedBenefit(idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${
                      selectedBenefit === idx 
                        ? 'bg-slate-900 border-slate-700/80 shadow-xl shadow-slate-950/40' 
                        : 'bg-slate-950/30 border-slate-900/60 hover:bg-slate-900/25 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className={`p-2.5 rounded-full transition-colors duration-300 ${
                      selectedBenefit === idx ? 'bg-slate-800 text-amber-400' : 'bg-slate-950 text-slate-500'
                    }`}>
                      <IconComp size={20} />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${selectedBenefit === idx ? 'text-white' : 'text-slate-300'}`}>
                        {b.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">
                        {b.subtitle}
                      </p>
                    </div>
                    <ArrowUpRight className={`w-4 h-4 ml-auto transition-transform ${
                      selectedBenefit === idx ? 'text-amber-400 translate-x-0.5 -translate-y-0.5' : 'text-slate-600'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive display details */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-900/70 to-slate-950/50 backdrop-blur-md border border-slate-800/60 rounded-3xl p-8 h-full flex flex-col justify-between shadow-xl">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedBenefit}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-2xl md:text-3xl font-serif font-bold text-white mt-1">
                        {benefits[selectedBenefit].title}
                      </h4>
                    </div>
                    <div className="px-4 py-2 rounded-2xl bg-slate-950/70 border border-slate-850 text-xs text-slate-300 font-bold flex items-center gap-2 self-start md:self-auto">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span>{benefits[selectedBenefit].metric}</span>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                    {benefits[selectedBenefit].description}
                  </p>

                  <div className="border-t border-slate-800/60 pt-6 space-y-4">
                    <h5 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Key Details Included:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {benefits[selectedBenefit].points.map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span className="text-sm text-slate-300">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Aesthetic footer */}
              <div className="mt-8 pt-6 border-t border-slate-800/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ThumbsUp className="w-3.5 h-3.5 text-blue-500" />
                  <span>siswa account guaranteed for review integrity</span>
                </div>
                <span>UKM Rate My Professor</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
