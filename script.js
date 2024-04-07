function Scene(){
  var self = this;
  var W, H;
  var camera, scene, renderer;
  var geometry, material, mesh;
  var pointLight;
  var obj = {};
  var mouseX = 0;
  var mouseY = 0;
  var nbmesh = 100;
  
  
  this.init = function(){
    // SET
    scene = new THREE.Scene();
	scene.background = new THREE.Color(0xffff00);
    W = window.innerWidth
    H = window.innerHeight
    
    // LIGHTS
    pointLight = new THREE.PointLight(0xFFFFFF, 1.5, 1000);
	  pointLight.position.x = 0;
		pointLight.position.y = 0;
		pointLight.position.z = 500;
		scene.add(pointLight);
    
    // CAMERA
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;
    
    // CAST
    geometry = new THREE.CubeGeometry( 200, 200, 200 );
    
    
    var mesh;
    var color;
    for (var i = 0; i < nbmesh; i++) {
      color = new THREE.Color( 0xffffff );
      color.setRGB( Math.random(), Math.random(), Math.random() );
      
      material = new THREE.MeshPhongMaterial( { color:color, wireframe: false } );
      
      obj['mesh'+i] = new THREE.Mesh( geometry, material );
      
      scene.add( obj['mesh'+i] );
      mesh = obj['mesh' + i];
      
      mesh.position.x = ((- W* 2) * Math.random()) + W;
      mesh.position.y = ((- H* 4) * Math.random()) + H;
      mesh.position.z = ((- H *4) * Math.random()) + H;
    }
    
    // ACTION
    renderer = new THREE.WebGLRenderer();

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('container').appendChild( renderer.domElement );
    
    window.addEventListener( "resize", this.onresize)
    document.addEventListener( "mousemove", this.onmousemove)
  }
  
  this.animate = function(){
    requestAnimationFrame( self.animate );

    
    for ( var i = 0; i < nbmesh; i++ ) {	
      var mesh = obj['mesh'+i];
      mesh.rotation.x += ((W * .5) ) * .00005;
      mesh.rotation.y += ((H * .5) - mouseX) * .00005;
      mesh.position.z  = ((H * .5) - mouseY) * 1.5;  	
    }
    
    pointLight.distance = (mouseY * 2) +1000;
    camera.position.y = (mouseY * 0.5);
    camera.position.x = (mouseX * 0.5);
    
    renderer.render( scene, camera );
  }
  
  this.onresize = function(){
    W = window.innerWidth
    H = window.innerHeight
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H, true);
    renderer.render(scene, camera);
  }
  
  this.onmousemove = function(e){
    mouseX = e.pageX;
    mouseY = e.pageY;
  }
  
  this.init();
	this.animate();
}

new Scene();