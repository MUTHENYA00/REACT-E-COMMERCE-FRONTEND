import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import toyImg from '../../assets/toy.jpg';
import kitchenImg from '../../assets/kitchen.png';
import gamingImg from '../../assets/gamingdeal.png';
import fashionImg from '../../assets/fashion.png';
import offerImg from '../../assets/offer.png';

export default function Hero() {
  const banners = [
    { path: '/category/toy', imgSource: toyImg },
    { path: '/product/kitchen', imgSource: kitchenImg },
    { path: '/search?price_max=20', imgSource: offerImg },
    { path: '/product/fashion', imgSource: fashionImg },
    { path: '/search?gaming', imgSource: gamingImg },
  ];

  return (
    <div className="block w-full max-w-6xl mx-auto rounded-none border-0 bg-white p-2.5 shadow-sm">
      {/* Structural dashboard frame wrapper c*/}
      <div className="relative w-full overflow-hidden rounded-none bg-slate-900">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true, el: '.custom-dots' }}
          navigation={{ nextEl: '.custom-next', prevEl: '.custom-prev' }}
          className="relative h-[220px] w-full select-none sm:h-[280px] md:h-[400px]"
        >
            
          {banners.map((slide, index) => (
            <SwiperSlide key={index}>
              
              <a
                href={slide.path}
                className="relative block h-full w-full rounded-none no-underline"
              >
                <img
                  src={slide.imgSource}
                  alt="Featured Promo Banner"
                  className="absolute top-0 left-0 h-full w-full rounded-none pointer-events-none object-cover"
                />
              </a>
            </SwiperSlide>
          ))}

      
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button className="custom-prev flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-black/40 text-white shadow-sm backdrop-blur-xs transition-all hover:bg-black/60 active:scale-95">
              <FaChevronLeft className="text-xs" />
            </button>
            <button className="custom-next flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-black/40 text-white shadow-sm backdrop-blur-xs transition-all hover:bg-black/60 active:scale-95">
              <FaChevronRight className="text-xs" />
            </button>
          </div>

       
          <div className="swiper-pagination custom-dots absolute bottom-4 left-1/2 z-20 fnplex -translate-x-1/2 items-center gap-1.5 [&_.swiper-pagination-bullet-active]:bg-white [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:bg-white/40 [&_.swiper-pagination-bullet]:opacity-1 [&_.swiper-pagination-bullet]:transition-all" />
        </Swiper>
      </div>
    </div>
  );
}
