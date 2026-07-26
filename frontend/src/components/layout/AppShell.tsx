import { ReactNode } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface Props {
  children: ReactNode;
}

export default function AppShell({ children }: Props) {
  return (
    <>
      <Sidebar />

      <div className="min-h-screen bg-slate-50 md:ml-60">
        <Navbar />
        <main>{children}</main>
      </div>
    </>
  );
}