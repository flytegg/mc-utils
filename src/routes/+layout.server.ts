import type {LayoutServerLoad} from './$types'

// Read on the server so the nav and banner render in their final state, instead of changing once the page loads
export const load: LayoutServerLoad = (({cookies}) => {
    return {
        favourites: (cookies.get("mcu-favourites") ?? "").split("//").filter(Boolean),
        bannerDismissed: cookies.get("mcu-banner2-dismissed") === "true"
    }
})
