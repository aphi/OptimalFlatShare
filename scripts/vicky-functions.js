
function init(){
	expandTable();expandTable();expandTable();
}

function contractTable(){
	resetSolutionColours();
	
	tbl = document.getElementById("mainTable");
	tblHead = document.getElementById("mainTableHead");
	tblBody = document.getElementById("mainTableBody");
	
	// exit if no rows to remove
	if (tblBody.rows.length == 0){
		return;
	}
	
	// remove col	
	tblHead.children[0].removeChild(tblHead.children[0].lastChild);
	for (var r=0;r<tblBody.rows.length;r++){
		tblBody.rows[r].removeChild(tblBody.rows[r].lastChild);
	}
	
	// remove row
	tblBody.removeChild(tblBody.lastChild);
}

function expandTable(){
	resetSolutionColours();
	
	tbl = document.getElementById("mainTable");
	tblHead = document.getElementById("mainTableHead");
	tblBody = document.getElementById("mainTableBody");
	
	// add row
	row=document.createElement("tr");	
	for (var c=0;c<tblHead.rows[0].children.length;c++){
		if (c==0){
			row.appendChild(genInputCell("th", tbl.rows.length + "_" + c, "Person " + tbl.rows.length));
		}else{
			row.appendChild(genInputCell("td", tbl.rows.length + "_" + c, ""));
		}
	}
	tblBody.appendChild(row);
	
	// add col
	for (var r=0;r<tbl.rows.length;r++){
		if (r==0){
			tblHead.children[0].appendChild(genInputCell("th", r + "_" + tbl.rows[r].children.length, "Room " + tbl.rows[r].children.length));
		}else{
			tbl.rows[r].appendChild(genInputCell("td", r + "_" + tbl.rows[r].children.length, ""));
		}
	}
}

function genInputCell(eleType, id, placeholder){
	cell = document.createElement(eleType);
	inputNode = document.createElement("input");
	inputNode.type = "text";
	inputNode.id = id;
	
	if (eleType == "th"){
		inputNode.className = "thinput";
	}else{
		inputNode.className = "tdinput";
	}
	
	if (placeholder){
		inputNode.placeholder = placeholder;
	}
	
	inputNode.onmouseover = function() {backgrounds(this, "yellow");}
	inputNode.onmouseout = function() {backgrounds(this, "white");}
	
	cell.appendChild(inputNode);
	return cell;
}

// colour this input, as well as the headers
function backgrounds(inputNode, colour){
	r_c = inputNode.id.split("_");
	
	try{
		rowheaderInput = document.getElementById(r_c[0] + "_0");
		colheaderInput = document.getElementById("0_" + r_c[1]);
		
		inputNode.style.backgroundColor = colour;
		rowheaderInput.style.backgroundColor = colour;
		colheaderInput.style.backgroundColor = colour;
	}
	catch(err){}
}

function enterDummyData(){
	resetSolutionColours();
	
	var dummyPersonNames = ["Alice", "Bob", "Camilla", "David", "Ester", "Frank", "Georgina", "Hugo", "Ingrid", "Joseph", "Kathryn", "Liam"];
	var dummyRoomNames = ["Front", "Roadside", "Upstairs Double", "Upstairs Single", "Balcony", "Guesthouse East", "Guesthouse West", "Cellar", "Laundry", "Roof", "Bathroom", "Attic"];
	
	tbl = document.getElementById("mainTable");
	var numPeople = tbl.rows.length - 1;
	var numRooms = numPeople;
	
	for (var row=0;row<numPeople;row++){
		tbl.rows[row+1].cells[0].firstChild.value = dummyPersonNames[row];
	}
	
	for (var col=0;col<numRooms; col++){
		tbl.rows[0].cells[col+1].firstChild.value = dummyRoomNames[col];
	}
	
	// Random float numbers. problem is that they don't have a fixed sum
	//for (var row=0;row<numPeople;row++){
	//	for (var col=0;col<numPeople;col++){
	//		tbl.rows[row+1].cells[col+1].firstChild.value = Math.floor(75 + Math.random()*275);
	//	}
	//}
	
	// Generate random integers this time, with a fixed sum
	var fixedSum = 100 * numRooms;
	var startingVal = 75;
	var increment = 5;
		
	for (var row=0;row<numPeople;row++){
		var personBids = Array()
		//initialise bids
		for (var col=0;col<numRooms;col++){
			personBids[col] = startingVal;
		}
		//run randomisation
		for (var i=0; i<((fixedSum-startingVal*numRooms)/increment); i++){
			personBids[Math.floor(Math.random()*numPeople)] += increment;
		}
		//apply bids
		for (var col=0;col<numRooms;col++){
			tbl.rows[row+1].cells[col+1].firstChild.value = personBids[col];
		}
	}
}

function resetSolutionColours(){
	tbl = document.getElementById("mainTable");
	var numPeople = tbl.rows.length - 1;
	var numRooms = numPeople;
	for (var row=0;row<numPeople;row++){
		for (var col=0;col<numPeople;col++){
			tbl.rows[row+1].cells[col+1].style.backgroundColor = "white";
		}
	}
}

function sum(arr){
	total = 0;
	for (i=0; i<arr.length; i++){
		total += arr[i];
	}
	return total;
}


function runAuction(){
	resetSolutionColours();
	
	tbl = document.getElementById("mainTable");
	var numPeople = tbl.rows.length - 1;
	var numRooms = numPeople;

	var bids = new Array();
	var roomNames = new Array();
	var personNames = new Array();
	
	var name;
	
	for (var row=0;row<numPeople;row++){
		name = tbl.rows[row+1].cells[0].firstChild.value;
		if (name == ""){
			name = tbl.rows[row+1].cells[0].firstChild.placeholder;
		}
		personNames[row] = name;
	}
	
	for (var col=0;col<numPeople; col++){
		name = tbl.rows[0].cells[col+1].firstChild.value;
		if (name == ""){
			name = tbl.rows[0].cells[col+1].firstChild.placeholder;
		}
		roomNames[col] = name;
	}
	
	for (var row=0;row<numPeople;row++){
		bids[row] = new Array();
		for (var col=0;col<numRooms;col++){
			//read bids
			bids[row][col] = parseFloat(tbl.rows[row+1].cells[col+1].firstChild.value);
		}
	}
	
	var vickreyValues = new Array();
	var vickreyValuesSum = 0
	var bidsSum = sum(bids[0]);
	
	for (var room=0;room<numRooms;room++){
		roomBids = new Array();
		for (var person=0;person<numPeople;person++){
			roomBids.push(bids[person][room]);
		}
		roomBids.sort(function(a,b){return a - b});
		vickreyValues.push(roomBids[roomBids.length-2]);
		vickreyValuesSum += roomBids[roomBids.length-2];
	}
	
	var lp = new Object();
    lp.A = new Array();
	lp.c = new Array();
	lp.b = new Array();
	lp.xLB = new Array();
	lp.xUB = new Array();
	lp.m = numPeople + numRooms// num constraints
	lp.n = numPeople * numRooms// num vars
	
	//build objective & var bounds
	for (var person=0; person<numPeople; person++){
		for (var room=0; room<numRooms; room++){
			lp.c.push(-bids[person][room]); //making bids negative
			
			lp.xLB.push(0);
			lp.xUB.push(1);
		}
	}
	
	//build constraint 1: each person must get a room, & RHS
	for (var personConstraint=0;personConstraint<numPeople; personConstraint++){
		var constr = new Array();
		for (var person=0;person<numPeople; person++){	
			for (var room=0; room<numRooms; room++){
				if (personConstraint == person){
					constr.push(1);
				}else{
					constr.push(0);
				}
			}
		}
		lp.A.push(constr);
		lp.b.push(1);
	}
	
	//build constraint 2: each room must get a person & RHS
	for (var roomConstraint=0;roomConstraint<numRooms; roomConstraint++){
		var constr = new Array();
		for (var person=0;person<numPeople; person++){	
			for (var room=0; room<numRooms; room++){
				if (roomConstraint == room){
					constr.push(1);
				}else{
					constr.push(0);
				}
			}		
		}
		lp.A.push(constr);
		lp.b.push(1);
	}
	
    SimplexJS.PrimalSimplex(lp);
	//alert(lp.x);
	//
	
	//var multiplier = vickreyValuesSum / -lp.z;   for a proportional surplus split
	var diff = vickreyValuesSum - bidsSum;
	
	var solution = new Array();
	for (var person=0; person<numPeople; person++){
		for (var room=0; room<numRooms; room++){
			if (lp.x[numPeople * person + room] > 0.99){
				tbl.rows[person+1].cells[room+1].style.backgroundColor = "red";
				
				var thisAssignment = new Array();
				thisAssignment.push(roomNames[room]);
				thisAssignment.push(personNames[person]);
				thisAssignment.push(bids[person][room]);
				thisAssignment.push(vickreyValues[room]);
				thisAssignment.push(parseFloat(vickreyValues[room] - diff/numRooms).toFixed(2));
				//solution.push(thisAssignment);
				solution[room] = thisAssignment;
			}
		}
	}
	
	//alert(-lp.z);

	//build results table
	tbl = document.getElementById("resultsTable");
	tbl.removeChild(document.getElementById("resultsTableBody"));
	
	tblBody = document.createElement("tbody");
	tblBody.id = "resultsTableBody";
	tbl.appendChild(tblBody);
	
	// Room Person Their Bid Vickrey Value Final Price
	rowTitles = ["Room", "Person", "Their Bid", "Vickrey Value", "Final Price"]
	for (var resultsRow=0; resultsRow<rowTitles.length; resultsRow++){
		row=document.createElement("tr");		
		cell = document.createElement("th");
		cell.innerHTML = rowTitles[resultsRow];
		row.appendChild(cell);
		
		for (var col=0; col<numPeople; col++){			
			cell = document.createElement("td");
			cell.innerHTML = solution[col][resultsRow];			
			
			row.appendChild(cell);
		}
		tblBody.appendChild(row);
	}
}