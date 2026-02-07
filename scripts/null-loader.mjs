// ESM loader hook to handle image imports in Node.js (Vite handles these in browser)
// Used by validate-camps.js to import camps.js without Vite's asset pipeline

const imageExtensions = /\.(png|jpg|jpeg|webp|avif|gif|svg)$/;

export async function resolve(specifier, context, nextResolve) {
  if (imageExtensions.test(specifier)) {
    return { url: 'data:text/javascript,export default "placeholder"', shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
