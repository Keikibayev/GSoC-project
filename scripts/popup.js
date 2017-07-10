
function save_now_function(){
	var wb_url = "https://web.archive.org/save/";
	chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'save' }, function(response) {
	});
}

function recent_capture_function(){
	var wb_url = "https://web.archive.org/web/2/";
	chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'recent' }, function(response) {
	});
}

function first_capture_function(){
	var wb_url = "https://web.archive.org/web/0/";
	chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'first' }, function(response) {
	});
}

function view_all_function(){
	var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
	url = document.location.href.replace(pattern, "");
	open_url = "https://web.archive.org/web/*/"+encodeURI(url);
	document.location.href = open_url;
}

function makeModal(){
    chrome.runtime.sendMessage({message: "makemodal"}, function(response) {
	});
    
}

function showSettings(eventObj){
    var target=eventObj.target;
    if(target.getAttribute('toggle')=='off'){
        document.getElementById('settings_btn').setAttribute('toggle','on');
    document.getElementById('settings_div').style.display="block";
    }else{
        document.getElementById('settings_btn').setAttribute('toggle','off');
        document.getElementById('settings_div').style.display="none";
    }
    
}

function restoreSettings() {
  //count=0;
  chrome.storage.sync.get({
    
    ts:true,
    rt:true,
    book:true,
    orcid:true
  }, function(items) {
    
    document.getElementById('ts').checked = items.ts;
    document.getElementById('rt').checked = items.rt;
    document.getElementById('book').checked = items.book;
    document.getElementById('orcid').checked = items.orcid;
      if(items.rt){
          document.getElementById('make_modal').style.display="block";
      }else{
          document.getElementById('make_modal').style.display="none";
      }
      if(items.ts){
          chrome.runtime.sendMessage({message: "start_ts"}, function(response) {});
      }
      if(items.book){
          document.getElementById('get_book').style.display="block";
      }else{
          document.getElementById('get_book').style.display="none";
      }
      if(items.orcid){
          chrome.runtime.sendMessage({message: "start_orcid"}, function(response) {});
      }
  });
}

function saveSettings(){
    var ts = document.getElementById('ts').checked;
    var rt = document.getElementById('rt').checked;
    var book = document.getElementById('book').checked;
    var orcid= document.getElementById('orcid').checked;
    if(ts){
        chrome.runtime.sendMessage({message: "start_ts"}, function(response) {});
    }
    if(rt){
        document.getElementById('make_modal').style.display="block";
    }
    if(book){
        document.getElementById('get_book').style.display="block";
    }
    if(orcid){
        chrome.runtime.sendMessage({message: "start_orcid"}, function(response) {});
    }
    chrome.storage.sync.set({
    
    ts: ts,
    rt:rt,
    book:book,
    orcid:orcid
  });
}

function getBooks(){
    chrome.runtime.sendMessage({message: "injectol" }, function(response) {
	});
}

function dispORCID(response){
          if(response.text!=undefined){
              console.log('Text received');
      document.getElementsByClassName('loader')[0].style.display='block';
      //.log('message received');
      var xhr = new XMLHttpRequest();
      //.log(xhr);
  xhr.open("GET","https://pub.orcid.org/v2.0/search?q="+response.text, true);

  xhr.onload = function() {
      //.log('Loaded');
      var dispArea=document.getElementById('disp');
      //dispArea.innerHTML="Searching...";

    
var xmlDoc = xhr.responseXML;
    
    function nsResolver(prefix) {
  var ns = {
    'search' : 'http://www.orcid.org/ns/search',
    'common': 'http://www.orcid.org/ns/common'
  };
  return ns[prefix] || null;
}
      
      
      
      

      
      
      
var eventNodeList = xmlDoc.evaluate('/search:search//search:result/common:orcid-identifier/common:path',xmlDoc, nsResolver, XPathResult.ANY_TYPE, null );  
      var idArr=[];


var currentEvent = eventNodeList.iterateNext();  
while (currentEvent) {  

    idArr.push(currentEvent.innerHTML);
    currentEvent = eventNodeList.iterateNext();  
}

document.getElementsByClassName('loader')[0].style.display='none';
      
//dispArea.innerHTML="";      
if(idArr.length!=0){
      //var list=document.createElement('ul');
    var linkToPage=document.createElement('a');
        linkToPage.setAttribute('href','https://orcid.org/orcid-search/quick-search?searchQuery='+response.text);
        linkToPage.innerHTML="Go to ORCID search";
        linkToPage.addEventListener('click',function(event){
            window.open(event.target.href, "", "width=750,height=1000");
        });
    var divBeforeList=document.createElement('div');
    divBeforeList.innerHTML="Top 10 results from ORCID search are :";
        dispArea.appendChild(linkToPage);
        dispArea.appendChild(divBeforeList);
      var len=idArr.length;
      if(len>10){
          len=10;
      }
        for(var i=0;i<len;i++){
            //var newxhr=new XMLHttpRequest();
            //makereq(idArr[i]);
            //newxhr.open('GET','https://pub.orcid.org/v2.0/'+idArr[i]+'/record',true);
            //newxhr.setRequestHeader();
            //newxhr.onload=function(){
                
            //};
            //newxhr.send(null);
            //var listElem=document.createElement('li');
            var listElem=document.createElement('a');
            listElem.setAttribute('class','list-group-item');
            var url="http://orcid.org/"+idArr[i];
            //listElem.innerHTML="<a href='#' id="+url+">"+ idArr[i]+"</a>";
            listElem.innerHTML=idArr[i];
            listElem.setAttribute('href','#');
            listElem.setAttribute('id',url);
            
            listElem.addEventListener('click',function(event){
                    var id=event.target.id;
                    //chrome.tabs.create({url:id});
                    //window.open(id,'_blank');
                    if(document.getElementsByClassName('active').length!=0){
                      document.getElementsByClassName('active')[0].classList.remove('active');  
                    } 
                    event.target.classList.add('active');
                    window.open(id, "", "width=750,height=1000");
                });
            //list.appendChild(listElem);
            dispArea.appendChild(listElem);
            //var newxhr=new XMLHttpRequest();
            //makereq(listElem,idArr[i],newxhr);
        }
        
    }else{
      dispArea.innerHTML="Not found";
  }

      
      
      
      
      
      
      
      
      
      
      
      
      
      
  };
  xhr.send(null);
      
}
}

function pasteSelection() {
    //.log('Pasted');
    chrome.tabs.query({active: true,currentWindow: true}, function (tabs) {

    

            //.log('Message sent');
            chrome.tabs.sendMessage(tabs[0].id,{method: "getSelectionfororcid"},function(response){
                //.log(response);
                dispORCID(response);
            });
            //.log('Yup done');
    });
}









restoreSettings();

document.getElementById('settings_div').style.display="none";


document.getElementById('save_now').onclick = save_now_function;
document.getElementById('recent_capture').onclick = recent_capture_function;
document.getElementById('first_capture').onclick = first_capture_function;
document.getElementById('make_modal').onclick=makeModal;

document.getElementById('settings_btn').onclick=showSettings;
document.getElementById('settings_save_btn').onclick=saveSettings;
document.getElementById('get_book').onclick = getBooks;

window.onload=pasteSelection;

