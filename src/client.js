const THREE = require('three')
const OrbitControls = require('three-orbit-controls')(THREE)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

const renderer = new THREE.WebGLRenderer({alpha: true})
const canvas = document.getElementById('canvas')
var [ width, height ] = [ canvas.offsetWidth, canvas.offsetHeight ]
renderer.setSize(width, height)
document.getElementById('canvas').appendChild(renderer.domElement)

const Game = require('./Game')
var game = new Game()
scene.add(game.world.initializeRendering())
camera.position.z = 8 
camera.position.y = 8
var controls = new OrbitControls(camera)
controls.target.set(game.world.grid.getWidth() / 2, 0, game.world.grid.getLength() / 2)
camera.lookAt(game.world.grid.getWidth() / 2, 0, game.world.grid.getLength() / 2)

var spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 0, 10, 0 );

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 3;
spotLight.shadow.mapSize.height = 3;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

scene.add( spotLight );

var light = new THREE.AmbientLight(0xffffff)
scene.add(light)

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
// scene.add(directionalLight);


function animate() {
    var {added, removed} = game.update()
    added.map(added => scene.add(added.initializeRendering()))
    removed.map(removed => scene.remove(removed.rendering))
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
animate()
