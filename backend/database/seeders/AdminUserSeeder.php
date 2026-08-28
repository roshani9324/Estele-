<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            [
                'email' => 'admin@estele.com',
            ],
            [
                'name' => 'Estele Admin',
                'password' => Hash::make('Admin@12345'),
                'is_admin' => true,
            ]
        );
    }
}
