const THREE = require('three')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

const renderer = new THREE.WebGLRenderer()
const canvas = document.getElementById('canvas')
var [ width, height ] = [ canvas.offsetWidth, canvas.offsetHeight ]
renderer.setSize(width, height)
document.getElementById('canvas').appendChild(renderer.domElement)

var geometry = new THREE.BoxGeometry(1, 1, 1)
var material = new THREE.MeshBasicMaterial({color: 0x00ff00})
var cube = new THREE.Mesh(geometry, material)
scene.add(cube)

const Game = require('./Game')
var game = new Game()
scene.add(game.world.initializeRendering())

camera.position.z = 5

function animate() {
    game.update()
    cube.rotation.y += 0.1
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
animate()
