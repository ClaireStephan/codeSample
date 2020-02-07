/**
  * TODO: solve the TRAP: test 8 & 9 
  **/
 
 /**
  * Compute value for each position, 
  * and propagate to right, left and down when possible
  **/
function computeMap(floor: number,
                pos: number,
                value: number,
                dir:'L'|'R'|'I', // Left, Right, Init (no choice done yet) 
                elevators: number[][],
                map: number[][],
                nbClones: number,
                nbAdditionalElevators: number) {
    /*
    step +1
    elevator +1
    switch dir +3
    build +3
    */

    var remainingEl: number = nbAdditionalElevators;
    if ( nbClones &&
        (map[floor][pos] == undefined || map[floor][pos] > value)) {

        map[floor][pos] = value;
            // go Left
        if (pos > 0 && !elevators[floor].includes(pos-1)) {
            var step: number = 1;
            var clones = nbClones;
            if (dir == 'R') {
                step = 4;
                clones--;
            }
            computeMap(floor, pos-1, value+step, 'L', elevators, map, 
                        clones, nbAdditionalElevators);
        }
            // go Right
        if (pos < map[floor].length-1 && !elevators[floor].includes(pos+1)) {
            var step: number = 1;
            var clones = nbClones;
            if (dir == 'L') {
                step = 4;
                clones--;
            }
            computeMap(floor, pos+1, value+step, 'R', elevators, map,
                        clones, nbAdditionalElevators);
        }
        // go down
        if (floor) {
            //with existing
            var el: number[] = ( floor > 0 ) ? elevators[floor-1] : []
            var step: number = 1;
            if (el.includes(pos)) {
                computeMap(floor-1, pos, value+step, dir, elevators, map,
                            nbClones, nbAdditionalElevators);
            }
        
            // try adding new elevators if none
            if (!el.length && nbAdditionalElevators && nbClones) {
                var upFloor: number = floor-1;
                step = 4;
                while ( (el == undefined || !el.length) 
                        && upFloor < elevators.length) {
                    el = elevators[++upFloor];
                }
                if (el.includes(pos)) {
                    return computeMap(floor-1, pos, value+step, dir, elevators, map,
                                nbClones-1, nbAdditionalElevators-1);
                }
            }
        }
    }
    return remainingEl;
}
 
  /**
  * find best spot to add a new elevator 
  **/
function findOptimal(exitFloor: number, 
                exitPos: number,
                elevators: number[][],
                map: number[][],
                nbClones: number,
                nbAdditionalElevators: number) {

    var floor: number;
    var pos: number;
    var value: number;
    var step = 4;
    // TO IMPROVE
    var dir:'L'|'R'|'I' = 'I';
    
    // check first if all floor have been reached or add an elevator
    var sum_elevators = elevators[exitFloor];
    for (let i = exitFloor-1; i >= 0 ; i--) {
        sum_elevators.concat(elevators[i+1]);
        if (map[i].filter(box => box != undefined).length == 0) {
            pos = sum_elevators[0];
            var min = map[i+1][pos];
            for (var j = 1; j < sum_elevators.length; j++ ){
                var new_pos: number = sum_elevators[j];
                var new_value: number = map[i+1][new_pos];
                if (min > new_value) {
                    pos = new_pos;
                    min = new_value;
                }
            }
            floor = i;
            break;
        }
    }

    // otherwise look for a good shortcut: minimize the max distance
    if (floor == undefined) {
        var max: number = 0;
        for (let i = exitFloor-1; i >= 0 ; i--) {
            for (var j = 0; j < elevators[i+1].length; j++ ){
                var new_pos: number = elevators[i+1][j];
                var dist: number = map[i][new_pos] - map[i+1][new_pos];
                if (max < dist) {
                    floor = i;
                    pos = new_pos;
                    max = dist;
                }
            }
        }
    }

    value = map[floor+1][pos];
    return computeMap(floor, pos, value+step, dir, elevators, map,
                            nbClones-1, nbAdditionalElevators-1);
}
  
  /**
  * MAIN 
  **/
var inputs: string[] = readline().split(' ');
const nbFloors: number = parseInt(inputs[0]); // number of floors
const width: number = parseInt(inputs[1]); // width of the area
const nbRounds: number = parseInt(inputs[2]); // maximum number of rounds
const exitFloor: number = parseInt(inputs[3]); // floor on which the exit is found
const exitPos: number = parseInt(inputs[4]); // position of the exit on its floor
const nbTotalClones: number = parseInt(inputs[5]); // number of generated clones
const nbAdditionalElevators: number = parseInt(inputs[6]); // number of additional elevators that you can build
const nbElevators: number = parseInt(inputs[7]); // number of elevators

var elevators: number[][] = new Array();
for (let i = 0; i < nbFloors ; i++) {
    elevators[i] = new Array();
}
elevators[exitFloor] = [exitPos];
for (let i = 0; i < nbElevators; i++) {
    var inputs: string[] = readline().split(' ');
    const elevatorFloor: number = parseInt(inputs[0]); // floor on which this elevator is found
    const elevatorPos: number = parseInt(inputs[1]); // position of the elevator on its floor
    elevators[elevatorFloor].push(elevatorPos);
}

// compute the map
var map: number[][] = new Array();
for (let i = 0; i < nbFloors ; i++) {
    map[i] = new Array(width);
}
var res = computeMap(exitFloor, exitPos, 0, 'I', elevators, map, nbTotalClones, nbAdditionalElevators);
// we should at least have reached the ground

while ( res && map[0].filter(box => box != undefined).length == 0) {
    res = findOptimal(exitFloor, exitPos, elevators, map, nbTotalClones, res);
}

var isOk: boolean = false;

var built: boolean[] = new Array(exitFloor);
// game loop
while (true) {
    var inputs: string[] = readline().split(' ');
    const cloneFloor: number = parseInt(inputs[0]); // floor of the leading clone
    const clonePos: number = parseInt(inputs[1]); // position of the leading clone on its floor
    const direction: string = inputs[2]; // direction of the leading clone: LEFT or RIGHT

    var action: 'WAIT'|'BLOCK'|'ELEVATOR' = 'WAIT';

    // if path is too long we need to optimize more
    if (!isOk) {
        while ( res && map[cloneFloor][clonePos] > nbRounds) {
            res = findOptimal(exitFloor, exitPos, elevators, map, nbTotalClones, res);
        }
        isOk = true;
    }

    // if we are under an elevator
    if ( elevators[cloneFloor] && elevators[cloneFloor].includes(clonePos)) {
        // WAIT
    } else if ( (direction == 'RIGHT' && map[cloneFloor][clonePos+1] > map[cloneFloor][clonePos]) 
        || (direction == 'LEFT' && map[cloneFloor][clonePos-1] > map[cloneFloor][clonePos]) ) {
        // if we can't keep same direction
        action = 'BLOCK';
        if ( cloneFloor != exitFloor
          && (map[cloneFloor+1][clonePos] == map[cloneFloor][clonePos]-4) ) {
              // if we want to go up with a new elevator
            if (built[cloneFloor] ) { // elevator is built
                action = 'WAIT';
            } else {
                action = 'ELEVATOR';
                built[cloneFloor] = true;
            }
        }
    }

    console.log(action);     // action: WAIT or BLOCK
}
