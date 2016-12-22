// Load PIXI
var PIXI = require('pixi.js');

//Number of slices
var slices = 8;
window.sprites = [];
var w = window.innerWidth;
var h = window.innerHeight;

//Create the renderer
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {antialias: true, transparent: false, resolution: 1});

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new PIXI.Container();

//Tell the `renderer` to `render` the `stage`
renderer.render(stage);

var TextureFile = "./bin/texture.png";

PIXI.loader
  .add(TextureFile)
  .load(setup);

function setup() {


    for (var i = 0; i < slices; i++) {

        var isOdd = i % 2 != 0;

        var angle = i * Math.PI / (slices / 2);

        var sprite = createSlice(isOdd);
            sprite.x = w * 0.5;
            sprite.y = h * 0.5;
            sprite.rotation = angle;
            sprites.push( sprite );

        stage.addChild( sprite );

    }

    function createSlice(odd) {

        var angle = Math.PI / ( slices / 2 );

        var container = new PIXI.Container();
        var resource = PIXI.loader.resources[TextureFile];
        var slice = new PIXI.extras.TilingSprite(resource.texture,w,h);

        //to make it is to mirror, we center the title at the x and y
        slice.anchor = new PIXI.Point(0.5, 0.5);

        //if it's odd, we flip
        if( odd ){
            slice.scale.x = -1.0;
        }

        //calculate the radius.
        var r = Math.hypot(w*0.5-w, h*0.5-h);
        //calculate the x and y for angle
        var x = r * Math.cos( angle );
        var y = r * Math.sin( angle );

        // Create the mask
        var mask = new PIXI.Graphics();
            mask.beginFill(0xFFFF00);
            mask.moveTo( 0, 0);
            mask.lineTo( w, 0 );
            mask.lineTo( x, y );
            mask.lineTo( 0, 0 );
            mask.endFill();
            //if we don't do this, they don't mirror correctly
            //rotating this so it makes more sense
            //The flip (scale.x) needs to occur at the seam
            mask.rotation = 1.5707963267948966 - angle * 0.5;

        container.addChild(mask);
        container.addChild(slice);

        slice.mask = mask;


        return container;
    }

    //window.sprites = sprites;

    function gameLoop() {

        //Loop this function at 60 frames per second
        requestAnimationFrame(gameLoop);

        //Move the cat 1 pixel to the right each frame
        for (var i = 0; i < sprites.length; ++i) {

            sprites[i].children[1].tilePosition.x += 3;
            sprites[i].children[1].tilePosition.y -= 0.5;

            /*if( i % 2 != 0 ){
                sprites[i].children[1].rotation += Math.sin(0.01);// 0.009;

            }else{
                sprites[i].children[1].rotation -= Math.sin(0.01);//0.009;
            }*/
        }

        //Render the stage to see the animation
        renderer.render(stage);
    }

    //Start the game loop
    gameLoop();
}


