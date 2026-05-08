const MentionsLegales = () => {
    return (
        <div className="bg-white py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-black text-afrilane-dark-grey mb-12">
                    Mentions <span className="text-afrilane-blue">Légales</span>
                </h1>

                <section className="space-y-12 text-gray-600 leading-8">

                    {/* Présentation */}
                    <div>
                        <h2 className="text-xl font-bold text-afrilane-dark-grey mb-4 uppercase tracking-wider">
                            1. Présentation de l'entreprise
                        </h2>

                        <p>
                            Le site <strong>afrilane.cm</strong> est édité par
                            <strong> AFRILANE</strong>, Cabinet d’ingénierie informatique
                            et Centre de Formation Professionnelle agréé.
                        </p>

                        <ul className="mt-4 list-disc pl-5 space-y-2">
                            <li>
                                <strong>Siège social :</strong> Yaoundé – Maétur Biteng,
                                Cameroun
                            </li>

                            <li>
                                <strong>Statut :</strong> Centre de Formation
                                Professionnelle Agréé (MINEFOP)
                            </li>

                            <li>
                                <strong>Téléphone :</strong> +237 222 31 16 01
                            </li>

                            <li>
                                <strong>Email :</strong> contact@afrilane.cm
                            </li>
                        </ul>
                    </div>

                    {/* Directeur */}
                    <div>
                        <h2 className="text-xl font-bold text-afrilane-dark-grey mb-4 uppercase tracking-wider">
                            2. Directeur de publication
                        </h2>

                        <p>
                            Le directeur de publication du site est AFRILANE.
                        </p>
                    </div>

                    {/* Hébergement */}
                    <div>
                        <h2 className="text-xl font-bold text-afrilane-dark-grey mb-4 uppercase tracking-wider">
                            3. Hébergement
                        </h2>

                        <p>
                            Le site est hébergé par <strong>Vercel Inc.</strong>,
                            situé à San Francisco, Californie, États-Unis.
                        </p>
                    </div>

                    {/* Propriété intellectuelle */}
                    <div>
                        <h2 className="text-xl font-bold text-afrilane-dark-grey mb-4 uppercase tracking-wider">
                            4. Propriété intellectuelle
                        </h2>

                        <p>
                            L’ensemble du contenu présent sur ce site
                            (textes, images, graphismes, logo, vidéos,
                            icônes, structure et design) est protégé par les lois
                            relatives à la propriété intellectuelle.
                        </p>

                        <p className="mt-4">
                            Toute reproduction, modification ou diffusion,
                            totale ou partielle, sans autorisation préalable
                            écrite d’AFRILANE est strictement interdite.
                        </p>
                    </div>

                    {/* Données personnelles */}
                    <div>
                        <h2 className="text-xl font-bold text-afrilane-dark-grey mb-4 uppercase tracking-wider">
                            5. Données personnelles
                        </h2>

                        <p>
                            AFRILANE s’engage à assurer la confidentialité
                            des données personnelles collectées via le site.
                        </p>

                        <p className="mt-4">
                            Les informations recueillies via les formulaires
                            sont utilisées uniquement dans le cadre des services
                            proposés par AFRILANE.
                        </p>
                    </div>

                    {/* Cookies */}
                    <div>
                        <h2 className="text-xl font-bold text-afrilane-dark-grey mb-4 uppercase tracking-wider">
                            6. Cookies
                        </h2>

                        <p>
                            Le site peut utiliser des cookies afin d’améliorer
                            l’expérience utilisateur et réaliser des statistiques
                            de navigation.
                        </p>
                    </div>

                    {/* Responsabilité */}
                    <div>
                        <h2 className="text-xl font-bold text-afrilane-dark-grey mb-4 uppercase tracking-wider">
                            7. Responsabilité
                        </h2>

                        <p>
                            AFRILANE met tout en œuvre pour assurer l’exactitude
                            des informations diffusées sur le site. Toutefois,
                            aucune garantie n’est donnée quant à l’exhaustivité
                            ou à l’actualité des contenus.
                        </p>
                    </div>

                </section>
            </div>
        </div>
    );
};

export default MentionsLegales;