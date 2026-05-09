<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\Product;
use App\Models\Project;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function getFilterData()
    {
        if (Auth::user()->role !== 'manager') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'success' => true,
            'sales' => User::where('role', 'sales')->select('id', 'name')->get(),
        ]);
    }

    public function exportProjects(Request $request)
    {
        if (Auth::user()->role !== 'manager') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $query = Project::with(['lead', 'sales', 'items.product']);

        if ($request->filled('id_sales')) {
            $query->where('id_sales', $request->id_sales);
        }
        if ($request->filled('month')) {
            $query->whereMonth('created_at', $request->month);
        }
        if ($request->filled('year')) {
            $query->whereYear('created_at', $request->year);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('lead', function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%");
            });
        }

        $projects = $query->latest()->get();

        return new StreamedResponse(function () use ($projects) {
            $handle = fopen('php://output', 'w');
            
            fputcsv($handle, ['ID Project', 'Tanggal Dibuat', 'Nama Prospek', 'Nama Sales', 'Status', 'Catatan', 'Total Nilai (Rp)']);

            foreach ($projects as $p) {
                $total = $p->items->sum(function($item) { 
                    return $item->qty * $item->nego_price; 
                });
                fputcsv($handle, [
                    $p->id,
                    $p->created_at->format('Y-m-d H:i'),
                    $p->lead->name ?? '-',
                    $p->sales->name ?? '-',
                    strtoupper($p->status),
                    $p->notes,
                    number_format($total, 0, ',', '.')
                ]);
            }
            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="Report_Projects_'.now()->format('Ymd_His').'.csv"',
        ]);
    }

    public function exportLeads(Request $request)
    {
        if (Auth::user()->role !== 'manager') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $query = Lead::with('sales');
        
        if ($request->filled('id_sales')) {
            $query->where('id_sales', $request->id_sales);
        }
        if ($request->filled('month')) {
            $query->whereMonth('created_at', $request->month);
        }
        if ($request->filled('year')) {
            $query->whereYear('created_at', $request->year);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $query->where('name', 'LIKE', "%{$request->search}%");
        }

        $leads = $query->latest()->get();

        return new StreamedResponse(function () use ($leads) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID Lead', 'Tanggal Input', 'Nama Prospek', 'Kontak', 'Alamat', 'Kebutuhan', 'Nama Sales', 'Status']);

            foreach ($leads as $l) {
                fputcsv($handle, [
                    $l->id,
                    $l->created_at->format('Y-m-d H:i'),
                    $l->name,
                    $l->contact,
                    $l->address,
                    $l->requirement,
                    $l->sales->name ?? '-',
                    strtoupper($l->status)
                ]);
            }
            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="Report_Leads_'.now()->format('Ymd_His').'.csv"',
        ]);
    }

    public function exportProducts(Request $request)
    {
        if (Auth::user()->role !== 'manager') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $query = Product::query();

        if ($request->filled('search')) {
            $query->where('name', 'LIKE', "%{$request->search}%");
        }
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active === 'true' ? 1 : 0);
        }

        $products = $query->latest()->get();

        return new StreamedResponse(function () use ($products) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID Produk', 'Kode Produk', 'Nama Produk', 'Deskripsi', 'HPP', 'Margin (%)', 'Harga Jual (Rp)', 'Status']);

            foreach ($products as $p) {
                fputcsv($handle, [
                    $p->id,
                    $p->code,
                    $p->name,
                    $p->description,
                    number_format($p->hpp, 0, ',', '.'),
                    $p->margin,
                    number_format($p->selling_price, 0, ',', '.'),
                    $p->is_active ? 'AKTIF' : 'TIDAK AKTIF'
                ]);
            }
            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="Report_Products_'.now()->format('Ymd_His').'.csv"',
        ]);
    }

    public function exportCustomers(Request $request)
    {
        if (Auth::user()->role !== 'manager') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $query = Customer::with('sales');

        if ($request->filled('id_sales')) {
            $query->where('id_sales', $request->id_sales);
        }
        if ($request->filled('month')) {
            $query->whereMonth('joined_at', $request->month);
        }
        if ($request->filled('year')) {
            $query->whereYear('joined_at', $request->year);
        }
        if ($request->filled('search')) {
            $query->where('name', 'LIKE', "%{$request->search}%");
        }

        $customers = $query->latest()->get();

        return new StreamedResponse(function () use ($customers) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID Customer', 'Tanggal Bergabung', 'Nama', 'Kontak', 'Alamat', 'Nama Sales']);

            foreach ($customers as $c) {
                fputcsv($handle, [
                    $c->id,
                    $c->joined_at,
                    $c->name,
                    $c->contact,
                    $c->address,
                    $c->sales->name ?? '-'
                ]);
            }
            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="Report_Customers_'.now()->format('Ymd_His').'.csv"',
        ]);
    }
}