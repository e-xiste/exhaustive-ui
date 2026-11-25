/** Components whose page is not at the name of their documentation directory. Keep in sync with router/app.routes.ts. */
const COMPONENT_ROUTES = {
    scroller: 'virtualscroller',
    Image: 'image'
};

/** The route of the page of a component, without a leading slash. */
export function componentRoute(name) {
    return COMPONENT_ROUTES[name] ?? name;
}
