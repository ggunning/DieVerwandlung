var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
var createScene = function () {
// This creates a basic Babylon Scene object (non-mesh)
var scene = new BABYLON.Scene(engine);

// This creates and positions a free camera (non-mesh)
var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 4, -30), scene);

// This targets the camera to scene origin
camera.setTarget(BABYLON.Vector3.Zero());

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;

new BABYLON.Debug.AxesViewer(scene, 10);

var myMaterial;
setupMaterials(scene);

var wall_o;
var wall_i;
var wall_l;
var wall_r;
setupFloorPlan(scene);

let rotate;
let movein;
let rotate_rv;
let movein_rv;
let frameRate = 20;
[rotate, movein] = setupAnimation(rotate, movein, frameRate);

[rotate, movein] = setupAnimationRoofView(rotate, movein, frameRate);

setupButtons(scene, camera, movein, rotate, frameRate);

return scene;
};

function setupMaterials(scene){

myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
myMaterial.diffuseTexture = new BABYLON.Texture("https://raw.githubusercontent.com/ggunning/DieVerwandlung/main/media/wall_o.png", scene);
//myMaterial.alpha = 0.5;
myMaterial.diffuseTexture.hasAlpha = true;

};

function setupFloorPlan(scene){

var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 20, height: 20}, scene);
ground.position.y = 0;
ground.position.x = 0;
ground.position.z = 0;

wall_o = BABYLON.MeshBuilder.CreateBox("wall_o", {width: 14, height:6, depth:0.2}, scene);
wall_i = BABYLON.MeshBuilder.CreateBox("wall_i", {width: 14, height:6, depth:0.2}, scene);
wall_l = BABYLON.MeshBuilder.CreateBox("wall_l", {width: 10, height:6, depth:0.2}, scene);
wall_r = BABYLON.MeshBuilder.CreateBox("wall_r", {width: 10, height:6, depth:0.2}, scene);

wall_o.position.y = 3;
wall_i.position.y = 3;

wall_o.position.z = 5;
wall_i.position.z = -5;

wall_l.position.y = 3;
wall_r.position.y = 3;

wall_l.position.x = -7;
wall_r.position.x = 7;

wall_l.rotation.y = Math.PI / 2;
wall_r.rotation.y = Math.PI / 2;

wall_o.material = myMaterial;
wall_i.material = myMaterial;

};

function setupAnimation(rotate, movein, frameRate){

//for camera to sweep round
rotate = new BABYLON.Animation("rotate", "rotation.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

let rotate_keys = []; 

rotate_keys.push({
frame: 0,
value: 0
});

rotate_keys.push({
frame: 9 * frameRate,
value: 0
});

rotate_keys.push({
frame: 14 * frameRate,
value: Math. PI
});

rotate.setKeys(rotate_keys);

//for camera move forward
movein = new BABYLON.Animation("movein", "position", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

let movein_keys = []; 

movein_keys.push({
frame: 0,
value: new BABYLON.Vector3(0, 5, -30)
});

movein_keys.push({
frame: 3 * frameRate,
value: new BABYLON.Vector3(0, 2, -10)
});

movein_keys.push({
frame: 5 * frameRate,
value: new BABYLON.Vector3(0, 2, -10)
});

movein_keys.push({
frame: 8 * frameRate,
value: new BABYLON.Vector3(-2, 2, 3)
});

movein.setKeys(movein_keys);

return [rotate, movein];

};

function setupAnimationRoofView(rotate, movein, frameRate){
//for camera to sweep round
rotate = new BABYLON.Animation("rotate", "rotation.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

let rotate_keys = []; 

rotate_keys.push({
frame: 0,
value: 0
});

rotate_keys.push({
frame: 9 * frameRate,
value: 0
});

rotate_keys.push({
frame: 14 * frameRate,
value: Math. PI
});

rotate.setKeys(rotate_keys);

//for camera move forward
movein = new BABYLON.Animation("movein", "position", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

let movein_keys = []; 

movein_keys.push({
frame: 0,
value: new BABYLON.Vector3(0, 5, -30)
});

movein_keys.push({
frame: 3 * frameRate,
value: new BABYLON.Vector3(0, 2, -10)
});

movein_keys.push({
frame: 5 * frameRate,
value: new BABYLON.Vector3(0, 2, -10)
});

movein_keys.push({
frame: 8 * frameRate,
value: new BABYLON.Vector3(-2, 2, 3)
});

movein.setKeys(movein_keys);

return [rotate, movein];
};

function setupButtons(scene, camera, movein, rotate, frameRate){

var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

var button2 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Awake");
button2.width = "150px";
button2.left = "2%";
button2.top = "10px";
button2.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
button2.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
button2.height = "40px";
button2.color = "yellow";
button2.background = "#EB4D4B";
button2.cornerRadius = 20;
button2.thickness = 4;
button2.children[0].color = "#DFF9FB";
button2.children[0].fontSize = 24;
button2.onPointerUpObservable.add(function() {
scene.beginDirectAnimation(camera, [movein, rotate], 0, 25 * frameRate, false);
});
advancedTexture.addControl(button2);  

var button3 = BABYLON.GUI.Button.CreateSimpleButton("but3", "Discovered");
button3.width = "150px"
button3.left = "20%";
button3.top = "10px";
button3.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
button3.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
button3.height = "40px";
button3.color = "yellow";
button3.background = "#EB4D4B";
button3.cornerRadius = 20;
button3.thickness = 4;
button3.children[0].color = "#DFF9FB";
button3.children[0].fontSize = 24;
button3.onPointerUpObservable.add(function() {
scene.beginDirectAnimation(camera, [movein, rotate], 100, 110 * frameRate, false);
});
advancedTexture.addControl(button3);  

};
        window.initFunction = async function() {
            
            
            var asyncEngineCreation = async function() {
                try {
                    return createDefaultEngine();
                } catch(e) {
                    console.log("the available createEngine function failed. Creating the default engine instead");
                    return createDefaultEngine();
                }
            }

            window.engine = await asyncEngineCreation();
if (!engine) throw 'engine should not be null.';
startRenderLoop(engine, canvas);
window.scene = createScene();};
initFunction().then(() => {sceneToRender = scene                    
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});