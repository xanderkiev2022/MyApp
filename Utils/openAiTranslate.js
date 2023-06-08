import axios from 'axios';
import { RAPID_API_KEY } from '@env';

export const openAiTranslate = async needToTranslate => {
  const options = {
    method: 'POST',
    url: 'https://openai80.p.rapidapi.com/completions',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': 'openai80.p.rapidapi.com',
    },
    data: {
      model: 'text-davinci-003',
      prompt: `Translate the following comment from English to Ukrainian: "${needToTranslate}"`,
      max_tokens: 50,
      temperature: 0,
      top_p: 1,
      n: 1,
      stream: false,
      logprobs: null,
      stop: 'monkey',
    },
  };

  try {
    const response = await axios.request(options);
    const translatedVersion = response.data.choices[0].text.trim();
    return translatedVersion;
  } catch (error) {
    console.error(error);
  }
};
