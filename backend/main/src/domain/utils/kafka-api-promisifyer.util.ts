export const kafkaPromisify = (
  fn: (...args: any[]) => any
): ((...args: any[]) => any) => {
  return (...args: any[]) => {
    return new Promise((res, rej) => {
      fn(...args, (err?: any, data?: any) => {
        if (err) {
          rej(err);
        } else {
          res(data);
        }
      });
    });
  };
};
