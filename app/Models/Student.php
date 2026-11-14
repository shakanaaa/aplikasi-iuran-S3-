<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'user_id',
    'major_id',
    'full_name',
    'birth_date',
    'gender',
    'address',
    'phone',
    'status',
    'admission_date',
    'graduation_date',
])]
class Student extends Model
{
    use SoftDeletes;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_GRADUATED = 'graduated';

    public const STATUS_TRANSFERRED = 'transferred';

    public const STATUS_ARCHIVED = 'archived';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'admission_date' => 'date',
            'graduation_date' => 'date',
        ];
    }

    /**
     * Get the user account for the student.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the major for the student.
     */
    public function major(): BelongsTo
    {
        return $this->belongsTo(Major::class);
    }

    /**
     * Get the class histories for the student.
     */
    public function classHistories(): HasMany
    {
        return $this->hasMany(StudentClassHistory::class);
    }
}
