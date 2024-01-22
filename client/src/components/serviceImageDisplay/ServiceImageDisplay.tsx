import { FC, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

import "./swiperStyles.css";

type Props = { images: { main_pic: boolean | undefined; url: string }[] };

const ServiceImageDisplay: FC<Props> = ({ images }) => {
  return (
    <Swiper
      modules={[Navigation]}
      height={72}
      navigation
      loop={true}
      className="swiper-container"
    >
      {images.map((img) => (
        <SwiperSlide key={img.url}>
          <div className="h-full w-full flex items-center justify-center">
            <img src={img.url} className="h-72" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ServiceImageDisplay;
