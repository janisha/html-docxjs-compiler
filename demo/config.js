const {
  AlignmentType,
  LevelFormat,
  LevelSuffix,
} = require('docx');

const WORD_NUMBERING_CONFIGURATION = {
  config: [
    {
      reference: 'numbering',
      levels: [
        {
          level: 0,
          format: LevelFormat.DECIMAL,
          text: '%1)', // results in '1)', '2)', etc.
          alignment: AlignmentType.START,
          style: {
            paragraph: {
              indent: { left: 150, hanging: 50 },
              spacing: {
                after: 100,
              },
            },
          },
          suffix: LevelSuffix.SPACE,
        },
        {
          level: 1,
          format: LevelFormat.LOWER_ROMAN,
          text: '%2.', // results in '1.', '2.', etc.
          alignment: AlignmentType.START,
          style: {
            paragraph: {
              // Increase indentation for nested levels
              indent: { left: 200, hanging: 150 },
              spacing: {
                after: 100,
              },
            },
          },
          suffix: LevelSuffix.SPACE,
        },
      ],
    },
    {
      reference: 'unordered',
      levels: [
        {
          level: 0,
          format: LevelFormat.DECIMAL,
          text: '%1.',
          style: {
            paragraph: {
              indent: { left: 250, hanging: 160 },
              spacing: {
                after: 100,
              },
            },
          },
          suffix: LevelSuffix.SPACE,
        },
        {
          level: 1,
          format: LevelFormat.GANADA,
          text: '%1.',
          style: {
            paragraph: {
              indent: { left: 250, hanging: 160 },
              spacing: {
                after: 100,
              },
            },
          },
          suffix: LevelSuffix.SPACE,
        },
        {
          level: 2,
          format: LevelFormat.CHOSUNG,
          text: '%1.',
          style: {
            paragraph: {
              indent: { left: 250, hanging: 160 },
              spacing: {
                after: 100,
              },
            },
          },
          suffix: LevelSuffix.SPACE,
        },
      ],
    },
  ],
};

module.exports = { WORD_NUMBERING_CONFIGURATION };