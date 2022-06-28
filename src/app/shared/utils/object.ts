export const hasOwnProperty = (
  object: Record<string, unknown>,
  key: string
): boolean => {
  return Object.prototype.hasOwnProperty.call(object, key);
};

export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const deepEqual = (firstItem: any, secondItem: any): boolean => {
  const firstItemType = typeof firstItem;
  const secondItemType = typeof secondItem;

  if (
    !firstItemType ||
    firstItemType !== secondItemType ||
    firstItemType === "string" ||
    firstItemType === "number" ||
    firstItemType === "bigint" ||
    firstItemType === "boolean" ||
    firstItemType === "symbol"
  ) {
    return firstItem === secondItem;
  }

  if (Array.isArray(firstItem)) {
    return firstItem.every((itemElem, index) =>
      deepEqual(itemElem, secondItem[index])
    );
  }

  let areObjectsEqual = true;
  for (const key in firstItem) {
    if (
      hasOwnProperty(firstItem, key) &&
      !deepEqual(firstItem[key], secondItem[key])
    ) {
      areObjectsEqual = false;
      break;
    }
  }

  return areObjectsEqual;
};
