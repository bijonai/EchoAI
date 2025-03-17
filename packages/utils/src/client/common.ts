import OpenAI from "openai";

export function defineClient(
  baseUrl: string,
  apiKey: string,
) {
  return ({ _baseUrl, _apiKey }: { _baseUrl?: string, _apiKey?: string } = {}) => {
    return new OpenAI({
      baseURL: _baseUrl ?? baseUrl,
      apiKey: _apiKey ?? apiKey,
    })
  }
}