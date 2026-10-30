export const qualificationGroups = [
  { name: '컴퓨터활용능력', ids: ['computer-skills-1', 'computer-skills-2'] },
  { name: 'AI-POT', ids: ['ai-pot-1', 'ai-pot-2'] },
  { name: 'AIBT', ids: ['aibt-1', 'aibt-2'] },
  { name: 'AICE', ids: ['aice-associate', 'aice-basic'] },
];
export function groupOf(id) { return qualificationGroups.find((group) => group.ids.includes(id)); }
export function groupResults(items) {
  const seen = new Set();
  return items.filter((item) => { const group = groupOf(item.id); if (!group) return true; if (seen.has(group.name)) return false; seen.add(group.name); return true; });
}
