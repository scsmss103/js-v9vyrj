// Import stylesheets
import "./style.css";

//eventlisteners

//--filter
document.getElementById("myFilter").addEventListener("input", function(event) {
  var filter = event.target.value.toUpperCase();

  getfilter(filter);
});

//load firebase

var firebaseConfig = {
  apiKey: "AIzaSyBvXl4M6mjgaK_xyzfNG2Qmp0gcxiktu-0",
  authDomain: "stock-price-b675c.firebaseapp.com",
  databaseURL: "https://stock-price-b675c.firebaseio.com",
  projectId: "stock-price-b675c",
  storageBucket: "stock-price-b675c.appspot.com",
  messagingSenderId: "434049662522",
  appId: "1:434049662522:web:5e73672d17d9d69f39bf03",
  measurementId: "G-V5GQX48SD7"
};
// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
} catch {}

var db = firebase.firestore();

//functions

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

function sort_table(col,order) {

  dimmer();
  var table, rows, switching, i, x, y, shouldSwitch, op, col_no;
  table = document.getElementById("myTable");
  switching = true;

  //get operator to sort
  if(order=='desc'){
    op='<';
  }else{op='>';};
  //get column number to sort
  if(col=='ivr'){
    col_no=4;
  }else if(col=='earnings'){
    col_no=5;
  }else{return;};



  while (switching) {
    switching = false;
    rows = table.rows;
    //i < rows.length - 1
    for (i = 1;i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("td")[col_no];
      y = rows[i + 1].getElementsByTagName("td")[col_no];
      x = x.innerHTML;
      y = y.innerHTML;
      
      //for earnings
      if(col=='earnings'){
        if(x=='no earnings'){x='2100-01-01';};
        if(y=='no earnings'){y='2100-01-01';};
        x = new Date(x);
        y = new Date(y);
        x = x.getTime();
        y = y.getTime();
      };
      
      if (eval(String(x)+op+String(y))) {
        //console.log(i);
        shouldSwitch = true;
        break;
      }
    }

    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }

  setTimeout(function() {
    reset_class_names_ivrTbl();
    change_page("page1");
    dimmer();
  }, 5000);
}

function drawChart() {
  // Define the chart to be drawn.

  var ref_perf = db.doc("date/perf_etfs");
  var html_perf = "";
  var data = new google.visualization.DataTable();
  data.addColumn("string", "ETF");
  data.addColumn("number", "Performance");
  data.addColumn({ type: "number", role: "annotation" });
  data.addColumn({ type: "string", role: "style" });

  ref_perf.get().then(function(perf) {
    var perf_data = perf.data();

    for (var i in perf_data) {
      var etf = i;
      var perf_etf = perf_data[String(i)];
      var color = "";
      if (perf_etf > 0) {
        color = "green";
      } else {
        color = "red";
      }
      data.addRow([etf, perf_etf, perf_etf, color]);
    }
  });

  var options = {
    title: "Performance Sector ETFs",
    bar: { groupWidth: "80%" },
    vAxis: { minValue: 0 },
    legend: "none"
  };

  // Instantiate and draw the chart.
  var chart = new google.visualization.BarChart(
    document.getElementById("div_charts")
  );

  //set 3 sec delay becoz firebase is slow
  setTimeout(function() {
    chart.draw(data, options);
  }, 3000);
}

function loadChart() {
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);
}

function hide_earnings() {
  dimmer();
  console.log('function called..')
  var tbl = document.getElementById("ivr_table");
  var rows = tbl.rows;
  var dt = new Date(document.getElementById("inputExpiry").value);
 
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].getElementsByTagName("td")[5].innerHTML == "no earnings") {
        curr_dt = new Date("2100-01-01");
      } else {
        var curr_dt = new Date(rows[i].getElementsByTagName("td")[5].innerHTML);
      }

      if (curr_dt < dt) {
        tbl.deleteRow(i);
        i--;
      }
    };

    reset_class_names_ivrTbl();
    setTimeout(function() {
      change_page("page1");
      dimmer();
    }, 3000);
    
  } 

function reset_class_names_ivrTbl() {
  var tbl = document.getElementById("ivr_table");
  var rows = tbl.rows;
  for (var i = 0; i < rows.length; i++) {
    rows[i].className = i;
  }
}

function check_if_div_shows(div) {
  var div_elem = document.getElementById(String(div));
  return div_elem.className.indexOf("w3-show");
}

function load_runs() {
  //check if div is shown, if its gonna be hidden just hide div and dnt run the script
  dimmer();
  var div = check_if_div_shows("div_runs");
  if (div == -1) {
    dimmer();
    return;
  };
  //
  var ref_html = db.doc("date/htmls");
  ref_html.get().then(function(doc) {
    var data1 = doc.data();
    //console.log(data1);
    var html = "";

    for (var i in data1) {
      //console.log(i);
      html += data1[String(i)];
    }
    document.getElementById("run_table").innerHTML = html;
    dimmer();
  });
  
}

function load_data_val() {
  //check if div is shown, if its gonna be hidden just hide div and dnt run the script
  var div = check_if_div_shows("div_runs");
  if (div == -1) {
    return;
  }
  //
  var ref_data_val = db.collection("date/data_val/uploads");
  var html_data_val = "";
  ref_data_val.get().then(function(tbl) {
    tbl.forEach(function(doc_data_val) {
      var new_ref = ref_data_val.doc(doc_data_val.id);

      new_ref.get().then(function(field) {
        var data_val_data = field.data();

        html_data_val += "<tr><td>" + doc_data_val.id + "</td>";
        html_data_val += "<td>" + data_val_data["date"] + "</td>";
        html_data_val += "<td>" + data_val_data["no_rows"] + "</td>";
        html_data_val += "<td>" + data_val_data["no_ticker"] + "</td></tr>";

        document.getElementById("data_val_table").innerHTML = html_data_val;
      });
    });
  });
}

function load_ivr() {
  //check if div is shown, if its gonna be hidden just hide div and dnt run the script
  dimmer();
  var div = check_if_div_shows("div_ivr");
  if (div == -1) {
    document.getElementById('earn_check').checked=false;
    document.getElementById('sort_earn_check').checked=false;
    dimmer();
    return;
  }
  //
  var ref_ivr = db.collection("date/ivr/ticker");
  var html_ivr = "";
  ref_ivr.get().then(function(col) {
    col.forEach(function(doc_ivr) {
      var data_ivr1 = doc_ivr;

      var new_ref = ref_ivr.doc(doc_ivr.id);
      new_ref.get().then(function(new_doc) {
        var ivr_data = new_doc.data();

        html_ivr += "<tr><td>" + doc_ivr.id + "</td>";
        html_ivr += "<td>" + ivr_data["iv_30"] + "</td>";
        html_ivr += "<td>" + ivr_data["min_iv"] + "</td>";
        html_ivr += "<td>" + ivr_data["max_iv"] + "</td>";
        html_ivr += "<td>" + ivr_data["ivr"] + "</td>";
        html_ivr +=
          '<td class="w3-xxlarge">' + ivr_data["earnings"] + "</td></tr>";

        document.getElementById("ivr_table").innerHTML = html_ivr;
      });
    });
  });

  setTimeout(function() {
    reset_class_names_ivrTbl();
    change_page("page1");
    var ref_upl = db.doc("date/ivr");
    ref_upl.get().then(function(upl) {
      var upl_data = upl.data();
      dimmer();
      window.alert("data as per: " + upl_data["upload_date"]);
    });
  }, 5000);
}

function buttons(id) {
  var x = document.getElementById(id);
  if (x.className.indexOf("w3-show") == -1) {
    x.className += "w3-show";
  } else {
    x.className = x.className.replace("w3-show", "");
  }
}

function calc_pos_size() {
  //check if div is shown, if its gonna be hidden just hide div and dnt run the script
  var div = check_if_div_shows("div_calculator");
  if (div == -1) {
    return;
  }
  //
  var tgt = document.getElementById("tgt").value;
  var ccy = document.getElementById("ccy").value.toUpperCase();
  var atr = document.getElementById("atr").value;
  var ref_fx = db.doc("date/fx_rates/ccy/" + ccy);

  ref_fx.get().then(function(fx_data) {
    var fx_dat = fx_data.data();
    var fx = fx_dat["rate"];
    var fx_date = fx_dat["date"];
    var pos = tgt / fx / (atr * 0.25);

    var pos = Math.round(pos * 100) / 100;
    //console.log(pos);

    document.getElementById("pos_size").innerHTML = pos;
    document.getElementById("fx_rate").innerHTML =
      String(fx) + ' <span style="font-size:0.5em">(' + fx_date + ")</span>";
  });
}

function check_box_handler(checkbox,check_func,args1,uncheck_func,args2){

var box = document.getElementById(checkbox);

if(box.checked==true){
check_func.apply(this,args1);
}else{uncheck_func.apply(this,args2);};
};



function dimmer(){

var dspl = document.getElementById('overlay').style.display

if(dspl == ''){
document.getElementById('overlay').style.display='none';
document.getElementById('loader').style.display='none'
}else{
document.getElementById('overlay').style.display = '';
document.getElementById('loader').style.display = '';
};
}

function load_premium(){
dimmer();
//check if div is shown, if its gonna be hidden just hide div and dnt run the script
  var div = check_if_div_shows("div_premium");
  if (div == -1) {
    dimmer();
    return;
  }
  //
var html='';
var ref_prem = db.collection('date/trades/trx_no');
ref_prem.get().then(function(col){
col.forEach(function(trx_no){

var new_ref = ref_prem.doc(trx_no.id)
new_ref.get().then(function(data){
var data = data.data();
html+='<tr><td>'+trx_no.id+'</td>';
html+='<td>'+data['underlying']+'</td>';
html+='<td>'+data['premium']+'</td></tr>';
document.getElementById('premium_table').innerHTML = html;
});
});
});
setTimeout(function(){dimmer();},2000);
}

function load_closed_trx(){
dimmer();
//check if div is shown, if its gonna be hidden just hide div and dnt run the script
  var div = check_if_div_shows("div_closed_trx");
  if (div == -1) {
    dimmer();
    return;
  }
  //
var html='';
var ref_prem = db.collection('date/trades/perf');
ref_prem.get().then(function(col){
col.forEach(function(trx_no){

var new_ref = ref_prem.doc(trx_no.id)
new_ref.get().then(function(data){
var data = data.data();
html+='<tr><td>'+trx_no.id+'</td>';
html+='<td>'+data['underlying']+'</td>';
html+='<td>'+data['entry_time']+'</td>';
html+='<td>'+data['exit_time']+'</td>';
html+='<td>'+data['days_in_trade']+'</td>';
html+='<td>'+data['perf']+'</td></tr>';
document.getElementById('closed_trx_table').innerHTML = html;
});
});
});
setTimeout(function(){
  dimmer();
  sort_table_all('closed_trx_table','trx','desc');
  
  },4000);
}

function sort_table_all(tbl,col,order) {

  dimmer();
  var table, rows, switching, i, x, y, shouldSwitch, op, col_no;
  table = document.getElementById(tbl);
  switching = true;

  //get operator to sort
  if(order=='desc'){
    op='<';
  }else{op='>';};
  //get column number to sort
  if(col=='trx'){
    col_no=0;
  }else if(col=='perf'){
    col_no=2
  }else{return;};



  while (switching) {
    switching = false;
    rows = table.rows;
    //i < rows.length - 1
    for (i = 0;i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("td")[col_no];
      y = rows[i + 1].getElementsByTagName("td")[col_no];
      x = x.innerHTML;
      y = y.innerHTML;
      
      //for earnings
      if(col=='earnings'){
        if(x=='no earnings'){x='2100-01-01';};
        if(y=='no earnings'){y='2100-01-01';};
        x = new Date(x);
        y = new Date(y);
        x = x.getTime();
        y = y.getTime();
      };
      
      if (eval(String(x)+op+String(y))) {
        //console.log(i);
        shouldSwitch = true;
        break;
      }
    }

    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }

  setTimeout(function() {
    dimmer();
  }, 3000);
}



function load_perf(){

dimmer();
//check if div is shown, if its gonna be hidden just hide div and dnt run the script
  var div = check_if_div_shows("div_perf");
  if (div == -1) {
    dimmer();
    return;
  }
  //
var html='';
var ref_mtd = db.collection('date/trades/mtd');
ref_mtd.get().then(function(col){
col.forEach(function(trx_no){
var new_ref = ref_mtd.doc(trx_no.id)
new_ref.get().then(function(data){
var data = data.data();
html+='<tr><td>'+trx_no.id+'</td>';
html+='<td>'+data['no_trx']+'</td>';
html+='<td>'+data['perf']+'</td>';
document.getElementById('perf_mtd_table').innerHTML = html;
});
});
});

var html_ytd='';
var ref_ytd = db.collection('date/trades/ytd');
ref_ytd.get().then(function(col){
col.forEach(function(trx_no){
var new_ref = ref_ytd.doc(trx_no.id)
new_ref.get().then(function(data){
var data = data.data();
html_ytd+='<tr><td>'+trx_no.id+'</td>';
html_ytd+='<td>'+data['no_trx']+'</td>';
html_ytd+='<td>'+data['perf']+'</td>';
document.getElementById('perf_ytd_table').innerHTML = html_ytd;
});
});
});


setTimeout(function(){
  dimmer();
  sort_table_all('perf_mtd_table','perf','desc');
  sort_table_all('perf_ytd_table','perf','desc');
  },4000);



}




//for testing
function test(){

document.getElementById('overlay').style.display = '';

}



window.sort_table = sort_table;
window.getfilter = getfilter;
window.change_page = change_page;
window.loadTablePage = loadTablePage;
window.loadChart = loadChart;
window.hide_earnings = hide_earnings;
window.reset_class_names_ivrTbl = reset_class_names_ivrTbl;
window.check_if_div_shows = check_if_div_shows;
window.load_runs = load_runs;
window.load_data_val = load_data_val;
window.load_ivr = load_ivr;
window.buttons = buttons;
window.calc_pos_size = calc_pos_size;
window.check_box_handler = check_box_handler;
window.dimmer = dimmer;
window.test = test;
window.load_premium = load_premium;
window.load_closed_trx = load_closed_trx;
window.load_perf = load_perf;