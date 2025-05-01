<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $table = 'clients';

    protected $fillable = [
        'first_name',
        'last_name',
        'address',
        'phone_no',
        'email',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public $timestamps = true;
}
