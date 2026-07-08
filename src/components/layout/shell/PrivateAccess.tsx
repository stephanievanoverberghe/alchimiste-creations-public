"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

export type PrivateAccess = {
    adminPath?: string;
    clientPath: string;
    isAdmin: boolean;
} | null;

const PrivateAccessContext = createContext<PrivateAccess>(null);

/**
 * Récupère la session navigateur via /api/private-access **une seule fois**
 * par page et la partage à tout le shell (header, menu, footer) via contexte —
 * évite le double appel réseau quand plusieurs consommateurs coexistent. Les
 * pages publiques restent statiques : les anonymes voient « Connexion », un
 * client « Mon espace », l'admin « Admin ». `null` tant que la réponse n'est
 * pas arrivée (ou si déconnecté).
 */
export function PrivateAccessProvider({ children }: { children: ReactNode }) {
    const [privateAccess, setPrivateAccess] = useState<PrivateAccess>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadSession() {
            try {
                const response = await fetch("/api/private-access", {
                    cache: "no-store",
                });

                if (!response.ok) return;

                const access = (await response.json()) as PrivateAccess;

                if (!isMounted) return;

                setPrivateAccess(access);
            } catch {
                if (isMounted) setPrivateAccess(null);
            }
        }

        void loadSession();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <PrivateAccessContext.Provider value={privateAccess}>
            {children}
        </PrivateAccessContext.Provider>
    );
}

/** Lit la session partagée par le `PrivateAccessProvider` (aucun appel réseau). */
export function usePrivateAccess() {
    return useContext(PrivateAccessContext);
}
