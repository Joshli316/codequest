import { playSound } from './components/audio';

const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, c => HTML_ESCAPES[c] || c);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function renderFeedback(correct: boolean, message: string): string {
  const bg = correct ? 'rgba(0,212,170,0.1)' : 'rgba(255,107,107,0.1)';
  const border = correct ? 'var(--green)' : 'var(--red)';
  return `<div style="padding:var(--space-md);border-radius:var(--radius-md);background:${bg};border:1px solid ${border};line-height:1.6;font-size:var(--text-sm);">${message}</div>`;
}

export function renderScoreBar(current: number, total: number, correctCount: number): string {
  const pct = Math.round((current / total) * 100);
  return `
    <div class="game-score-bar">
      <span>${current}/${total}</span>
      <span>✓ ${correctCount}</span>
    </div>
    <div class="progress-bar">
      <div class="progress-bar-fill" style="width:${pct}%"></div>
    </div>
  `;
}

export function setupQuizOptions(
  container: HTMLElement,
  correctIndex: number,
  onCorrect: (selectedIndex: number) => void,
  onWrong: (selectedIndex: number) => void,
): void {
  let answered = false;
  const btns = container.querySelectorAll('.option-btn');

  btns.forEach((btn, btnIndex) => {
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;

      const idx = parseInt((btn as HTMLElement).dataset.index || String(btnIndex));
      const isCorrect = idx === correctIndex;

      btns.forEach((b, i) => {
        b.classList.add('disabled');
        if (i === correctIndex) b.classList.add('correct');
        if (b === btn && !isCorrect) b.classList.add('wrong');
      });

      playSound(isCorrect ? 'correct' : 'wrong');
      (isCorrect ? onCorrect : onWrong)(idx);
    });
  });
}
