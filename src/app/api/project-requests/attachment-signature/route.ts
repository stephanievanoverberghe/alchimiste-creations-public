import { NextResponse } from "next/server";

import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { signCloudinaryUploadParams } from "@/server/cloudinary/signature";

export const runtime = "nodejs";

/**
 * Dossier Cloudinary imposé côté serveur pour toutes les pièces jointes de
 * demandes publiques. Le prospect ne peut ni le changer ni injecter d'autres
 * paramètres : seuls `folder` et `timestamp` sont signés, donc tout ajout
 * client invalide la signature.
 */
const ATTACHMENT_FOLDER = "project-requests/attachments";

/**
 * Signature d'upload pour la pièce jointe du formulaire public de demande.
 * Endpoint anonyme mais **rate-limité par IP** et strictement borné : il ne
 * signe qu'un upload dans un dossier fixe. La clé secrète Cloudinary ne quitte
 * jamais le serveur ; seuls la clé publique, le cloud, l'horodatage et la
 * signature sont renvoyés.
 */
export async function POST(request: Request) {
    const rateLimit = checkRateLimit({
        key: `project-request-attachment:${getClientIp(request)}`,
    });

    if (!rateLimit.ok) {
        return NextResponse.json(
            {
                ok: false,
                message:
                    "Trop de tentatives d'envoi. Merci de réessayer dans quelques minutes.",
            },
            {
                headers: {
                    "Retry-After": String(rateLimit.retryAfterSeconds),
                },
                status: 429,
            },
        );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;

    if (!cloudName || !apiKey) {
        return NextResponse.json(
            {
                ok: false,
                message: "L'envoi de document n'est pas disponible pour le moment.",
            },
            { status: 503 },
        );
    }

    const timestamp = Math.floor(Date.now() / 1000);

    try {
        const signature = signCloudinaryUploadParams({
            folder: ATTACHMENT_FOLDER,
            timestamp,
        });

        return NextResponse.json({
            ok: true,
            apiKey,
            cloudName,
            folder: ATTACHMENT_FOLDER,
            signature,
            timestamp,
        });
    } catch {
        return NextResponse.json(
            {
                ok: false,
                message: "L'envoi de document n'est pas disponible pour le moment.",
            },
            { status: 503 },
        );
    }
}
