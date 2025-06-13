import React, { useState, useEffect } from "react";
import axios from "axios";

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

  // Particle background component (from Service.jsx)
  const ParticleBackground = () => {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `scale(${Math.random() * 2})`,
              opacity: 0.5,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>
    );
  };

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
    <section className="relative w-full min-h-screen bg-gradient-to-br from-black via-black to-blue-900 overflow-hidden">
      {/* Blue blurred circle background effect */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 opacity-40 blur-[180px]" />
      <ParticleBackground />
      <div className="relative z-10 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 pt-24 md:pt-32">
            <h1 className="text-4xl font-bold text-white mb-6">Travel Blog</h1>
            <p className="text-lg text-gray-400">Discover amazing stories and travel tips</p>
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
        {/* Fixed bottom nav for mobile/hidden nav */}
        <nav className="fixed left-0 w-full z-50 bg-black/80 backdrop-blur-md border-t border-white/10 flex justify-around items-center py-3 md:hidden" style={{ bottom: '1.5rem' }}>
          <a href="/" className="text-white flex flex-col items-center text-xs hover:text-blue-400 transition-colors">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8l2 2m-2-2v8m0 0H7m6 0h4" /></svg>
            Home
          </a>
          <a href="/gallery" className="text-white flex flex-col items-center text-xs hover:text-blue-400 transition-colors">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 12V8a2 2 0 012-2h12a2 2 0 012 2v4" /></svg>
            Gallery
          </a>
          <a href="/services" className="text-white flex flex-col items-center text-xs hover:text-blue-400 transition-colors">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6" /></svg>
            Services
          </a>
          <a href="/blog" className="text-white flex flex-col items-center text-xs hover:text-blue-400 transition-colors">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z" /></svg>
            Blog
          </a>
        </nav>
      </div>
    </section>
  );
};

export default Blog;