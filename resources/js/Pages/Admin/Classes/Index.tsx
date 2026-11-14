import AdminNav from '@/Components/AdminNav';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type ClassRoom = {
    id: number;
    name: string;
    grade_level: number;
    is_active: boolean;
    major: { id: number; code: string; name: string };
    academic_year: { id: number; name: string };
    students_count: number;
};

type Paginator<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    classes: Paginator<ClassRoom>;
    majors: { id: number; code: string; name: string }[];
    academicYears: { id: number; name: string }[];
};

export default function ClassesIndex({ classes, majors, academicYears }: Props) {
    const { props } = usePage();
    const flash = (props as { flash?: { success?: string } }).flash?.success;

    const form = useForm({
        major_id: '',
        academic_year_id: '',
        name: '',
        grade_level: '10',
        is_active: true,
    });
    const [editingId, setEditingId] = useState<number | null>(null);

    const startEdit = (room: ClassRoom) => {
        setEditingId(room.id);
        form.setData({
            major_id: String(room.major.id),
            academic_year_id: String(room.academic_year.id),
            name: room.name,
            grade_level: String(room.grade_level),
            is_active: room.is_active,
        });
        form.clearErrors();
    };

    const resetForm = () => {
        form.reset();
        setEditingId(null);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (editingId) {
            form.put(route('admin.classes.update', { classRoom: editingId }), {
                onSuccess: resetForm,
                preserveScroll: true,
            });
        } else {
            form.post(route('admin.classes.store'), {
                onSuccess: resetForm,
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Master Kelas
                </h2>
            }
        >
            <Head title="Kelas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <AdminNav />

                    {flash && (
                        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
                            {flash}
                        </div>
                    )}

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">
                                {editingId ? 'Edit Kelas' : 'Tambah Kelas'}
                            </h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="major_id" value="Jurusan" />
                                    <select
                                        id="major_id"
                                        className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={form.data.major_id}
                                        onChange={(e) => form.setData('major_id', e.target.value)}
                                        required
                                    >
                                        <option value="">— Pilih jurusan —</option>
                                        {majors.map((m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.code} — {m.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={form.errors.major_id} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="academic_year_id" value="Tahun Ajaran" />
                                    <select
                                        id="academic_year_id"
                                        className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={form.data.academic_year_id}
                                        onChange={(e) => form.setData('academic_year_id', e.target.value)}
                                        required
                                    >
                                        <option value="">— Pilih tahun ajaran —</option>
                                        {academicYears.map((y) => (
                                            <option key={y.id} value={y.id}>
                                                {y.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={form.errors.academic_year_id} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="name" value="Nama Kelas (mis. X RPL 1)" />
                                    <TextInput
                                        id="name"
                                        className="mt-1 block w-full"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="grade_level" value="Tingkat" />
                                    <select
                                        id="grade_level"
                                        className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={form.data.grade_level}
                                        onChange={(e) => form.setData('grade_level', e.target.value)}
                                        required
                                    >
                                        <option value="10">Kelas 10</option>
                                        <option value="11">Kelas 11</option>
                                        <option value="12">Kelas 12</option>
                                    </select>
                                    <InputError message={form.errors.grade_level} className="mt-2" />
                                </div>
                                <label className="flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_active}
                                        onChange={(e) => form.setData('is_active', e.target.checked)}
                                    />
                                    Aktif
                                </label>
                                <div className="flex gap-2">
                                    <PrimaryButton disabled={form.processing}>
                                        {editingId ? 'Simpan' : 'Tambah'}
                                    </PrimaryButton>
                                    {editingId && (
                                        <SecondaryButton type="button" onClick={resetForm}>
                                            Batal
                                        </SecondaryButton>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200 lg:col-span-2">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Kelas</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Jurusan</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Tahun Ajaran</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Siswa</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {classes.data.map((room) => (
                                        <tr key={room.id}>
                                            <td className="px-4 py-3 font-medium">{room.name}</td>
                                            <td className="px-4 py-3">{room.major.name}</td>
                                            <td className="px-4 py-3">{room.academic_year.name}</td>
                                            <td className="px-4 py-3">{room.students_count}</td>
                                            <td className="px-4 py-3">
                                                {room.is_active ? 'Aktif' : 'Nonaktif'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    type="button"
                                                    onClick={() => startEdit(room)}
                                                    className="text-indigo-600 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {classes.data.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                                                Belum ada kelas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <div className="flex flex-wrap gap-1 border-t border-gray-100 p-3">
                                {classes.links.map((link, i) =>
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            preserveScroll
                                            className={`rounded px-2 py-1 text-sm ${
                                                link.active ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            className="rounded bg-gray-50 px-2 py-1 text-sm text-gray-400"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
