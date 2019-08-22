console.log("asd");
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
  renderArticle(JSON.parse(data));
}

function renderArticle(article) {
  var articleList = document.getElementById('article-list');
  var html = article.map(function (element) {
    return '<li>' + element.title + '</li>';
  }).join('');
  articleList.innerHTML  = html;
}