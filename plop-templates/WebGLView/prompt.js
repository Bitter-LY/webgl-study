const { notEmpty } = require('../utils')

module.exports = {
  description: '创建WebGLView',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'view名称',
      validate: notEmpty('name')
    }
  ],
  actions: () => {
    const name = '{{name}}'

    return [
      {
        type: 'add',
        path: `src/views/${name}/index.tsx`,
        templateFile: 'plop-templates/WebGLView/index.hbs',
        data: {
          name: name
        }
      },
      {
        type: 'add',
        path: `src/views/${name}/vshader.glsl`,
        templateFile: 'plop-templates/WebGLView/vshader.hbs'
      },
      {
        type: 'add',
        path: `src/views/${name}/fshader.glsl`,
        templateFile: 'plop-templates/WebGLView/fshader.hbs'
      }
    ]
  }
}
