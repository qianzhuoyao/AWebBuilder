export const createSingleInstance = <T>(initializer: () => T): (() => T) => {
  let instance: T | null = null;
  return () => {
    if (instance === null) {
      instance = initializer();
    }
    return instance;
  };
};
