let CPM = require("../../build/artistoo-cjs.js")

let config = {
    ndim : 2,
    field_size : [500,500],
        conf : {
        torus : [true,true],						
        seed : 50,							
        T : 20,								
        J: [[0,10,10,0], [10,0,0,0], [10,0,0,0], [0,0,0,0]],
        LAMBDA_V: [0,5,5,200],					
        V: [0,200,200,100],
        LAMBDA_P: [0,2,2,5],					
        P : [0,180,180,90],						
        LAMBDA_ACT : [0,200,200,0],			
        MAX_ACT : [0,80,80,0],				
        ACT_MEAN : "geometric",
        IS_BARRIER : [false,false,false,true]			
    },
    simsettings : {
        NRCELLS : [1,1,1], //1500						
        BURNIN : 500,
        RUNTIME : 5000,
        CANVASCOLOR : "eaecef",
        CELLCOLOR : ["000000","000000", "CCCCCC"],
        ACTCOLOR : [true,false,false],					
        SHOWBORDERS : [false,true,false],		
        BORDERCOL : ["DDDDDD","DDDDDD","DDDDDD","DDDDDD"],
        zoom :2,
        SAVEIMG : true,					// Should a png image of the grid be saved
                                            // during the simulation?
        IMGFRAMERATE : 100,					// If so, do this every <IMGFRAMERATE> MCS.
        SAVEPATH : "../node/output/img/trackobstacles15by15-track100"+process.argv[2],	// ... And save the image in this folder.
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
            if (cid <= 101){
                let average_position = allpercentages[cid]
                const fs = require('fs');
                fs.appendFileSync('../node/output/img/trackobstacles15by15-track100'+process.argv[2]+'/position'+cid+'.txt', average_position+"\n");
            }
        }
        console.log("update")
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function initializeGrid(){

    // add the initializer if not already there
    if( !this.helpClasses["gm"] ){ this.addGridManipulator() }
    
    // Seed 1 moving cell with tracking
    this.gm.seedCellAt(1, [this.C.extents[1]/2 + 35, this.C.extents[1]/2 +35] )
    // Seed 1 moving cellwithout tracking
    let cellstomake = 100
    while (cellstomake>0){
        this.gm.seedCellAt(2, [getRandomInt(500), getRandomInt(500)] )
        cellstomake-=1
    }

    // Seed grid
    let rows = 15
	let cols = 15
	for( var i = Math.floor((this.C.extents[0]/cols)/2) ; i < this.C.extents[0] ; i += Math.floor(this.C.extents[0]/cols) ){
		for( var j = Math.floor((this.C.extents[1]/rows)/2) ; j < this.C.extents[1] ; j += Math.floor(this.C.extents[1]/rows) ){
			for( let x = 0; x < 200; x+=20){
				let circ = this.gm.makeCircle( [i,j], 6 )
				this.gm.assignCellPixels( circ, 3 )
			}
		}
	}

    
}

sim.run()