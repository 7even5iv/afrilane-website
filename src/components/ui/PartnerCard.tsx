'use client';

import { motion } from "framer-motion";
import { FaShieldAlt } from "react-icons/fa";

interface PartnerCardProps {
  name: string;
  logo: string;
  orientation?: 'portrait' | 'landscape';
}

const PartnerCard = ({
  name,
  logo,
  orientation = 'landscape'
}: PartnerCardProps) => {

  const handleError = (
    e: React.SyntheticEvent<HTMLImageElement>
  ) => {
    const img = e.currentTarget;

    img.style.display = "none";

    const fallback =
      img.nextElementSibling as HTMLElement | null;

    if (fallback) {
      fallback.classList.remove("hidden");
      fallback.classList.add("flex");
    }
  };

  // Configuration des dimensions selon l'orientation
  const getImageDimensions = () => {
    switch (orientation) {
      case 'portrait':
        return {
          containerClass: "aspect-[3/4]",
          imageClass: "h-auto w-full max-h-32 object-cover",
          wrapperClass: "mb-4"
        };
      case 'landscape':
        return {
          containerClass: "aspect-[4/3]",
          imageClass: "h-auto w-full object-contain",
          wrapperClass: "mb-4"
        };
      default:
        return {
          containerClass: "aspect-square",
          imageClass: "h-16 object-contain",
          wrapperClass: ""
        };
    }
  };

  const dimensions = getImageDimensions();

  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 18,
      }}
      className={`
        group
        relative
        overflow-hidden
        rounded-[28px]
        border border-white/10
        bg-white/70
        backdrop-blur-2xl
        shadow-[0_10px_50px_rgba(0,0,0,0.08)]
        hover:shadow-[0_20px_80px_rgba(59,130,246,0.18)]
        transition-all
        duration-700
        ${orientation === 'portrait' ? 'min-h-[280px]' : 'min-h-[190px]'}
        p-8
      `}
    >

      {/* BACKGROUND GLOW */}
      <div
        className="
          absolute
          inset-0
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-700
          bg-gradient-to-br
          from-blue-500/10
          via-cyan-400/5
          to-transparent
        "
      />

      {/* TOP LIGHT */}
      <div
        className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2
          w-32
          h-32
          bg-blue-400/20
          blur-3xl
          opacity-0
          group-hover:opacity-100
          transition-all
          duration-700
        "
      />

      {/* BORDER EFFECT */}
      <div
        className="
          absolute
          inset-0
          rounded-[28px]
          border
          border-blue-500/0
          group-hover:border-blue-500/20
          transition-all
          duration-500
        "
      />

      {/* CONTENT */}
      <div
        className="
          relative
          z-10
          flex
          flex-col
          items-center
          justify-center
          h-full
        "
      >

        {/* LOGO CONTAINER */}
        <div className={dimensions.wrapperClass}>
          <motion.div
            className={`${dimensions.containerClass} flex items-center justify-center`}
            whileHover={{
              scale: 1.05,
            }}
            transition={{
              duration: 0.4,
            }}
          >
            <motion.img
              src={logo}
              alt={`Logo ${name}`}
              loading="lazy"
              onError={handleError}
              whileHover={{
                scale: 1.08,
              }}
              transition={{
                duration: 0.4,
              }}
              className={`
                ${dimensions.imageClass}
                transition-all
                duration-700
                /* SUPPRESSION DU GRIS - IMAGES TOUJOURS EN COULEURS */
                group-hover:scale-110
              `}
            />
          </motion.div>
        </div>

        {/* FALLBACK */}
        <div
          className="
            hidden
            absolute
            inset-0
            items-center
            justify-center
            flex-col
            text-center
          "
        >

          <div
            className="
              w-16
              h-16
              rounded-2xl
              bg-gradient-to-br
              from-blue-500
              to-cyan-400
              text-white
              flex
              items-center
              justify-center
              font-black
              text-2xl
              shadow-lg
              mb-4
            "
          >
            {name.charAt(0)}
          </div>

          <span
            className="
              text-sm
              font-bold
              text-gray-700
              uppercase
              tracking-[0.25em]
            "
          >
            {name}
          </span>

        </div>

        {/* LABEL */}
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          whileHover={{
            opacity: 1,
            y: 0,
          }}
          className="
            absolute
            bottom-0
            flex
            items-center
            gap-2
            text-xs
            font-semibold
            text-gray-500
            uppercase
            tracking-[0.18em]
          "
        >
          <FaShieldAlt className="text-blue-500" />
          Trusted Partner
        </motion.div>
      </div>

      {/* BOTTOM LINE */}
      <div
        className="
          absolute
          bottom-0
          left-0
          h-[3px]
          w-0
          group-hover:w-full
          bg-gradient-to-r
          from-blue-500
          via-cyan-400
          to-blue-500
          transition-all
          duration-700
        "
      />

    </motion.div>
  );
};

export default PartnerCard;