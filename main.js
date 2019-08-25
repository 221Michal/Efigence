let json;
let categores = ['all'];
let years = [];
let selectedYear;
let selectedCategory = 'all';
let seletYears = document.getElementsByClassName('custom-select');
let tagList = document.getElementsByClassName('category-selects');

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
  selectedYear = years[0];
  selectReportsToRender();

  //display categores
  let catList = categores.map(function (cat) {
    return '<button class="cat-btn" onclick="selectCat(event)">' + cat + '</button>'
  }).join('');
  tagList[0].innerHTML = catList;
}

function selectReportsToRender() {
  let reportToRender = [];
  json.forEach(function (item) {
    let date = new Date(item.date).getFullYear();
    if (date === selectedYear) {
      if (selectedCategory === 'all') reportToRender.push(item);
      else {
        let catCheck = selectedCategory.find(function (cat) {
          return cat === item.category
        });
        if (catCheck) reportToRender.push(item);
      }
    }
  });
  renderReports(reportToRender)
}

function renderReports(article) {
  let articleList = document.getElementById('article-list');
  let html = article.map(function (element) {
    let date = new Date(element.date);
    return (
      '<div class="report">'
        +
        '<div class="report-date">'
          +
          date.getFullYear()
          +
        '</div>'
        +
        '<div class="report-content">'
          +
          '<h4 class="report-title">'
            +
            element.title
            +
          '</h4>'
          +
          '<p class="report-descriptionn">'
            +
            element.description
          +
        '</div>'
        +
      '</div>'
    )
  }).join('');
  articleList.innerHTML  = html;
}

function selectChange(year) {
  selectedYear = parseInt(year);
  selectReportsToRender();
}

function selectCat(e) {
  let target = e.target;
  if (target.classList.contains('active')) target.classList.remove('active');
   else  target.classList.add('active');
  cat = target.innerText;
  if (cat === 'all') selectedCategory = 'all';
  else {
    if (selectedCategory === 'all') selectedCategory = [cat];
    else {
     let catCheck = selectedCategory.find(function (item) {
       return item === cat
     });
      if (catCheck) {
        selectedCategory.remove(cat);
        if (selectedCategory.length === 0 ) selectedCategory = 'all'
      } else  selectedCategory.push(cat)
    }
  }
  selectReportsToRender();
}

Array.prototype.remove = function() {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};