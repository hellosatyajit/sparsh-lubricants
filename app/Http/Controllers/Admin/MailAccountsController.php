<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\MailAccount;
use Illuminate\Support\Facades\Log;

class MailAccountsController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function index()
    {
        $mailAccounts = MailAccount::whereNull('deleted_at')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('admin/mail-accounts', [
            'mailAccounts' => $mailAccounts
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'mail_id' => 'required|string|max:100',
            'status' => 'required|in:active,inactive',
            'app_code' => 'required|string',
        ]);

        try {
            MailAccount::create($validated);
            return redirect()->back()->with('success', 'Mail account created successfully.');
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return redirect()->back()->withErrors([
                    'mail_id' => 'This Mail ID already exists.',
                ])->withInput();
            }
            
            Log::error('DB Error on create:', ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors([
                'general' => 'Something went wrong. Please try again.',
            ])->withInput();
        }
    }

    public function update(Request $request, MailAccount $mailAccount)
    {
        $validated = $request->validate([
            'mail_id' => 'required|string|max:100',
            'status' => 'required|in:active,inactive',
            'app_code' => 'required|string',
        ]);

        $mailAccount->update($validated);

        return redirect()->back();
    }

    /**
     * Delete the user's account.
     */
    public function destroy(MailAccount $mailAccount)
    {
        $mailAccount->deleted_at = now();
        $mailAccount->save();

        return redirect()->back();
    }
}
