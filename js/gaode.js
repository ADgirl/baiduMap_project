	
	var addrs = [];
	var adds_0 =0,adds_1 = 0,adds_2 = 0,adds_3 = 0;
	var adds_0_s = 0,adds_1_s = 0,adds_2_s = 0,adds_3_s = 0;
//	var icon_0 = "/baiduMap_project/img/marker_red_sprite.png";
//	var icon_1 = "/baiduMap_project/img/marker_OrangeRed_sprite.png";
//	var icon_2 = "/baiduMap_project/img/marker_Orange_sprite.png";
//	var icon_3 = "/baiduMap_project/img/marker_blue_sprite.png";
	var icon_0 = {
        type: 'image',
        image: '/baiduMap_project/img/marker_red_sprite.png',
        size: [6, 9],
        anchor: 'bottom-center',
    };
    var icon_1 = {
        type: 'image',
        image: '/baiduMap_project/img/marker_OrangeRed_sprite.png',
        size: [6, 9],
        anchor: 'bottom-center',
    };
    var icon_2 = {
        type: 'image',
        image: '/baiduMap_project/img/marker_Orange_sprite.png',
        size: [6, 9],
        anchor: 'bottom-center',
    };
    var icon_3 = {
        type: 'image',
        image: '/baiduMap_project/img/marker_blue_sprite.png',
        size: [6, 9],
        anchor: 'bottom-center',
    };
	
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
		console.log(addrs)
	}
	
	
	
	var map = new AMap.Map('l-map', {
		     resizeEnable: true
		});
	 var geocoder = new AMap.Geocoder({
        city: "重庆", //城市设为北京，默认：“全国”
    });
    var markers = [];
	var marker = new AMap.Marker();
    
    function geoCode(address,type,icon) {
    	var obj = {};
        geocoder.getLocation(address['故障地址'], function(status, result) {
            if (status === 'complete'&&result.geocodes.length) {
                obj.lnglat = result.geocodes[0].location;
                obj.type = type;
                obj.number = address['工单编号'];
                obj.addr = address['故障地址'];
//              marker.setIcon(icon)
//              document.getElementById('lnglat').value = lnglat;
//              marker.setPosition(address.lnglat);
//              map.setFitView(marker);
//              markers.push(marker);
//console.log(obj)
                addrs.push(obj);
//              map.add(...markers);
            }else{
                log.error('根据地址查询位置失败');
            }
        });
    }
    
     map.on('complete', function () {
        // 创建 AMap.LabelsLayer 图层
        var layer = new AMap.LabelsLayer({
            zooms: [3, 20],
            zIndex: 1000,
            collision: false
        });

        // 将图层添加到地图
        map.add(layer);

        var markers = [];
//      var positions = Positions.slice(0, 3E4);

        

        for (var i = 0; i < addrs.length; i++) {
            var curPosition = addrs[i];
            var curData = {
                position: curPosition.lnglat,
                icon:curPosition.type === 0?icon_0:(curPosition.type === 1?icon_1:(curPosition.type === 2?icon_2:icon_3))
            };

            var labelMarker = new AMap.LabelMarker(curData);

            markers.push(labelMarker);

            // 给marker绑定事件
            labelMarker.on('mouseover', function(e){
                var position = e.data.data && e.data.data.position;

                if(position){
                    normalMarker.setContent(
                        '<div class="amap-info-window">'
                            + position +
                            '<div class="amap-info-sharp"></div>' +
                        '</div>');
                    normalMarker.setPosition(position);
                    map.add(normalMarker);
                }
            });

            labelMarker.on('mouseout', function(){
                map.remove(normalMarker);
            });
        }

        // 一次性将海量点添加到图层
        layer.add(markers);

        // 普通点
        var normalMarker = new AMap.Marker({
            anchor: 'bottom-center',
            offset: [0, -15],
        });
    });
    
	window.onload = function(){
			bdGEO();
	}


