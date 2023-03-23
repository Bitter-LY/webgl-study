const WebGLViewPrompt = require('./plop-templates/WebGLView/prompt')

/**
 *
 * @param {import('plop').NodePlopAPI} plop
 */
module.exports = (plop) => {
  plop.setGenerator('View', WebGLViewPrompt)
}
