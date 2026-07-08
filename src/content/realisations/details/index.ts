import { ancreToiProject } from "./ancre-toi";
import { explorArtProject } from "./explor-art";
import { mysteresALaCarteProject } from "./mysteres-a-la-carte";
import { norelArtProject } from "./norel-art";
import { rivagePhotoProject } from "./rivage-photo";
import type { RealisationDetailContent } from "./types";

export const realisationDetailPages: readonly RealisationDetailContent[] = [
    norelArtProject,
    rivagePhotoProject,
    mysteresALaCarteProject,
    ancreToiProject,
    explorArtProject,
] as const;

export function getRealisationDetailBySlug(slug: string) {
    return realisationDetailPages.find((project) => project.slug === slug);
}

export type { RealisationDetailContent } from "./types";
