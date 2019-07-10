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
    console.log("New song!")
    console.log("title: ", title.textContent.trim());
    console.log("artist: ", artist.textContent.trim());}
}
