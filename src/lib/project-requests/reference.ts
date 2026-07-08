export function createProjectRequestReference(
    date = new Date(),
    sequence = 1,
) {
    const dateSegment = date.toISOString().slice(0, 10).replaceAll("-", "");

    return `AC-DEM-${dateSegment}-${formatSequence(sequence)}`;
}

function formatSequence(sequence: number) {
    return String(Math.max(sequence, 1)).padStart(3, "0");
}
