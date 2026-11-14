<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ClassRoomRequest;
use App\Models\AcademicYear;
use App\Models\ClassRoom;
use App\Models\Major;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ClassRoomController extends Controller
{
    /**
     * Display a listing of classes.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Classes/Index', [
            'classes' => ClassRoom::with(['major:id,code,name', 'academicYear:id,name'])
                ->orderBy('name')
                ->paginate(15),
            'majors' => Major::where('is_active', true)->orderBy('code')->get(['id', 'code', 'name']),
            'academicYears' => AcademicYear::orderByDesc('start_date')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created class.
     */
    public function store(ClassRoomRequest $request): RedirectResponse
    {
        ClassRoom::create($request->validated());

        return back()->with('success', 'Kelas berhasil ditambahkan.');
    }

    /**
     * Update the specified class.
     */
    public function update(ClassRoomRequest $request, ClassRoom $classRoom): RedirectResponse
    {
        $classRoom->update($request->validated());

        return back()->with('success', 'Kelas berhasil diperbarui.');
    }
}
