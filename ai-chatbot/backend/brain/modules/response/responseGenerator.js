const { pickRandom } = require('../utils/helpers');

function generateResponse(intent, fallbackIntent) {
    const availableResponses = intent?.responses || fallbackIntent?.responses || [];
    return pickRandom(availableResponses) || "I am here to help. Could you ask that another way?";
}

module.exports = { generateResponse };