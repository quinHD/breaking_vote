$(document).ready(function(){
    $.ajax({
        url: window.location.href,
        success: function(townFromServer){
            dataToShow = [];
     
            town = townFromServer;
            totalVotes = town.votes;
            blankVotesTown = blankVotesTownCreator(town);
            seatsToAssing = numberOfSeatsCalculator(town);
            townWithMinimumPercentageParties = townWithMinimumPercentagePartiesCalculator(town);
            execChart(town, false);
        },
        error: function(){alert("casque")},
        dataType: 'json'

    });

    $(".blank_as_votes").on('click', toggleShowBlanksAsParties);
    function toggleShowBlanksAsParties () {
        if ( $('.blank_as_votes').text() === "Poner blancos como partidos" ) {
            blankVotesTownCreator(town);
            $('.blank_as_votes').text("Quitar blancos como partidos");
            execChart(town, false);
        } else {
            blankVotesTownCreator(town);
            $('.blank_as_votes').text("Poner blancos como partidos");
            execChart(town, true);
        }
    }



function blankVotesTownCreator (town) {
   var newTown = town;
   var partyBlancos = {
      acronym: "blancos",
      name: "blancos",
      color: "(0,0,0)",
      votes: newTown.blank_votes,
      seats: 0,
   };
   var partyNulos = {
      acronym: "nulos",
      name: "nulos",
      color: "(0,0,0)",
      votes: newTown.null_votes,
      seats: 0,
   };
   newTown.parties.push(partyNulos);
   newTown.parties.push(partyBlancos);
   return newTown;
}
function removeBlanKVotesFromParties (town) {
   var onlyParties = [];
   for (var i = 0; i < town.parties.length; i++) {
      if ( (town.parties[i].acronym !== "blancos") && (town.parties[i].acronym !== "nulos") ) {
         onlyParties.push(town.parties[i]);
      }
   }
   town.parties = onlyParties;
   return town;
}
function numberOfSeatsCalculator (town) {
   var seats = 0;
   for (var i = 0; i < town.parties.length; i++) {
      seats += town.parties[i].seats; 
   }
   return seats;
}

function minimumPercentagePartiesCalculator (town) {
   minimumPercentageParties = [];
   for (var i = 0; i < town.parties.length-1; i++) {

      if (town.parties[i].votes >= town.votes/20) {
         minimumPercentageParties.push(town.parties[i]);    
      }
   }
    minimumPercentageParties.push(town.parties[town.parties.length -1]);    
   return minimumPercentageParties;
} 
function townWithMinimumPercentagePartiesCalculator (town) {
   var newTown = town;
   newTown.parties = minimumPercentagePartiesCalculator(town);
   return newTown;
}

function createPartiesWithCyphers (town) {
   var partiesWithCyphers = [];
   var town = townWithMinimumPercentagePartiesCalculator(town);
   for (var i = 0; i < town.parties.length; i++) {
      for (var j = 1; j <= seatsToAssing; j++) {
         partyWithCyphers = {party: town.parties[i].name, cypher: town.parties[i].votes/j}
         partiesWithCyphers.push(partyWithCyphers);
      }
   }
   return partiesWithCyphers;
}
function createPartiesWithSeats (town) {
   var partiesWithSeats = {};
   for (var i = 0; i < town.parties.length; i++) {
      partiesWithSeats[town.parties[i].name] = 0;
   }
   return partiesWithSeats;
}
function calculatePartiesWithSeats (town) {
   var partiesWithSeats = createPartiesWithSeats(town);
   var partiesWithCyphers = createPartiesWithCyphers(town);
   for (var i = 1; i <= seatsToAssing; i++) {
      var max_cypher = Math.max.apply(Math,partiesWithCyphers.map(function(o){return o.cypher;}));
      for(var j = 0; j < partiesWithCyphers.length; j++) {
         if (partiesWithCyphers[j].cypher === max_cypher) {
            partiesWithSeats[partiesWithCyphers[j].party] += 1;
            partiesWithCyphers[j].cypher = -1;
         }
      }
   }
   return partiesWithSeats;
}
function createUpdateTown (town) {
   var newTown = town;
   var parkingWithSeats = calculatePartiesWithSeats(town);
   for(var i = 0; i < Object.keys(parkingWithSeats).length; i++) {
      for (var j=0; j<newTown.parties.length; j++) {
         if (newTown.parties[j].name === Object.keys(parkingWithSeats)[i]) {
            newTown.parties[j].seats = parkingWithSeats[Object.keys(parkingWithSeats)[i]];
         }
      }
   }
   return newTown;
}
function createDonutData (town, doIt) {
   if (doIt === true) {
      removeBlanKVotesFromParties(town);      
   }
   var newTown = createUpdateTown(town);
   var donutData = [];
   var dataChunk = {};
   for (var i = 0; i < newTown.parties.length; i++) {
      dataChunk = {name: newTown.parties[i].acronym + " - " + newTown.parties[i].seats, y: newTown.parties[i].seats};
      donutData.push(dataChunk);
   }
   return donutData;
}

    $("#blanks-slider").on("change", function(){

        var blanksLeft = parseInt($("#blanks-slider").val());
        var decreasedVotes = parseInt($("#blanks-slider").attr("max")) - parseInt($("#blanks-slider").val());
        town.votes = totalVotes - decreasedVotes;
        town.blank_votes = blanksLeft;

        town.parties[town.parties.length -1].votes = blanksLeft;

        seatsToAssing = numberOfSeatsCalculator(town);
        townWithMinimumPercentageParties = townWithMinimumPercentagePartiesCalculator(town);


        execChart(town, false);

    });

    $("#blanks-slider").on("mousemove", function(){
        $("#txt-blanks-slider").text($("#blanks-slider").val());
    });

    function execChart(town, doIt) {
        console.log(town);
        $('#containerGraph').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: {
                text: town.name,
                align: 'center',
                verticalAlign: 'middle',
                y: 50,
                style: {
                    fontSize: 15
                }
            
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: -50,
                        style: {
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '0px 1px 2px black'
                        }
                    },
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '75%']
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                innerSize: '50%',
                data: createDonutData(town, doIt)
            }]
        });
    };
});