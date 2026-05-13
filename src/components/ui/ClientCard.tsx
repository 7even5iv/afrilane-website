import { motion } from "framer-motion";

interface ClientCardProps {
    name: string;
    logo: string;
    industry: string;
}

const ClientCard = ({ name, logo, industry }: ClientCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -15, scale: 1.02 }}
            className="relative group h-64 w-full bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-blue-900/5 overflow-hidden flex items-center justify-center p-12 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)] hover:border-blue-200"
        >
            {/* CONTENU PRINCIPAL */}
            <div className="relative z-10 flex flex-col items-center text-center w-full">

                {/* ZONE LOGO / NOM - PLUS GRANDE */}
                <div className="h-32 w-full flex items-center justify-center mb-4">
                    <img
                        src={logo}
                        alt={name}
                        className="max-h-full max-w-[90%] object-contain filter grayscale md:grayscale md:group-hover:grayscale-0 landscape:grayscale-0 transition-all duration-700"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                    />

                    {/* TEXTE DE SECOURS - PLUS GRAND */}
                    <span className="hidden text-3xl font-black text-slate-200 group-hover:text-blue-600 transition-colors duration-500 uppercase tracking-widest">
                        {name}
                    </span>
                </div>

                {/* SECTEUR D'ACTIVITÉ */}
                <div className="overflow-hidden h-0 group-hover:h-8 transition-all duration-500 opacity-0 group-hover:opacity-100 mt-2">
                    <span className="text-[12px] font-bold text-blue-500 uppercase tracking-[0.3em] whitespace-nowrap">
                        {industry}
                    </span>
                </div>
            </div>

            {/* DÉCORATION : Ligne de couleur plus épaisse */}
            <div className="absolute bottom-0 left-0 w-0 h-2 bg-gradient-to-r from-blue-600 to-cyan-400 group-hover:w-full transition-all duration-700" />
        </motion.div>
    );
};

export default ClientCard;