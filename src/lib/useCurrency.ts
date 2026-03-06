/**
 * useCurrency — auto-detects if the user is in Tunisia and returns
 * a formatter that shows prices in TND or USD accordingly.
 *
 * Detection priority:
 *  1. Explicit override stored in localStorage ("tl_currency")
 *  2. Browser timezone === "Africa/Tunis"
 *  3. Browser language starts with "ar-TN" or "fr-TN"
 *  4. Default → USD
 *
 * Exchange rate: 1 USD ≈ 3.15 TND (approximate, fixed for demo)
 */

const USD_TO_TND = 3.15;

function detectTunisia(): boolean {
    try {
        const stored = localStorage.getItem("tl_currency");
        if (stored === "TND") return true;
        if (stored === "USD") return false;

        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz === "Africa/Tunis") return true;

        const lang = navigator.language || "";
        if (lang.startsWith("ar-TN") || lang.startsWith("fr-TN")) return true;
    } catch {
        // SSR or restricted environments
    }
    return false;
}

export function useCurrency() {
    const isTunisia = detectTunisia();
    const currency = isTunisia ? "TND" : "USD";
    const symbol = isTunisia ? "DT" : "$";

    /**
     * Convert a USD amount and format it for display.
     * Returns e.g. "DT 378" or "$120"
     */
    function formatPrice(usdAmount: number): string {
        if (isTunisia) {
            const tnd = Math.round(usdAmount * USD_TO_TND);
            return `DT\u00A0${tnd.toLocaleString()}`;
        }
        return `$${usdAmount.toLocaleString()}`;
    }

    /**
     * Format a raw amount that is already in the displayed currency
     * (e.g. from a field where user typed a value in their local currency)
     */
    function formatRaw(amount: number): string {
        if (isTunisia) {
            return `DT\u00A0${Math.round(amount).toLocaleString()}`;
        }
        return `$${amount.toLocaleString()}`;
    }

    /** Convert USD to local currency value (number only, no symbol) */
    function toLocal(usdAmount: number): number {
        return isTunisia ? Math.round(usdAmount * USD_TO_TND) : usdAmount;
    }

    return { isTunisia, currency, symbol, formatPrice, formatRaw, toLocal };
}
