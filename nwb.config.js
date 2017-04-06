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
  },
  webpack: {
    aliases: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    }
  }
}
