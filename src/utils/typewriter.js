/**
 * Typewriter and paragraph-by-paragraph reveal utility for the handwritten letter.
 */

export class TypewriterController {
  constructor(options = {}) {
    this.speed = options.speed || 24; // ms per character
    this.paragraphDelay = options.paragraphDelay || 350; // ms between paragraphs
    this.isSkipped = false;
    this.isFinished = false;
    this.timer = null;
  }

  async typeParagraphs(paragraphs, renderCallback, onParagraphComplete, onAllComplete) {
    this.isSkipped = false;
    this.isFinished = false;

    for (let pIndex = 0; pIndex < paragraphs.length; pIndex++) {
      if (this.isSkipped) break;
      const text = paragraphs[pIndex];

      // Type each character of the paragraph
      for (let cIndex = 0; cIndex <= text.length; cIndex++) {
        if (this.isSkipped) break;
        renderCallback(pIndex, text.slice(0, cIndex));
        await this.delay(this.speed);
      }

      if (this.isSkipped) break;
      if (onParagraphComplete) onParagraphComplete(pIndex);
      await this.delay(this.paragraphDelay);
    }

    this.finish(paragraphs, renderCallback, onAllComplete);
  }

  delay(ms) {
    return new Promise((resolve) => {
      this.timer = setTimeout(resolve, ms);
    });
  }

  skip(paragraphs, renderCallback, onAllComplete) {
    if (this.isFinished) return;
    this.isSkipped = true;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.finish(paragraphs, renderCallback, onAllComplete);
  }

  finish(paragraphs, renderCallback, onAllComplete) {
    this.isFinished = true;
    // Render full paragraphs
    for (let i = 0; i < paragraphs.length; i++) {
      renderCallback(i, paragraphs[i]);
    }
    if (onAllComplete) onAllComplete();
  }
}
