'use client';

import { motion } from "framer-motion";

interface PartnerCardProps {
  name: string;
  logo: string;
}

const PartnerCard = ({
  name,
  logo
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
    }
  };

  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.02
      }}
      transition={{
        type: "spring",
        stiffness: 250
      }}
      className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border border-white/20
                bg-white/70
                backdrop-blur-xl
                shadow-lg shadow-blue-900/5
                hover:shadow-2xl
                transition-all
                duration-500
                min-h-[170px]
                p-8
            "
    >

      {/* Glow Effect */}
      <div className="
                absolute
                inset-0
                opacity-0
                group-hover:opacity-100
                transition-opacity
                duration-500
                bg-gradient-to-br
                from-blue-500/5
                to-cyan-500/5
            " />

      {/* Border Glow */}
      <div className="
                absolute
                inset-0
                rounded-3xl
                border
                border-blue-500/0
                group-hover:border-blue-500/10
                transition-all
                duration-500
            " />

      {/* Content */}
      <div className="
                relative
                flex
                items-center
                justify-center
                w-full
                h-full
            ">

        {/* Logo */}
        <motion.img
          src={logo}
          alt={`Logo ${name}`}
          loading="lazy"
          onError={handleError}
          whileHover={{
            scale: 1.05
          }}
          transition={{
            duration: 0.3
          }}
          className="object-cover transition-all duration-[1.5s] 
          ease-out group-hover:scale-110 
          md:grayscale md:group-hover:grayscale-0"
        />

        {/* Fallback */}
        <div className="
                    hidden
                    absolute
                    inset-0
                    items-center
                    justify-center
                    flex-col
                    text-center
                ">

          <div className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-blue-100
                        text-blue-600
                        flex
                        items-center
                        justify-center
                        font-black
                        text-xl
                        mb-3
                    ">
            {name.charAt(0)}
          </div>

          <span className="
                        text-sm
                        font-bold
                        text-gray-500
                        uppercase
                        tracking-[0.2em]
                    ">
            {name}
          </span>

        </div>
      </div>

      {/* Bottom Glow Line */}
      <div className="
                absolute
                bottom-0
                left-0
                h-1
                w-0
                group-hover:w-full
                bg-gradient-to-r
                from-blue-500
                to-cyan-400
                transition-all
                duration-500
            " />

    </motion.div>
  );
};

export default PartnerCard;