import type { ReactNode } from "react";

interface PrivateLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

export default function PrivateLayout({ children, modal }: PrivateLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
