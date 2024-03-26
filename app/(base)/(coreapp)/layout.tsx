import { ServerTime } from './_components/ServerTime';
import { SpinnerModal } from './_components/SpinnerModal';

export default function CoreAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SpinnerModal />
      <ServerTime />
    </>
  );
}
