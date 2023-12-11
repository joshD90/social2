const isError = (instance: unknown): instance is Error => {
  return instance instanceof Error;
};

export default isError;
