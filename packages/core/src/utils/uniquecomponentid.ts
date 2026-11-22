export var lastId = 0;

/**
 * @internal Pre-signals helper kept for the components; not meant for applications and may be removed in a future major.
 */
export function UniqueComponentId(prefix = 'pn_id_') {
    lastId++;

    return `${prefix}${lastId}`;
}
