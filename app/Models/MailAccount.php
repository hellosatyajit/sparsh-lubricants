<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MailAccount extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'mail_id',
        'status',
        'app_code',
    ];

    protected $casts = [
        'status' => 'string',
    ];
}
