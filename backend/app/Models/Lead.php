<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['id_sales', 'name', 'contact', 'address', 'requirement', 'status'])]
class Lead extends Model
{
    public function sales()
    {
        return $this->belongsTo(User::class, 'id_sales');
    }

    public function projects()
    {
        return $this->hasMany(Project::class, 'id_lead');
    }

    public function customer()
    {
        return $this->hasOne(Customer::class, 'id_lead');
    }
}
