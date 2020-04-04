// 百度地图API功能
	var map = new BMap.Map("l-map");
	map.centerAndZoom(new BMap.Point(117.269945,31.86713), 13);
	map.enableScrollWheelZoom(true);
	var myGeo = new BMap.Geocoder();
	var geolocation = new BMap.Geolocation();
	var adds = [];
	var markerClusterer = null;
	var markers = [];
	map.centerAndZoom('重庆市',15);
	
	function bdGEO(){
		console.log(addr.length);
		addr.forEach(item =>{
			name.indexOf(item['故障类型']) >-1 && adds.push(item);
		});
		console.log(adds)
		adds.forEach(add =>{
			geocodeSearch(add);
		})
	}
	function geocodeSearch(add){
		myGeo.getPoint(add['故障地址'], function(point){
			if (point) {
				document.getElementById("result").innerHTML +=  add['工单编号']+'-'+add['故障地址'] + ":" + point.lng + "," + point.lat + "</br>";
				var address = new BMap.Point(point.lng, point.lat);
				addMarker(address,new BMap.Label(add['故障地址'],{offset:new BMap.Size(20,-10)}));
			}
		}, "重庆市");
	}
	// 编写自定义函数,创建标注
	function addMarker(point,label){
		var marker = new BMap.Marker(point);
		
		
		map.addOverlay(marker);
		marker.setLabel(label);
		markers.push(marker);
	}
	function cluster(){		
		markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});
	}
	