export function pluralizeEn(number: number) {
  const i = Math.floor(Math.abs(number));

  if (i === 1) {
    return "one";
  }

  return "other";
}

export function pluralizeRu(number: number) {
  const absoluteWholeNumber = Math.floor(Math.abs(number));

  if (absoluteWholeNumber % 10 === 1 && !(absoluteWholeNumber % 100 === 11))
    return "one";

  if (
    absoluteWholeNumber % 10 === Math.floor(absoluteWholeNumber % 10) &&
    absoluteWholeNumber % 10 >= 2 &&
    absoluteWholeNumber % 10 <= 4 &&
    !(absoluteWholeNumber % 100 >= 12 && absoluteWholeNumber % 100 <= 14)
  ) {
    return "few";
  }

  if (
    absoluteWholeNumber % 10 === 0 ||
    (absoluteWholeNumber % 10 === Math.floor(absoluteWholeNumber % 10) &&
      absoluteWholeNumber % 10 >= 5 &&
      absoluteWholeNumber % 10 <= 9) ||
    (absoluteWholeNumber % 100 === Math.floor(absoluteWholeNumber % 100) &&
      absoluteWholeNumber % 100 >= 11 &&
      absoluteWholeNumber % 100 <= 14)
  ) {
    return "many";
  }

  return "other";
}
