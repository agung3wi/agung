<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed'); ?>
<link rel="stylesheet" href="//code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css">
<script src="//code.jquery.com/ui/1.11.1/jquery-ui.js"></script>
<link rel="stylesheet" href="/resources/demos/style.css">
<script type="text/javascript">
$(function() {
	function get_item(){
		items = parseInt($('#jml-item').val());
		coloumn =  $('.main-table tbody').find("tr").length ;
		kosong = false;
		if(coloumn<items){
			for (i = 1; i <= items; i++) { 
				if($('.main-table tbody').find("tr.item_"+i).length ==0){
					kosong = true;
					break;
				}
			}
			if(kosong){
				return i;
			} 
		} else {
			newitem = items+1;
			$('#jml-item').val(newitem);
			return newitem;
		}
	}

	function chosen_item(item,id,data){
		$('.main-table tbody').find("tr.item_"+item+" .harga").val(data.harga);
		setRupiah($('.main-table tbody').find("tr.item_"+item+" .harga"));
	}

	function setRupiah(inp)
	{
		if(typeof $(inp).val() != 'undefined')
		{
			newVal = '';
			temp = $(inp).val().replace(/\./g,'');
			len = temp.length;
			//alert(temp);
			counter = 0;
			for(var i=len-1; i>=0; i--)
			{
				newVal = newVal + temp.substr(i,1);
				counter++;
				if(counter%3 == 0 && i!=0)
				{
					newVal = newVal + '.';
				}
			}
			newVal = newVal.split("").reverse().join("");
			if(newVal=='NaN') newVal = '0';
			$(inp).val(newVal);
		}
	}


	$(".add-item-barang").on("click", function() {
		items = get_item();
		var append = '<tr data-item="'+items+'" class="item_'+items+'">';
		item_barang = '<td><input type="text" data-item="'+items+'" class="col-sm-8 simplified-input item-barang" '+ 
		'name="item_'+items+'[nama_barang]" /></td>';
		append += item_barang;
		append += '<td><input type="text" name="item_'+items+'[nama_barang]" class="simplified-input item-jumlah" /></td>';
		append += '<td><input class="simplified-input harga" type="text" /></td>';
		append += '<td></td>';
		append += '<td></td>';
		append += '<td></td>';
		aksi = '<td><button type="button" data-item="'+items+'" class="btn btn-merah item-hapus">Hapus</button></td>';
		append += aksi;
		append += '</tr>';
        $('.main-table tbody').append(append);
        //hapus item
        $(".item-hapus").on("click", function() {
			item = $(this).data('item');
			$('.item_'+item).remove();
		});

		$('.item-barang').autocomplete(
		{
			source : function( request, response ) {
				$.ajax({
					url: "<?php echo base_url(); ?>jual/stok_json",
					dataType: "json",
					data: {
					term: request.term
					},
					success: function( data ) {
					response( data );
					}
				});
			},
			select: function (event, ui)
		    {
		    	var y = $(this).data('item');
		        var test = ui.item ? ui.item.id : 0;
		        if (test > 0)
		        {
		           chosen_item(y,test,ui.item);
		        }
		    }
		});	
        //$("main-table").;
        //autocomplete select barang
    });
});

		
</script>
<?php echo form_open('jual/create'); ?>
<div style="display:none;">
	<input type='text' id="jml-item" name="jml-item" value="0" />
</div>
<table class="table table-bordered table-hover main-table">
	<thead>
		<tr>
			<th>Nama Barang</th>
			<th>Jumlah Barang</th>
			<th>Harga Per Barang</th>
			<th>Satuan</th>
			<th>Diskon</th>
			<th>Total</th>
			<th>Aksi</th>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
<div class="tombolAdd">
<button type="button" class="btn btn-primary add-item-barang">Add Barang</button>
</div>

<?php echo form_close();?>