<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\ClassRoom;
use App\Models\Major;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'student']);

        $admin = User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Administrator',
                'email' => 'admin@s3.local',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'is_active' => true,
            ]
        );
        $admin->syncRoles('admin');

        $major = Major::firstOrCreate(
            ['code' => 'RPL'],
            ['name' => 'Rekayasa Perangkat Lunak', 'is_active' => true]
        );

        $year = AcademicYear::firstOrCreate(
            ['name' => '2026/2027'],
            ['start_date' => '2026-07-01', 'end_date' => '2027-06-30', 'is_active' => true]
        );

        $gradeNames = [10 => 'X', 11 => 'XI', 12 => 'XII'];

        foreach ($gradeNames as $grade => $label) {
            ClassRoom::firstOrCreate(
                [
                    'academic_year_id' => $year->id,
                    'major_id' => $major->id,
                    'name' => "{$label} RPL",
                ],
                ['grade_level' => $grade, 'is_active' => true]
            );
        }
    }
}
