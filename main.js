import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

// const controls = new OrbitControls(camera, renderer.domElement);

let clock = new THREE.Clock();
let mixer;

// シーンの作成
const scene = new THREE.Scene();
// 座標軸の表示
scene.add(new THREE.AxesHelper(5));

const light = new THREE.PointLight();
light.position.set(0.8, 1.4, 1.0);
scene.add(light);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

// カメラの作成
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// const camera = new THREE.PerspectiveCamera(
//   45,
//   window.innerWidth / window.innerHeight,
//   1,
//   5000
// );

//カメラセット
camera.position.set(10, 10, 30);
camera.lookAt(0, 0, 0);

// 滑らかにカメラコントローラーを制御する
const controls = new OrbitControls(camera, document.body);
controls.enableDamping = true;
controls.dampingFactor = 0.2;

//光源
const dirLight = new THREE.SpotLight(0xffffff,10);//color,強度
dirLight.position.set(-2000, 3000, 300);
dirLight.castShadow = true;
scene.add(dirLight);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xffffff));
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
// const points = [];
// points.push(new THREE.Vector3(-10, 0, 0));
// points.push(new THREE.Vector3(0, 10, 0));
// points.push(new THREE.Vector3(10, 0, 0));

// const geometry = new THREE.BufferGeometry().setFromPoints(points);
// const line = new THREE.Line(geometry, material);

const loader = new FBXLoader();
loader.load(
  // "Taunt.fbx",
  "untitled5.fbx",
  (object) => {
    object.scale.set(0.1, 0.1, 0.1);
    //シーン内の特定のオブジェクトのアニメーション用のプレーヤー(アニメーションの調整)
    mixer = new THREE.AnimationMixer(object);
    //Animation Actionを生成
    const action = mixer.clipAction(object.animations[0]);

    //アニメーションを再生する
    action.play();

    //オブジェクトとすべての子孫に対してコールバックを実行
    object.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
      }
    });

    scene.add(object);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
);

// scene.add(line);

// camera.position.z = 5;

function animate() {
  if (mixer) {
    mixer.update(clock.getDelta());
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
// //読み込んだシーンが暗いので、明るくする
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.render(scene, camera);
