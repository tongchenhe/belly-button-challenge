const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// initialize the dropdown menu
function add_name_to_dropdown(name){
    let dropdown = d3.select("#selDataset")
    dropdown.append("option").text(name)
}

// initialize the page to default id number
function init(data){
    data.names.map(item => add_name_to_dropdown(item))
    // load the demographic and charts for the first id in the dataset
    loadDemographicInfo(data, data.names[0])
    loadCharts(data, data.names[0])
}

function loadDemographicInfo(data, sample_id){
    // Filter the data for the object with the desired sample number
    let sampleMetadata = data.metadata.filter(person => person.id==sample_id)[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata")

    // clear any existing metadata
    panel.html("")

    // Loop through all key-value pair in sample metadata and add them to the panel
    for (const [key, value] of Object.entries(sampleMetadata)) {
        panel.append("p").text(`${key}: ${value}`).attr("style","font-size:12px;font-weight: bold;")
    }

}

function loadCharts(data, sample){
    //   put the data into a variable
    //   filter the data using 'sample'
    //   grab the first entry [0]
    result = data.samples.filter(person => person.id==sample)[0];
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;
    // set up the bubble chart
    let bubble_trace ={
        x : otu_ids,
        y : sample_values,
        mode: 'markers',
        marker: {
            color: otu_ids,
            size: sample_values
        }
    }
    let bubbleData = [bubble_trace]
    let bubbleLayout = {
        // set the x axis title
        xaxis : {
            title :"OTU ID"
        }
    }
    // Build a Bubble Chart 
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // slice the data down to 10 items and reverse to descending order
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    //create trace
    bar_trace = {
        x : sample_values.slice(0, 10).reverse(),
        y : yticks,
        type : "bar",
        orientation: "h"
    }
    bar_data = [bar_trace]
    // create layout  (title is enough)
    bar_layout = {
        width : 400,
    }
    // draw your plot Plotly.newPlot()
    Plotly.newPlot("bar", bar_data, bar_layout)
}

function optionChanged(newSample){
    //Fetch new data each time a row sample is selected
    d3.json(url).then(function(data){
        // build charts
        loadCharts(data, newSample)
        // build metadata
        loadDemographicInfo(data, newSample)   
    })

}


// do everyting after we fetch the json data
d3.json(url).then(data => init(data));
