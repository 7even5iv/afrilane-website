const Confidentialite = () => {
    return (
        <div className="bg-afrilane-light-grey py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100">

                    <h1 className="text-4xl font-black text-afrilane-dark-grey mb-12">
                        Politique de{" "}
                        <span className="text-afrilane-blue">
                            Confidentialité
                        </span>
                    </h1>

                    <div className="space-y-12 text-gray-600 leading-8">

                        {/* Introduction */}
                        <div>
                            <p>
                                Chez <strong>AFRILANE</strong>, la protection
                                de vos données personnelles est une priorité.
                                Cette politique explique quelles données sont
                                collectées, comment elles sont utilisées et
                                quels sont vos droits.
                            </p>
                        </div>

                        {/* Collecte */}
                        <div>
                            <h2 className="text-xl font-bold text-afrilane-dark-grey mb-4 uppercase tracking-wider">
                                1. Collecte des données
                            </h2>

                            <p>
                                Nous collectons certaines informations lorsque
                                vous utilisez notre site ou remplissez nos
                                formulaires.
                            </p>

                            <ul className="mt-4 list-disc pl-5 space-y-2">
                                <li>Nom et prénom</li>
                                <li>Adresse e-mail</li>
                                <li>Numéro de téléphone</li>
                                <li>Informations relatives aux formations</li>
                            </ul>
                        </div>

                        {/* Utilisation */}
                        <div>
                            <h2 className="text-xl font-bold text-afrilane-dark-grey mb-4 uppercase tracking-wider">
                                2. Utilisation des données
                            </h2>

                            <p>
                                Les informations collectées sont utilisées
                                exclusivement dans le cadre des activités
                                d’AFRILANE :
                            </p>

                            <ul className="mt-4 list-disc pl-5 space-y-2">
                                <li>
                                    Gestion des inscriptions aux formations
                                    et certifications
                                </li>

                                <li>
                                    Envoi d’informations administratives
                                    et pédagogiques
                                </li>

                                <li>
                                    Réponse aux demandes de contact,
                                    devis ou audit
                                </li>

                                <li>
                                    Amélioration de l’expérience utilisateur
                                    sur le site
                                </li>
                            </ul>
                        </div>

                        {/* Protection */}
                        <div>
                            <h2 className="text-xl font-bold text-afrilane-dark-grey mb-4 uppercase tracking-wider">
                                3. Protection des données
                            </h2>

                            <p>
                                AFRILANE met en œuvre des mesures de sécurité
                                techniques et organisationnelles afin de protéger
                                vos données contre tout accès non autorisé,
                                perte ou divulgation.
                            </p>
                        </div>

                        {/* Cookies */}
                        <div>
                            <h2 className="text-xl font-bold text-afrilane-dark-grey mb-4 uppercase tracking-wider">
                                4. Cookies
                            </h2>

                            <p>
                                Le site peut utiliser des cookies pour améliorer
                                votre navigation, mesurer l’audience et optimiser
                                les performances du site.
                            </p>
                        </div>

                        {/* Droits */}
                        <div>
                            <h2 className="text-xl font-bold text-afrilane-dark-grey mb-4 uppercase tracking-wider">
                                5. Vos droits
                            </h2>

                            <p>
                                Conformément aux réglementations en vigueur,
                                vous disposez d’un droit :
                            </p>

                            <ul className="mt-4 list-disc pl-5 space-y-2">
                                <li>D’accès à vos données</li>
                                <li>De rectification</li>
                                <li>De suppression</li>
                                <li>D’opposition au traitement</li>
                            </ul>

                            <p className="mt-4">
                                Pour exercer vos droits, contactez-nous à :
                                <strong> contact@afrilane.cm</strong>
                            </p>
                        </div>

                        {/* Modification */}
                        <div>
                            <h2 className="text-xl font-bold text-afrilane-dark-grey mb-4 uppercase tracking-wider">
                                6. Modification de la politique
                            </h2>

                            <p>
                                AFRILANE se réserve le droit de modifier la
                                présente politique de confidentialité à tout
                                moment afin de garantir sa conformité avec les
                                évolutions légales et techniques.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Confidentialite;