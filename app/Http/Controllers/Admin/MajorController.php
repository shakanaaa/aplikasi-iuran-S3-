<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MajorRequest;
use App\Models\Major;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MajorController extends Controller
{
    /**
     * Display a listing of majors.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Majors/Index', [
            'majors' => Major::withCount('students')
                ->orderBy('code')
                ->paginate(15),
        ]);
    }

    /**
     * Store a newly created major.
     */
    public function store(MajorRequest $request): RedirectResponse
    {
        Major::create($request->validated());

        return back()->with('success', 'Jurusan berhasil ditambahkan.');
    }

    /**
     * Update the specified major.
     */
    public function update(MajorRequest $request, Major $major): RedirectResponse
    {
        $major->update($request->validated());

        return back()->with('success', 'Jurusan berhasil diperbarui.');
    }
}
