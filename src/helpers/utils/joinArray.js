function joinArray(arr) {
  if (Array.isArray(arr)) {
    if (arr.length > 1) {
      return arr.join(" ");
    }
    return arr.join("");
  }
  return null;
}

module.exports = joinArray;
