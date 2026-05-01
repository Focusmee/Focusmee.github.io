export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

export function getReadingMinutes(body: string) {
  const latinWords = body.trim().split(/\s+/u).filter(Boolean).length;
  const chineseCharacters = (body.match(/[\u4e00-\u9fff]/gu) || []).length;
  const totalWords = latinWords + Math.ceil(chineseCharacters / 2);
  return Math.max(1, Math.round(totalWords / 220));
}
