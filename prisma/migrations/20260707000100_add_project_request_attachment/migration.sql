-- AlterTable: colonnes optionnelles pour la pièce jointe transmise par le
-- prospect depuis le formulaire public de demande de projet (lien Cloudinary
-- + nom de fichier d'origine). Additif et nullable : aucune donnée existante
-- n'est impactée.
ALTER TABLE "ProjectRequest" ADD COLUMN "attachmentUrl" TEXT;
ALTER TABLE "ProjectRequest" ADD COLUMN "attachmentName" TEXT;
