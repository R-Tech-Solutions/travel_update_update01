import React, { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const galleryImages = [
  {
    src: "https://images.pexels.com/photos/2356059/pexels-photo-2356059.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "photo gallery image 01",
  },
  {
    src: "https://images.pexels.com/photos/3618162/pexels-photo-3618162.jpeg",
    alt: "photo gallery image 07",
  },
  {
    src: "https://images.unsplash.com/photo-1689217634234-38efb49cb664?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
    alt: "photo gallery image 08",
  },
  {
    src: "https://images.unsplash.com/photo-1520350094754-f0fdcac35c1c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
    alt: "photo gallery image 09",
  },
  {
    src: "https://cdn.devdojo.com/images/june2023/mountains-10.jpeg",
    alt: "photo gallery image 10",
  },
  {
    src: "https://cdn.devdojo.com/images/june2023/mountains-06.jpeg",
    alt: "photo gallery image 06",
  },
  {
    src: "https://images.pexels.com/photos/1891234/pexels-photo-1891234.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "photo gallery image 07",
  },
  {
    src: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
    alt: "photo gallery image 08",
  },
  {
    src: "https://images.pexels.com/photos/4256852/pexels-photo-4256852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "photo gallery image 09",
  },
  {
    src: "https://images.unsplash.com/photo-1541795083-1b160cf4f3d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
    alt: "photo gallery image 10",
  },
];

const Gellery = () => {
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const modalRef = useRef(null);

  // Fetch gallery photos from backend
  useEffect(() => {
    async function fetchGalleryPhotos() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/gallery/photos/");
        const data = await res.json();
        setGalleryPhotos(data);
      } catch {
        setGalleryPhotos([]);
      }
    }
    fetchGalleryPhotos();
  }, []);

  // Keyboard navigation and close
  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setModalOpen(false);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [modalOpen, activeIndex]);

  const openModal = (idx) => {
    setActiveIndex(idx);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setActiveIndex(null), 300);
  };

  // Fix: Use galleryPhotos for modal, not galleryImages
  const nextImage = () => {
    setActiveIndex((prev) =>
      prev === galleryPhotos.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setActiveIndex((prev) =>
      prev === 0 ? galleryPhotos.length - 1 : prev - 1
    );
  };

  return (
    <>
      <section className="px-4 py-4 mx-auto max-w-7xl mb-6">
        <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center flex items-center justify-center min-h-[80px]">
          <h1
            className="mb-2 text-4xl font-extrabold leading-none tracking-normal text-gray-900 md:text-6xl md:tracking-tight"
            style={{ marginTop: "80px" }} // Add margin to push title below navbar
          >
            <span className="block w-full text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500 lg:inline">
              Here's to the crazy ones
            </span>
          </h1>
        </div>
      </section>
      <section className="mb-24">
        <div className="w-full h-full select-none">
          <div className="max-w-6xl mx-auto duration-1000 delay-300 opacity-100 select-none ease animate-fade-in-view">
            <ul className="grid grid-cols-2 gap-5 lg:grid-cols-5">
              {/* Render backend gallery photos */}
              {galleryPhotos.map((img, idx) => (
                <li
                  key={img.id}
                  className="transition-all duration-500 transform opacity-100 translate-y-0"
                >
                  <img
                    onClick={() => { setActiveIndex(idx); setModalOpen(true); }}
                    src={`http://127.0.0.1:8000${img.image}`}
                    alt={`gallery photo ${img.id}`}
                    className="object-cover select-none w-full h-auto bg-gray-200 rounded cursor-zoom-in aspect-[5/6] lg:aspect-[2/3] xl:aspect-[3/4] transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                    style={{ userSelect: "none" }}
                  />
                </li>
              ))}
              {/* ...existing code for static galleryImages if you want to keep them ... */}
            </ul>
          </div>
          {/* Modal */}
          {modalOpen && (
            <div
              ref={modalRef}
              className="fixed inset-0 z-[99] flex items-center justify-center bg-black bg-opacity-50 select-none cursor-zoom-out"
              onClick={closeModal}
              tabIndex={-1}
            >
              <div
                className="relative flex items-center justify-center w-11/12 xl:w-4/5 h-11/12"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Prev Button */}
                <button
                  onClick={prevImage}
                  className="absolute left-0 flex items-center justify-center text-white translate-x-10 rounded-full cursor-pointer xl:-translate-x-24 2xl:-translate-x-32 bg-white/10 w-14 h-14 hover:bg-white/20"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                {/* Image */}
                {galleryPhotos[activeIndex] && (
                  <img
                    src={`http://127.0.0.1:8000${galleryPhotos[activeIndex].image}`}
                    alt={`gallery photo ${galleryPhotos[activeIndex].id}`}
                    className="object-contain object-center w-full h-full select-none cursor-zoom-out"
                    style={{ userSelect: "none" }}
                  />
                )}
                {/* Next Button */}
                <button
                  onClick={nextImage}
                  className="absolute right-0 flex items-center justify-center text-white -translate-x-10 rounded-full cursor-pointer xl:translate-x-24 2xl:translate-x-32 bg-white/10 w-14 h-14 hover:bg-white/20"
                  aria-label="Next image"
                >
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Gellery;
