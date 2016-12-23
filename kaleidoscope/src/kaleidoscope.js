const PIXI = require('pixi.js');

export default class Kaleidoscope {


    constructor(texturePath, slices){

        //Number of slices
        this.slices = slices;
        this.sprites = [];
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.sX = 3.0;
        this.sY = 0.5;

        //Create the renderer
        this.renderer = PIXI.autoDetectRenderer(this.w, this.h, {antialias: true, transparent: true, resolution: 1});

        //Add the canvas to the HTML document
        document.body.appendChild(this.renderer.view);

        //Create a container object called the `stage`
        this.stage = new PIXI.Container();

        //Tell the `renderer` to `render` the `stage`
        this.renderer.render(this.stage);

        this.TextureFile = texturePath;

        PIXI.loader
            .add(this.TextureFile)
            .load( ()=>{
                this.setup();
                this.loop();
            });

        //listners
        window.addEventListener('resize', this.onResize.bind(this) );

    }

    setup() {


        for (var i = 0; i < this.slices; i++) {

            var isOdd = i % 2 != 0;

            var angle = i * Math.PI / (this.slices / 2);

            var sprite = this.createSlice(isOdd);
                sprite.x = this.w * 0.5;
                sprite.y = this.h * 0.5;
                sprite.rotation = angle;
                this.sprites.push( sprite );

            this.stage.addChild( sprite );

        }

    }

    createSlice(odd) {

        var angle = Math.PI / ( this.slices / 2 );

        var container = new PIXI.Container();
        var resource = PIXI.loader.resources[this.TextureFile];
        var slice = new PIXI.extras.TilingSprite(resource.texture,this.w,this.h);

        //to make it is to mirror, we center the title at the x and y
        slice.anchor = new PIXI.Point(0.5, 0.5);

        //if it's odd, we flip
        if( odd ){
            slice.scale.x = -1.0;
        }

        //calculate the radius.
        var r = Math.hypot(this.w*0.5-this.w, this.h*0.5-this.h);
        //calculate the x and y for angle
        var x = r * Math.cos( angle );
        var y = r * Math.sin( angle );

        // Create the mask
        var mask = new PIXI.Graphics();
        mask.beginFill(0xFFFF00);
        mask.moveTo( 0, 0);
        mask.lineTo( this.w, 0 );
        mask.lineTo( x, y );
        mask.lineTo( 0, 0 );
        mask.endFill();
        //if we don't do this, they don't mirror correctly
        //rotating this so it makes more sense
        //The flip (scale.x) needs to occur at the seam
        // 90 degrees - the angle cut in half
        mask.rotation = 1.5707963267948966 - angle * 0.5;

        container.addChild(mask);
        container.addChild(slice);

        slice.mask = mask;


        return container;
    }

    loop() {

        //Loop this function at 60 frames per second
        requestAnimationFrame(this.loop.bind(this));

        //Move the cat 1 pixel to the right each frame
        for (var i = 0; i < this.sprites.length; ++i) {

            this.sprites[i].children[1].tilePosition.x += this.sX;
            this.sprites[i].children[1].tilePosition.y -= this.sY;

            /*if( i % 2 != 0 ){
                sprites[i].children[1].rotation += Math.sin(0.01);// 0.009;

            }else{
                sprites[i].children[1].rotation -= Math.sin(0.01);//0.009;
            }*/
        }

        //Render the stage to see the animation
        this.renderer.render(this.stage);
    }

    onResize(){

        for(var i =0; i < this.sprites.length; i++){

            this.sprites[i].destroy();
        }

        this.sprites = [];

        this.w = window.innerWidth;
        this.h = window.innerHeight;

        this.renderer.resize(this.w, this.h);

        this.setup();
    }

    set speedX(v){
        this.sX = v;
    }

    set speedY(v){
        this.sY = v;
    }
}
