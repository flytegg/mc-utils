export function trackEvent(action, category, label) {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}
