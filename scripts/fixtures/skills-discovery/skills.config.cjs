module.exports = {
  include: [
    'fexd-skill-fixture-plain-*',
    '@fexd-skill-fixture-*/scoped-package',
    {
      package: 'fexd-skill-fixture-multi-*',
      skills: ['fixture-multi-two'],
    },
    {
      package: 'fexd-skill-fixture-duplicate-*',
      skills: ['fixture-duplicate-name'],
    },
  ],
  exclude: [
    {
      package: 'fexd-skill-fixture-duplicate-b-*',
      skills: ['fixture-duplicate-name'],
    },
    {
      package: 'fexd-skill-fixture-multi-*',
      skills: ['fixture-multi-one'],
    },
  ],
}
