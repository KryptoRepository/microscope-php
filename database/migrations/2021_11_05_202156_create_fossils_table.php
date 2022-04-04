<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFossilsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fossils', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('photo')->nullable();
            $table->string('video')->nullable();
            $table->string('model_3d')->nullable();
            $table->foreignId('invertebrate_id')->nullable(); // Типы беспозвоночных животных
            $table->foreignId('index_fossil_id')->nullable(); // Руководящие формы
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fossils');
    }
}
