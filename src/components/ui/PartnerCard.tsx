interface PartnerCardProps {
  name: string;
  logo: string;
}

const PartnerCard = ({ name, logo }: PartnerCardProps) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    img.style.display = "none";

    const fallback = img.nextElementSibling as HTMLElement | null;
    if (fallback) {
      fallback.classList.remove("hidden");
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg shadow-blue-900/5 flex items-center justify-center border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group min-h-[160px]">

      <div className="flex items-center justify-center w-full h-full relative">

        {/* LOGO */}
        <img
          src={logo}
          alt={`Logo ${name}`}
          loading="lazy"
          onError={handleError}
          className="max-h-16 w-auto object-contain filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
        />

        {/* FALLBACK */}
        <span className="hidden absolute text-lg font-semibold text-gray-400 uppercase tracking-wide text-center px-2">
          {name}
        </span>

      </div>
    </div>
  );
};

export default PartnerCard;