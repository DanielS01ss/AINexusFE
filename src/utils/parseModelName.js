export function extractBeforeUnderscore(str) {
    // Split the string at the underscore
    let parts = str.split('_');
    // Return the first part
    return parts[0];
}