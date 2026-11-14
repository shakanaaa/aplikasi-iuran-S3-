<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StudentRequest;
use App\Models\ClassRoom;
use App\Models\Major;
use App\Models\Student;
use App\Models\StudentClassHistory;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    /**
     * Display a listing of students.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Students/Index', [
            'students' => Student::with([
                'user:id,name,username,is_active',
                'major:id,code,name',
                'classHistories' => fn ($query) => $query->with(['class:id,name', 'academicYear:id,name'])->latest('start_date'),
            ])
                ->latest()
                ->paginate(15),
            'majors' => Major::where('is_active', true)->orderBy('code')->get(['id', 'code', 'name']),
            'classes' => ClassRoom::with('academicYear:id,name')->orderBy('name')->get(['id', 'name', 'academic_year_id']),
        ]);
    }

    /**
     * Store a newly created student.
     */
    public function store(StudentRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->string('full_name')->toString(),
                'username' => null,
                'email' => null,
                'password' => Str::random(32),
                'is_active' => true,
            ]);
            $user->assignRole('student');

            $student = Student::create([
                ...$request->safe()->except('class_id'),
                'user_id' => $user->id,
                'status' => $request->input('status', Student::STATUS_ACTIVE),
            ]);

            if ($request->filled('class_id')) {
                $class = ClassRoom::findOrFail($request->integer('class_id'));

                StudentClassHistory::create([
                    'student_id' => $student->id,
                    'class_id' => $class->id,
                    'academic_year_id' => $class->academic_year_id,
                    'start_date' => $request->date('admission_date'),
                    'status' => StudentClassHistory::STATUS_ACTIVE,
                    'created_by' => $request->user()->id,
                ]);
            }
        });

        return back()->with('success', 'Siswa berhasil ditambahkan.');
    }

    /**
     * Update the specified student.
     */
    public function update(StudentRequest $request, Student $student): RedirectResponse
    {
        DB::transaction(function () use ($request, $student) {
            $student->update($request->safe()->except('class_id'));
            $student->user->update(['name' => $request->string('full_name')->toString()]);
        });

        return back()->with('success', 'Siswa berhasil diperbarui.');
    }

    /**
     * Archive the specified student.
     */
    public function destroy(Student $student): RedirectResponse
    {
        DB::transaction(function () use ($student) {
            $student->classHistories()
                ->where('status', StudentClassHistory::STATUS_ACTIVE)
                ->update(['status' => StudentClassHistory::STATUS_COMPLETED, 'end_date' => now()->toDateString()]);

            $student->update(['status' => Student::STATUS_ARCHIVED]);
            $student->user->update(['is_active' => false]);
            $student->delete();
        });

        return back()->with('success', 'Siswa berhasil diarsipkan.');
    }
}
