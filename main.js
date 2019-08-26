
let json;
let categores = ['Wszystkie'];
let years = [];
let selectedYear;
let selectedCategory = 'Wszystkie';
let reportToRender= [] ;
const seletYears = document.getElementsByClassName('date-select');
const tagList = document.getElementsByClassName('category-selects');


//fetch data
loadJSON(fetchJson);

function loadJSON(callback) {

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'http://mmknet.pl/data.json', true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

function fetchJson(data) {
  json = JSON.parse(data);
  getParametrsFromJson();
}

function getParametrsFromJson() {
  //get year and category from json
  json.forEach(function (item) {
    if (categores.length === 0) {
      categores.push(item.category);
    } else {
      const catCheck = categores.find(function (catItem) {
        return catItem === item.category
      });
      if (!catCheck) categores.push(item.category)
    }
    const date = new Date(item.date).getFullYear();
    if (years.length === 0) {
      years.push(date);
    } else {
      const yearCheck = years.find(function (year) {
        return year === date
      });
      if (!yearCheck) years.push(date)
    }
  });

  //select year
  years.sort(function(a, b){return b-a});
  const yearsList = years.map(function (year) {
    return '<option>' + year + '</option>'
  }).join('');
  seletYears[0].innerHTML = yearsList;
  selectedYear = years[0];
  selectReportsToRender();

  //display categores
  const catList = categores.map(function (cat) {
    return '<button class="cat-btn" onclick="selectCat(event)">' + cat + '</button>'
  }).join('');
  tagList[0].innerHTML = catList;
  document.getElementsByClassName('cat-btn')[0].classList.add('active')
}

function selectReportsToRender() {
  document.getElementsByClassName('search-input')[0].value = '';
  reportToRender = [];
  json.forEach(function (item) {
    const date = new Date(item.date).getFullYear();
    if (date === selectedYear) {
      if (selectedCategory === 'Wszystkie') reportToRender.push(item);
      else {
        let catCheck = selectedCategory.find(function (cat) {
          return cat === item.category
        });
        if (catCheck) reportToRender.push(item);
      }
    }
  });
  renderReports()
}

function renderReports() {
  const reportList = document.getElementById('report-list');
  let html = reportToRender.map(function (element) {
    const date = new Date(element.date);
    //create date view
    let reportDate = (
      '<div class="date">'
        + date.getDay()+'.'+date.getMonth()+'.'+date.getFullYear()+
      '</div>'
      +
      '<div class="date">'
        + date.getHours() +':'+ date.getMinutes() +
      '</div>'
      +
      '<div class="report-cat">'
        +'Raporty '+ element.category +
      '</div>'
    );
    //create links view
    let links;
    if (element.files.length === 0) links = '';
    else if (element.files.length === 1) {
      links= (
        '<a href="#">'
        +element.files[0].filename+' ('+element.files[0].filesize+'KB)'+
        '</a>'
      )
    } else {
      const key = Math.random();
      links = (
        '<a href="#" onclick="toggleLinks('+key+')">Pliki do pobrania' +
        ' ('
        +element.files.length+
        ')' +
        '</a>' +
        '<ul id='+key+' class="file-list hidden">'
         +
          element.files.map(function (link) {
            return (
                '<li>' +
                  '<a href="#">'
                    +link.filename+' ('+link.filesize+'KB)'+
                  '</a>' +
                '</li>'
            )
          }).join('')
          +
        '</ul>'
      )
    }
    return (
      '<div class="report">'
        +
        '<div class="report-date">'
          +reportDate+
        '</div>'
        +
        '<div class="report-content">'
          +
          '<h4 class="report-title">'
            +element.title+
          '</h4>'
          +
          '<p class="report-descriptionn">'
            +element.description+
          '</p>'
          +
          '<div class="report-link">'
          +'<a href="#">Zobacz raport</a>'+links+
          '</div>'
          +
        '</div>'
        +
      '</div>'
    )
  }).join('');
  reportList.innerHTML  = html;
}

function selectChange(year) {
  reportToRender= [];
  selectedYear = parseInt(year);
  selectReportsToRender();
}

function selectCat(e) {
  reportToRender= [];
  const target = e.target;
  const cat = target.innerText;
  const active = document.getElementsByClassName("active");
  if (cat === 'Wszystkie') {
    while (active.length)
      active[0].classList.remove("active");
  }
  if (target.classList.contains('active')) target.classList.remove('active');
   else  target.classList.add('active');
  if (cat === 'Wszystkie') selectedCategory = 'Wszystkie';
  else {
    if (selectedCategory === 'Wszystkie') {
      active[0].classList.remove("active");
      selectedCategory = [cat];
    }
    else {
     let catCheck = selectedCategory.find(function (item) {
       return item === cat
     });
      if (catCheck) {
        selectedCategory.remove(cat);
        if (selectedCategory.length === 0 ) {
          document.getElementsByClassName('cat-btn')[0].classList.add("active");
          selectedCategory = 'Wszystkie'
        }
      } else  selectedCategory.push(cat)
    }
  }
  selectReportsToRender();
}

function toggleLinks(key) {
  let fileLlist = document.getElementById(key);
  if (fileLlist.classList.contains('hidden')) fileLlist.classList.remove('hidden');
  else fileLlist.classList.add('hidden');
}

function search() {
  const inputValue =document.getElementsByClassName('search-input')[0].value;
  if (inputValue.length === 0) {
    selectReportsToRender();
  } else {
    reportToRender = reportToRender.filter(function (item) {
      if (item.title.includes(inputValue)) return true;
      else if (item.description.includes(inputValue)) return true;
    });
    renderReports()
  }
}

Array.prototype.remove = function() {
  let what, a = arguments, L = a.length, ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};