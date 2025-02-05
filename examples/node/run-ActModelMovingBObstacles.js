let CPM = require("../../build/artistoo-cjs.js")

let config = {

	// Grid settings
	ndim : 2,
	field_size : [200,200],
	
	// CPM parameters and configuration
	conf : {
		// Basic CPM parameters
		torus : [true,true],						// Should the grid have linked borders?
		seed : 20,							// Seed for random number generation.
		T : 20,								// CPM temperature
		
		// Constraint parameters. 
		// Mostly these have the format of an array in which each element specifies the
		// parameter value for one of the cellkinds on the grid.
		// First value is always cellkind 0 (the background) and is often not used.
				
		// Adhesion parameters:
		J: [[0,20,0], [20,0,0], [0,0,0]],
		
		// VolumeConstraint parameters
		LAMBDA_V: [0,50,50],					// VolumeConstraint importance per cellkind
		V: [0,200,100],							// Target volume of each cellkind
		
		// PerimeterConstraint parameters
		LAMBDA_P: [0,2,5],						// PerimeterConstraint importance per cellkind
		P : [0,180,90],						// Target perimeter of each cellkind
		
		// ActivityConstraint parameters
		LAMBDA_ACT : [0,200,0],				// ActivityConstraint importance per cellkind
		MAX_ACT : [0,80,0],					// Activity memory duration per cellkind
		ACT_MEAN : "geometric"				// Is neighborhood activity computed as a
											// "geometric" or "arithmetic" mean?

	},
	
	// Simulation setup and configuration
	simsettings : {
	
		// Cells on the grid
		NRCELLS : [150,150],						// Number of cells to seed for all
											// non-background cellkinds.
		// Runtime etc
		BURNIN : 500,
		RUNTIME : 1000,
		RUNTIME_BROWSER : "Inf",
		
		// Visualization
		CANVASCOLOR : "eaecef",
		CELLCOLOR : ["000000", "A020F0"],
		BORDERCOLOR: ["ffffff","ffffff"],
		ACTCOLOR : [true],					// Should pixel activity values be displayed?
		SHOWBORDERS : [true],				// Should cellborders be displayed?
		zoom : 2,							// zoom in on canvas with this factor.
		
		// Output images
		SAVEIMG : true,					// Should a png image of the grid be saved
											// during the simulation?
		IMGFRAMERATE : 1,					// If so, do this every <IMGFRAMERATE> MCS.
		SAVEPATH : "output/img/test",	// ... And save the image in this folder.
		EXPNAME : "ActModel",					// Used for the filename of output images.
		
		// Output stats etc
		STATSOUT : { browser: false, node: true }, // Should stats be computed?
		LOGRATE : 10							// Output stats every <LOGRATE> MCS.

	}
	
}


function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function initializeGrid(){
	// add the initializer if not already there
	if( !this.helpClasses["gm"] ){ this.addGridManipulator() }

	// Seed epidermal cell layer
	let rows = 8
	let cols = 16
	for( var i = Math.floor((this.C.extents[0]/cols)/2) ; i < this.C.extents[0] ; i += Math.floor(this.C.extents[0]/cols) ){
		for( var j = Math.floor((this.C.extents[1]/rows)/2) ; j < this.C.extents[1] ; j += Math.floor(this.C.extents[1]/rows) ){
			console.log(i,j)
			this.gm.seedCellAt( 2, [i,j] )
		}
	}
	let cellstomake = 50
	while (cellstomake>0){
		this.gm.seedCellAt( 1, [getRandomInt(200), getRandomInt(200)] )
		cellstomake-=1
	}
}

let custommethods = {
	initializeGrid : initializeGrid
}

let sim = new CPM.Simulation( config, custommethods )


sim.run()
