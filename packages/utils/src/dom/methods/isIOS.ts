export default function isIOS(): boolean {
    // iPadOS reports the user agent of a desktop Mac: tell it apart by its touch points
    const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

    return (/iPad|iPhone|iPod/.test(navigator.userAgent) || isIPadOS) && !('MSStream' in window);
}
