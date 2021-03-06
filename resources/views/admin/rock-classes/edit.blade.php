@extends('admin.layout')

@section('content')
<!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Main content -->
    <section class="content">

      <!-- Default box -->
      <div class="box">
        <div class="box-header with-border">
          <h3 class="box-title">Изменение класса</h3>
          @include('admin.errors')
        </div>
        <div class="box-body">
        {{Form::open(['route'=>['rock-classes.update',$item->id], 'method'=>'put'])}}
          <div class="col-md-6">
            <div class="form-group">
              <label for="inputName">Название</label>
              <input type="text" class="form-control" id="inputName" name="name" placeholder="" value="{{$item->name}}">
              <label for="inputDesc">Описание</label>
              <input type="text" class="form-control" id="inputDesc" name="description" placeholder="" value="{{$item->description}}">
            </div>
        </div>
      </div>
        <!-- /.box-body -->
        <div class="box-footer">
          <button class="btn btn-default">Назад</button>
          <button class="btn btn-warning pull-right">Изменить</button>
        </div>
        <!-- /.box-footer-->
        {{Form::close()}}
      </div>
      <!-- /.box -->

    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->

@endsection
