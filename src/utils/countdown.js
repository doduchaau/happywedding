/**
 * Countdown utility calculating remaining time based on timestamps.
 */

export function parseWeddingDate(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    return { valid: false, timestamp: null, error: 'Thiếu định dạng ngày' };
  }

  // Check for placeholder strings like "[YYYY-MM-DD]..."
  if (dateString.includes('[') || dateString.includes('YYYY')) {
    return {
      valid: false,
      timestamp: null,
      error: 'Ngày cưới đang ở dạng bản mẫu: ' + dateString,
    };
  }

  const parsed = new Date(dateString);
  const time = parsed.getTime();

  if (isNaN(time)) {
    return {
      valid: false,
      timestamp: null,
      error: 'Ngày không hợp lệ: ' + dateString,
    };
  }

  return { valid: true, timestamp: time, date: parsed };
}

export function calculateTimeRemaining(targetTimestamp) {
  if (!targetTimestamp) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isDone: false,
    };
  }

  const now = Date.now();
  const diff = targetTimestamp - now;

  if (diff <= 0) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isDone: true,
    };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return {
    total: diff,
    days: Math.max(0, days),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    seconds: Math.max(0, seconds),
    isDone: false,
  };
}

export function padZero(num) {
  return String(num).padStart(2, '0');
}
