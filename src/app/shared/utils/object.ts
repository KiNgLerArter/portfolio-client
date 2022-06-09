export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const deepEqual = (firstItem: any, secondItem: any): boolean => {
  const firstItemType = typeof firstItem;
  if (
    !firstItemType ||
    firstItemType === 'string' ||
    firstItemType === 'number' ||
    firstItemType === 'bigint' ||
    firstItemType === 'boolean' ||
    firstItemType === 'symbol'
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
      firstItem.hasOwnProperty(key) &&
      !deepEqual(firstItem[key], secondItem[key])
    ) {
      areObjectsEqual = false;
      break;
    }
  }

  return areObjectsEqual;
};
