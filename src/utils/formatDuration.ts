export const formatDuration = (totalMinutes) => {
    const minutes = parseInt(totalMinutes) || 0;
    if (minutes < 60) return `${minutes} menit`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return remainingMinutes > 0
        ? `${hours} jam ${remainingMinutes} menit`
        : `${hours} jam`;
};