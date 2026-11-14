<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/admin')->assertRedirect('/login');
        $this->get('/admin/majors')->assertRedirect('/login');
        $this->get('/admin/students')->assertRedirect('/login');
    }

    public function test_non_admin_users_cannot_access_admin_pages(): void
    {
        $role = Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']);
        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole($role);

        $this->actingAs($user)->get('/admin')->assertForbidden();
        $this->actingAs($user)->get('/admin/majors')->assertForbidden();
        $this->actingAs($user)->post('/admin/students', [])->assertForbidden();
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $this->withoutVite();

        $role = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole($role);

        $this->actingAs($user)->get('/admin')->assertOk();
    }
}
