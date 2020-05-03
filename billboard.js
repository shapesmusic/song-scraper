sourceDate = document.getElementsByClassName('chart-detail-header__date-selector-button');
elements = document.getElementsByClassName('chart-list-item');
for (var i=0; i<elements.length; i++){
    var isNew = false;
    var element = elements[i];
    var trendIcon = element.getElementsByClassName('chart-list-item__trend-icon')[0].getElementsByTagName('img');
    if(trendIcon.length > 0){
       isNew = trendIcon[0].src.indexOf('-new') > -1;
    }
    var title = element.getElementsByClassName('chart-list-item__title')[0];
    var artist = element.getElementsByClassName('chart-list-item__artist')[0];
    if(isNew){

    setTimeout (console.log.bind (console, "dateAdded: " + new Date()));
    setTimeout (console.log.bind (console, "source: " + "Billboard Hot 100"));
    setTimeout (console.log.bind (console, "sourceDate: " + sourceDate[0].innerText));
    setTimeout (console.log.bind (console, "sourceUrl: " + window.location.href));
    setTimeout (console.log.bind (console, "songName: " + title.textContent.trim()));
    setTimeout (console.log.bind (console, "artistName: " + artist.textContent.trim()));
    setTimeout (console.log.bind (console, "videoID: " + ""));
  }
};
