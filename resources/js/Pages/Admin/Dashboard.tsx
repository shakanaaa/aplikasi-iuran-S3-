import AdminNav from '@/Components/AdminNav';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

type Props = {
    stats: {
        students: number;
        majors: number;
        classes: number;
        academicYears: number;
    };
};

export default function AdminDashboard({ stats }: Props) {
    const cards = [
        { label: 'Siswa', value: stats.students, href: route('admin.students.index') },
        { label: 'Jurusan', value: stats.majors, href: route('admin.majors.index') },
        { label: 'Kelas', value: stats.classes, href: route('admin.classes.index') },
        { label: 'Tahun Ajaran', value: stats.academicYears, href: route('admin.academic-years.index') },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard Admin
                </h2>
            }
        >
            <Head title="Dashboard Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <AdminNav />

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {cards.map((card) => (
                            <Link
                                key={card.label}
                                href={card.href}
                                className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 hover:ring-indigo-300"
                            >
                                <div className="text-sm text-gray-500">{card.label}</div>
                                <div className="mt-2 text-3xl font-semibold text-gray-900">
                                    {card.value}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
