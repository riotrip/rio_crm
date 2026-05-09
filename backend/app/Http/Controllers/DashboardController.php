<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\Project;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function stats()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->role === 'sales') {
            $totalLeads = Lead::where('id_sales', $user->id)->count();
            $totalDeals = Project::where('id_sales', $user->id)->where('status', 'approved')->count();
            $totalCustomers = Customer::where('id_sales', $user->id)->count();
        } else {
            $totalLeads = Lead::count();
            $totalDeals = Project::where('status', 'approved')->count();
            $totalCustomers = Customer::count();
        }

        return response()->json([
            'success' => true,
            'data' => [
                'total' => $totalLeads,
                'deal' => $totalDeals,
                'customer' => $totalCustomers
            ]
        ]);
    }
}