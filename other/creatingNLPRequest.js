const OpenAI = require('openai-api');
const Openai = new OpenAI(process.env.OPENAI_TOKEN);
module.exports = function (EngineName, Prompt, TokenNum, Temperature, StopSigns) {

    return Openai.complete({
        engine: EngineName,
        prompt: Prompt,
        maxTokens: TokenNum,
        temperature: Temperature,
        topP: 0.3,
        presencePenalty: 0,
        frequencyPenalty: 0.5,
        bestOf: 1,
        n: 1,
        stream: false,
        stop: StopSigns
    });
}
