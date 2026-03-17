import type { ReactElement } from 'react';
import MainModalClient, { MainModalProps, MainModalTrigger } from './MainModalClient';

type MainModalComponent = ((props: MainModalProps) => ReactElement) & {
  Trigger: typeof MainModalTrigger;
};

const MainModal = ((props: MainModalProps) => {
  return <MainModalClient {...props} />;
}) as MainModalComponent;

MainModal.Trigger = MainModalTrigger;

export type { MainModalProps, ForwardedModalProps } from './MainModalClient';
export default MainModal;
