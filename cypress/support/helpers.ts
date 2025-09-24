// cypress/support/helpers.ts
export function pickShared(obj: any, reference: any): any {
  const result: any = {};
  for (const key in reference) {
    if (obj[key] !== undefined) {
      if (typeof reference[key] === 'object' && reference[key] !== null) {
        result[key] = pickShared(obj[key], reference[key]);
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}


// cypress/support/helpers.ts
export function compareWithTolerance(actual: any, reference: any, numberTolerance = 0.0001) {
  for (const key in reference) {
    if (actual[key] === undefined) {
      throw new Error(`Missing key in actual object: ${key}`);
    }

    const refVal = reference[key];
    const actVal = actual[key];

    if (typeof refVal === 'string' && typeof actVal === 'string') {
      if (refVal.toLowerCase() !== actVal.toLowerCase()) {
        throw new Error(`String mismatch for key "${key}": expected "${refVal}", got "${actVal}"`);
      }
    } else if (typeof refVal === 'number' && typeof actVal === 'number') {
      if (Math.abs(refVal - actVal) > numberTolerance) {
        throw new Error(`Number mismatch for key "${key}": expected "${refVal}", got "${actVal}"`);
      }
    } else if (typeof refVal === 'object' && refVal !== null) {
      compareWithTolerance(actVal, refVal, numberTolerance);
    } else {
      if (refVal !== actVal) {
        throw new Error(`Value mismatch for key "${key}": expected "${refVal}", got "${actVal}"`);
      }
    }
  }
}
