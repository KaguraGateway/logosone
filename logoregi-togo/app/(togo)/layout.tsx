'use client';
import { Box } from '@chakra-ui/react';

import { useErrorModal } from '@/jotai/errorModal';
import ErrorModal from '@/ui/ErrorModal';
import { Header } from '@/ui/Header';

export default function HandyLayout({ children }: { children: React.ReactNode }) {
  const { isErrorModalOpen, onErrorModalClose, errorTitle, errorMessage } = useErrorModal();

  return (
    <>
      <Header />
      <Box mt="60px">{children}</Box>
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={onErrorModalClose}
        errorTitle={errorTitle}
        errorMessage={errorMessage}
      />
    </>
  );
}
