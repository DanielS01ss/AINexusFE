export function convertStringToInt(str) {
    // Încearcă să convertești string-ul într-un număr
    const num = parseFloat(str);

    // Verifică dacă conversia a fost reușită și dacă numărul este un întreg
    if (!isNaN(num) && Number.isInteger(num)) {
        return num;
    } else {
        return null;
    }
}