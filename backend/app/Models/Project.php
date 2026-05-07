<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['id_lead', 'id_sales', 'status', 'notes', 'id_approved_by', 'approved_at'])]
class Project extends Model
{
    public function lead()
    {
        return $this->belongsTo(Lead::class, 'id_lead');
    }

    public function sales()
    {
        return $this->belongsTo(User::class, 'id_sales');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'id_approved_by');
    }

    public function items()
    {
        return $this->hasMany(ProjectItem::class, 'id_project');
    }
}
