const knownData = [

    [
        9.16632,
        49.279957
    ]
];

let ctx;

const point = turf.helpers.point;
const turfDistance = turf.distance.default;
const destination = turf.destination.default;
const projection = turf.projection;


let position = [9.16632, 49.279957];
let scale = 20;
let width = 3;
let length = 5;
let points;


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
    center = projection.toMercator(point([9.16632, 49.279957]))["geometry"]["coordinates"];
    print(center);

    ctx.translate(250, 250);
}

function drawStall(context, points) {
    context.beginPath();
    context.moveTo((points[0][0] - center[0]) * scale, (points[0][1] - center[1]) * scale);
    context.lineTo((points[1][0] - center[0]) * scale, (points[1][1] - center[1]) * scale);
    context.stroke();
    context.lineTo((points[2][0] - center[0]) * scale, (points[2][1] - center[1]) * scale);
    context.stroke();
    context.lineTo((points[3][0] - center[0]) * scale, (points[3][1] - center[1]) * scale);
    context.stroke();
    context.closePath();
    context.stroke();
}

const print = console.log;

function testSuc() {
    ctx.clearRect(-250, -250, 500, 500);

    const distance = Math.sqrt((width / 2) * (width / 2) + (length / 2) * (length / 2));
    const angle = Math.asin((width / 2) / distance) * (180 / Math.PI);

    print("width: ", width, " length: ", length, " angle: ", angle, " distance: ", distance, " scale: " + scale);


    const topLeft = destination(point(position), distance / 1000, 360 - angle);
    const topRight = destination(point(position), distance / 1000, angle);
    const bottomRight = destination(point(position), distance / 1000, 180 - angle);
    const bottomLeft = destination(point(position), distance / 1000, 180 + angle);

    points = [];

    points.push(projection.toMercator(topLeft["geometry"])["coordinates"]);
    points.push(projection.toMercator(topRight["geometry"])["coordinates"]);
    points.push(projection.toMercator(bottomRight["geometry"])["coordinates"]);
    points.push(projection.toMercator(bottomLeft["geometry"])["coordinates"]);

    drawStall(ctx, points);

}


document.addEventListener("DOMContentLoaded", function (e) {

    initCanvas();
    testSuc();

    //    window.requestAnimationFrame(updateScreen);
});

document.addEventListener("keydown", (event) => {
    //console.log(event);
    if ((event.key === "W")) {
        width += 0.10;
    }
    if ((event.key === "w")) {
        width -= 0.10;
    }
    if ((event.key === "L")) {
        length += 0.10;
    }
    if ((event.key === "l")) {
        length -= 0.10;
    }
    if (event.key === "-") {
        scale -= 1;
    }
    if (event.key === "+") {
        scale += 1;
    }

    testSuc();

});
