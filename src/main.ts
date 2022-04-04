
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;

init();
animate();

function init() {
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('app') as HTMLCanvasElement,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType('local');
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(VRButton.createButton(renderer));
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.layers.enable(1);

  const geometry = new THREE.BoxGeometry(100, 100, 100);
  geometry.scale(1, 1, -1);

  const textures = getTexturesFromAtrasFile('./assets/sun_temple_stripe_stereo.jpg', 12);
  const materials = [];

  for (let i = 0; i < 6; i++) {
    materials.push(new THREE.MeshBasicMaterial({ map: textures[i] }));
  }
  const skyBox = new THREE.Mesh(geometry, materials);
  skyBox.layers.set(1);
  scene.add(skyBox);

  const materialsR = [];
  for (let i = 0; i < 12; i++) {
    materialsR.push(new THREE.MeshBasicMaterial({ map: textures[i] }));
  }

  const skyBoxR = new THREE.Mesh(geometry, materialsR);
  skyBoxR.layers.set(2);
  scene.add(skyBoxR);

  window.addEventListener('resize', onWindowResize);
}


function getTexturesFromAtrasFile(atlasImgUrl: string, tilesNum: number) {
  const textures: string | any[] = [];

  for (let i = 0; i < tilesNum; i++) {

    textures[i] = new THREE.Texture();

  }

  const loader = new THREE.ImageLoader();
  loader.load(atlasImgUrl, function (imageObj) {

    let canvas, context;
    const tileWidth = imageObj.height;

    for (let i = 0; i < textures.length; i++) {

      canvas = document.createElement('canvas');
      canvas.height = tileWidth;
      canvas.width = tileWidth;
      context = canvas.getContext('2d');
      if (context == null) throw new Error('Could not get context')
      else {
        context.drawImage(imageObj, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth);
      }
      textures[i].image = canvas;
      textures[i].needsUpdate = true;

    }

  });

  return textures;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  renderer.setAnimationLoop(render);
}
function render() {
  renderer.render(scene, camera);
}
