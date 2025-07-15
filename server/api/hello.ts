export default defineEventHandler(async () => {
  await new Promise((resolve) =>
    setTimeout(() => {
      resolve(true);
    }, 1000),
  );
  return {
    hello: `world - ${new Date().toISOString()}`,
  };
});
