export function pluralizeEn(number: number) {
  const i = Math.floor(Math.abs(number));

  if (i === 1) {
    return "one";
  }

  return "other";
}

export function pluralizeRu(number: number) {
  const absNumber = Math.floor(Math.abs(number));

  if (absNumber % 10 === 1 && !(absNumber % 100 === 11)) return "one";

  if (
    absNumber % 10 === Math.floor(absNumber % 10) &&
    absNumber % 10 >= 2 &&
    absNumber % 10 <= 4 &&
    !(absNumber % 100 >= 12 && absNumber % 100 <= 14)
  ) {
    return "few";
  }

  if (
    absNumber % 10 === 0 ||
    (absNumber % 10 === Math.floor(absNumber % 10) &&
      absNumber % 10 >= 5 &&
      absNumber % 10 <= 9) ||
    (absNumber % 100 === Math.floor(absNumber % 100) &&
      absNumber % 100 >= 11 &&
      absNumber % 100 <= 14)
  ) {
    return "many";
  }

  return "other";
}
