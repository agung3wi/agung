function get_value(o) 
{
	//get inventory 
	/*var json = o.attr("inventory") ;
	$("#debug").html(json) ;*/
	
	
	//get posisiton
	var p = o.offset();
	
	//get position point-1
	var point1_y = p.top ; 
	var point1_x= p.left ; 
	
	//get position point-2
	var lebar = o.width(); 
	var tinggi = o.height() ; 
	var point2_x = point1_x+lebar ; 
	var point2_y = p.top ; 
	
	//get position point-3 
	var point3_x = p.left ; 
	var point3_y = p.top +  tinggi ; 
	
	//get position point-4
	var point4_x = point2_x ; 
	var point4_y = point3_y ; 
	
	//get position debuging
	$("#debug").append("<br> posisi point-1 x,y : "+point1_x+","+point1_y);
	$("#debug").append("<br> posisi point-2 x,y : "+point2_x+","+point2_y);
	$("#debug").append("<br> posisi point-3 x,y : "+point3_x+","+point3_y);
	$("#debug").append("<br> posisi point-4 x,y : "+point4_x+","+point4_y);
	$("#debug").append("<br> json : "+point1_x+","+point1_y+"-"+point2_x+","+point2_y+"-"+point3_x+","+point3_y+"-"+point4_x+","+point4_y);
	
	//return to json 
	var position_json = {} ; 
	position_json.posisi =  [point1_x+","+point1_y,point2_x+","+point2_y,point3_x+","+point3_y,point4_x+","+point4_y]
	return position_json; 
}

(function($, window, document) {
	function arrayUnique(array) {
	    var a = array.concat();
	    for(var i = 0; i < a.length; ++i) {
	        for(var j = i + 1; j < a.length; ++j) {
	            if(a[i] == a[j]) {
	            	a.splice(j--, 1);
	            }
	        }
	    }
	    return a;
	};

	// Mendapatkan koordinat tiang dari tenda tertentu
	function koordinatTiang(tenda) {
		var	tendaOffset = tenda.position(),
			tendaWidth  = tenda.width(),
			tendaHeight = tenda.height(),
			tiang       = {
				tiang1: tendaOffset.left + ", " + tendaOffset.top,
				tiang2: (parseInt(tendaOffset.left) + parseInt(tendaWidth)) + ", " + tendaOffset.top,
				tiang3: tendaOffset.left + ", " + (parseInt(tendaOffset.top) + parseInt(tendaHeight)),
				tiang4: (parseInt(tendaOffset.left) + parseInt(tendaWidth)) + ", " + (parseInt(tendaOffset.top) + parseInt(tendaHeight))
			};
		return tiang; 
	}

	function hitungProperti(tendaTerpasang) {
		var properti     = [],
			jmlhBlandar  = 0,
			jmlhKudaKuda = 0,
			jmlhTerpal   = 0,
			jmlhReng     = 0;
		
		for (var i = 1; i <= tendaTerpasang; i++) {
			jmlhBlandar = jmlhBlandar + parseInt($("#tenda-" + i).data("blandar"));
			jmlhKudaKuda = jmlhKudaKuda + parseInt($("#tenda-" + i).data("kuda-kuda"));
			jmlhTerpal = jmlhTerpal + parseInt($("#tenda-" + i).data("terpal"));
			jmlhReng = jmlhReng + parseInt($("#tenda-" + i).data("reng"));
		}
		properti.push({"label": "Blandar", "jumlah": jmlhBlandar});
		properti.push({"label": "Kuda-Kuda", "jumlah": jmlhKudaKuda});
		properti.push({"label": "Terpal", "jumlah": jmlhTerpal});
		properti.push({"label": "Reng", "jumlah": jmlhReng});
		return properti;
	}

	// Menghitung jumlah tenda yang diperlukan untuk semua tenda yang telah terpasang
	function hitungTiang(tendaTerpasang) {
		var dropBox       = $("#droppable");
			tenda         = dropBox.find(".drag"),
			tiang         = [],
			tempTiang     = "",
			property      = "",
			koordinatSama = "";
		
		for (var i = 1; i <= tendaTerpasang; i++) {
			// Data koordinat tiang
			tempTiang = koordinatTiang(dropBox.find(".tenda-" + i));

			for (var j = 1; j <= 4; j++) {
				property = "tiang" + j;
				// Cek apakah koordinat tiang sudah ada atau belum
				koordinatSama = $.inArray(tempTiang[property], tiang);
				if (koordinatSama == -1) {
					// Jika belum ada, masukkan koordinat tiang
					tiang.push(tempTiang[property]);
				}
			}
		}
		return tiang;
	}

	function pasangTiang(tendaTerpasang) {
		var dropBox         = $("#droppable"),
			tiang           = koordinatTiang(dropBox.find(".tenda-" + tendaTerpasang)),
			tiangOrig       = $("#master-tiang"),			
			clonedElem      = "",
			indexTiang      = "",
			tempData        = [],
			koordClass      = "",
			koordTiang      = "",
			koordTiangSplit = "",
			sisiTiang       = "",
			tiangActive     = "",
			jmlhTiang       = dropBox.find(".tiang").length;
		
		// Clone elemen tiang secara otomatis begitu elemen tenda di-drop di area "droppable".
		for (var i = 0; i < 4; i++) {
			tiangActive = "";
			indexTiang = "tiang" + (i + 1);
			koordTiang = tiang[indexTiang];
			koordTiangSplit = koordTiang.split(", ");
			koordClass = (koordTiangSplit[0] - 10) + "-" + (koordTiangSplit[1] - 10);
			sisiTiang = i % 2 ? "tiang-kanan" : "tiang-kiri";
			//if ($("." + koordClass).length > 1) {
				$("." + koordClass).each(function() {
					if ($(this).hasClass("tiang-active")) {
						tiangActive = " tiang-active";
					}
				});
			//}
			clonedElem = tiangOrig
				.clone()
				.attr("id", "tiang-" + (jmlhTiang + 1))
				/*.draggable({
					helper: 'original',
					snap: true,
					tolerance: 'fit'})*/
				.addClass("tiang-tenda-" + tendaTerpasang + " ui-selected")
				.addClass(koordClass + " " + sisiTiang + tiangActive)
				.data("tenda", tendaTerpasang)
				.css({
					// Atur posisi tiang agar berada tepat di tengah titik koordinat.
					position: "absolute",
					top: parseInt(koordTiangSplit[1]) - 10,
					left: parseInt(koordTiangSplit[0]) - 10
				})
				.appendTo(dropBox);
			jmlhTiang++;
		}
	}

	function conctextMenuTenda(tendaTerpasang) {
		// Pengaturan Context Menu untuk elemen tenda.
		var tendaID = "",
			dropBox = $("#droppable");
		$.contextMenu({
	        selector: '#droppable .tenda',
	        callback: function(key, options) {
	        	// Callback mengatur action apa saja yang akan dilakukan jika salah satu menu dipilih.
	        	tendaID = $(this).attr("id");
	        	if (key == "settings") {
	        		alert("Settings clicked!..");
	        	} else if (key == "delete") {
	        		$(this).remove();
		            dropBox.find(".tiang-" + tendaID).remove();
		            tendaTerpasang = dropBox.find(".drag").length;
					// hitungTiang(tendaTerpasang);
	        	} else if (key == "pasang_tiang") {
	        		dropBox.find(".tiang-" + tendaID).removeClass("tiang-inactive").addClass("tiang-active");
	        	} else if (key == "lepas_tiang") {
	        		dropBox.find(".tiang-" + tendaID).removeClass("tiang-active").addClass("tiang-inactive");
	        	}
	        	/*$("#tiang-terpasang").html(dropBox.find(".tiang-active").length);
	        	$("#tiang-tdk-terpasang").html(dropBox.find(".tiang-inactive").length);*/
	        },
	        items: {
	        	// Pengaturan menu item yang ditampilkan pada context menu.
	        	"settings": {name: "Settings", icon: "edit"},
	        	/*"pasang_tiang": {name: "Pasang Tiang", icon: "add"},
	        	"lepas_tiang": {name: "Lepas Tiang", icon: "cut"},*/
	            "delete": {name: "Delete", icon: "delete"}
	        }
	    });
	}

	function contextMenuTiang() {
		// Pengaturan Context Menu untuk elemen tiang.
		var dropBox      = $("#droppable"),
			tiangSebaris = [],
			addedClass   = "",
			removedClass = "",
			koordClass   = "";
		$.contextMenu({
	        selector: '#droppable .tiang',
	        callback: function(key, options) {
	        	// Callback mengatur action apa saja yang akan dilakukan jika salah satu menu dipilih.
	        	var el         = $(this),
	        		koordTiang = el.offset();
	        	if (key == "toggle_tiang") {
	        		if (el.hasClass("tiang-active")) {
	        			addedClass = "tiang-inactive";
	        			removedClass = "tiang-active";
	        		} else {
	        			addedClass = "tiang-active";
	        			removedClass = "tiang-inactive";
	        		}
	        		koordClass = koordTiang.left + "-" + koordTiang.top;
	        		dropBox.find("." + koordClass).removeClass(removedClass).addClass(addedClass);
	        	} else if (key == "toggle_tiang_baris") {
	        		if ($("." + koordTiang.left + "-" + koordTiang.top).length == 1) {
	        			if (el.hasClass("tiang-kanan")) {
	        				tiangSebaris = cariKoordTiangSebaris(el, "kanan");
	        			} else {
	        				tiangSebaris= cariKoordTiangSebaris(el, "kiri");
	        			}
	        		} else if ($("." + koordTiang.left + "-" + koordTiang.top).length == 2) {
	        			var tiangKanan = false,
	        				tiangKiri  = false;
	        			$("." + koordTiang.left + "-" + koordTiang.top).each(function() {
	        				if ( $(this).hasClass("tiang-kanan") ) {
	        					tiangKanan = true;
	        				} else {
	        					tiangKiri = true;
	        				}
	        			});

	        			if ( tiangKanan && tiangKiri ) {
	        				var sisiKanan = cariKoordTiangSebaris(el, "kanan");
		        			var sisiKiri = cariKoordTiangSebaris(el, "kiri");
							tiangSebaris = arrayUnique(sisiKanan.concat(sisiKiri));
	        			} else {
	        				if ( tiangKanan ) {
		        				tiangSebaris = cariKoordTiangSebaris(el, "kanan");
		        			} else {
		        				tiangSebaris = cariKoordTiangSebaris(el, "kiri");
		        			}
	        			} 
	        		} else if ($("." + koordTiang.left + "-" + koordTiang.top).length > 2) {
						var sisiKanan = cariKoordTiangSebaris(el, "kanan");
	        			var sisiKiri = cariKoordTiangSebaris(el, "kiri");
						tiangSebaris = arrayUnique(sisiKanan.concat(sisiKiri));
	        		}
	        		var tiangSebarisCount = tiangSebaris.length;
	        		if (el.hasClass("tiang-active")) {
	        			addedClass = "tiang-inactive";
	        			removedClass = "tiang-active";
	        		} else {
	        			addedClass = "tiang-active";
	        			removedClass = "tiang-inactive";
	        		}
	        		for (var i = 0; i < tiangSebarisCount; i++) {
	        			$("." + tiangSebaris[i]).removeClass(removedClass).addClass(addedClass);
	        		}
	        	}
	        	/*$("#tiang-terpasang").html(dropBox.find(".tiang-active").length);
	        	$("#tiang-tdk-terpasang").html(dropBox.find(".tiang-inactive").length);*/
	        },
	        items: {
	        	// Pengaturan menu item yang ditampilkan pada context menu.
	        	"toggle_tiang": {name: "Toggle Tiang", icon: "edit"},
	        	"toggle_tiang_baris": {name: "Toggle Tiang Sebaris", icon: "edit"}
	        }
	    });
	}

	function cariKoordTiangSebaris(el, direction) {
		var stage          = "start",     // Penunjuk status pencarian tiang
			stacker        = [],          // Menyimpand data koordinat tiang yang sebaris
			tendaID        = "",          // ID tenda
			lebarTenda     = "",          // Lebar tenda
			nextPointKoord = "",          // Koordinat tiang berikutnya. Format: "xxx-yyy"
			nextPoint      = "",          // Object dengan class seperti nextPointKoord
			koordTiang     = el.offset(); // Koordinat elemen yg menjadi basis pencarian
		stacker.push(koordTiang.left + "-" + koordTiang.top);
		do {
			lebarTenda = "";
			if (stage == "start") {
				// Pertama kali pencarian
				tendaID = el.data("tenda");
				stage = "second";
			} else if (stage == "second") {
				// Pencarian kedua dan seterusnya hingga proses berhenti
				tendaID = $("." + nextPointKoord + ".tiang-" + direction).data("tenda");
				koordTiang = $("." + nextPointKoord).offset(); // Koordinat tiang yang baru
			}
			lebarTenda = $("#tenda-" + tendaID).width();
			if (direction == "kanan") {
				nextPointKoord = (koordTiang.left - lebarTenda) + "-" + koordTiang.top;
			} else {
				nextPointKoord = (koordTiang.left + lebarTenda) + "-" + koordTiang.top;
			}
			// nextPoint = $("." + nextPointKoord);
			stacker.push(nextPointKoord);
			if ($("." + nextPointKoord).length == 1) {
				// Hentikan proses jika koordinat yang diuji hanya memiliki satu tiang.
				stage = "stop";
			} else if ($("." + nextPointKoord).length > 1) {
				stage = "stop";
				$("." + nextPointKoord).each(function(index) {
					if ($(this).hasClass("tiang-" + direction)) {
						stage = "second";
					}
				});
			}
		} while (stage != "stop");		
		return stacker;
	}

	$(function() {
		var tendaTerpasang = 0,                // Jumlah tenda yang terpasang.
			debug          = $("#debug"),      // Area untuk menampilkan koordinat tiang yang diperlukan.
			selected       = $([]),            // Kumpulan elemen yang dipilih (selectable).
    		offset         = {top:0, left:0},  // Offset elemen yang akan di-drag.
    		clonedEl       = "",               // Hasil cloning elemen.
    		tendaID        = "",               // ID tenda
    		koordClass     = "",               // nama class yang menunjukkan koordinat elemen tiang.
    		dragged        = "",               // Item yang dipindah-pindah dalam dropbox.
    		dropBox        = $("#droppable");  // Area drop item.

		dropBox.selectable({filter:"div.drag"});

		// Event handler untuk "selectablestop" yang bertujuan untuk memastikan bahwa semua
		// tiang untuk tenda yang dipilih juga ikut terpilih.
		dropBox.on("selectablestop", function(event) {
		    dropBox.find(".tenda").each(function(index) {
		    	if ($(this).hasClass("ui-selected")) {
		    		tendaID = this.id;
		    		dropBox.find(".tiang-" + tendaID).addClass("ui-selected");
		    	}
		    });
		});

		// Pengaturan Draggable
		$(".drag").draggable({
			delay: 10,
			helper: 'clone',
			snap: true,
			snapTolerance: 5,
			//cursor: 'move',
			revert: true, 
			start: function( event,ui) {
				$(".ui-selected").removeClass("ui-selected");
			}
		});

		// Pengaturan Droppable
		dropBox.droppable({
			accept: '.drag',
			activeClass: "drop-area",
			tolerance: 'fit',
			drop: function (e, ui) {
				// start innerdropable
				dragged = ui.helper.clone();
				ui.helper.remove();
				dragged
					.addClass("ui-selected")
					.draggable({
						containment: "#droppable",
						helper: 'original',
						snap: true,
						snapTolerance: 5,
						tolerance: 'fit',
						start: function(e, ui) {
							tendaID = this.id;
							if ($(this).hasClass("ui-selected")) {
								if ($(this).hasClass("tenda")) {
									// Memastikan tiang dari tenda yang di-drag juga ikut terpilih
									//tendaID = this.id;
									dropBox.find(".tiang-" + tendaID).addClass("ui-selected");
								}
								// Simpan semua elemen yang terpilih dalam variabel "selected"
					            selected = dropBox.find(".ui-selected").each(function() {
					               var el = $(this);
					               el.data("offset", el.offset());
					            });
					        } else {
					        	if ($(this).hasClass("tenda")) {
					        		// Memastikan tiang dari tenda yang di-drag juga ikut terpilih
									//tendaID = this.id;
									dropBox.find(".ui-selected").removeClass("ui-selected");
									dropBox.find(".tiang-" + tendaID).addClass("ui-selected");
									selected = dropBox.find(".ui-selected").each(function() {
						               var el = $(this);
						               el.data("offset", el.offset());
						            });
								} else {
									selected = $([]);
					            	dropBox.find(".ui-selected").removeClass("ui-selected");
								}			            
					        }
					        offset = $(this).offset();
					        
					        // Hapus class yang mewakili koordinat tiang saat ini ".posX-posY"
					        // class yang berisi koordinat yang baru akan ditambahkan ketika ketika event drag selesai.
					        dropBox.find(".tiang").each(function(index, value) {
					        	koordClass = $(this).offset();
					        	$(this).removeClass(koordClass.left + "-" + koordClass.top);
					        });
						},
						drop: function (e, ui) {
						},
						drag: function(e,ui) {
							// Skrip berikut ini bertujuan untuk mengatur posisi seluruh elemen yang di-drag agar konsisten
							var dt = ui.position.top - offset.top,
					            dl = ui.position.left - offset.left;
					        // take all the elements that are selected expect $("this"), which is the element being dragged and loop through each.
					        selected.not(this).each(function() {
					            // create the variable for we don't need to keep calling $("this")
					            // el = current element we are on
					            // off = what position was this element at when it was selected, before drag
								var el = $(this),
									off = el.data("offset");
					            el.css({top: Math.round(off.top) + dt, left: Math.round(off.left) + dl});
					        });
							// get_value($(this));
						}
					})
					.addClass('remove-enable')
					.appendTo(dropBox);
				
				var totalItem      = dropBox.find(".drag").length,
					totalTiang     = dropBox.find(".tiang").length,
					tendaTerpasang = totalItem - totalTiang;

				if (dropBox.find(".tenda-" + tendaTerpasang).length < 1) {
					// Jika tenda belum diberikan ID, tambahkan ID dan class sesuai dengan urutannya.
					dragged.addClass("tenda-" + tendaTerpasang).attr("id", "tenda-" + tendaTerpasang);
				}

				if (dropBox.find(".tiang-tenda-" + tendaTerpasang).length < 1) {
					// Jika tiang untuk tenda dengan ID tertentu belum tersedia di layout, jalankan fungsi di bawah ini.
					pasangTiang(tendaTerpasang);
				}

				// Menambahkan class pada tiang. class ini berisi koordinat terbaru setelah event drag berakhir.				
				dropBox.find(".tiang").each(function(index, value) {
		        	koordClass = $(this).offset();
		        	koordClass = Math.round(koordClass.left) + "-" + Math.round(koordClass.top);
		        	$(this).addClass(koordClass);
		        });

				var tiangDibutuhkan    = hitungTiang(tendaTerpasang),
					properti           = hitungProperti(tendaTerpasang),
					listProperti       = $("#properti"),
					debugTxt           = [],
					propertiTxt        = [],
					tiangTerpasanglist = [];
				debugTxt.push("<h3>Tenda terpasang: " + tendaTerpasang + "</h3>");
				propertiTxt.push("<h3>Properti yang dibutuhkan</h3>");

				// Memroses output jumlah tiang yang dibutuhkan.
				for (i = 0; i < tiangDibutuhkan.length; i++) {
					debugTxt.push("<p>Tiang ke-" + (i + 1) + ": " + tiangDibutuhkan[i] + "</p>");
				}
				
				// Memroses output berupa properti apa saja yang dibutuhkan.
				$.each(properti, function(index, value) {
					propertiTxt.push("<p>" + value["label"] + ": " + value["jumlah"] + "</p>");
				});

				dropBox.find(".tiang-active").each(function(index, value) {
					var listTiangTerpasang = $(this).offset();
				});
				propertiTxt.push("<p>Tiang: " + tiangDibutuhkan.length + "</p>");
				debug.html(debugTxt.join(""));
				listProperti.html(propertiTxt.join(""));
			}
		});

		dropBox.on("click", ".drag", function(e) {
			if (e.ctrlKey) {
		        // Jika tombol CTRL ditekan pada saat memilih item, jalankan logic di bawah
		        if ($(this).hasClass("ui-selected")) {
		        	$(this).removeClass("ui-selected");
		        	tendaID = this.id;
		        	dropBox.find(".tiang-" + tendaID).removeClass("ui-selected");
		        } else {
		        	if ($(this).hasClass("tenda")) {
		        		// Memastikan tiang dari tenda yang dipilih juga ikut terpilih
		        		$(this).addClass("ui-selected");
		        		tendaID = this.id;
		        		dropBox.find(".tiang-" + tendaID).addClass("ui-selected");
		        	} else {
		        		$(this).addClass("ui-selected");
		        	}
		        }
		    } else {
		    	if ($(this).hasClass("ui-selected")) {
		        	$(".ui-selected").removeClass("ui-selected");
		        } else {
		        	$(".ui-selected").removeClass("ui-selected");
		        	if ($(this).hasClass("tenda")) {
		        		// Memastikan tiang dari tenda yang dipilih juga ikut terpilih
		        		$(this).addClass("ui-selected");
		        		tendaID = this.id;
		        		dropBox.find(".tiang-" + tendaID).addClass("ui-selected");
		        	} else {
		        		$(this).addClass("ui-selected");
		        	}
		        }
		    }
		});

		// Pengaturan area Remove element dengan cara di-drag.
		var removeBox = $("#remove-drag");
		removeBox.droppable({
			drop: function (event, ui) {
				tendaID = $(ui.draggable).attr("id");
				$(ui.draggable).remove();
		        $(".tiang-" + tendaID).remove();
				tendaTerpasang = dropBox.find(".drag").length;
				hitungTiang(tendaTerpasang);
			},
			hoverClass: "remove-drag-hover",
			accept: '.remove-enable'
		});

		// Context Menu tenda.
		conctextMenuTenda(tendaTerpasang);

		// Context Menu tiang.
		contextMenuTiang();
	});
}(window.jQuery, window, document)); // IIFE nih bro!!.. :D