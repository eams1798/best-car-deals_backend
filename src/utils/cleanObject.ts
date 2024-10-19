export const cleanObject = (obj: any): any => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null && v !== undefined && v !== '').map(([k, v]) => {
      if (typeof v === 'object' && !Array.isArray(v)) {
        return [k, cleanObject(v)];
      }
      return [k, v];
    })
  );
};