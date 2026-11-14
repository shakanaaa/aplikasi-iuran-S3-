import AdminNav from '@/Components/AdminNav';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type Major = {
    id: number;
    code: string;
    name: string;
    is_active: boolean;
    students_count: number;
};

type Paginator<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    majors: Paginator<Major>;
};

export default function MajorsIndex({ majors }: Props) {
    const { props } = usePage();
    const flash = (props as { flash?: { success?: string } }).flash?.success;

    const form = useForm({ code: '', name: '', is_active: true });
    const [editingId, setEditingId] = useState<number | null>(null);

    const startEdit = (major: Major) => {
        setEditingId(major.id);
        form.setData({ code: major.code, name: major.name, is_active: major.is_active });
        form.clearErrors();
    };

    const resetForm = () => {
        form.reset();
        setEditingId(null);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (editingId) {
            form.put(route('admin.majors.update', { major: editingId }), {
                onSuccess: resetForm,
                preserveScroll: true,
            });
        } else {
            form.post(route('admin.majors.store'), {
                onSuccess: resetForm,
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Master Jurusan
                </h2>
            }
        >
            <Head title="Jurusan" />

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
                                {editingId ? 'Edit Jurusan' : 'Tambah Jurusan'}
                            </h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="code" value="Kode" />
                                    <TextInput
                                        id="code"
                                        className="mt-1 block w-full"
                                        value={form.data.code}
                                        onChange={(e) => form.setData('code', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.code} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="name" value="Nama" />
                                    <TextInput
                                        id="name"
                                        className="mt-1 block w-full"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.name} className="mt-2" />
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
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Kode</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Nama</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Siswa</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {majors.data.map((major) => (
                                        <tr key={major.id}>
                                            <td className="px-4 py-3 font-mono">{major.code}</td>
                                            <td className="px-4 py-3">{major.name}</td>
                                            <td className="px-4 py-3">{major.students_count}</td>
                                            <td className="px-4 py-3">
                                                {major.is_active ? 'Aktif' : 'Nonaktif'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    type="button"
                                                    onClick={() => startEdit(major)}
                                                    className="text-indigo-600 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {majors.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                                Belum ada jurusan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <div className="flex flex-wrap gap-1 border-t border-gray-100 p-3">
                                {majors.links.map((link, i) =>
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
