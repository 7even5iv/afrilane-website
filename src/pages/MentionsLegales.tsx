const MentionsLegales = () => {
    return (
        <div className="bg-white py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-black text-afrilane-dark-grey mb-8">Mentions <span className="text-afrilane-blue">Légales</span></h1>

                <section className="space-y-8 text-gray-600 leading-relaxed">
                    <div>
                        <h2 className="text-xl font-bold text-afrilane-dark-grey mb-4 uppercase tracking-wider">1. Présentation de l'entreprise</h2>
                        <p>Le site <strong>afrilane.cm</strong> est édité par AFRILANE, Cabinet d'ingénierie informatique et Centre de Formation Professionnelle.</p>
                        <ul className="mt-2 list-disc pl-5">
                            <li><strong>Siège Social :</strong> Yaoundé - Maétur Biteng, Entrée Maétur Biteng, Cameroun.</li>
                            <li><strong>Statut :</strong> Centre de Formation Professionnelle Agréé (MINEFOP).</li>
                            <li><strong>Contact :</strong> +237 222 31 16 01 / contact@afrilane.cm</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-afrilane-dark-grey mb-4 uppercase tracking-wider">2. Hébergement</h2>
                        <p>Le site est hébergé par Vercel Inc., dont le siège social est situé à San Francisco, USA.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-afrilane-dark-grey mb-4 uppercase tracking-wider">3. Propriété Intellectuelle</h2>
                        <p>L'ensemble de ce site (logo, textes, structure) relève de la législation camerounaise et internationale sur le droit d'auteur et la propriété intellectuelle. Toute reproduction est interdite sans autorisation préalable d'AFRILANE.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MentionsLegales;