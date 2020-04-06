
	var map = new BMap.Map("l-map",{minZoom:5,maxZoom:19});
	map.centerAndZoom('重庆市',15);
	map.enableScrollWheelZoom(true);
//	var b = new BMap.Bounds(new BMap.Point(106.377914,29.49282),new BMap.Point(106.927533,29.309561));
//	try {	
//		BMapLib.AreaRestriction.setBounds(map, b);
//	} catch (e) {
//		alert(e);
//	}
	
	var myGeo = new BMap.Geocoder();
	var geolocation = new BMap.Geolocation();
	var adds_0 = [],adds_1 = [],adds_2 = [],adds_3 = [];
	var adds_0_s = 0,adds_1_s = 0,adds_2_s = 0,adds_3_s = 0;
	var markerClusterer = null;
	var markers = [];
	var name=['低压故障','高压故障','计量故障','电能质量'];
	
	var icon_0 = new BMap.Icon("../img/marker_red_sprite.png",new BMap.Size(19, 25), {
    anchor: new BMap.Size(19, 25)
  });
	var icon_1 = new BMap.Icon("../img/marker_OrangeRed_sprite.png",new BMap.Size(19, 25), {
    anchor: new BMap.Size(19, 25)
  });
	var icon_2 = new BMap.Icon("../img/marker_Orange_sprite.png",new BMap.Size(19, 25), {
    anchor: new BMap.Size(19, 25)
  });
	var icon_3 = new BMap.Icon("../img/marker_blue_sprite.png",new BMap.Size(19, 25), {
    anchor: new BMap.Size(19, 25)
  });
	window.onload = () =>{
		bdGEO();
	}
	
	function bdGEO(){
		addr.forEach(item =>{
			switch (item['故障类型']){
				case '低压故障':
					geocodeSearch(item,icon_0);
					adds_0.push(item);
					break;
				case '高压故障':
					geocodeSearch(item,icon_1);
					adds_1.push(item);
					break;
				case '计量故障':
					geocodeSearch(item,icon_2);
					adds_2.push(item);
					break;
				case '电能质量':
					geocodeSearch(item,icon_3);
					adds_3.push(item);
					break;
				default:
					break;
			}
		});
		document.getElementById('adds_0').innerHTML = adds_0.length;
		document.getElementById('adds_1').innerHTML = adds_1.length;
		document.getElementById('adds_2').innerHTML = adds_2.length;
		document.getElementById('adds_3').innerHTML = adds_3.length;
//		setTimeout(() =>{
//			cluster();
//		},2000)
	}
	function geocodeSearch(add,myIcon){
		myGeo.getPoint(add['故障地址'], function(point){
			if (point) {
//				document.getElementById("result").innerHTML +=  add['工单编号']+'-'+add['故障地址'] + ":" + point.lng + "," + point.lat + "</br>";
				var address = new BMap.Point(point.lng, point.lat);
				addMarker(address,myIcon,add);
			}
		}, "重庆市");
	}
	// 编写自定义函数,创建标注
	function addMarker(point,myIcon,add){
		var marker = new BMap.Marker(point,{icon:myIcon});
		marker.setLabel(new BMap.Label(add['工单编号'],{offset:new BMap.Size(20,-10)}));//{offset:new BMap.Size(20,-10)}
		map.addOverlay(marker);
		marker.markerType=add['故障类型'];
		markers.push(marker);
	}
	function cluster(){		
		markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});
	}
	
	var overlay = null;
	var overlaycomplete = function(e){
		overlay && map.removeOverlay(overlay);
		overlay = e.overlay;
		adds_0_s = 0;adds_1_s = 0;adds_2_s = 0;adds_3_s = 0;
		drawingManager.close();		//关闭画图
        markers.forEach(marker =>{
        	var point = new BMap.Point(marker.point.lng, marker.point.lat);
        	if(e.drawingMode === "circle"){
	        	InOrOutCircle(point,marker.markerType,e.overlay);
	        } else if(e.drawingMode === "rectangle"){
	        	InOrOutRectangle(point,marker.markerType,e.overlay);
	        } else if(e.drawingMode === "polygon"){
	       		InOrOutPolygon(point,marker.markerType,e.overlay);
	        }
        })
        document.getElementById('adds_0_s').innerHTML = adds_0_s;
		document.getElementById('adds_1_s').innerHTML = adds_1_s;
		document.getElementById('adds_2_s').innerHTML = adds_2_s;
		document.getElementById('adds_3_s').innerHTML = adds_3_s;
		
    };
    function clearAll(){
    	overlay && map.removeOverlay(overlay);
    	document.getElementById('adds_0_s').innerHTML = '';
		document.getElementById('adds_1_s').innerHTML = '';
		document.getElementById('adds_2_s').innerHTML = '';
		document.getElementById('adds_3_s').innerHTML = '';
    }
    var styleOptions = {
        strokeColor:"red",    //边线颜色。
        fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    };
    //实例化鼠标绘制工具
    var drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
            drawingModes:[BMAP_DRAWING_CIRCLE]
        },
        circleOptions: styleOptions, //圆的样式
        rectangleOptions: styleOptions,
        polygonOptions: styleOptions
    });  
	 //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', overlaycomplete);
    
  //判断点是否在多边形内
    function InOrOutPolygon(point,type,polygon) {
        var result = BMapLib.GeoUtils.isPointInPolygon(point, polygon);
        if (result) {//在内部，把该点显示在地图上
            switch (type){//adds_0_s = 0;adds_1_s = 0;adds_2_s = 0;adds_3_s = 0;
				case '低压故障':
					adds_0_s++;
					break;
				case '高压故障':
					adds_1_s++;
					break;
				case '计量故障':
					adds_2_s++;
					break;
				case '电能质量':
					adds_3_s++;
					break;
				default:
					break;
			}
        }
    }
    
	//判断点是否在矩形内
    function InOrOutRectangle(point,type,rectangle){
        	var result = BMapLib.GeoUtils.isPointInPolygon(point, rectangle);
        if (result) {//在内部，把该点显示在地图上
           switch (type){//adds_0_s = 0;adds_1_s = 0;adds_2_s = 0;adds_3_s = 0;
				case '低压故障':
					adds_0_s++;
					break;
				case '高压故障':
					adds_1_s++;
					break;
				case '计量故障':
					adds_2_s++;
					break;
				case '电能质量':
					adds_3_s++;
					break;
				default:
					break;
			}
        }
    }
    function InOrOutCircle(point,type,circle){
    	 var result = BMapLib.GeoUtils.isPointInCircle(point, circle);
    	 if (result) {//在内部，把该点显示在地图上
           switch (type){//adds_0_s = 0;adds_1_s = 0;adds_2_s = 0;adds_3_s = 0;
				case '低压故障':
					adds_0_s++;
					break;
				case '高压故障':
					adds_1_s++;
					break;
				case '计量故障':
					adds_2_s++;
					break;
				case '电能质量':
					adds_3_s++;
					break;
				default:
					break;
			}
        }
    }