<?php

namespace Tests\Feature\Admin;

use App\Models\AcademicYear;
use App\Models\ClassRoom;
use App\Models\Major;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class MasterDataTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $role = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $this->admin = User::factory()->create(['is_active' => true]);
        $this->admin->assignRole($role);
    }

    public function test_admin_can_create_major(): void
    {
        $this->actingAs($this->admin)
            ->post('/admin/majors', [
                'code' => 'RPL',
                'name' => 'Rekayasa Perangkat Lunak',
                'is_active' => true,
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $this->assertDatabaseHas('majors', ['code' => 'RPL', 'name' => 'Rekayasa Perangkat Lunak']);
    }

    public function test_major_code_must_be_unique(): void
    {
        Major::create(['code' => 'RPL', 'name' => 'RPL', 'is_active' => true]);

        $this->actingAs($this->admin)
            ->post('/admin/majors', ['code' => 'RPL', 'name' => 'Lain', 'is_active' => true])
            ->assertSessionHasErrors('code');
    }

    public function test_admin_can_create_academic_year_and_class(): void
    {
        $major = Major::create(['code' => 'TKJ', 'name' => 'TKJ', 'is_active' => true]);

        $this->actingAs($this->admin)
            ->post('/admin/academic-years', [
                'name' => '2026/2027',
                'start_date' => '2026-07-01',
                'end_date' => '2027-06-30',
                'is_active' => true,
            ])
            ->assertSessionHasNoErrors();

        $year = AcademicYear::firstOrFail();

        $this->actingAs($this->admin)
            ->post('/admin/classes', [
                'major_id' => $major->id,
                'academic_year_id' => $year->id,
                'name' => 'X TKJ 1',
                'grade_level' => '10',
                'is_active' => true,
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('classes', ['name' => 'X TKJ 1', 'major_id' => $major->id]);
    }

    public function test_class_name_must_be_unique_per_year_and_major(): void
    {
        $major = Major::create(['code' => 'TKJ', 'name' => 'TKJ', 'is_active' => true]);
        $year = AcademicYear::create([
            'name' => '2026/2027',
            'start_date' => '2026-07-01',
            'end_date' => '2027-06-30',
            'is_active' => true,
        ]);
        ClassRoom::create([
            'major_id' => $major->id,
            'academic_year_id' => $year->id,
            'name' => 'X TKJ 1',
            'grade_level' => '10',
            'is_active' => true,
        ]);

        $this->actingAs($this->admin)
            ->post('/admin/classes', [
                'major_id' => $major->id,
                'academic_year_id' => $year->id,
                'name' => 'X TKJ 1',
                'grade_level' => '10',
                'is_active' => true,
            ])
            ->assertSessionHasErrors('name');
    }
}
