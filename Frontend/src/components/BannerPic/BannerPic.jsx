import React from "react";

const BannerPic = ({ img }) => {
  const bgImage = {
    backgroundImage: `url(${img})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "300px",
  };
  return (
    <div data-aos="zoom-in" className="h-[300px] w-full" style={bgImage}></div>
  );
};

export default BannerPic;
