export const incrementTracker = async (stat: string) => {
    await fetch(`/api/tracker/${stat}`, {
        method: 'POST'
    });
};
