'use strict';

// Adapted from https://stackoverflow.com/a/29046739/399105
function hasES2017Support() {
  try {
    eval('async function foo() {}');
  } catch (e) {
    return false;
  }
  return true;
}

if (!hasES2017Support()) {
  document.write(`
    <div style="color:#212529;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;margin:2em;">
      <h1>Outdated browser</h1>
      <p>Your web browser may be outdated. Please upgrade your browser or install a modern browser such as <a href="https://www.mozilla.org/firefox/" style="color:#007bff;text-decoration:none">Firefox</a>.</p>
    </div>
  `);

  if (window.stop) {
    window.stop();
  }
}
