import type React from "react";
import { NavBar } from "../components/navbar";
import PWABadge from "../PWABadge";

interface Props extends React.PropsWithChildren {
    pageMenuItems?: React.JSX.Element
}

export function MainLayout({ children, pageMenuItems }: Props) {
    return <div className="flex flex-col h-full justify-between">
        <NavBar menuItems={pageMenuItems} />
        <PWABadge></PWABadge>
        <main className="p-4 grow self-center w-full md:w-3xl">
            {children}
        </main>
    </div >
}