// src/services/api.ts

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface InscriptionData {
    student_name: string;
    student_email: string;
    student_phone: string;
    formation_id: number | null;
    payment_method: string;
    registration_fees: number;
}

export const apiService = {
    // Inscription
    registerForFormation: async (data: InscriptionData) => {
        console.log("📤 Envoi au serveur:", JSON.stringify(data, null, 2));
        
        const response = await fetch(`${API_URL}/registrations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        console.log("📥 Réponse du serveur:", result);
        
        if (!response.ok) {
            // Gérer spécifiquement les erreurs de validation 422
            if (response.status === 422 && result.errors) {
                const errorMessages = Object.values(result.errors).flat().join(', ');
                throw new Error(`Validation échouée: ${errorMessages}`);
            }
            throw new Error(result.message || 'Erreur lors de l\'inscription');
        }
        
        return result;
    },
    
    // Initier un paiement
    initiatePayment: async (data: any) => {
        console.log("💰 Envoi paiement:", JSON.stringify(data, null, 2));
        
        const response = await fetch(`${API_URL}/payments/initiate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        console.log("💸 Réponse paiement:", result);
        
        if (!response.ok) {
            if (response.status === 422 && result.errors) {
                const errorMessages = Object.values(result.errors).flat().join(', ');
                throw new Error(`Validation paiement: ${errorMessages}`);
            }
            throw new Error(result.message || 'Erreur lors de l\'initiation du paiement');
        }
        
        return result;
    },
    
    // Vérifier le statut du paiement
    checkPaymentStatus: async (transactionId: string) => {
        const response = await fetch(`${API_URL}/payments/status/${transactionId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        return await response.json();
    }
};