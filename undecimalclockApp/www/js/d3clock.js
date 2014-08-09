var d3clockfunc = function(scope, elem, attrs) {


	window.onresize = function(event) {
		onWindowResize();
	}

	var onWindowResize = function() {
		var svg = elem.find("svg")[0];
		var targetDim = Math.min(window.innerWidth, window.innerHeight);
		svg.setAttribute('height', targetDim);
		svg.setAttribute('width', targetDim);
		svg.style.marginTop = targetDim / -2.0;
		console.log(svg);
	};

	var radians = 0.0174532925, 
		clockRadius = 200,
		margin = 50,
		width = (clockRadius+margin)*2,
		height = (clockRadius+margin)*2,
		hourHandLength = 2*clockRadius/4,
		hourHandWidth = 10,
		hourHandBalance = 20,
		minuteHandLength = clockRadius - 30 ,
		minuteHandWidth = 8,
		minuteHandBalance = 20,
		secondHandWidth = 4,
		secondHandLength = clockRadius,
		secondHandBalance = 30,
		secondTickStart = clockRadius;
		secondTickLength = -10,
		hourTickStart = clockRadius,
		hourTickLength = -18
		secondLabelRadius = clockRadius + 16;
		secondLabelYOffset = 5
		hourLabelRadius = clockRadius - 40
		hourLabelYOffset = 7;

		/*	
		undeclarge = secselapsed (domain: 0~86399, range: 0~360)
		undecmedium = secondselapsed / 7854.545 (domain: 0~10, range: 0~360)
		undeecsmall = milliseconds elapsed % 66156.2021 -- (domain: 0~66155, range: 0~360) 
	var hourScale = d3.scale.linear()
		.domain([0,(86340 - 1)]) // from 0 to numhours - 1
		.range([0,360 - (360 / 86340)]); // from 0 to 360 - (360 / numhours)

	var minuteScale = d3.scale.linear()
		.domain([0,(11-1)])
		.range([0,360 - (360 / 11)]);

	var secondScale = d3.scale.linear()
		.domain([0,(66156.2021 - 1)])
		.range([0,360 - (360 / 66156.2021)]);

	
		*/

	var hourScale = d3.scale.linear()
		.domain([0,(11 - 1)]) // from 0 to numhours - 1
		.range([0,360 - (360 / 11)]); // from 0 to 360 - (360 / numhours)

	var minuteScale = d3.scale.linear()
		.domain([0,(7854.5455-1)])
		.range([0,360 - (360 / 7854.5455)]);

	var secondScale = d3.scale.linear()
		.domain([0,(66156.2021 - 1)])
		.range([0,360 - (360 / 66156.2021)]);

	var handData = [
		{
			type:'undeclarge',
			value:0,
			scale:hourScale,
			length:-hourHandLength,
			balance:hourHandBalance,
			width:hourHandWidth
		},
		{
			type:'undecmedium',
			value:0,
			scale:minuteScale,
			length:-minuteHandLength,
			balance:minuteHandBalance,
			width:minuteHandWidth 
		},
		{
			type:'undecsmall',
			value:0,
			scale:secondScale,
			length:-secondHandLength,
			balance:secondHandBalance,
			width:secondHandWidth 
		}
	];

	function drawClock(){ //create all the clock elements

		updateData();	//draw them in the correct starting position
		var rawSvg = elem.find("svg")[0];
		var svg = d3.select(rawSvg)
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", "0 0 " + width + " " + height)
			.attr("preserveAspectRatio", "xMidyMid");

		var face = svg.append('g')
			.attr('id','clock-face')
			.attr('transform','translate(' + (clockRadius + margin) + ',' + (clockRadius + margin) + ')');

		//add marks for seconds
		face.selectAll('.undecsmall-tick')
			.data(d3.range(5468 / 2,661560, 5468)).enter()
				.append('line')
				.attr('class', 'undecsmall-tick')
				.attr('x1',0)
				.attr('x2',0)
				.attr('y1',secondTickStart)
				.attr('y2',secondTickStart + secondTickLength)
				.attr('transform',function(d){
					console.log("minutetick");
					return 'rotate(' + ((secondScale(d / 10.0) + 180) % 360) + ')';
				});
		//and labels
/*
		face.selectAll('.second-label')
			.data(d3.range(5,61,5))
				.enter()
				.append('text')
				.attr('class', 'second-label')
				.attr('text-anchor','middle')
				.attr('x',function(d){
					return secondLabelRadius*Math.sin(secondScale(d)*radians);
				})
				.attr('y',function(d){
					return -secondLabelRadius*Math.cos(secondScale(d)*radians) + secondLabelYOffset;
				})
				.text(function(d){
					return d;
				});
*/
		//... and hours
		face.selectAll('.undeclarge-tick')
			.data(d3.range(0,11)).enter()
				.append('line')
				.attr('class', 'undeclarge-tick')
				.attr('x1',0)
				.attr('x2',0)
				.attr('y1',hourTickStart)
				.attr('y2',hourTickStart + hourTickLength)
				.attr('transform',function(d){
					return 'rotate(' + hourScale(d) + ')';
				});

		face.selectAll('.hour-label')
			.data(d3.range(0,11))
				.enter()
				.append('text')
				.attr('class', 'hour-label')
				.attr('text-anchor','middle')
				.attr('x',function(d){
					return hourLabelRadius*Math.sin(hourScale(d)*radians + Math.PI);
				})
				.attr('y',function(d){
					return -hourLabelRadius*Math.cos(hourScale(d)*radians + Math.PI) + hourLabelYOffset;
				})
				.text(function(d){
					if(d == "0") return ":";
					if(d == "10") return "Ø";
					return d;
				});


		var hands = face.append('g').attr('id','clock-hands');

		face.append('g').attr('id','face-overlay')
			.append('circle').attr('class','hands-cover')
				.attr('x',0)
				.attr('y',0)
				.attr('r',clockRadius/50);

		hands.selectAll('path')
			.data(handData)
				.enter()
				.append('path')
				.attr('class', function(d){
					return d.type + '-hand hand';
				})
				.attr('d', function(d) {
					return "M" + (d.width / 2.0) + " " + d.balance + " L" + (d.width / -2.0) + " " + d.balance + " L0 " + d.length + " Z"
				})
				.attr('transform',function(d){
					return 'rotate(' + ((d.scale(d.value) + 180) % 360) + ')';
				});
	}

	function moveHands(){
		d3.select('#clock-hands').selectAll('path')
		.data(handData)
			.transition()
			.ease("linear")
			.attr('transform',function(d){
				return 'rotate(' + ((d.scale(d.value) + 180) % 360) + ')';
			});
	}

	function updateData(){
		var t = new Date();
		var elapsedSeconds = (3600 * t.getHours()) + (60 * t.getMinutes()) + t.getSeconds();
		var elapsedMilliseconds = (elapsedSeconds * 1000) + t.getMilliseconds();

		/* 
		in one day, there are 11 undechours 
		there are 11 
		The hour hand should turn 360 degrees in a day; the minute hand should do 11 rotations of 360 degrees in a day. The second hand should do 1331 360 degree rotations in a day.
		
		24hour  =  secondselapsed  / 3600 -- secs in an hour (domain: 0~23, range: 0~360)
		min = secondselapsed % 3600  -- secs in an hour (domain: 0~3599, range: 0~360)
		sec = milliseconds elapsed % 60,000 -- millisecs in a minute (domain: 0~59999, range: 0~360)
		undeclarge = secselapsed (domain: 0~86399, range: 0~360)
		undecmedium = secondselapsed / 7854.545 (domain: 0~10, range: 0~360)
		undeecsmall = milliseconds elapsed % 66156.2021 -- (domain: 0~66155, range: 0~360)

		handData[0].value = elapsedSeconds / 86400 * 11;
		handData[1].value = elapsedSeconds / 7854.5455;
		handData[2].value = elapsedMilliseconds % 66156.2021;
		*/

		handData[0].value = elapsedSeconds / 86400.0 * 11.0; //from 0 to 11
		handData[1].value = elapsedSeconds % 7854.5455; //11 rotations in a day
		handData[2].value = Math.round(elapsedMilliseconds % 66156.2021) + 273.375;

	}

	drawClock();

	onWindowResize();

	setInterval(function(){
//		console.log(handData);
		updateData();
		moveHands();
	}, 100);
	//}, 546.75);

	d3.select(self.frameElement).style("height", height + "px");
}
