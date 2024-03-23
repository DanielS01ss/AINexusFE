export function truncateString(str) {
    if (str.length > 21) {
      return str.substring(0, 21) + "...";
    } else {
      return str;
    }
  }