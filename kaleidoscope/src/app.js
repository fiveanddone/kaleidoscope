import Kaleidoscope from './kaleidoscope.js';


function map(value, min1, max1, min2, max2) {
    return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
}


var kaleidoscope = new Kaleidoscope("./bin/texture.png", 8);


    //kaleidoscope.speedX = 50;


window.addEventListener('mousemove', (e)=>{
    kaleidoscope.speedX = map( e.clientX, 0, window.innerWidth, -3.0, 3.0 );
    kaleidoscope.speedY = map( e.clientY, 0, window.innerHeight, -3.0, 3.0 );
})
