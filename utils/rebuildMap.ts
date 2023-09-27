export function rebuildMap<K, T>(map: Map<K, T>): Map<K, T> {
  return new Map(map.entries());
}
