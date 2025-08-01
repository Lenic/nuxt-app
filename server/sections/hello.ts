let hello = 'Hello';

export function getHello() {
  return Promise.resolve(`${hello} - fetched - ${new Date().toISOString()}`);
}

export function setHello(value: string) {
  hello = value.slice(0, 5);
  return Promise.resolve(`${hello} - updated - ${new Date().toISOString()}`);
}
