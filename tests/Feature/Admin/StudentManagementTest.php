<?php

namespace Tests\Feature\Admin;

use App\Models\AcademicYear;
use App\Models\ClassRoom;
use App\Models\Major;
use App\Models\Student;
use App\Models\StudentClassHistory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class StudentManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private Major $major;

    private ClassRoom $class;

    protected function setUp(): void
    {
        parent::setUp();

        $role = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']);
        $this->admin = User::factory()->create(['is_active' => true]);
        $this->admin->assignRole($role);

        $this->major = Major::create(['code' => 'RPL', 'name' => 'RPL', 'is_active' => true]);
        $year = AcademicYear::create([
            'name' => '2026/2027',
            'start_date' => '2026-07-01',
            'end_date' => '2027-06-30',
            'is_active' => true,
        ]);
        $this->class = ClassRoom::create([
            'major_id' => $this->major->id,
            'academic_year_id' => $year->id,
            'name' => 'X RPL 1',
            'grade_level' => '10',
            'is_active' => true,
        ]);
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'full_name' => 'Budi Santoso',
            'major_id' => $this->major->id,
            'class_id' => $this->class->id,
            'birth_date' => '2008-05-10',
            'gender' => 'L',
            'phone' => '08123456789',
            'admission_date' => '2026-07-15',
            'status' => 'active',
        ], $overrides);
    }

    public function test_admin_can_create_student_with_account_and_class_history(): void
    {
        $this->actingAs($this->admin)
            ->post('/admin/students', $this->payload())
            ->assertSessionHasNoErrors();

        $student = Student::firstOrFail();
        $this->assertSame('Budi Santoso', $student->full_name);
        $this->assertSame($this->major->id, $student->major_id);

        $user = $student->user;
        $this->assertNotNull($user);
        $this->assertSame('Budi Santoso', $user->name);
        $this->assertTrue($user->hasRole('student'));

        $history = StudentClassHistory::firstOrFail();
        $this->assertSame($student->id, $history->student_id);
        $this->assertSame($this->class->id, $history->class_id);
        $this->assertSame(StudentClassHistory::STATUS_ACTIVE, $history->status);
    }

    public function test_student_requires_full_name_and_valid_major(): void
    {
        $this->actingAs($this->admin)
            ->post('/admin/students', $this->payload(['full_name' => '', 'major_id' => 9999]))
            ->assertSessionHasErrors(['full_name', 'major_id']);

        $this->assertSame(0, Student::count());
    }

    public function test_admin_can_update_student_name_and_status(): void
    {
        $student = Student::create([
            'user_id' => User::factory()->create()->id,
            'major_id' => $this->major->id,
            'full_name' => 'Budi Santoso',
            'status' => 'active',
            'admission_date' => '2026-07-15',
        ]);

        $this->actingAs($this->admin)
            ->put("/admin/students/{$student->id}", $this->payload([
                'full_name' => 'Budi Santoso Putra',
                'status' => 'graduated',
                'graduation_date' => '2027-06-01',
            ]))
            ->assertSessionHasNoErrors();

        $student->refresh();
        $this->assertSame('Budi Santoso Putra', $student->full_name);
        $this->assertSame('graduated', $student->status);
        $this->assertSame('Budi Santoso Putra', $student->user->name);
    }

    public function test_archiving_student_deactivates_account_and_preserves_history(): void
    {
        $student = Student::create([
            'user_id' => User::factory()->create(['is_active' => true])->id,
            'major_id' => $this->major->id,
            'full_name' => 'Budi Santoso',
            'status' => 'active',
            'admission_date' => '2026-07-15',
        ]);
        StudentClassHistory::create([
            'student_id' => $student->id,
            'class_id' => $this->class->id,
            'academic_year_id' => $this->class->academic_year_id,
            'start_date' => '2026-07-15',
            'status' => StudentClassHistory::STATUS_ACTIVE,
        ]);

        $this->actingAs($this->admin)
            ->delete("/admin/students/{$student->id}")
            ->assertRedirect();

        $this->assertSoftDeleted('students', ['id' => $student->id]);
        $this->assertSame('archived', $student->fresh()->status);
        $this->assertFalse($student->user->fresh()->is_active);

        $history = StudentClassHistory::firstOrFail();
        $this->assertSame(StudentClassHistory::STATUS_COMPLETED, $history->status);
        $this->assertNotNull($history->end_date);
    }
}
