var statsEnabled = false;
var container;
var camera, scene, renderer;
var mesh, zmesh, lightMesh, geometry;
var directionalLight, pointLight;

var mouseX = 0;
var mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

document.addEventListener( 'mousemove', onDocumentMouseMove, false );

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );
	camera.position.z = 3200;

	scene = new THREE.Scene();

	var r = "resources/";

	var urls = [ r + "px.dds", r + "nx.dds",
				 r + "py.dds", r + "ny.dds",
				 r + "pz.dds", r + "nz.dds" ];


	var textureCube = THREE.ImageUtils.loadCompressedTextureCube( urls );
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } )
	var geometry = new THREE.SphereGeometry( 100, 96, 64 );

	var mesh = new THREE.Mesh( geometry, material );
	mesh.scale.x = mesh.scale.y = mesh.scale.z = 16;
	scene.add( mesh );

	// Skybox

	var shader = THREE.ShaderLib[ "cube" ];
	shader.uniforms[ "tCube" ].value = textureCube;

	var material = new THREE.ShaderMaterial( {

		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		side: THREE.BackSide

	} ),


	mesh = new THREE.Mesh( new THREE.CubeGeometry( 6000, 6000, 6000 ), material );
	scene.add( mesh );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById('container').appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove(event) {

	mouseX = ( event.clientX - windowHalfX );
	mouseY = ( event.clientY - windowHalfY );

}

function animate() {

	requestAnimationFrame( animate );

	render();
}

function render() {
	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;

	camera.lookAt( scene.position );

	renderer.render( scene, camera );
}
