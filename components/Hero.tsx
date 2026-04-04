import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { ParticlesBackground } from './ParticlesBackground';
import { Professor, Course } from '../types';

interface Props {
  professors?: Professor[];
  courses?: Course[];
}

export const Hero: React.FC<Props> = ({ professors = [], courses = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    
    if (term) {
      const courseMatch = courses.some(c => 
        c.code.toLowerCase().includes(term) || 
        c.name.toLowerCase().includes(term)
      );

      const profMatch = professors.some(p => 
        p.name.toLowerCase().includes(term)
      );

      if (courseMatch && !profMatch) {
        navigate(`/courses?search=${encodeURIComponent(searchTerm)}`);
      } else {
        navigate(`/professors?search=${encodeURIComponent(searchTerm)}`);
      }
    } else {
      navigate('/professors');
    }
  };

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex items-center justify-center bg-terminal-black">
      <div className="absolute inset-0 z-0">
        <ParticlesBackground 
          particleCountFactor={3000}
          baseSpeed={0.4}
          particleColor="#333"
          mouseForce={-2.0}
        />
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* ASCII Art Banner */}
        <pre className="text-[0.5rem] md:text-xs leading-none text-terminal-light opacity-80 mb-8 hidden sm:block select-none">
{`
██████╗  █████╗ ████████╗███████╗    ███╗   ███╗██╗   ██╗    ██████╗ ██████╗  ██████╗ ███████╗
██╔══██╗██╔══██╗╚══██╔══╝██╔════╝    ████╗ ████║╚██╗ ██╔╝    ██╔══██╗██╔══██╗██╔═══██╗██╔════╝
██████╔╝███████║   ██║   █████╗      ██╔████╔██║ ╚████╔╝     ██████╔╝██████╔╝██║   ██║█████╗  
██╔══██╗██╔══██║   ██║   ██╔══╝      ██║╚██╔╝██║  ╚██╔╝      ██╔═══╝ ██╔══██╗██║   ██║██╔══╝  
██║  ██║██║  ██║   ██║   ███████╗    ██║ ╚═╝ ██║   ██║       ██║     ██║  ██║╚██████╔╝██║     
╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚═╝     ╚═╝   ╚═╝       ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     
`}
        </pre>
        <h1 className="text-4xl md:text-6xl font-bold text-terminal-light mb-6 tracking-tighter sm:hidden">
          RATE_MY_<br/>PROFESSOR
        </h1>

        <div className="inline-block border-2 border-terminal-accent p-1 mb-10 bg-terminal-black">
          <div className="bg-terminal-accent text-terminal-black px-4 py-1 font-bold text-sm md:text-base uppercase tracking-widest">
            System v2.0 // Online
          </div>
        </div>

        <p className="text-terminal-gray text-sm md:text-lg max-w-2xl mx-auto mb-12 font-bold uppercase tracking-widest">
          &gt; Accessing verified academic records... <br/>
          &gt; Optimized for decision making.
        </p>
        
        {/* Terminal Search Box */}
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="group relative">
            <div className="absolute -inset-1 bg-terminal-accent opacity-20 group-hover:opacity-40 transition-opacity blur-sm"></div>
            <div className="relative flex items-center bg-terminal-black border-2 border-terminal-light group-focus-within:border-terminal-accent transition-colors">
              <div className="pl-4 pr-2 text-terminal-accent font-bold">
                root@ukm:~#
              </div>
              <input 
                type="text" 
                className="w-full h-14 bg-transparent text-terminal-light outline-none font-mono placeholder:text-terminal-gray uppercase"
                placeholder="grep 'professor_name'"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                type="submit"
                className="h-14 px-6 bg-terminal-light text-terminal-black hover:bg-terminal-accent font-bold uppercase transition-colors flex items-center"
              >
                EXEC <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-terminal-gray uppercase">
          <div className="border border-terminal-gray p-2 hover:border-terminal-light hover:text-terminal-light transition-colors cursor-default">
            [+] Verified_Reviews
          </div>
          <div className="border border-terminal-gray p-2 hover:border-terminal-light hover:text-terminal-light transition-colors cursor-default">
            [+] Quality_Metrics
          </div>
          <div className="border border-terminal-gray p-2 hover:border-terminal-light hover:text-terminal-light transition-colors cursor-default">
            [+] Data_Analysis
          </div>
          <Link to="/admin/login" className="border border-terminal-gray p-2 hover:bg-terminal-gray hover:text-terminal-light transition-colors flex items-center justify-center">
            Admin_Login &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};