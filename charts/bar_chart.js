var xScale = d3.scaleBand()
    .round(true)
    .paddingInner(0.05);

var yScale = d3.scaleLinear();

var xAxis = d3.axisBottom()
    .scale(xScale);

var yAxis = d3.axisLeft()
    .scale(yScale);

d3.tsv("data/planets.tsv", function (d) {
    return {
        name: d.name,
        gravity: +d.gravity,
        temperature: +d.temperature,
        distance: +d.distance,
    };
}).then(function (data) {
    var margin = { top: 20, left: 40, bottom: 40, right: 40 };
    var width = parseInt(d3.select("#chart").style("width")) - margin.left - margin.right;
    var height = parseInt(d3.select("#chart").style("height")) - margin.top - margin.bottom;
    var svg = d3.select("#chart")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    xScale.domain(data.map(function (d) {
        return d.name;
    }))
        .range([0, width]);

    yScale.domain([0, d3.max(data, function (d) {
        return d.gravity;
    })])
        .range([height, 0]).nice();

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.7em')
        .text('Gravity (ms')
        .append('tspan')
        .style('baseline-shift', 'super')
        .style('font-size', '0.7em')
        .text('-2')
        .append('tspan')
        .style('baseline-shift', 'normal')
        .style('font-size', '1.43em') //1.43 ~ 1/0.7
        .text(')');

    svg.selectAll('.bar')
        .data(data, function (d) {
            return d.name;
        })
        .enter().append('rect') //ENTER
        .attr('class', 'bar')
        .attr('x', function (d) {
            return xScale(d.name);
        })
        .attr('y', function (d) {
            return yScale(d.gravity);
        })
        .attr('width', xScale.bandwidth())
        .attr('height', function (d) {
            return height - yScale(d.gravity);
        })
        .attr('fill', 'red');

    svg.selectAll('.name')
        .data(data, function (d) {
            return d.name;
        })
        .enter() //ENTER
        .append('text')
        .text(function (d) {
            return d.name;
        })
        .attr('class', 'name')
        .attr('x', function (d) {
            return xScale(d.name) + xScale.bandwidth() / 2;
        })
        .attr('y', function (d) {
            return height + 10;
        })

    svg.selectAll('.gravity')
        .data(data, function (d) {
            return d.name;
        })
        .enter() //ENTER
        .append('text')
        .text(function (d) {
            return d.gravity + ' ms';
        })
        .attr('class', 'gravity')
        .attr('x', function (d) {
            return xScale(d.name) + xScale.bandwidth() / 2;
        })
        .attr('y', function (d) {
            return height + 20;
        })
        .append('tspan').text('-2')
        .style('baseline-shift', 'super')
        .style('font-size', '0.7em');

    resize();

    //bind window resize event to call resize() 
    d3.select(window).on('resize', resize);

    function resize() {
        var svg = d3.select("#chart");
        
        width = parseInt(svg.style('width')) - margin.left - margin.right;
        height = parseInt(svg.style('height')) - margin.top - margin.bottom;
        svg.attr('width', width)
            .attr('height', height)

        xScale.range([0, width]);
        yScale.range([height, 0]).nice();

        svg.selectAll('.bar')
            .data(data, function (d) {
                return d.name;
            }) //UPDATE
            .attr('x', function (d) {
                return xScale(d.name);
            })
            .attr('y', function (d) {
                return yScale(d.gravity);
            })
            .attr('width', xScale.bandwidth())
            .attr('height', function (d) {
                return height - yScale(d.gravity);
            });

        if (width < 550 || height < 90) {
            svg.select('.x.axis').style('display', 'none');
            svg.select('.y.axis').style('display', 'none');

            svg.selectAll('.name')
                .data(data, function (d) {
                    return d.name;
                }) //UPDATE
                .attr('x', function (d) {
                    return xScale(d.name) + xScale.bandwidth() / 2;
                })
                .attr('y', function (d) {
                    return height + 10;
                })
                .style('display', 'initial');

            svg.selectAll('.gravity')
                .data(data, function (d) {
                    return d.name;
                }) //UPDATE
                .attr('x', function (d) {
                    return xScale(d.name) + xScale.bandwidth() / 2;
                })
                .attr('y', function (d) {
                    return height + 20;
                })
                .style('display', 'initial');

            svg.select('.x.axis').style('display', 'none');
            svg.select('.y.axis').style('display', 'none');
            svg.selectAll('.name').style('display', 'initial');
            svg.selectAll('.gravity').style('display', 'initial');
        } else {
            yAxis.ticks(Math.max(height / 50, 2)); //one every 50 pixels
            xAxis.ticks(Math.max(width / 50, 2));

            svg.select('.x.axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);

            svg.select('.y.axis')
                .call(yAxis);

            svg.select('.x.axis').style('display', 'initial');
            svg.select('.y.axis').style('display', 'initial');
            svg.selectAll('.name').style('display', 'none');
            svg.selectAll('.gravity').style('display', 'none');
        }
    }
});