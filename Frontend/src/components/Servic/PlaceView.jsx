import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";

// Helper: get image URL for preview (like AddPlace)
const getImageUrl = (img) => {
  if (!img) return "/placeholder.svg";
  if (
    typeof img === "string" &&
    (img.startsWith("http://") || img.startsWith("https://"))
  )
    return img;
  if (typeof img === "string") return `http://127.0.0.1:8000${img}`;
  return "/placeholder.svg";
};

const PlaceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/places/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        // Map backend fields to frontend model
        const mapped = {
          id: data.id,
          subtitle: data.title, // backend 'title' → frontend 'subtitle'
          main_image: data.main_image,
          sub_images: data.sub_images || [],
          included: data.include, // backend 'include' → frontend 'included'
          exclude: data.exclude, // backend 'excluded' → frontend 'exclude'
          tour_highlights: data.tour_highlights, // backend 'tour_highlights' → frontend 'highlights'
          about_place: data.about_place, // backend 'about_place' → frontend 'description'
          price: data.price,
          price_title: data.price_title, // <-- Add this line
        };
        setPlace(mapped);
        setCurrentImage(data.main_image);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!place) return <div className="text-center py-20">Place not found</div>;

  return (
    <div className="flex flex-col items-center w-full mt-20 bg-black text-white">
      <div className="w-full max-w-4xl px-4 mx-auto">
        {/* Header */}
        <div className="relative pt-5 pb-5 w-full">
          <header className="w-full">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {place.subtitle}
            </h1>
          </header>
        </div>
        {/* Image Section */}
        <div className="flex flex-col gap-8 items-center w-full">
          <div className="flex justify-center w-full">
            <img
              className="rounded-xl w-full h-auto max-h-[500px] object-cover shadow-2xl"
              src={getImageUrl(currentImage)}
              alt="Main View"
            />
          </div>
          <div className="flex justify-center flex-wrap gap-4 w-full">
            {/* Main image thumbnail */}
            <img
              onClick={() => setCurrentImage(place.main_image)}
              className={`hover:opacity-70 w-20 h-20 rounded-lg cursor-pointer object-cover border ${
                currentImage === place.main_image
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
              src={getImageUrl(place.main_image)}
              alt="Main Thumbnail"
            />
            {/* Sub images thumbnails */}
            {Array.isArray(place.sub_images) &&
              place.sub_images.map((img, idx) => (
                <img
                  key={idx}
                  onClick={() => setCurrentImage(img.image)}
                  className={`hover:opacity-70 w-20 h-20 rounded-lg cursor-pointer object-cover border ${
                    currentImage === img.image
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  src={getImageUrl(img.image)}
                  alt={`Sub ${idx + 1}`}
                />
              ))}
          </div>
        </div>
        {/* Reserve Card Section */}
        <div className="max-w-md w-full rounded-lg shadow-md overflow-hidden border-2 border-white mt-20 bg-gray-900">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-2">
             {place.price_title} 
            </h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-white">Price</span>
                <span className="font-semibold text-white">Total : ${place.price}</span>
              </div>
              <p className="text-sm text-white">
                (Price includes taxes and booking fees)
              </p>
            </div>
            <button
              onClick={() => navigate(`/Forms/${place.id}`)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              Reserve Now
            </button>
          </div>
        </div>
        {/* About Section */}
        <main className="py-8 w-full">
          <h2 className="text-xl font-bold mb-4 text-white">About This Tour</h2>
          <p className="text-gray-300">{place.about_place}</p>
        </main>
        {/* Highlights Section */}
        <div className="rounded-lg p-6 mb-8 w-full bg-gray-900">
          <h2 className="text-2xl font-bold text-white mb-6">
            TOUR HIGHLIGHTS
          </h2>
          {(() => {
            let highlights = place.tour_highlights;
            if (
              typeof highlights === "string" &&
              highlights.trim().startsWith("[")
            ) {
              try {
                highlights = JSON.parse(highlights);
              } catch {}
            }
            return Array.isArray(highlights) ? (
              <ul className="space-y-2 list-disc pl-5">
                {highlights.map((item, idx) => (
                  <li key={idx} className="text-gray-300">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-300">{highlights}</p>
            );
          })()}
        </div>
{/* 
        <div className="bg-gray-900 w-full mb-10 p-6 rounded-lg">
          <h2 className="text-3xl font-bold text-white mb-6">Tour Itinerary</h2>
          {itineraryData.map((item, idx) => (
            <ItineraryItem key={idx} {...item} />
          ))}
        </div> */}

        {/* Included-Excluded Section */}
        <div className="w-full mb-20 bg-gray-900 p-6 rounded-lg">
          <h2 className="text-3xl font-bold text-white mb-6">
            What's Included & Excluded
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                Included
              </h3>
              {(() => {
                let included = place.included;
                if (
                  typeof included === "string" &&
                  included.trim().startsWith("[")
                ) {
                  try {
                    included = JSON.parse(included);
                  } catch {}
                }
                return Array.isArray(included) ? (
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    {included.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-300">{included}</p>
                );
              })()}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                Excluded
              </h3>
              {(() => {
                let excluded = place.exclude;
                if (
                  typeof excluded === "string" &&
                  excluded.trim().startsWith("[")
                ) {
                  try {
                    excluded = JSON.parse(excluded);
                  } catch {}
                }
                return Array.isArray(excluded) ? (
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    {excluded.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-300">{excluded}</p>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
      <ScrollToTop smooth color="#fff" style={{ backgroundColor: "#3b82f6" }} />
    </div>
  );
};

export default PlaceView;
