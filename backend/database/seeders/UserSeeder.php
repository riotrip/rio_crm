<?php

namespace Database\Seeders;

use App\Models\User; // <-- Pastikan ini ada
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash; // <-- Pastikan ini ada

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Manager',
            'email' => 'admin@mail.com',
            'password' => Hash::make('password123'),
            'role' => 'manager',
        ]);

        User::create([
            'name' => 'Budi',
            'email' => 'budi@mail.com',
            'password' => Hash::make('password123'),
            'role' => 'sales',
        ]);

        User::create([
            'name' => 'Andi',
            'email' => 'andi@mail.com',
            'password' => Hash::make('password123'),
            'role' => 'sales',
        ]);
    }
}
