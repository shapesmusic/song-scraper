sourceDate = document.getElementsByClassName('date-selector__button button--link');
elements = document.getElementsByClassName('chart-list__element display--flex');
for (var i=0; i<elements.length; i++){
    var element = elements[i];
    var isNew = element.getElementsByClassName('chart-element__trend chart-element__trend--new color--accent');
    var title = element.getElementsByClassName('chart-element__information__song text--truncate color--primary')[0];
    var artist = element.getElementsByClassName('chart-element__information__artist text--truncate color--secondary')[0];

if(isNew.length == 1 && isNew[0].innerText == "New"){ // because innerText can also be "Re-Enter"

  // console.log("dateAdded: " + new Date());
  // console.log("source: " + "Billboard Hot 100");
  // console.log("sourceDate: " + sourceDate[0].innerText);
  // console.log("sourceUrl: " + window.location.href);
  console.log("songName: " + title.innerText.trim());
  // console.log("artistName: " + artist.innerText.trim());
  // console.log("videoID: " + "");

}

};
