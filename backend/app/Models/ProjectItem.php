<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['id_project', 'id_product', 'qty', 'selling_price', 'nego_price', 'needs_approval'])]
class ProjectItem extends Model
{
    public const UPDATED_AT = null;

    public function project()
    {
        return $this->belongsTo(Project::class, 'id_project');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'id_product');
    }
}
