import { useState, useEffect } from "react";
import axios from "axios";
import {BackendUrl} from "../../BackendUrl";

const Slider = () => {
  const [displayText, setDisplayText] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fullText = "Welcome To";

  // Fetch items from backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${BackendUrl}/api/items/`);
        setItems(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch items: ' + err.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Typewriter effect for the heading
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 100);
    return () => clearInterval(typing);
  }, []);

  if (loading) return <div className="w-full h-[35vh] bg-black flex items-center justify-center text-white">Loading...</div>;
  if (error) return <div className="w-full h-[35vh] bg-black flex items-center justify-center text-white">{error}</div>;

  return (
    <div className="relative w-full flex flex-col items-center bg-black overflow-hidden">
      {/* Blue blurred circle background effect */}
      <div className="z-0 absolute opacity-90 rounded-full blur-[200px] w-[40%] h-[40%] bg-blue-600 top-[100px] left-1/5 pointer-events-none" />
      {/* Animated Header with gradient background */}
      <div className="h-[35vh] w-full bg-black flex flex-col items-center justify-center gap-2 pt-4 pb-0">
        <p className="m-0 text-transparent text-3xl sm:text-4xl md:text-5xl font-mono font-medium uppercase animate-text bg-[url('https://images.unsplash.com/photo-1508624217470-5ef0f947d8be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxM3x8b2NlYW58ZW58MHwwfHx8MTc0Mzc5MjQzNnww&ixlib=rb-4.0.3&q=80&w=1080')] bg-contain bg-clip-text opacity-90 filter contrast-150 tracking-widest leading-none">
          {displayText}
        </p>
        <p className="m-0 text-transparent text-5xl sm:text-7xl md:text-8xl font-mono font-extrabold uppercase animate-textReverse bg-[url('https://images.unsplash.com/photo-1488330890490-c291ecf62571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwzfHxncmVlbnxlbnwwfDB8fHwxNzQzNzkyMzgwfDA&ixlib=rb-4.0.3&q=80&w=1080')] bg-contain bg-clip-text filter contrast-150 leading-none">
          Sri Lanka
        </p>
      </div>
      {/* Grid Layout Section with Image Cards */}
      <section className="w-full py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div key={item.id} className="card">
                <img 
                  src={`${BackendUrl}${item.image}`} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="card__content">
                  <p className="card__title">{item.title}</p>
                  <p className="card__description">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <style jsx>{`
        .card {
          position: relative;
          width: 100%;
          height: 300px;
          background-color: #1a1a1a;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          perspective: 1000px;
          box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.1);
          transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .card:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 16px rgba(255, 255, 255, 0.2);
        }
        .card__content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 20px;
          box-sizing: border-box;
          background-color: rgba(0, 0, 0, 0.9);
          transform: rotateX(-90deg);
          transform-origin: bottom;
          transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .card:hover .card__content {
          transform: rotateX(0deg);
        }
        .card__title {
          margin: 0;
          font-size: 24px;
          color: #ffffff;
          font-weight: 700;
        }
        .card:hover img {
          scale: 0;
          transform: rotate(-45deg);
        }
        .card__description {
          margin: 10px 0 0;
          font-size: 14px;
          color: #ffffff;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};

export default Slider;