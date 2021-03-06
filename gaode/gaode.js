	
	var addrs = [];
	var adds_0 =0,adds_1 = 0,adds_2 = 0,adds_3 = 0;
	var adds_0_s = 0,adds_1_s = 0,adds_2_s = 0,adds_3_s = 0;
	var icon_0 = "../img/marker_red_sprite.png";
	var icon_1 = "../img/marker_OrangeRed_sprite.png";
	var icon_2 = "../img/marker_Orange_sprite.png";
	var icon_3 = "../img/marker_blue_sprite.png";
//	var icon_0 = {
//      type: 'image',
//      image: '/baiduMap_project/img/marker_red_sprite.png',
//      size: [6, 9],
//      anchor: 'bottom-center',
//  };
//  var icon_1 = {
//      type: 'image',
//      image: '/baiduMap_project/img/marker_OrangeRed_sprite.png',
//      size: [6, 9],
//      anchor: 'bottom-center',
//  };
//  var icon_2 = {
//      type: 'image',
//      image: '/baiduMap_project/img/marker_Orange_sprite.png',
//      size: [6, 9],
//      anchor: 'bottom-center',
//  };
//  var icon_3 = {
//      type: 'image',
//      image: '/baiduMap_project/img/marker_blue_sprite.png',
//      size: [6, 9],
//      anchor: 'bottom-center',
//  };
	
	function bdGEO(){
		
		addr.forEach((item,index) =>{
			switch (item['故障类型']){
				case '低压故障':
					geoCode(item,0,icon_0);
					adds_0++;
					break;
				case '高压故障':
					geoCode(item,1,icon_1);
					adds_1++;
					break;
				case '计量故障':
					geoCode(item,2,icon_2);
					adds_2++;
					break;
				case '电能质量':
					geoCode(item,3,icon_3);
					adds_3++;
					break;
				default:
					break;
			}
		});
		document.getElementById('adds_0').innerHTML = adds_0;
		document.getElementById('adds_1').innerHTML = adds_1;
		document.getElementById('adds_2').innerHTML = adds_2;
		document.getElementById('adds_3').innerHTML = adds_3;
		document.getElementById('adds_4').innerHTML = adds_0+adds_1+adds_2+adds_3;
		setTimeout(() =>{
		
			console.log(addrs)
			
			var overlayGroups = new AMap.OverlayGroup(markers);
			map.add(overlayGroups);
		},3000);
	}
	
	
	
	var map = new AMap.Map('l-map', {
//		    resizeEnable: true,
		    zoom: 12, //初始地图级别
      		center: [106.626359,29.500097], //初始地图中心点
		});
	var geocoder = new AMap.Geocoder({
        city: "重庆市", //城市默认：“全国”
    });
    var markers = [];
    var markerList = [];
	
    
    function geoCode(address,type,icon) {
    	var marker = new AMap.Marker();
    	var obj = {};
        geocoder.getLocation(address['故障地址'], function(status, result) {
            if (status === 'complete'&&result.geocodes.length) {
                obj.lnglat = result.geocodes[0].location;
                obj.type = type;
                obj.number = address['工单编号'];
                obj.addr = address['故障地址'];
		 		var marker = new AMap.Marker({
		            map: map,
		            position: result.geocodes[0].location,
		            icon: icon,
//		            anchor: 'bottom-center', //设置锚点
		            offset: new AMap.Pixel(0, -19),
		            title:address['工单编号']+':  '+address['故障地址']
		        });
		        markerList.push(obj);
		        markers.push(marker);
            }else{
                log.error('查询位置失败'+address['故障地址']);
            }
        });
       
    }
    

    
    
    var mouseTool = new AMap.MouseTool(map); 
    //监听draw事件可获取画好的覆盖物
    var overlays = [];
    mouseTool.on('draw',function(e){
    	adds_0_s = 0;adds_1_s = 0;adds_2_s = 0;adds_3_s = 0;
        overlays.push(e.obj);
        console.log(e)
        var arr = e.obj.getPath();//获取路径坐标
		   isInPolygon(arr)
    }) 
    
    mouseTool.polygon({
	    fillColor:'#00b0ff',
	    strokeColor:'#80d8ff'
    });
//  var radios = document.getElementsByName('func');
//  for(var i=0;i<radios.length;i+=1){
//      radios[i].onchange = function(e){
//      	
//
//        draw(e.target.value)
//      }
//  }

    document.getElementById('clear').onclick = function(){
        clear();
    }  
    function clear(){
    	map.remove(overlays)
        overlays = [];
        document.getElementById('adds_0_s').innerHTML = '';
		document.getElementById('adds_1_s').innerHTML = '';
		document.getElementById('adds_2_s').innerHTML = '';
		document.getElementById('adds_3_s').innerHTML = '';
		document.getElementById('adds_4_s').innerHTML = '';
    }
//  document.getElementById('close').onclick = function(){
//      mouseTool.close(true)//关闭，并清除覆盖物
//      for(var i=0;i<radios.length;i+=1){
//          radios[i].checked = false;
//      }
//      document.getElementById('adds_0_s').innerHTML = '';
//		document.getElementById('adds_1_s').innerHTML = '';
//		document.getElementById('adds_2_s').innerHTML = '';
//		document.getElementById('adds_3_s').innerHTML = '';
//		document.getElementById('adds_4_s').innerHTML = '';
//  }
    
    function isInPolygon(path){
    	let s1=[],s2=[],s3=[],s4=[];
    	markerList.forEach(item =>{    		
    		var isPointInRing = AMap.GeometryUtil.isPointInRing(item.lnglat,path);
    		if(isPointInRing){
    			switch (item.type){
    				case 0:
    					adds_0_s++;
    					s1.push(item.number+'-'+item.addr)
    					break;
    				case 1:
    					adds_1_s++;
    					s2.push(item.number+'-'+item.addr)
    					break;
    				case 2:
    					adds_2_s++;
    					s3.push(item.number+'-'+item.addr)
    					break;
    				case 3:
    					adds_3_s++;
    					s4.push(item.number+'-'+item.addr)
    					break;
    					
    			}
    		}
    	});
    	document.getElementById('adds_0_s').innerHTML = adds_0_s;
		document.getElementById('adds_1_s').innerHTML = adds_1_s;
		document.getElementById('adds_2_s').innerHTML = adds_2_s;
		document.getElementById('adds_3_s').innerHTML = adds_3_s;
		document.getElementById('adds_4_s').innerHTML = adds_0_s+adds_1_s+adds_2_s+adds_3_s;
		console.log('低压故障：')
		console.log(s1);
		console.log('高压故障：');
		console.log(s2);
		console.log('计量故障：');
		console.log(s3);
		console.log('电能质量：');
		console.log(s4);
    }

     map.on("complete", function(){
       bdGEO();
    });

