const image = document.querySelector(".robotImage")

let stage = 0;

// This function animates the image of the robot
function animateDancing() {
    stage += 1

    // Reset the animation if the stage of the animation is greater than 3
    if (stage > 3) {
        stage = 0
    }

    // Change the image to animate the robot
    switch (stage) {
        case 0:
            image.src = "../img/robot.png";
            break;
        case 1:
            image.src = "../img/robot_down.png";
            break;
        case 2:
            image.src = "../img/robot.png";
            break;
        case 3:
            image.src = "../img/robot_down.png";
            break;
    }

    // Change the image direction
    if (stage <= 1) {
        image.style.transform = "scaleX(1)"
    } else {
        image.style.transform = "scaleX(-1)"
    }
}

// Run the animation
setInterval(animateDancing, 900);