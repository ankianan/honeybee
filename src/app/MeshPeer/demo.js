
/**
 * Before connection, peer updates its local list.
 * On connection, dest peer recieves player list of peer.
 * If "dest peer" has any other peer, it shares the "other peer" with peer.
 * peer connects with other peer.
 * And the loop repeats.
 */

/*
	R <- {R,A} A 	
	
	{R,A} R <- {R,B} B  
	{R,A,B} R -> {A} ->{R,B} B  
	{R,A} A <- {R,A,B} B  
	
	{R,A,B} R <- {R,C} C  
	{R,A,B,C} R -> {A,B} -> {R,C} C  	
	{R,A,B} A <- {R,A,B,C} C  
	{R,A,B} B <- 

	{R,A,B,C} R <- {R,D} D
	{R,A,B,C,D} R -> {A,B,C} -> {R,D} C  	
	{R,A,B,C} A <- {R,A,B,C,D} D  
	{R,A,B,C} B <- 
	{R,A,B,C} C <- 
 */

/* Error cases

	R <- {R,A} A 	
	  -> {A} A			
	
	{R,A} R <- {R,B} B  
	{R,A,B} R -> {A} ->{R,B} B  
	{R,A} A <- {R,A,B} B 
			-> {R,B}	 
	
	{R,A,B} R <- {R,C} C  
	{R,A,B,C} R -> {A,B} -> {R,C} C  	
	{R,A,B} A <- {R,A,B,C} C  
	{R,A,B} B <- 

	{R,A,B,C} R <- {R,D} D
	{R,A,B,C,D} R -> {A,B,C} -> {R,D} C  	
	{R,A,B,C} A <- {R,A,B,C,D} D  
	{R,A,B,C} B <- 
	{R,A,B,C} C <- 
 */