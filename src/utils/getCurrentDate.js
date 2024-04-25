export function getDataCurenta() {
    const azi = new Date();
    const an = azi.getFullYear();
    const luna = (azi.getMonth() + 1).toString().padStart(2, '0');
    const zi = azi.getDate().toString().padStart(2, '0');
  
    return `${an}-${luna}-${zi}`;
}