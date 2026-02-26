import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Premium Link-in-Bio | Profile",
    description: "Connect and find all social links, music, and resources in one place.",
};

export default function MeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
