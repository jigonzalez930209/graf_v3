module.exports = {
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'jigonzalez930209',
          name: 'graf_V3'
        },
        prerelease: false,
        draft: true
      }
    }
  ]
}
