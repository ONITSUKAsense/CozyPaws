import {
  Star,
  ArrowUpRight,
  Play,
  ArrowRight,
  Plus,
} from "lucide-react";

const ASSETS = {
  avatar:
    "https://polo-pecan-73837341.figma.site/_assets/v11/e62173d41f91350a59628e8a9a55ae078a886fb9.png?w=128",
  productCard:
    "https://polo-pecan-73837341.figma.site/_assets/v11/3e5158dad63d392ade022e81890edc9f54d750bc.png",
  videoCard:
    "https://polo-pecan-73837341.figma.site/_assets/v11/76be6ec3a93a703b15e9cc01e764a4e3f9d7d2c0.png",
  bottomLeft:
    "https://polo-pecan-73837341.figma.site/_assets/v11/8d44b25186ef45a5789c74668fb781cea4e1ff49.png",
  bottomCenter:
    "https://polo-pecan-73837341.figma.site/_assets/v11/96745c4e72ad5c5208e53a885df797fd82cd854a.png?h=1024",
  bottomRight:
    "https://polo-pecan-73837341.figma.site/_assets/v11/81bd2e7a66b58f3d8f3ad78fd1ebf01af8dfdee1.png",
} as const;

function HeadingWords() {
  return (
    <h1 className="font-serif-display text-[#1a3d1a] md:text-7xl lg:text-[clamp(60px,7.5vw,110px)] leading-[0.95] tracking-tight">
      <span className="block">
        <span className="inline-block animate-word-pop delay-200">
          Everything
        </span>
      </span>
      <span className="block">
        <span className="inline-block animate-word-pop delay-400">Your</span>{" "}
        <span className="inline-block animate-word-pop delay-500">Pets</span>{" "}
        <span className="inline-block animate-word-pop delay-600">Love</span>
      </span>
    </h1>
  );
}

function LeftProductCard() {
  return (
    <div className="absolute md:top-[80px] lg:top-[50px] left-4 lg:left-12 z-10 md:w-[160px] lg:w-[clamp(160px,14vw,260px)] animate-slide-in-left delay-600">
      <div
        className="relative rounded-2xl overflow-hidden bg-gray-100"
        style={{ aspectRatio: "260/257" }}
      >
        <img
          src={ASSETS.productCard}
          alt="Cozy Cat House"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 w-8 h-8 md:w-10 md:h-10 bg-[#1a3d1a] rounded-full flex items-center justify-center hover:bg-[#2a5a2a] transition-colors cursor-pointer">
          <ArrowUpRight className="w-4 h-4 md:w-5 text-white" />
        </div>
      </div>
      <p className="text-gray-700 md:text-sm lg:text-base mt-1 font-medium">
        Cozy Cat House
      </p>
      <p className="text-[#1a3d1a] font-bold md:text-sm lg:text-base">$49.99</p>
    </div>
  );
}

function RightVideoCard() {
  return (
    <div className="absolute md:top-[80px] lg:top-[50px] right-4 lg:right-12 z-10 md:w-[120px] lg:w-[clamp(120px,10vw,177px)] animate-slide-in-right delay-700">
      <div
        className="relative rounded-2xl overflow-hidden bg-gray-100"
        style={{ aspectRatio: "177/287" }}
      >
        <img
          src={ASSETS.videoCard}
          alt="Video review"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#1a3d1a] flex items-center justify-center hover:bg-[#2a5a2a] transition-colors cursor-pointer">
          <Play className="w-4 h-4 md:w-5 text-white fill-white" />
        </div>
      </div>
      <p className="text-gray-600 text-[10px] md:text-[11px] lg:text-xs mt-1.5 leading-tight font-medium">
        Watch Product Reviews on TikTok and YouTube
      </p>
    </div>
  );
}

function BottomImages() {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end">
      <div
        className="relative flex-1 overflow-hidden"
        style={{ maxHeight: "min(70vh, 55vw)" }}
      >
        <img
          src={ASSETS.bottomLeft}
          alt=""
          className="w-full h-auto block animate-photo-reveal delay-800"
        />
        <div
          className="absolute left-4 lg:left-6 flex items-center gap-2"
          style={{ bottom: "clamp(20px, 4vh, 50px)" }}
        >
          <div className="flex items-center animate-scale-in delay-1000">
            <div className="flex -space-x-1.5">
              <img
                src={ASSETS.avatar}
                alt=""
                className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white object-cover"
              />
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#1a3d1a] flex items-center justify-center border-2 border-white">
                <Plus className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </div>
            </div>
            <span className="font-bold text-white text-sm md:text-base lg:text-lg ml-1.5">
              98K+
            </span>
          </div>
        </div>
      </div>

      <div
        className="relative flex-[1.3] overflow-hidden"
        style={{ maxHeight: "min(85vh, 70vw)" }}
      >
        <img
          src={ASSETS.bottomCenter}
          alt=""
          className="w-full h-auto block animate-photo-reveal delay-600"
        />
        <div
          className="absolute left-4 lg:left-6 right-4 lg:right-6"
          style={{ bottom: "clamp(20px, 4vh, 50px)" }}
        >
          <div className="animate-scale-in delay-1100">
            <p className="text-white font-bold text-sm md:text-base lg:text-lg">
              Best Products for Your Pet
            </p>
            <button className="mt-1.5 md:mt-2 bg-[#E86A10] hover:bg-[#d45e0d] text-white text-xs md:text-sm px-4 md:px-5 py-1.5 md:py-2 rounded-full inline-flex items-center gap-1.5 font-medium transition-colors">
              Explore Products
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        className="relative flex-1 overflow-hidden"
        style={{ maxHeight: "min(70vh, 55vw)" }}
      >
        <img
          src={ASSETS.bottomRight}
          alt=""
          className="w-full h-auto block animate-photo-reveal delay-900"
        />
        <div
          className="absolute right-4 lg:right-6"
          style={{ bottom: "clamp(20px, 4vh, 50px)" }}
        >
          <div className="flex items-center gap-1 animate-scale-in delay-1200">
            <Star className="w-5 h-5 md:w-6 md:h-6 text-[#E86A10]" fill="#E86A10" />
            <span className="font-bold text-white text-lg md:text-xl lg:text-2xl">
              4.6
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopLayout() {
  return (
    <div className="hidden md:flex flex-1 flex-col overflow-hidden relative">
      <div className="relative z-20 px-12 pt-[5.4rem] text-center">
        <HeadingWords />
      </div>

      <LeftProductCard />
      <RightVideoCard />

      <BottomImages />
    </div>
  );
}

function MobileLayout() {
  return (
    <div className="flex md:hidden flex-1 flex-col overflow-hidden">
      <div className="px-4 pt-4 text-center shrink-0">
        <h2 className="font-serif-display text-[#1a3d1a] text-[36px] leading-[1.1] tracking-tight">
          Everything Your Pets Love
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          Discover the best for your furry friends
        </p>
        <button className="mt-3 bg-[#E86A10] hover:bg-[#d45e0d] text-white text-sm font-medium px-6 py-2 rounded-full transition-colors">
          Explore Products
        </button>
      </div>

      <div className="flex gap-3 px-4 mt-4 shrink-0">
        <div className="flex-1 aspect-square rounded-2xl overflow-hidden bg-gray-100 relative">
          <img
            src={ASSETS.productCard}
            alt="Cozy Cat House"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-1.5 right-1.5 w-7 h-7 bg-[#1a3d1a] rounded-full flex items-center justify-center">
            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <div className="flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 relative">
          <img
            src={ASSETS.videoCard}
            alt="Video review"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#1a3d1a] flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 px-4 mt-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            <img
              src={ASSETS.avatar}
              alt=""
              className="w-6 h-6 rounded-full border-2 border-white object-cover"
            />
            <div className="w-6 h-6 rounded-full bg-[#1a3d1a] flex items-center justify-center border-2 border-white">
              <Plus className="w-3 h-3 text-white" />
            </div>
          </div>
          <span className="font-bold text-sm text-[#1a3d1a]">98K+</span>
        </div>
        <div className="w-px h-6 bg-gray-300" />
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-[#E86A10]" fill="#E86A10" />
          <span className="font-bold text-sm text-[#1a3d1a]">4.6</span>
        </div>
      </div>

      <div className="flex items-end flex-1 mt-2">
        <div className="flex-1 overflow-hidden">
          <img
            src={ASSETS.bottomLeft}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-[1.3] overflow-hidden">
          <img
            src={ASSETS.bottomCenter}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <img
            src={ASSETS.bottomRight}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <DesktopLayout />
      <MobileLayout />
    </div>
  );
}
