export async function wait(duration = 100) {
  await new Promise((resolve) => setTimeout(resolve, duration));
}
