/**
 * @internal Pre-signals helper kept for the components; not meant for applications and may be removed in a future major. Use `booleanAttribute`.
 */
export const transformToBoolean = (value: any): boolean => {
    // a bare attribute (<p-accordion multiple>) is bound as an empty string
    return value === '' || !!value;
};

/**
 * @internal Pre-signals helper kept for the components; not meant for applications and may be removed in a future major. Use `numberAttribute`.
 */
export const transformToNumber = (value: string | number): number => {
    return typeof value === 'string' ? parseFloat(value) : value;
};
