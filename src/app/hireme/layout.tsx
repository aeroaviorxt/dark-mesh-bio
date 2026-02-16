import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Project Intake | Hire avrxt',
    description: 'Start your technical journey with avrxt. Use our project intake terminal to estimate budgets and timelines for your next big idea.',
    keywords: ['hire developer', 'project intake', 'software development quote', 'full stack engineer hire', 'avrxt cloud hiring'],
};

export default function HireMeLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
