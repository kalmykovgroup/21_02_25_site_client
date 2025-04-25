import React  from "react";
import styles from "./PromoSlider.module.css";


import { Swiper, SwiperSlide } from "swiper/react";
import {EffectCoverflow, Pagination, Navigation, Autoplay} from "swiper/modules";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "swiper/css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "swiper/css/effect-coverflow";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "swiper/css/pagination";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "swiper/css/navigation";

import {BannerDto} from "../../api/Promo/Dtos/BannerDto.ts";


const PromoSlider: React.FC = () => {

    const banners: BannerDto[] = [
        {id: "1", link: "/home", alt: "",  img: "https://storage.yandexcloud.net/kalmykov-group.ru/promo/banner1.webp"},
        {id: "2", link: "/home", alt: "",  img: "https://storage.yandexcloud.net/kalmykov-group.ru/promo/banner2.webp"},
        {id: "3", link: "/home", alt: "",  img: "https://storage.yandexcloud.net/kalmykov-group.ru/promo/banner3.webp"},
        {id: "4", link: "/home", alt: "",  img: "https://storage.yandexcloud.net/kalmykov-group.ru/promo/banner4.webp"},
        {id: "5", link: "/home", alt: "",  img: "https://storage.yandexcloud.net/kalmykov-group.ru/promo/banner5.webp"},
    ]

    return (
        <div className={styles.promoSlider}>
            <Swiper
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={3}
                loop={true}
                autoplay={{
                    delay: 5000, // Задержка между сменой слайдов (в миллисекундах)
                    disableOnInteraction: false, // Продолжать автопрокрутку после взаимодействия
                }}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,  // значение можно подбирать экспериментально
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                modules={[Autoplay, EffectCoverflow, Pagination, Navigation]}
                pagination={{ el: ".swiper-pagination", clickable: true }}
                navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                }}
                className="swiper_container"
            >
                {banners.map((banner, index) => (
                    <SwiperSlide key={index}>
                        <img src={banner.img} alt={banner.alt} style={{ width: '100%', height: 'auto' }} />
                    </SwiperSlide>
                ))}

                <div className="slider-controller">
                    <div className="swiper-button-prev slider-arrow">

                    </div>
                    <div className="swiper-button-next slider-arrow">

                    </div>
                    <div className="swiper-pagination"></div>
                </div>
            </Swiper>
        </div>
    );
};

export default PromoSlider;