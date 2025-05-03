<?php

use App\Http\Controllers\Admin\MailAccountsController;
use App\Http\Controllers\Admin\UsersController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('admin', 'admin/users');

    Route::get('admin/users', [UsersController::class, 'index'])->name('users.index');
    Route::post('admin/users', [UsersController::class, 'store'])->name('users.store');
    Route::put('admin/users/{user}', [UsersController::class, 'update'])->name('users.update');
    Route::delete('admin/users/{user}', [UsersController::class, 'destroy'])->name('users.destroy');

    Route::get('admin/mail-accounts', [MailAccountsController::class, 'index'])->name('mail-accounts.index');
    Route::post('admin/mail-accounts', [MailAccountsController::class, 'store'])->name('mail-accounts.store');
    Route::put('admin/mail-accounts/{mailAccount}', [MailAccountsController::class, 'update'])->name('mail-accounts.update');
    Route::delete('admin/mail-accounts/{mailAccount}', [MailAccountsController::class, 'destroy'])->name('mail-accounts.destroy');
});
