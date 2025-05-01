<?php

namespace App\Http\Controllers;

use App\Models\Client; // <- Corrected path

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::all();

        return response()->json([
            'success' => true,
            'data' => $clients,
        ]);
    }
}
