<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['code', 'name', 'description', 'hpp', 'margin', 'selling_price', 'is_active'])]
class Product extends Model
{
    protected $casts = [
        'hpp' => 'float',
        'margin' => 'float',
        'selling_price' => 'float',
        'is_active' => 'boolean'
    ];

    public function projectItems()
    {
        return $this->hasMany(ProjectItem::class, 'id_product');
    }
}
