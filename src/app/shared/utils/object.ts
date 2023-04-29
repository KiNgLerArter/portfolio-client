export const hasOwnProperty = (
  object: Record<string, unknown>,
  key: string
): boolean => {
  return Object.prototype.hasOwnProperty.call(object, key);
};

export const deepClone = (obj: any): any => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  const clonedObj = Object.create(Object.getPrototypeOf(obj));

  for (const key of Object.keys(obj)) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);

    if (descriptor.get || descriptor.set) {
      Object.defineProperty(clonedObj, key, {
        get: descriptor.get,
        set: descriptor.set,
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable
      });
    } else {
      clonedObj[key] = deepClone(obj[key]);
    }
  }

  return clonedObj;
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

export const isUndefined = (value: any): boolean =>
  typeof value === "undefined";
