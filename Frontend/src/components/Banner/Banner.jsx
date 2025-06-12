import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import TravelImg from "../../assets/world.png";
import TravelImg1 from "../../assets/cemara.png";
import { MdFlight, MdOutlineLocalHotel } from "react-icons/md";
import { IoIosWifi } from "react-icons/io";
import { IoFastFoodSharp } from "react-icons/io5";

const Banner = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <div className="bg-black-100">
        <div className="flex justify-center items-center backdrop-blur-xl py-8">
          <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Image section */}
              <div data-aos="flip-up">
                <img
                  src={TravelImg}
                  alt="biryani img"
                  className="max-w-[450px] h-[350px] w-full mx-auto drop-shadow-[5px_5px_12px_rgba(0,0,0,0.7)] object-cover"
                />
              </div>
              {/* text content section */}
              <div className="flex flex-col justify-center gap-6 sm:pt-0 lg:px-16" data-aos="fade-up">
                <h1 className="text-3xl sm:text-4xl font-bold">
                  Explore all corners of The world with us
                </h1>
                <p className="text-sm text-gray-500 tracking-wide leading-8">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Eaque reiciendis inventore iste ratione ex alias quis magni at
                  optio ratione ex alias quis magni at optio
                  <br />
                </p>
                <div className="grid grid-cols-2 gap-6" data-aos="zoom-in">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <MdFlight className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400 text-black dark:text-white" />
                      <p>Flight</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <MdOutlineLocalHotel className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400 text-black dark:text-white" />
                      <p>Hotel</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <IoIosWifi className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400 text-black dark:text-white" />
                      <p>Wi-fi</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <IoFastFoodSharp className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400 text-black dark:text-white" />
                      <p>Foods</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black-100">
        <div className="flex justify-center items-center backdrop-blur-xl py-8">
          <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* text content section - now comes first in DOM but appears on right */}
              <div className="flex flex-col justify-center gap-6 sm:pt-0 lg:px-16 order-2 sm:order-1" data-aos="fade-up">
                <h1 className="text-3xl sm:text-4xl font-bold">
                  Explore all corners of The world with us
                </h1>
                <p className="text-sm text-gray-500 tracking-wide leading-8">
                  Lorem ipsumdei, dolor sit amet consectetur adipisicing elit.
                  Eaque reiciendis inventore iste ratione ex alias quis magni at
                  optio ratione ex alias quis magni at optio
                  <br />
                </p>
                <div className="grid grid-cols-2 gap-6" data-aos="zoom-in">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <MdFlight className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400 text-black dark:text-white" />
                      <p>Flight</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <MdOutlineLocalHotel className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400 text-black dark:text-white" />
                      <p>Hotel</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <IoIosWifi className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400 text-black dark:text-white" />
                      <p>Wi-fi</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <IoFastFoodSharp className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400 text-black dark:text-white" />
                      <p>Foods</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Image section - now comes second in DOM but appears on left */}
              <div data-aos="flip-up" className="order-1 sm:order-2">
                <img
                  src={TravelImg1}
                  alt="biryani img"
                  className="max-w-[450px] h-[350px] w-full mx-auto drop-shadow-[5px_5px_12px_rgba(0,0,0,0.7)] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
       <div className="bg-black-100">
        <div className="flex justify-center items-center backdrop-blur-xl py-8">
          <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Image section */}
              <div data-aos="flip-up">
                <img
                  src={TravelImg}
                  alt="biryani img"
                  className="max-w-[450px] h-[350px] w-full mx-auto drop-shadow-[5px_5px_12px_rgba(0,0,0,0.7)] object-cover"
                />
              </div>
              {/* text content section */}
              <div className="flex flex-col justify-center gap-6 sm:pt-0 lg:px-16" data-aos="fade-up">
                <h1 className="text-3xl sm:text-4xl font-bold">
                  Explore all corners of The world with us
                </h1>
                <p className="text-sm text-gray-500 tracking-wide leading-8">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Eaque reiciendis inventore iste ratione ex alias quis magni at
                  optio ratione ex alias quis magni at optio
                  <br />
                </p>
                <div className="grid grid-cols-2 gap-6" data-aos="zoom-in">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <MdFlight className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400 text-black dark:text-white" />
                      <p>Flight</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <MdOutlineLocalHotel className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400 text-black dark:text-white" />
                      <p>Hotel</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <IoIosWifi className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400 text-black dark:text-white" />
                      <p>Wi-fi</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <IoFastFoodSharp className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400 text-black dark:text-white" />
                      <p>Foods</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black-100">
        <div className="flex justify-center items-center backdrop-blur-xl py-8">
          <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* text content section - now comes first in DOM but appears on right */}
              <div className="flex flex-col justify-center gap-6 sm:pt-0 lg:px-16 order-2 sm:order-1" data-aos="fade-up">
                <h1 className="text-3xl sm:text-4xl font-bold">
                  Explore all corners of The world with us
                </h1>
                <p className="text-sm text-gray-500 tracking-wide leading-8">
                  Lorem ipsumdei, dolor sit amet consectetur adipisicing elit.
                  Eaque reiciendis inventore iste ratione ex alias quis magni at
                  optio ratione ex alias quis magni at optio
                  <br />
                </p>
                <div className="grid grid-cols-2 gap-6" data-aos="zoom-in">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <MdFlight className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400 text-black dark:text-white" />
                      <p>Flight</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <MdOutlineLocalHotel className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400 text-black dark:text-white" />
                      <p>Hotel</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <IoIosWifi className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400 text-black dark:text-white" />
                      <p>Wi-fi</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <IoFastFoodSharp className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400 text-black dark:text-white" />
                      <p>Foods</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Image section - now comes second in DOM but appears on left */}
              <div data-aos="flip-up" className="order-1 sm:order-2">
                <img
                  src={TravelImg1}
                  alt="biryani img"
                  className="max-w-[450px] h-[350px] w-full mx-auto drop-shadow-[5px_5px_12px_rgba(0,0,0,0.7)] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
