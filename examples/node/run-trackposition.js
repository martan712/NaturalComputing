let CPM = require("../../build/artistoo-cjs.js")

let config = {
	field_size : [500,500],
		conf : {
		torus : [true,true],						
		seed : 50,							
		T : 20,								
		J: [[0,10,10], [10,0,0], [10,0,0]],
		LAMBDA_V: [0,5,5],					
		V: [0,200,200],
		LAMBDA_P: [0,2,2],					
		P : [0,180,180],						
		LAMBDA_ACT : [0,200,200],			
		MAX_ACT : [0,80,80],				
		ACT_MEAN : "geometric"			
	},
	simsettings : {
		NRCELLS : [1,1], //1500						
		BURNIN : 500,
		RUNTIME : 2000,
		CANVASCOLOR : "eaecef",
		CELLCOLOR : ["000000","000000"],
		ACTCOLOR : [true,true],					
		SHOWBORDERS : [false,false],			
		zoom :2,
		SAVEIMG : true,					// Should a png image of the grid be saved
											// during the simulation?
		IMGFRAMERATE : 1,					// If so, do this every <IMGFRAMERATE> MCS.
		SAVEPATH : "output/img/trackposition",	// ... And save the image in this folder.
		EXPNAME : "trackposition",					// Used for the filename of output images.
		
		// Note that we set this to true for the browser to see the
		// effect of our new stat:
		
		STATSOUT : { browser: true, node: true },
		LOGRATE : 1						

	}
}


let sim = new CPM.Simulation( config, { logStats: logStats, initializeGrid:initializeGrid} )

function getAveragePixelPosition(current_pixels) {
    if (!current_pixels.length) return null; // Handle empty list case

    let sumX = 0, sumY = 0, count = 0;

    current_pixels.forEach(([x, y]) => {
        sumX += x;
        sumY += y;
        count++;
    });

    return count > 0 ? [sumX / count, sumY / count] : null;
}

class PercentageActive extends CPM.Stat {
	compute_center_position( cid, cellpixels ){
		const current_pixels = cellpixels[cid]
		return getAveragePixelPosition(current_pixels)
	}
	
	compute(){
		const cellpixels = this.M.getStat( CPM.PixelsByCell ) 
		let percentages = {}
		for( let cid of this.M.cellIDs() ){
			percentages[cid] = this.compute_center_position( cid, cellpixels )
		}
		return percentages
	}
}

function logStats() {
		const allpercentages = this.C.getStat( PercentageActive )
		for( let cid of this.C.cellIDs() ){
			if (cid == 1){
				let average_position = allpercentages[cid]
				const fs = require('fs');
				fs.appendFileSync('output/img/position.txt', average_position+"\n");
				console.log(average_position)
			}
		}
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function initializeGrid(){

	// add the initializer if not already there
	if( !this.helpClasses["gm"] ){ this.addGridManipulator() }

	// // Seed epidermal cell layer
	// let step = 12
	// for( var i = 1 ; i < this.C.extents[0] ; i += step ){
	// 	for( var j = 1 ; j < this.C.extents[1] ; j += step ){
	// 		this.gm.seedCellAt( 1, [i,j] )
	// 	}
	// }

	// Seed 1 moving cell with tracking
	this.gm.seedCellAt(1, [this.C.extents[1]/2, this.C.extents[1]/2] )
	// Seed 1 moving cellwithout tracking
	let cellstomake = 1
	while (cellstomake>0){
		this.gm.seedCellAt(2, [getRandomInt(500), getRandomInt(500)] )
		cellstomake-=1
	}
}

sim.run()
