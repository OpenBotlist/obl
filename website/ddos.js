import toobusy from 'toobusy-js';
import Core from '../core.js';

// these are known bot useragents,if you know another one please make a pull requests.
// if you know a more good way to stop botnets,please make a pr to implement it on the prod relase so we can implement it.
const knownBotsToPattern = new Map([
  ['Headless Chrome', /HeadlessChrome/],
  ['Wget', /[wW]get/],
  ['Python urllib', /Python-urllib/],
  ['PHP crawl', /phpcrawl/],
  ['PhantomJS', /PhantomJS/]
]);

// Detect if an incoming request belongs to a bot using its user agent
function isKnownBotUserAgent(userAgent) {
  for (const [knownBot, pattern] of knownBotsToPattern.entries())
    if (pattern.test(userAgent))
      return {
        isBot: true,
        // In case the request comes from a bot,
        // we also returns the name of the bot
        nameBot: knownBot
      };

  return { isBot: false };
}

function loadDDOS(app) {
  toobusy.onLag((currentLag) => {
    console.log(`Event loop lag detected! Latency: ${currentLag}ms`);
    Core.Logger.logStat(`:hourglass: lag: ${currentLag}ms`);
  });

  // middleware which blocks requests when we're too busy
  app.use((_, res, next) => {
    if (toobusy())
      res.send(503, 'me irl: https://poketube.fun/watch?v=5FQg16v1YPU');
    else next();
  });
}

// localstroge object to store data

export { loadDDOS, isKnownBotUserAgent };
