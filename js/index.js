var width = 700;
var height = 400;
var margin = width/7;
var color = '#3F51B5';


var infoBoard = d3.select('.data-board')
				  .append('div')
				  .attr('id','info-board')
				  .style('opacity', 0);

var chart = d3.select('.data-board')
				  .append('svg')
				  .attr('width', width + 200)
				  .attr('height', height + 50)
//call api data				  
const request =  new XMLHttpRequest();
      request.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
      request.send();
      request.onload = function(){
    	const json = JSON.parse(request.responseText);

    	chart.append('text')
    		 .attr('transform', 'rotate(-90)')
    		 .attr('x', -250)
    		 .attr('y', margin + 20)
    		 .text(json.name.split(',')[0]);

    	// chart.append('text')
    	// 	 .attr('x', width - margin * 6.5)
    	// 	 .attr('y', height + margin/2)
    	// 	 .text(`*From: ${json.from_date} - To: ${json.to_date}`)

  		chart.append('text')
    		 .attr('x', width - margin * 0.5)
    		 .attr('y', height + margin / 2)
    		 .text(`*Units: Billion of Dollars`)

    	// take data timelines from json 
    	const times = json.data.map(year => {
    		let quarter;
    		//take month

    		let month = year[0].substr(5,2);
    		month = Number(month)
    		// convert month to quarter 

    		if(month < 4 && month >= 1){
    			quarter = 'Q1';
    		}else if(month < 7 && month >= 4){
    			quarter = 'Q2';
    		}else if(month < 10 && month >= 7){
    			quarter = 'Q3';
    		}else{
    			quarter = 'Q4';
    		}

    		//return year + quarter
    		return year[0].substr(0,4) + String.fromCharCode(160) + quarter;
    	});
    	const date = json.data.map(year => {
    		return new Date(year[0]);
    	})

    	//find min and max of times
    	const dateMax = new Date(d3.max(date));
    	const dateMin = new Date(d3.min(date));

    	//set month equal the tenth month of the year
    	dateMax.setMonth(dateMax.getMonth() + 3);

    	const XScale = d3.scaleTime()
    					 .domain([dateMin,dateMax])
    					 .range([0,width]);

    	const XAxis = d3.axisBottom().scale(XScale);

    	//append axis of abscissas
    	chart.append('g')
    		 .call(XAxis)
    		 .attr('id','xAxis')
    		 .attr('font-size','12')
    		 .attr('transform',`translate(${margin}, ${height + 5})`);

    	//take data GDP from json
    	const GDP = json.data.map(data => {return data[1]});

    	//find min and max of GDP
    	const gdpMax = d3.max(GDP);
    	// const gdpMin = d3.min(GDP);

    	const YScale = d3.scaleLinear()
    					 .domain([0, gdpMax])
    					 .range([height, 0]);
    	// create scale of GDP
    	const gdpScale = GDP.map(i => YScale(i));

    	const YAxis = d3.axisLeft().scale(YScale);

    	//append axis of ordinate
    	chart.append('g')
    		 .call(YAxis)
    		 .attr('id', 'YAxis')
    		 .attr('font-size','12')
    		 .attr('transform', `translate(${margin},5)`);

    	//append data-columns to graph
    	d3.select('svg')
    	  .selectAll('rect')
    	  .data(gdpScale)
    	  .enter()
    	  .append('rect')
    	  .attr('x', (d, i) => XScale(date[i]))
    	  .attr('y', (d,i) =>   d )
    	  .attr('width', width / gdpScale.length)
    	  .attr('height', (d,i) => height - d)
    	  .attr('transform', `translate(${margin + 1},5)`)
    	  .attr('data-date', (d,i) => json.data[i][0])
    	  .attr('data-gdp', (d,i) => json.data[i][1])
    	  .attr('fill', color)
    	  .attr('class', 'layout')
    	  .on('mouseover', (d,i) => {
    	  	 infoBoard.transition()
    	  	 		  .duration(0)
    	  	 		  .style('width', margin * 1.5 + 'px')
    	  	 		  .style('height', (margin * 3/4) + 'px')
    	  	 		  .style('background', '#2b2b2b')
    	  	 		  .style('color','whitesmoke')
    	  	 		  .style('opacity', 1)
    	  	 		  .style('top', d - margin * 3/4 + 'px')
    	  	 		  .style('border-radius', '5px')
    	  	 		  .style('box-shadow','#404040 0px 0px 5px')
    	  	 		  .style('left', XScale(date[i]) + margin * 1.5 + 'px');
    	  	 infoBoard.html(times[i] + '<br>' + '$' + GDP[i] + String.fromCharCode(160) + 'Billion');  	 	  
    	  })
    	  .on('mouseout', (d,i) => {
    	  	 infoBoard.transition()
    	  	 		  .duration(100)
    	  	 		  // .style('opacity', 0)
    	  });
    	//style XAxis and YAxis
    	d3.selectAll('path')
    	  .attr('stroke', 'black')
    	  .attr('stroke-width', 2);

    	//
    	console.log(dateMax, dateMin)
    	console.log(json)
    }