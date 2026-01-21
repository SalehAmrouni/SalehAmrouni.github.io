// compromise-nlp.js
// Lightweight NLP for browser using compromise
// https://github.com/spencermountain/compromise

// Load compromise from CDN if not present
if (typeof window.nlp === 'undefined') {
  var script = document.createElement('script');
  script.src = 'https://unpkg.com/compromise@latest/builds/compromise.min.js';
  script.onload = function() {
    window.compromiseLoaded = true;
  };
  document.head.appendChild(script);
} else {
  window.compromiseLoaded = true;
}

// Helper to extract main topics from user input
function extractTopics(text) {
  if (!window.nlp) return [];
  const doc = window.nlp(text);
  // Get nouns and topics
  const topics = doc.nouns().out('array');
  // Add verbs for intent
  const verbs = doc.verbs().out('array');
  return topics.concat(verbs);
}

window.extractTopics = extractTopics;
