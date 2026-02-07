// Registers the null-loader for image imports using Node.js module.register()
// Usage: node --import ./scripts/register-loader.mjs scripts/validate-camps.js

import { register } from 'node:module';

register(new URL('./null-loader.mjs', import.meta.url).href);
