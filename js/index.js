var width = 700;
var height = 400;

var infoBoard = d3.select('.data-board')
				  .append('div')
				  .attr('id','info-board')
				  .style('opacity', 1);

var hover = d3.select('.data-board')
				  .append('div')
				  .attr('class','overlay')
				  .style('opacity', 1);

var chart = d3.select('.data-board')
				  .append('div')
				  .attr('class','chart')
				  .attr('width', width)
				  .attr('height', height)
				  
const request =  new XMLHttpRequest();
      request.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
      request.send();
      request.onload = function(){
    	const json = JSON.parse(request.responseText);

    	console.log(json.data)
    }
