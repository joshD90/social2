import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

import "./swiperStyles.css";

type Props = { images: string[] };

const ServiceImageDisplay: FC<Props> = ({ images }) => {
  return (
    <Swiper
      modules={[Navigation]}
      onSlideChange={() => console.log("slide changing")}
      height={72}
      navigation
      loop={true}
    >
      {images.map((img) => (
        <SwiperSlide key={img}>
          <div className="h-full w-full flex items-center justify-center">
            <img src={img} className="h-72" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ServiceImageDisplay;
