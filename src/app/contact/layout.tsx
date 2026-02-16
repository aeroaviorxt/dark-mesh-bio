import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact avrxt | Technical Consultations',
    description: 'Direct uplink to avrxt for technical consultations, project inquiries, or architectural discussions. Let\'s build something exceptional.',
    keywords: ['contact developer', 'technical consultation', 'hire avrxt', 'software engineering help', 'get in touch'],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
