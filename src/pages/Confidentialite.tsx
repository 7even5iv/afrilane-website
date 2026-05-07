const Confidentialite = () => {
    return (
        <div className="bg-afrilane-light-grey py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-12 rounded-3xl shadow-sm">
                <h1 className="text-4xl font-black text-afrilane-dark-grey mb-8">Politique de <span className="text-afrilane-blue">Confidentialité</span></h1>

                <div className="space-y-8 text-gray-600">
                    <p>Chez AFRILANE, nous accordons une importance capitale à la protection de vos données personnelles.</p>

                    <div>
                        <h2 className="text-xl font-bold text-afrilane-dark-grey mb-2 uppercase">Collecte des données</h2>
                        <p>Nous collectons les informations que vous nous fournissez via nos formulaires d'inscription ou de contact (Nom, Email, Numéro de téléphone).</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-afrilane-dark-grey mb-2 uppercase">Utilisation</h2>
                        <p>Vos données sont exclusivement utilisées pour :</p>
                        <ul className="list-disc pl-5">
                            <li>Le traitement de vos inscriptions aux formations/certifications.</li>
                            <li>L'envoi d'informations administratives ou pédagogiques.</li>
                            <li>La réponse à vos demandes de devis ou d'audit.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-afrilane-dark-grey mb-2 uppercase">Vos Droits</h2>
                        <p>Conformément aux lois en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression de vos données en nous contactant à <strong>contact@afrilane.cm</strong>.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Confidentialite;