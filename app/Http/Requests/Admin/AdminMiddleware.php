<?php

namespace App\Http\Requests\Admin;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user()?->role !== 'admin') {
            abort(403);
        }

        return $next($request);
    }
}
