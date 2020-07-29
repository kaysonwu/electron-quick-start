const { join } = require('path');
const register = require('@babel/register');

register({
  cwd: join(__dirname, '..'),
  extensions: ['.ts', '.tsx'],
});
