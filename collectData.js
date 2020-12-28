let sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Load leaflet:
document.head.innerHTML += `<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin=""/>`;
let scriptEl = document.createElement("script");
scriptEl.src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js";
document.body.appendChild(scriptEl);
document.body.innerHTML += `<div id="leafletMapEl" style="width:600px; height:400px; position:fixed; z-index:10000000; top:0; left:0;"></div>`;

while(!window.L) await sleep(100);

let leafletMap = L.map('leafletMapEl').setView([1.3264806085279128, 103.82080078125001], 10);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1
}).addTo(leafletMap);


async function getProperties(minLat, maxLat, minLng, maxLng) {

  let html = await fetch(`https://www.propertyguru.com.sg/property-search-proxy?limit=20&listing_type=rent&market=residential&status_code=ACT&include_featured=1&page=1&specialist_agent_ids_top=290640%2C130674%2C84671&_includePhotos=true&min_latitude=${minLat}&min_longitude=${minLng}&max_latitude=${maxLat}&max_longitude=${maxLng}`, {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,pt;q=0.6",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest"
    },
    "referrer": "https://www.propertyguru.com.sg/map-search?limit=20&listing_type=rent&market=residential&status_code=ACT&include_featured=1&page=1&specialist_agent_ids_top=290640%2C130674%2C84671&_includePhotos=true&zoom=12&center=1.3457621582275987%2C103.82216859293212",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  }).then(r => r.text());


  let el = document.createElement("div");
  el.innerHTML = html;

  let propertyData = [...el.querySelectorAll(".listing-items .listing-item")].map(el => {
    let data = {
      listingId: Number(el.classList.toString().split("-").pop()),
      priceText: el.querySelector(".listing-price")?.innerText,
      sizeText: el.querySelector(".lst-sizes")?.innerText,
      roomsText: el.querySelector(".lst-rooms")?.innerHTML,
      typeText: el.querySelector(".lst-details .lst-ptype")?.innerText,
      builtYearText: el.querySelector(".lst-details .lst-top")?.innerText,
      locationText: el.querySelector(".listing-location")?.innerText,
    };
    return data;
  });

  let clusterData = await fetch(`https://api.propertyguru.com/v1/map/cluster?region=sg&locale=en&limit=20&listing_type=rent&market=residential&status_code=ACT&include_featured=1&page=1&specialist_agent_ids_top=290640%2C130674%2C84671&_includePhotos=true&zoom=17&sw=${minLat}%2C${minLng}&ne=${maxLat}%2C${maxLng}`, {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,pt;q=0.6",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site"
    },
    "referrer": "https://www.propertyguru.com.sg/map-search?limit=20&listing_type=rent&market=residential&status_code=ACT&include_featured=1&page=1&specialist_agent_ids_top=290640%2C130674%2C84671&_includePhotos=true&zoom=17&center=1.444489329951075%2C103.77096071311318",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "omit"
  }).then(r => r.json());
  
  for(let cluster of clusterData.clusters) {
    for(let d of propertyData) {
      if(cluster.ids.includes(d.listingId)) {
        d.lat = cluster.lat;
        d.lng = cluster.lng;
      }
    }
  }

  return propertyData;
}




let properties = [];
let stepSize = 0.01;
for(let lat = 1.195; lat < 1.476; lat += stepSize) {
  for(let lng = 103.603; lng < 104.031; lng += stepSize) {
    let props = await getProperties(lat, lat+stepSize, lng, lng+stepSize).catch(e => false);
    if(!props) {
      await sleep(60*1000);
      lng -= stepSize;
      continue;
    }
    properties.push(...props);
    L.rectangle([[lat, lng], [lat+stepSize, lng+stepSize]], {color: "#ff7800", weight: 1}).addTo(leafletMap);
    await sleep(1000);
  }
}

console.log(JSON.stringify(properties, null, 2));