let json;
let categores = [];
let years = [];
let seletYears = document.getElementsByClassName('custom-select');

loadJSON(fetchJson);

function loadJSON(callback) {

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'http://mmknet.pl/data.json', true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

function fetchJson(data) {
  json = JSON.parse(data);
  console.log(json)
  getParametrsFromJson();
}

function getParametrsFromJson() {

  //get year and category from json

  json.forEach(function (item) {
    if (categores.length === 0) {
      categores.push(item.category);
    } else {
      let catCheck = categores.find(function (catItem) {
        return catItem === item.category
      });
      if (!catCheck) categores.push(item.category)
    }
    let date = new Date(item.date).getFullYear();
    if (years.length === 0) {
      years.push(date);
    } else {
      let yearCheck = years.find(function (year) {
        return year === date
      });
      if (!yearCheck) years.push(date)
    }
  });

  //select year

  years.sort(function(a, b){return b-a});
  let yearsList = years.map(function (year) {
    return '<option>' + year + '</option>'
  }).join('');
  seletYears[0].innerHTML = yearsList;
  selectReportsToRender(years[0], 'all');

}

function selectReportsToRender(year, category) {
  let reportToRender = [];
  json.forEach(function (item) {
    let date = new Date(item.date).getFullYear();
    if (date === year) {
      if (category === 'all') reportToRender.push(item);
      else {
        if (item.category === category) reportToRender.push(item);
      }
    }
  });
  renderReports(reportToRender)
}

function renderReports(article) {
  let articleList = document.getElementById('article-list');
  let html = article.map(function (element) {
    return '<li>' + element.title + '</li>';
  }).join('');
  articleList.innerHTML  = html;
}

// seletYears.addEventListener('change', (event) => {
//   console.log("asd")
// });