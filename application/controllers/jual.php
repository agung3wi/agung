<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Jual extends CI_Controller {

	// public function __construct()
	// {
	// 	// $data['content'] = '<button class="btn btn-primary">Kirim</button>';
	// 	// $this->load->view('main',$data);
	// }

	function index(){
		$data = array();
		$tmp['content'] = $this->load->view('jual/add', $data, TRUE);
		$this->load->view('main',$tmp);	
	}

	function stok_json(){
		//$keyword = $this->uri->segment(3);
		$keyword = $_GET['term'];
		// cari di database
		$data = $this->db->from('stok')->like('nama',$keyword)->get();	
		$arr  = array();
		// format keluaran di dalam array
		foreach($data->result() as $row)
		{
			//$arr['query'] = $keyword;
			$arr[] = array(
				'value'	=>$row->nama,
				'label'	=>$row->nama,
				'harga'	=>$row->harga_jual, 
				'harga2'=>$row->harga_jual_customer,
				'id'=> $row->id_master 
			);
		}
		// minimal PHP 5.2
		echo json_encode($arr);
	}
}

