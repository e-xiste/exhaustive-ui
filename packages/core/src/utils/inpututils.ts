export const transformToBoolean = (value: any): boolean => {
    // a bare attribute (<p-accordion multiple>) is bound as an empty string
    return value === '' || !!value;
};

export const transformToNumber = (value: string | number): number => {
    return typeof value === 'string' ? parseFloat(value) : value;
};
