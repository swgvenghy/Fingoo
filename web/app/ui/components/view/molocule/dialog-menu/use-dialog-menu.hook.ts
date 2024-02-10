import { useRef } from 'react';
import { useDialogMenuStore } from '@/app/store/stores/dialog-menu.store';

export function useDialogMenu(key: string) {
  const action = useDialogMenuStore((state) => state.action);
  const isOpen = useDialogMenuStore((state) => state.isOpen[key]);
  const position = useDialogMenuStore((state) => state.position);
  const ref = useRef<HTMLButtonElement>(null);

  const openDialogMenu = (payload?: unknown) => {
    const position = ref.current?.getBoundingClientRect();

    if (!position) {
      return;
    }

    const newPosition = {
      x: position.left,
      y: position.top + position.height / 2,
    };

    action.setPayload(payload);
    action.setPosition(newPosition);
    action.open(key);
  };

  const closeDialogMenu = () => {
    action.close(key);
  };

  return {
    ref,
    isOpen,
    position,
    openDialogMenu,
    closeDialogMenu,
  };
}