<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['code', 'name', 'description', 'hpp', 'margin', 'selling_price', 'is_active'])]
class Product extends Model
{
    public function projectItems()
    {
        return $this->hasMany(ProjectItem::class, 'id_product');
    }
}
