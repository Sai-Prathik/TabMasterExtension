import {html, render} from './node_modules/lit-html/lit-html.js';

const dataScroll = (tabsData)=>html`${tabsData.map((d)=>html`
<div class="d-flex chrome-tab align-items-center bg-white justify-content-between col shadow itemwrp " title=${d.title} domain=${extractDomain(d.url)} data-tabid = ${d.id} windowid = ${d.windowId}>
<div class="d-flex col align-items-center title-text">
<img width="22px" class="favicon " height="22px" src='${d.favIconUrl}'/>
<div class="text-truncate ">${d.title}</div>
</div>
 
<div class="status_sec d-flex align-items-center justify-content-between px-2">
<div class="active_status ${d.active?'active':''} border-1"></div>
<img width="20px" height="20px" src="./bookmark.svg" />

<img width="20px" height="20px" src="./threedots.svg" /> 

</div> 
</div>

`)}`

var tabsData;

$('body')
.on('click','.itemwrp',(e)=>{
    var clickedElement = e.currentTarget
    console.log(clickedElement,clickedElement.getAttribute('data-tabid'),clickedElement.getAttribute('windowid'))
    chrome.windows.update(parseInt(clickedElement.getAttribute('windowid')), { focused: true }, function(window) {
        // Using chrome.tabs.update to activate the tab
        chrome.tabs.update(parseInt(clickedElement.getAttribute('data-tabid')), { active: true });
      });
})
.on('keyup search','#searchtabs',(e)=>{
    var searchKey = e.currentTarget.value
    var tabs = $('.chrome-tab')
    $('.chrome-tab').removeClass('d-none')
    var res = _.filter(tabs,(tb)=>{ 
        return !(tb.getAttribute('domain').includes(searchKey)||tb.getAttribute('title').includes(searchKey))
    })
    _.map(res,(d)=>{
        d.classList.add('d-none')
    })
})
.on('click','.tab-btn',(e)=>{
    var target = e.target
    $('.carousel-item').removeClass('active')
    $(`.carousel-item.${target.getAttribute('data-slide-to')}`).addClass('active')
})

chrome.tabs.query({windowType:'normal'}, function(tabs) {
    tabs = _.map(tabs,(d)=>{d['domain']=extractDomain(d.url);return d})
    var groupedData = _.groupBy(tabs,'domain')
    $('#tablength').html(` (${tabs.length})`) 
    $('#domainlength').html(`(${Object.keys(groupedData).length})`) 
    render(dataScroll(tabs),document.getElementById('tab-wrp1'))
});
 
function extractDomain(url) {
    var domainRegex = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)/;
    var match = url.match(domainRegex);
    return match && match[1];
}
 