import './index.css';
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const typingTexts = [
  "Dufite ubuhanga bwa AI, VR/AR, Blockchain n'ibindi by'ikoranabuhanga bya none",
  "Turimo gutegura ejo hazaza by'ikoranabuhanga",
  "Innovation, Creativity, and Future Technology Combined"
];

function useTypingEffect(texts, speed = 100, pause = 2000) {
  const [displayText, setDisplayText] = useState("");
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    if (!deleting && charIdx < texts[textIdx].length) {
      timeout = setTimeout(() => setCharIdx(charIdx + 1), speed);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(charIdx - 1), speed / 2);
    } else if (!deleting && charIdx === texts[textIdx].length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setTextIdx((textIdx + 1) % texts.length);
    }
    setDisplayText(texts[textIdx].substring(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, textIdx, texts, speed, pause]);

  return displayText;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle scroll to top on mount and before reload
  useEffect(() => {
    // Function to scroll to top
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Scroll to top on mount
    scrollToTop();

    // Handle before unload
    const handleBeforeUnload = () => {
      scrollToTop();
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', scrollToTop);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', scrollToTop);
    };
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/posts/');
      setBlogPosts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch blog posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Typing effect ---
  const typing = useTypingEffect(typingTexts);

  // --- Floating orbs and particles ---
  const particleContainerRef = useRef(null);

  useEffect(() => {
    // Particle system
    let interval;
    function createParticle() {
      if (!particleContainerRef.current) return;
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDuration = (Math.random() * 3 + 3) + "s";
      particle.style.animationDelay = Math.random() * 2 + "s";
      particleContainerRef.current.appendChild(particle);
      setTimeout(() => particle.remove(), 6000);
    }
    interval = setInterval(createParticle, 500);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-24 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white text-xl">Loading posts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black py-24 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-24 px-4 sm:px-6 lg:px-8 mt-16 relative overflow-hidden">
      {/* --- Floating Orbs --- */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: -10 }}
      >
        <div className="floating-orb w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400" style={{top: '2.5rem', left: '-12rem', opacity: 0.2}}></div>
        <div className="floating-orb w-80 h-80 bg-gradient-to-r from-blue-400 to-cyan-400" style={{top: '24rem', right: '-10rem', opacity: 0.2, animationDelay: '-4s'}}></div>
        <div className="floating-orb w-64 h-64 bg-gradient-to-r from-green-400 to-blue-400" style={{bottom: '5rem', left: '50%', opacity: 0.2, animationDelay: '-2s'}}></div>
      </div>
      {/* --- Particle Container --- */}
      <div ref={particleContainerRef} className="particle-container"></div>
      {/* --- Blog Content --- */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-6">Travel Blog</h1>
          {/* --- Typing Text Effect --- */}
          <p className="text-lg text-gray-400">
            <span className="typing-text">{typing}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="max-w-sm backdrop-blur-md bg-black/30 border border-white/10 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 hover:bg-black/40 relative">
              <a href={`/blog/${post.id}`}>
                <img 
                  className="rounded-t-lg w-full h-48 object-cover" 
                  src={`http://127.0.0.1:8000${post.post_image}`} 
                  alt={post.post_title} 
                />
              </a>
              {/* Flame Icon */}
              <div className="absolute top-3 right-3 bg-red-500 rounded-full p-1">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12.315 2c-.866 0-1.7.566-2.138 1.137-.52.664-.94 1.488-1.54 2.126C7.4 6.55 6.6 7.42 5.865 8.165A1 1 0 005 9h-.438c-1.353 0-2.316.56-2.678 1.144-.336.54-.158 1.258.412 1.838a1 1 0 00.707 1.707l.707.707a1 1 0 001.414 0l.707-.707a1 1 0 000-1.414l-.707-.707c-.4-.4-.58-.93-.412-1.468a1.536 1.536 0 01.412-1.468l.685-.685c.664-.664 1.488-1.54 2.126-2.138C10.566 2.5 11.315 2 12.315 2z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div className="p-5 flex flex-col justify-between h-full">
                <div>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
                    {post.post_title}
                  </h5>
                  <p className="mb-3 font-normal text-gray-300 text-base leading-relaxed">
                    {post.post_content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;