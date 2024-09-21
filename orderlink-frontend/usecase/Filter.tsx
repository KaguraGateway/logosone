import { useState } from 'react';

export type FilterItem = {
  id: string;
  name: string;
  checked: boolean;
  children?: FilterItem[];
};

export function isSomeChecked(item: FilterItem): boolean {
  if(item.checked) return true;
  return item.children?.some((child) => isSomeChecked(child)) ?? false;
}

export function useFilterItem(initialItems: FilterItem[]) {
  const [tempFilter, setTempFilter] = useState<FilterItem[]>(initialItems);

  const checkFilterItem = (item: FilterItem, checked: boolean) => {
    item.checked = checked;
    item.children = item.children?.map((child) => checkFilterItem(child, checked));
    return item;
  };
  const allCheckChange = (checked: boolean) => {
    const newFilter = tempFilter.map((item) => checkFilterItem(item, checked));
    setTempFilter(newFilter);
  };
  const onParentCheckChange = (item: FilterItem, checked: boolean): void => {
    const newFilter = tempFilter.map((i) => {
      if (i.name === item.name) {
        return checkFilterItem(item, checked);
      }
      return i;
    });
    setTempFilter(newFilter);
  };
  const onChildCheckChange = (parent: FilterItem, item: FilterItem, checked: boolean): void => {
    const newFilter = tempFilter.map((i) => {
      if (parent.name === i.name) {
        const newChildren = i.children?.map((child) => {
          if (child.name === item.name) {
            return checkFilterItem(item, checked);
          }
          return child;
        });
        return {
          ...i,
          children: newChildren,
        };
      }
      return i;
    });
    setTempFilter(newFilter);
  };
  const onGrandChildCheckChange = (root: FilterItem, parent: FilterItem, item: FilterItem, checked: boolean): void => {
    const newFilter = tempFilter.map((i) => {
      if (root.name === i.name) {
        const newChildren = i.children?.map((child) => {
          if (child.name === parent.name) {
            const newGrandChildren = child.children?.map((grandChild) => {
              if (grandChild.name === item.name) {
                return checkFilterItem(item, checked);
              }
              return grandChild;
            });
            return { ...child, children: newGrandChildren };
          }
          return child;
        });
        return {
          ...i,
          children: newChildren,
        };
      }
      return i;
    });
    setTempFilter(newFilter);
  };

  return {
    tempFilter,
    checkFilterItem,
    allCheckChange,
    onParentCheckChange,
    onGrandChildCheckChange,
    onChildCheckChange,
  };
}
