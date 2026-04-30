export const camelCaseToText = (str = "") =>
  str.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (s) => s.toUpperCase());

export const pascalCaseToText = (str = "") =>
  str.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (s) => s.toUpperCase());

export const camelToSnake = (str = "") => str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();

export const camelToKebab = (str = "") => str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

export const snakeToCamel = (str = "") => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

export const kebabToCamel = (str = "") => str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

export const pascalToCamel = (str = "") => str.charAt(0).toLowerCase() + str.slice(1);

export const camelToPascal = (str = "") => str.charAt(0).toUpperCase() + str.slice(1);

export const snakeCaseToText = (str = "") =>
  str
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
