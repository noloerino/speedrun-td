const THREE = require('three')
const OrbitControls = require('three-orbit-controls')(THREE)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
new OrbitControls(camera)

const renderer = new THREE.WebGLRenderer({alpha: true})
const canvas = document.getElementById('canvas')
var [ width, height ] = [ canvas.offsetWidth, canvas.offsetHeight ]
renderer.setSize(width, height)
document.getElementById('canvas').appendChild(renderer.domElement)

const Game = require('./Game')
var game = new Game()
scene.add(game.world.initializeRendering())

var light = new THREE.AmbientLight(0xaaaaaa)
scene.add(light)

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add(directionalLight);

camera.position.z = 10

function animate() {
    game.update()
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
animate()
