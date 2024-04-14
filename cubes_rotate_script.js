let scene, camera, cameraCtrl, renderer;
let width = window.innerWidth,height = window.innerHeight,cx = width / 2,cy = height / 2;
const TMath = THREE.Math;

let conf = {
  n: 7,
  objectWidth: 3,
  objectMargin: 5,
  minIntensity: 0.02,
  maxIntensity: 0.8,
  color: 0x707070,
  randomColor: true,
  emissiveColor: 0xff3030,
  randomEmissiveColor: false };


let meshes;
let maxLength;

let mouseOver = false;
const mouse = new THREE.Vector2();
const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const mousePosition = new THREE.Vector3();
const raycaster = new THREE.Raycaster();

// const stats = new Stats();

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  document.getElementById('container').appendChild( renderer.domElement );

  // document.body.appendChild(stats.dom);

  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.x = 40;
  camera.position.y = -40;
  camera.position.z = 40;
  cameraCtrl = new THREE.OrbitControls(camera);
  // cameraCtrl.enableRotate = false;
  cameraCtrl.enableKeys = false;

  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);

  initScene();
  renderer.domElement.addEventListener('mouseleave', e => {mouseOver = false;});
  renderer.domElement.addEventListener('mousemove', e => {
    const v = new THREE.Vector3();
    camera.getWorldDirection(v);
    v.normalize();
    mousePlane.normal = v;

    mouseOver = true;
    mouse.x = e.clientX / width * 2 - 1;
    mouse.y = -(e.clientY / height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(mousePlane, mousePosition);
  });

//  const gui = new dat.GUI();
//  gui.add(conf, 'n', 2, 16, 1).onChange(initScene);
//  gui.add(conf, 'objectWidth', 1, 20, 0.5).onChange(initScene);
//  gui.add(conf, 'objectMargin', 0, 10, 0.5).onChange(initScene);
//  gui.add(conf, 'maxIntensity', conf.minIntensity, 1, 0.1);
//  gui.add(conf, 'randomColor').listen().onChange(initScene);
//  gui.addColor(conf, 'color').onChange(v => {conf.randomColor = false;initScene();});
//  gui.add(conf, 'randomEmissiveColor').listen().onChange(initScene);
//  gui.addColor(conf, 'emissiveColor').onChange(v => {conf.randomEmissiveColor = false;initScene();});
//  gui.close();

  animate();
};

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  scene.add(new THREE.AmbientLight(0xbbbbbb));
  scene.add(new THREE.HemisphereLight(0xbbbbbb, 0x000000, 1));

  meshes = [];
  maxLength = new THREE.Vector3(1, 1, 1).multiplyScalar(conf.n * (conf.objectWidth + conf.objectMargin) / 2).length();
  let geo = new THREE.BoxBufferGeometry(conf.objectWidth, conf.objectWidth, conf.objectWidth);
  let pos = new THREE.Vector3();
  let color, emissive;
  for (let i = 0; i < conf.n; i++) {
    for (let j = 0; j < conf.n; j++) {
      for (let k = 0; k < conf.n; k++) {
        color = conf.randomColor ? randomColor() : conf.color;
        emissive = conf.randomEmissiveColor ? randomColor() : conf.emissiveColor;
        mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color, emissive, emissiveIntensity: 0 }));
        // mesh.position.set(TMath.randFloatSpread(100), TMath.randFloatSpread(100), TMath.randFloatSpread(100));
        pos.x = (-conf.n / 2 + i) * (conf.objectWidth + conf.objectMargin);
        pos.y = (-conf.n / 2 + j) * (conf.objectWidth + conf.objectMargin);
        pos.z = (-conf.n / 2 + k) * (conf.objectWidth + conf.objectMargin);
        mesh.rotation.set(0, Math.PI / 4, Math.PI / 4);
        mesh.destination = pos.clone();
        mesh.vcoef = 0.05 - pos.length() * ((0.05 - 0.005) / maxLength);
        meshes.push(mesh);
        scene.add(mesh);
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);

  cameraCtrl.update();

  let origin = mousePosition;
  if (!mouseOver) {
    const time = Date.now() * 0.001;
    const d = maxLength * 0.7;
    origin = new THREE.Vector3();
    origin.x = Math.sin(time * 0.9) * d;
    origin.y = Math.cos(time * 1.2) * d;
    origin.z = Math.cos(time * 0.7) * d;
  }

  let mesh, dv, d;
  for (let i = 0; i < meshes.length; i++) {
    mesh = meshes[i];
    dv = mesh.destination.clone().add(origin).sub(mesh.position);
    d = dv.length();
    dv.normalize().multiplyScalar(d * mesh.vcoef);
    mesh.position.add(dv);
    mesh.material.emissiveIntensity = TMath.clamp(40 * dv.length() / maxLength, conf.minIntensity, conf.maxIntensity);
  }

  renderer.render(scene, camera);

  // stats.update();
};

function onWindowResize() {
  width = window.innerWidth;cx = width / 2;
  height = window.innerHeight;cy = height / 2;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

init();