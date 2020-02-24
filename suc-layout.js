let ctx;

const point = turf.helpers.point;
const turfDistance = turf.distance.default;
const destination = turf.destination.default;
const projection = turf.projection;

class Stall {
    constructor(x, y, width, length, rotation) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.length = length;
        this.rotation = rotation;
    }
}



let position = [9.166627, 49.277359]; // real position
//let userPosition = [9.166627, 49.277359];
//let position = [9.1773, 49.2756]; // browser
let userPosition = [9.166627, 49.277359];
let scale = 8;
let points;
const stalls = [new Stall(9.166627, 49.277359, 3, 5, 0)];
let selectedStall = 0;


let center;


function drawCircle(context) {
    context.beginPath();
    context.arc(0, 0, 100, 0, 2 * Math.PI);
    context.stroke();
    context.moveTo(0, -100);
    context.lineTo(0, 100);
    context.stroke();
    context.moveTo(0, -100);
    context.lineTo(20, -80);
    context.stroke();
    context.moveTo(0, -100);
    context.lineTo(-20, -80);
    context.stroke();
}

function initCanvas() {
    const canvas = document.getElementById("sucCanvas");
    ctx = canvas.getContext("2d");
    center = projection.toMercator(point(position))["geometry"]["coordinates"];
    print(center);

    ctx.translate(250, 250);
}

function drawStall(context, points) {
    context.beginPath();
    context.lineWidth = 1;

    context.moveTo((points[0][0] - center[0]) * scale, -1 * (points[0][1] - center[1]) * scale);
    context.lineTo((points[1][0] - center[0]) * scale, -1 * (points[1][1] - center[1]) * scale);
    context.stroke();
    context.lineTo((points[2][0] - center[0]) * scale, -1 * (points[2][1] - center[1]) * scale);
    context.stroke();
    context.lineTo((points[3][0] - center[0]) * scale, -1 * (points[3][1] - center[1]) * scale);
    context.stroke();
    context.closePath();
    context.stroke();
}

function drawPosition(context, position) {
    const convertedPos = projection.toMercator(point(position))["geometry"]["coordinates"];
    context.beginPath();
    context.save();
    context.fillStyle = "red";
    context.arc((convertedPos[0] - center[0]) * scale, -1 * (convertedPos[1] - center[1]) * scale, 1 * scale, 0, 2 * Math.PI);
    context.fill();
    context.restore();

}

const print = console.log;

function testSuc() {
    ctx.clearRect(-250, -250, 500, 500);
    for (let stall of stalls) {
        const distance = Math.sqrt((stall.width / 2) * (stall.width / 2) + (stall.length / 2) * (stall.length / 2));
        const angle = Math.asin((stall.width / 2) / distance) * (180 / Math.PI);

        print("width: ", stall.width, " length: ", stall.length, " angle: ", angle, " distance: ", distance, " scale: " + scale);

        const position = [stall.x, stall.y];

        const topLeft = destination(point(position), distance / 1000, -angle + stall.rotation);
        const topRight = destination(point(position), distance / 1000, angle + stall.rotation);
        const bottomRight = destination(point(position), distance / 1000, 180 - angle + stall.rotation);
        const bottomLeft = destination(point(position), distance / 1000, -180 + angle + stall.rotation);

        points = [];

        points.push(projection.toMercator(topLeft["geometry"])["coordinates"]);
        points.push(projection.toMercator(topRight["geometry"])["coordinates"]);
        points.push(projection.toMercator(bottomRight["geometry"])["coordinates"]);
        points.push(projection.toMercator(bottomLeft["geometry"])["coordinates"]);
        drawStall(ctx, points);

    }



    drawPosition(ctx, userPosition);

}

function updatePosition(position) {
    console.log(position);
    pos = position.coords;
    userPosition = [pos.longitude, pos.latitude];
    testSuc();
}

document.addEventListener("DOMContentLoaded", function (e) {
    initCanvas();
    testSuc();

    let watchId = navigator.geolocation.watchPosition(updatePosition, function (positionError) {
        console.log(positionError);
    }, {
        enableHighAccuracy: true,
        maximumAge: 60000
    });
    //    window.requestAnimationFrame(updateScreen);
});

function processKey(key) {
    if ((key === "W")) {
        stalls[selectedStall].width += 0.10;
    }
    if ((key === "w")) {
        stalls[selectedStall].width -= 0.10;
    }
    if ((key === "L")) {
        stalls[selectedStall].length += 0.10;
    }
    if ((key === "l")) {
        stalls[selectedStall].length -= 0.10;
    }
    if ((key === "R")) {
        stalls[selectedStall].rotation += 5;
        if (stalls[selectedStall].rotation >= 180) {
            stalls[selectedStall].rotation = 0;
        }
    }
    if ((key === "r")) {
        stalls[selectedStall].rotation -= 5;
        if (stalls[selectedStall].rotation <= 0) {
            stalls[selectedStall].rotation = 180;
        }
    }
    if (key === "-") {
        if (scale <= 1) {
            scale -= 0.1;
        } else {
            scale -= 1;
        }
        if (scale <= 0) {
            scale = 0.1;
        }
    }
    if (key === "+") {
        if (scale < 1) {
            scale += 0.1;
        } else {
            scale += 1;

        }
    }
    if (key == "A") {
        stalls.push(new Stall(userPosition[0], userPosition[1], 3, 5, 0));
        selectedStall = stalls.length - 1;
    }
    if (key == "P") {
        position = userPosition;
        center = projection.toMercator(point(position))["geometry"]["coordinates"];
    }

    testSuc();

}

document.addEventListener("keydown", (event) => {
    //console.log(event);
    processKey(event.key);
});
