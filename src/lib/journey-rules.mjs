// 같은 슬롯의 검토된 후보 중 사용 가능한 첫 항목을 고른다. 후보 순서는 편집자가 정한다.
export function selectJourneyResources(references, findResource, isAvailable) {
  const selected = new Set();
  return references.flatMap((reference) => {
    const slot = reference.slot ?? reference.id;
    if (selected.has(slot)) return [];
    const item = findResource(reference.id);
    if (!item || !isAvailable(item)) return [];
    selected.add(slot);
    return [{ ref: reference, item }];
  });
}
