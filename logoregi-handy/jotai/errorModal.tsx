import { atom, useAtom } from 'jotai';

const errorTitleAtom = atom('');
const errorMessageAtom = atom('');

export function useErrorModal() {
  const [errorTitle, setErrorTitle] = useAtom(errorTitleAtom);
  const [errorMessage, setErrorMessage] = useAtom(errorMessageAtom);

  const isErrorModalOpen = errorTitle.length != 0 && errorMessage.length != 0;
  const onErrorModalClose = () => {
    setErrorTitle('');
    setErrorMessage('');
  };
  const onErrorModalOpen = (errorTitle: string, errorMessage: string) => {
    setErrorTitle(errorTitle);
    setErrorMessage(errorMessage);
  };

  return {
    errorTitle,
    errorMessage,
    isErrorModalOpen,
    onErrorModalClose,
    onErrorModalOpen,
  };
}
