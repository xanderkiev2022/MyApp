const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  organization: 'org-4q3OxHIgnHpOxFNd5IzBGkcT',
  //   apiKey: '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',
  apiKey: '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',
});
export const openai = new OpenAIApi(configuration);
