<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AcademicYearRequest;
use App\Models\AcademicYear;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AcademicYearController extends Controller
{
    /**
     * Display a listing of academic years.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/AcademicYears/Index', [
            'academicYears' => AcademicYear::withCount('classes')
                ->orderByDesc('start_date')
                ->paginate(15),
        ]);
    }

    /**
     * Store a newly created academic year.
     */
    public function store(AcademicYearRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            if ($request->boolean('is_active')) {
                AcademicYear::query()->update(['is_active' => false]);
            }

            AcademicYear::create($request->validated());
        });

        return back()->with('success', 'Tahun ajaran berhasil ditambahkan.');
    }

    /**
     * Update the specified academic year.
     */
    public function update(AcademicYearRequest $request, AcademicYear $academicYear): RedirectResponse
    {
        DB::transaction(function () use ($request, $academicYear) {
            if ($request->boolean('is_active')) {
                AcademicYear::query()->whereKeyNot($academicYear->id)->update(['is_active' => false]);
            }

            $academicYear->update($request->validated());
        });

        return back()->with('success', 'Tahun ajaran berhasil diperbarui.');
    }
}
