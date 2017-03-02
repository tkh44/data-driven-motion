module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'DDM',
      externals: {
        react: 'React'
      }
    }
  }
}
