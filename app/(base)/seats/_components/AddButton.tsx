'use client';

import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import { css } from '@/panda/css';

import { SeatNewDailog } from './Form';

export function AddButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={css({
          display: 'flex',
          alignItems: 'center',
          gap: '2',
          border: '1px solid',
          borderColor: 'gray.400',
          px: '4',
          py: '2',
        })}
        onClick={() => setIsOpen(true)}
      >
        <FaPlus />
        <span>座席を追加</span>
      </button>
      <SeatNewDailog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
