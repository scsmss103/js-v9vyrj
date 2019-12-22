// Import stylesheets
import "./style.css";




// Write Javascript code!

document.getElementById("myFilter").addEventListener('input',function(event){
var filter=event.target.value.toUpperCase();

getfilter(filter);

});


function getfilter(filter) {
  
  var table = document.getElementById("myTable");
  var tr = table.getElementsByTagName("tr");
  var indexer = 0;

  for (var i = 1; i < tr.length; i++) {
    var td = tr[i].getElementsByTagName("td");

    var ticker = td[0].innerHTML;
    

    if (ticker.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = "";
      tr[i].classList = indexer;
      indexer++;
    } else {
      tr[i].style.display = "none";
      tr[i].classList = "999";
    }
  }

  change_page("page1");
}

function change_page(id) {
  var elem = document.getElementById(id);
  var goToPage = elem.innerText;
  var table = document.getElementById("myTable");
  var tr = table.getElementsByTagName("tr");
  var rowPerPage = 20;
  

  var maxValPage = goToPage * rowPerPage;
  var minValPage = maxValPage - rowPerPage;
  

  loadTablePage(maxValPage, minValPage);

  var pag_all = document.getElementsByClassName("pagination")[0];

  
  var pagination = pag_all.getElementsByTagName("p");

  for (var i = 0; i < pagination.length; i++) {
    

    if (pagination[i].id == id) {
      if (pagination[i].className != "active") {
        pagination[i].className = "active";
      }
    } else {
      if (pagination[i].className == "active") {
        pagination[i].classList.remove("active");
      }
    }
  }
}

function loadTablePage(maxValPage, minValPage) {
  var table = document.getElementById("myTable");
  var tr = table.getElementsByTagName("tr");

  for (var i = 0; i < tr.length; i++) {
    var td = tr[i].getElementsByTagName("td");

    var tr_class = tr[i].className;
    

    if (tr_class >= minValPage && tr_class <= maxValPage) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }

  var thead = table.getElementsByTagName("thead");
  
  var tr_thead = thead[0].getElementsByTagName("tr");

  tr_thead[0].style.display = "";
}

function sort_table(){

var table, rows, switching, i, x, y, shouldSwitch;
table = document.getElementById('myTable');
switching = true;


while (switching){
switching = false;
rows = table.rows;

for(i=1;i<(rows.length-1);i++){
shouldSwitch=false;
x = rows[i].getElementsByTagName("td")[4];
y = rows[i+1].getElementsByTagName("td")[4];


if(Number(x.innerHTML) < Number(y.innerHTML)){
console.log(i);
shouldSwitch=true;
break;
};

};

if(shouldSwitch){

rows[i].parentNode.insertBefore(rows[i+1],rows[i]);
switching=true;
};


};

setTimeout(function(){
var table = document.getElementById('ivr_table');
var tr = table.getElementsByTagName('tr');

for(i=0;i<tr.length;i++){
tr[i].className = i;

};
change_page("page1");
}, 5000
);

}

function drawChart() {
      // Define the chart to be drawn.
      
    
      var ref_perf = db.doc('date/perf_etfs');
      var html_perf ='';
      var data = new google.visualization.DataTable(); 
      data.addColumn('string','ETF');
      data.addColumn('number','Performance');
      data.addColumn({type:'number',role:'annotation'});
      data.addColumn({type:'string', role:'style'});


      ref_perf.get().then(function(perf){

        var perf_data = perf.data();
        
        for (var i in perf_data){
          var etf = i;
          var perf_etf = perf_data[String(i)];         
          var color ='';
          if(perf_etf>0){
            color = 'green';
          } else {
            color = 'red';
          }
          data.addRow([etf,perf_etf,perf_etf,color]);
          
        };
      });
      
      var options = {
        title: "Performance Sector ETFs",
        bar: {groupWidth:"80%"},
        vAxis:{minValue:0},
        legend:'none',
        
        
      };

      // Instantiate and draw the chart.
      var chart = new google.visualization.BarChart(document.getElementById('div_charts'));
      
      //set 3 sec delay becoz firebase is slow
      setTimeout(function(){
      chart.draw(data, options)},3000);
 
    }
    
  function loadChart(){
    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    };



window.sort_table = sort_table;
window.getfilter = getfilter;
window.change_page  = change_page;
window.loadTablePage = loadTablePage;
window.loadChart = loadChart





  

