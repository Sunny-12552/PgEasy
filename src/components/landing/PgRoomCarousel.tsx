import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Maximize2,
  X,
  Sparkles,
  Calendar
} from 'lucide-react';
import { Room } from '../../types';

export interface RoomSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  badgeColor: string;
  sharingType: string;
  price: string;
  highlights: string[];
  floor: string;
}

export const PG_ROOM_SLIDES: RoomSlide[] = [
  {
    id: 'room-deluxe-double',
    title: 'Deluxe Double Sharing Suite',
    subtitle: 'Twin beds, ergonomic study tables, bedside lamps & balcony view',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&auto=format&fit=crop&q=80',
    badge: '12 Beds Available Now',
    badgeColor: 'bg-emerald-500',
    sharingType: 'Double Sharing • AC',
    price: '₹9,500/month',
    highlights: ['AC & Fan', 'Attached Bath', 'Individual Study Desk', 'Lockable Wardrobe'],
    floor: 'Floor 1 & 2'
  },
  {
    id: 'room-premium-single',
    title: 'Executive Single Private Room',
    subtitle: 'Private room with large daylight window, ergonomic chair & high-speed Wi-Fi',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&auto=format&fit=crop&q=80',
    badge: 'Only 1 Room Left',
    badgeColor: 'bg-amber-500',
    sharingType: 'Single Room • AC',
    price: '₹14,500/month',
    highlights: ['100% Privacy', 'Private Balcony', 'Smart TV', 'Geyser Attached'],
    floor: 'Floor 3 (Quiet Wing)'
  },
  {
    id: 'room-triple-sharing',
    title: 'Comfort Triple Sharing Room',
    subtitle: 'Spacious airy room with individual wooden beds, shelves & power sockets',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&auto=format&fit=crop&q=80',
    badge: 'Best Value for Students & Pros',
    badgeColor: 'bg-indigo-500',
    sharingType: 'Triple Sharing • AC / Non-AC',
    price: '₹7,500/month',
    highlights: ['Spacious Layout', 'Daily Housekeeping', '3 Meals Included', 'Shoe Racks'],
    floor: 'Floor 1'
  },
  {
    id: 'room-workstation-nook',
    title: 'In-Room Study & Workstation Nook',
    subtitle: 'Dual-band Wi-Fi optical fiber, comfortable task chair & ample power outlets',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop&q=80',
    badge: 'Work From Home Ready',
    badgeColor: 'bg-blue-600',
    sharingType: 'High-Speed Wi-Fi Zone',
    price: 'Gigabit Fiber Included',
    highlights: ['300 Mbps Fiber', 'Zero Power Cuts', 'UPS Backup', 'Quiet Ambiance'],
    floor: 'All Rooms'
  },
  {
    id: 'room-dining-lounge',
    title: 'Resident Dining & Common Hall',
    subtitle: 'Hygienic cafeteria serving 3 home-style meals, microwave & UV filtered water',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&auto=format&fit=crop&q=80',
    badge: '3 Times Food Everyday',
    badgeColor: 'bg-emerald-600',
    sharingType: 'Dining & Social Hub',
    price: 'Breakfast, Lunch & Dinner',
    highlights: ['Buffet Counter', 'South & North Menu', 'RO Drinking Water', 'Clean Dining'],
    floor: 'Ground Floor'
  },
  {
    id: 'room-modern-bathroom',
    title: 'Hygienic Modern Attached Bathrooms',
    subtitle: 'Instant geyser 24x7 hot water, modern sanitaryware & daily sanitization',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80',
    badge: 'Deep Cleaned Daily',
    badgeColor: 'bg-teal-600',
    sharingType: 'Attached Restroom',
    price: 'Daily Deep Cleaning',
    highlights: ['24x7 Hot Water', 'Pressure Shower', 'Mirror & Cabinet', 'Ventilated'],
    floor: 'Attached to Every Room'
  }
];

interface PgRoomCarouselProps {
  onOpenEnquiry?: (room?: Room | null) => void;
  pgName?: string;
}

export const PgRoomCarousel: React.FC<PgRoomCarouselProps> = ({
  onOpenEnquiry,
  pgName = 'GreenNest Premium PG'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 4000; // 4 seconds per slide
  const currentSlide = PG_ROOM_SLIDES[currentIndex];

  // Auto-slide effect with smooth progress bar
  useEffect(() => {
    if (isPaused || isLightboxOpen) return;

    const startTime = Date.now();
    const intervalTime = 50; // update progress every 50ms

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsed / SLIDE_DURATION) * 100);
      setProgress(currentProgress);

      if (elapsed >= SLIDE_DURATION) {
        setCurrentIndex((prev) => (prev + 1) % PG_ROOM_SLIDES.length);
        setProgress(0);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, isLightboxOpen]);

  const handleNext = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % PG_ROOM_SLIDES.length);
  };

  const handlePrev = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + PG_ROOM_SLIDES.length) % PG_ROOM_SLIDES.length);
  };

  const handleSelect = (index: number) => {
    setProgress(0);
    setCurrentIndex(index);
  };

  return (
    <>
      <div
        id="pg-room-moving-carousel"
        className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-slate-900 group select-none transition-all"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Top Progress Bar (Moving Timer) */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/20 z-30 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-indigo-400 to-indigo-500 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Main Image Stage */}
        <div className="relative w-full h-84 sm:h-[420px] overflow-hidden bg-slate-950">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </motion.div>
          </AnimatePresence>

          {/* Vignette & Gradient Overlays for High Contrast Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/25 pointer-events-none" />

          {/* Top Header Tags */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full ${currentSlide.badgeColor} text-white font-bold text-xs shadow-md flex items-center gap-1.5`}
              >
                <span className="w-2 h-2 rounded-full bg-white inline-block animate-ping" />
                {currentSlide.badge}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/45 backdrop-blur-md text-white/95 font-medium text-xs border border-white/20">
                {currentSlide.sharingType}
              </span>
            </div>

            {/* Quick Action Buttons on Top Right */}
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/20">
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all"
                title={isPaused ? 'Resume autoplay' : 'Pause moving pictures'}
                aria-label={isPaused ? 'Resume autoplay' : 'Pause moving pictures'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-white" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all"
                title="View Fullscreen"
                aria-label="View Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Left / Right Chevron Arrows (Hover & Touch Friendly) */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/45 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-85 sm:opacity-0 group-hover:opacity-100 hover:bg-black/75 hover:scale-105 transition-all shadow-lg"
            aria-label="Previous Room Image"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/45 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-85 sm:opacity-0 group-hover:opacity-100 hover:bg-black/75 hover:scale-105 transition-all shadow-lg"
            aria-label="Next Room Image"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Bottom Card Content: Title, Rent & Booking Trigger */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-20 text-white">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {pgName}
                  </span>
                  <span className="text-[11px] text-white/60 font-medium">• {currentSlide.floor}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
                  {currentSlide.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 line-clamp-1 max-w-md drop-shadow-xs">
                  {currentSlide.subtitle}
                </p>

                {/* Highlights chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {currentSlide.highlights.map((item, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-xs text-white/90 font-medium border border-white/10"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Action Button */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0">
                <div className="sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-300 block">Starting Rent</span>
                  <span className="text-lg sm:text-xl font-extrabold text-white text-emerald-300">
                    {currentSlide.price}
                  </span>
                </div>
                {onOpenEnquiry && (
                  <button
                    type="button"
                    onClick={() => onOpenEnquiry(null)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg hover:shadow-emerald-500/25 transition-all transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
                    Book Visit
                  </button>
                )}
              </div>
            </div>

            {/* Slide Indicators Strip */}
            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {PG_ROOM_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === idx
                        ? 'w-7 bg-emerald-400 shadow-xs shadow-emerald-400/50'
                        : 'w-2 bg-white/35 hover:bg-white/60'
                    }`}
                    title={`Slide ${idx + 1}: ${slide.title}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Slide Counter & Moving indicator label */}
              <div className="flex items-center gap-2 text-[11px] text-white/70 font-mono">
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {isPaused ? 'Paused' : 'Moving Pictures'}
                </span>
                <span>
                  {currentIndex + 1} / {PG_ROOM_SLIDES.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Bottom Mini Thumbnail Selector */}
        <div className="bg-slate-900/95 border-t border-white/10 px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {PG_ROOM_SLIDES.map((slide, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/30 border-indigo-500/80 text-white shadow-xs'
                    : 'bg-white/5 border-transparent text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <img
                  src={slide.image}
                  alt=""
                  className={`w-7 h-7 rounded-lg object-cover ring-1 ${
                    isActive ? 'ring-emerald-400' : 'ring-white/20'
                  }`}
                />
                <div className="text-[11px] leading-tight">
                  <span className="font-bold block text-white truncate max-w-[110px]">
                    {slide.title.split(' ')[0]} {slide.title.split(' ')[1]}
                  </span>
                  <span className="text-[9px] text-slate-400 block truncate max-w-[110px]">
                    {slide.sharingType.split('•')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox / Fullscreen Modal */}
      {isLightboxOpen && (
        <div
          id="pg-room-lightbox-modal"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between text-white pb-4 border-b border-white/15">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                {pgName} • High Resolution Room View
              </span>
              <h2 className="text-xl sm:text-2xl font-black">{currentSlide.title}</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
            />
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-all cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white pt-3 border-t border-white/15">
            <div className="text-center sm:text-left">
              <p className="text-sm text-slate-200">{currentSlide.subtitle}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-emerald-400">{currentSlide.price}</span>
                <span className="text-xs text-slate-400">• {currentSlide.sharingType}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {onOpenEnquiry && (
                <button
                  type="button"
                  onClick={() => {
                    setIsLightboxOpen(false);
                    onOpenEnquiry(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md cursor-pointer"
                >
                  Book / Enquire for this Room
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
