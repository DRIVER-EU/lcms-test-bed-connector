export const stringify = (m: string | Object) => (typeof m === 'string' ? m : JSON.stringify(m, null, 2));
