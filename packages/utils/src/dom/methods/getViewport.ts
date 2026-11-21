export default function getViewport(): { width: number; height: number } {
    const win = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        // The root element's clientWidth/clientHeight exclude the page scrollbars; window.innerWidth/innerHeight include them.
        w = e.clientWidth || win.innerWidth || g.clientWidth,
        h = e.clientHeight || win.innerHeight || g.clientHeight;

    return { width: w, height: h };
}
