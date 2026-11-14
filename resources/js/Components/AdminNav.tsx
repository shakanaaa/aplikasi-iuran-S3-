import { Link } from '@inertiajs/react';

const links = [
    { href: route('admin.dashboard'), label: 'Dashboard', name: 'admin.dashboard' },
    { href: route('admin.majors.index'), label: 'Jurusan', name: 'admin.majors.index' },
    { href: route('admin.academic-years.index'), label: 'Tahun Ajaran', name: 'admin.academic-years.index' },
    { href: route('admin.classes.index'), label: 'Kelas', name: 'admin.classes.index' },
    { href: route('admin.students.index'), label: 'Siswa', name: 'admin.students.index' },
];

export default function AdminNav() {
    return (
        <nav className="mb-6 flex flex-wrap gap-2">
            {links.map((link) => (
                <Link
                    key={link.name}
                    href={link.href}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                        route().current(link.name)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50'
                    }`}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}
