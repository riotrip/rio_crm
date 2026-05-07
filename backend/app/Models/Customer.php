<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['id_lead', 'id_project', 'id_sales', 'name', 'contact', 'address', 'joined_at'])]
class Customer extends Model
{
    public function lead()
    {
        return $this->belongsTo(Lead::class, 'id_lead');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'id_project');
    }

    public function sales()
    {
        return $this->belongsTo(User::class, 'id_sales');
    }
}
