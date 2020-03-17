export const stringify = (m: string | Object) => (typeof m === 'string' ? m : JSON.stringify(m, null, 2));

/**
 * Simple hash function, converting a string to a number.
 * See also: http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 * @param {string} str
 * @returns {string}
 */
export const hash = (obj: Object) => {
    let str = JSON.stringify(obj);
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash &= hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

export const wrapUnionFieldsOfProperties = (props: any) => {
    if (props && Object.keys(props).length > 0) {
        Object.keys(props).forEach(key => {
            const val = props[key];
            props[key] = {};
            if (typeof val === 'object') {
                props[key][`string`] = JSON.stringify(val);
            } else {
                props[key][`${typeof val}`] = val;
            }
        });
    }
}