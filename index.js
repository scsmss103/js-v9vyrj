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



window.sort_table = sort_table;
window.getfilter = getfilter;
window.change_page  = change_page;
window.loadTablePage = loadTablePage;





  

