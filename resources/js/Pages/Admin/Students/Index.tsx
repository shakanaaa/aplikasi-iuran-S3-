import AdminNav from '@/Components/AdminNav';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type ClassHistory = {
    id: number;
    start_date: string | null;
    end_date: string | null;
    status: string;
    class: { id: number; name: string } | null;
    academic_year: { id: number; name: string } | null;
};

type Student = {
    id: number;
    full_name: string;
    birth_date: string | null;
    gender: string | null;
    address: string | null;
    phone: string | null;
    status: string;
    admission_date: string | null;
    graduation_date: string | null;
    user: { id: number; name: string; username: string | null; is_active: boolean } | null;
    major: { id: number; code: string; name: string };
    class_histories: ClassHistory[];
};

type Paginator<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    students: Paginator<Student>;
    majors: { id: number; code: string; name: string }[];
    classes: {
        id: number;
        name: string;
        academic_year: { id: number; name: string };
    }[];
};

const emptyForm = {
    full_name: '',
    major_id: '',
    class_id: '',
    birth_date: '',
    gender: '',
    address: '',
    phone: '',
    admission_date: '',
    graduation_date: '',
    status: 'active',
};

const statusLabel: Record<string, string> = {
    active: 'Aktif',
    graduated: 'Lulus',
    transferred: 'Pindah',
    archived: 'Arsip',
};

export default function StudentsIndex({ students, majors, classes }: Props) {
    const { props } = usePage();
    const flash = (props as { flash?: { success?: string } }).flash?.success;

    const form = useForm({ ...emptyForm });
    const [editingId, setEditingId] = useState<number | null>(null);

    const startEdit = (student: Student) => {
        setEditingId(student.id);
        form.setData({
            full_name: student.full_name,
            major_id: String(student.major.id),
            class_id: '',
            birth_date: student.birth_date?.slice(0, 10) ?? '',
            gender: student.gender ?? '',
            address: student.address ?? '',
            phone: student.phone ?? '',
            admission_date: student.admission_date?.slice(0, 10) ?? '',
            graduation_date: student.graduation_date?.slice(0, 10) ?? '',
            status: student.status,
        });
        form.clearErrors();
    };

    const resetForm = () => {
        form.reset();
        form.setData({ ...emptyForm });
        setEditingId(null);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (editingId) {
            form.put(route('admin.students.update', { student: editingId }), {
                onSuccess: resetForm,
                preserveScroll: true,
            });
        } else {
            form.post(route('admin.students.store'), {
                onSuccess: resetForm,
                preserveScroll: true,
            });
        }
    };

    const archive = (student: Student) => {
        if (confirm(`Arsipkan siswa "${student.full_name}"? Riwayat pembayaran tetap tersimpan.`)) {
            router.delete(route('admin.students.destroy', { student: student.id }), {
                preserveScroll: true,
            });
        }
    };

    const selectClass =
        'mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Data Siswa
                </h2>
            }
        >
            <Head title="Siswa" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <AdminNav />

                    {flash && (
                        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
                            {flash}
                        </div>
                    )}

                    <div className="grid gap-6 xl:grid-cols-3">
                        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">
                                {editingId ? 'Edit Siswa' : 'Tambah Siswa'}
                            </h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="full_name" value="Nama Lengkap" />
                                    <TextInput
                                        id="full_name"
                                        className="mt-1 block w-full"
                                        value={form.data.full_name}
                                        onChange={(e) => form.setData('full_name', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.full_name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="major_id" value="Jurusan" />
                                    <select
                                        id="major_id"
                                        className={selectClass}
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
                                    <InputLabel htmlFor="class_id" value="Kelas (opsional, saat tambah)" />
                                    <select
                                        id="class_id"
                                        className={selectClass}
                                        value={form.data.class_id}
                                        onChange={(e) => form.setData('class_id', e.target.value)}
                                    >
                                        <option value="">— Tanpa kelas —</option>
                                        {classes.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} ({c.academic_year.name})
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={form.errors.class_id} className="mt-2" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <InputLabel htmlFor="birth_date" value="Tanggal Lahir" />
                                        <TextInput
                                            id="birth_date"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={form.data.birth_date}
                                            onChange={(e) => form.setData('birth_date', e.target.value)}
                                        />
                                        <InputError message={form.errors.birth_date} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="gender" value="Jenis Kelamin" />
                                        <select
                                            id="gender"
                                            className={selectClass}
                                            value={form.data.gender}
                                            onChange={(e) => form.setData('gender', e.target.value)}
                                        >
                                            <option value="">—</option>
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                        <InputError message={form.errors.gender} className="mt-2" />
                                    </div>
                                </div>
                                <div>
                                    <InputLabel htmlFor="admission_date" value="Tanggal Masuk" />
                                    <TextInput
                                        id="admission_date"
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={form.data.admission_date}
                                        onChange={(e) => form.setData('admission_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.admission_date} className="mt-2" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <InputLabel htmlFor="phone" value="Telepon" />
                                        <TextInput
                                            id="phone"
                                            className="mt-1 block w-full"
                                            value={form.data.phone}
                                            onChange={(e) => form.setData('phone', e.target.value)}
                                        />
                                        <InputError message={form.errors.phone} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="status" value="Status" />
                                        <select
                                            id="status"
                                            className={selectClass}
                                            value={form.data.status}
                                            onChange={(e) => form.setData('status', e.target.value)}
                                        >
                                            {Object.entries(statusLabel).map(([value, label]) => (
                                                <option key={value} value={value}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={form.errors.status} className="mt-2" />
                                    </div>
                                </div>
                                <div>
                                    <InputLabel htmlFor="graduation_date" value="Tanggal Lulus (opsional)" />
                                    <TextInput
                                        id="graduation_date"
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={form.data.graduation_date}
                                        onChange={(e) => form.setData('graduation_date', e.target.value)}
                                    />
                                    <InputError message={form.errors.graduation_date} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="address" value="Alamat" />
                                    <textarea
                                        id="address"
                                        rows={2}
                                        className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={form.data.address}
                                        onChange={(e) => form.setData('address', e.target.value)}
                                    />
                                    <InputError message={form.errors.address} className="mt-2" />
                                </div>
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

                        <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200 xl:col-span-2">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Nama</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Jurusan</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Kelas</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Akun</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {students.data.map((student) => {
                                        const latestHistory = student.class_histories[0];
                                        return (
                                            <tr key={student.id}>
                                                <td className="px-4 py-3 font-medium">{student.full_name}</td>
                                                <td className="px-4 py-3">{student.major.name}</td>
                                                <td className="px-4 py-3">
                                                    {latestHistory?.class?.name ?? '—'}
                                                    {latestHistory?.academic_year && (
                                                        <span className="block text-xs text-gray-500">
                                                            {latestHistory.academic_year.name}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {statusLabel[student.status] ?? student.status}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {student.user ? (
                                                        <span className={student.user.is_active ? 'text-green-600' : 'text-red-500'}>
                                                            {student.user.is_active ? 'Aktif' : 'Nonaktif'}
                                                        </span>
                                                    ) : (
                                                        '—'
                                                    )}
                                                </td>
                                                <td className="space-x-3 px-4 py-3 whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => startEdit(student)}
                                                        className="text-indigo-600 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => archive(student)}
                                                        className="text-red-600 hover:underline"
                                                    >
                                                        Arsipkan
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {students.data.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                                                Belum ada siswa.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <div className="flex flex-wrap gap-1 border-t border-gray-100 p-3">
                                {students.links.map((link, i) =>
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
