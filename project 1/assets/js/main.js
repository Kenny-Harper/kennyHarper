$(document).ready(function () {
  console.log('Gazetteer loaded.');
    
    // Hide InfinityFree cache-buster query (?i=1) without reloading
if (window.location.search === '?i=1') {
  history.replaceState(null, '', window.location.pathname);
}

  // ✅ Stop Chrome "Blocked aria-hidden..." warning by managing focus on show/hide
const returnFocusMap = new WeakMap();

document.querySelectorAll('.modal').forEach(modalEl => {
  // Save what had focus before the modal opens
  modalEl.addEventListener('show.bs.modal', () => {
    returnFocusMap.set(modalEl, document.activeElement);
  });

  // Force focus OUT before Bootstrap sets aria-hidden=true
  modalEl.addEventListener('hide.bs.modal', () => {
    // blur whatever is focused inside the modal
    if (modalEl.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    // move focus somewhere safe immediately
    document.body.focus();
  });

  // After it's shown, move focus into the modal properly
  modalEl.addEventListener('shown.bs.modal', () => {
    const focusable = modalEl.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    (focusable || modalEl).focus();
  });

  // Restore focus back to what opened it (nice accessibility)
  modalEl.addEventListener('hidden.bs.modal', () => {
    const prev = returnFocusMap.get(modalEl);
    if (prev && typeof prev.focus === 'function') prev.focus();
  });
});

$(document).on('hidden.bs.modal', '#demographicsModal', function () {
  $('#demo-preload').removeClass('fadeOut');
});

// --- Base map layers (for switching) ---
const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
});

const satellite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    maxZoom: 19,
    attribution: 'Tiles © Esri'
  }
);

// Initialize map with a default base layer
const map = L.map('map', {
  layers: [streets]
}).setView([20, 0], 2);

  // 🔹 Explicit icons – no Leaflet default guessing

  // City icon (standard marker)
  // const cityIcon = L.icon({
  //   iconUrl: 'assets/images/marker-icon.png',
  //   shadowUrl: 'assets/images/marker-shadow.png',
  //   iconSize: [25, 41],
  //   iconAnchor: [12, 41],
  //   popupAnchor: [1, -34],
  //   shadowSize: [41, 41]
  // });

 const cityIcon = L.ExtraMarkers.icon({
    icon: 'fa-building',
    markerColor: 'yellow',
    shape: 'square',
    prefix: 'fa'
  });

  // Airport icon (custom)
  // const airportIcon = L.icon({
  //   iconUrl: 'assets/images/airport-icon.png',
  //   iconSize: [25, 25],
  //   iconAnchor: [12, 12],
  //   popupAnchor: [0, -12]
  // });

  const airportIcon = L.ExtraMarkers.icon({
    icon: 'fa-plane',
    markerColor: 'blue',
    shape: 'square',
    prefix: 'fa'
  });

  navigator.geolocation.getCurrentPosition(function(pos){
    console.log(pos);
    const coordinates = pos.coords;
     $.getJSON('api/countryCode.php', {lat:coordinates.latitude, lng:coordinates.longitude})
  .done(countryCode => {
    console.log(countryCode);

    if (isApiError(countryCode) || !countryCode.data) {
      console.error('countryCode.php error:', getApiError(countryCode, 'Invalid response'));
      return; // user can still pick manually
    }

    $('#countrySelect').val(countryCode.data).change();
  })
  .fail((jqxhr, status, err) => {
    console.log(jqxhr);
    console.error('Failed to get countryCode:', status, err);
    $('#loading').text('Failed to get country code').show();
  });
  

  });

  // State variables
  let countryLayer = null;
  let selectedCountryISO3 = null;
  let selectedCountryISO2 = null;
  let selectedCountryName = null;      // 🔸 NEW – for Wikipedia (country NAME)
  let userAutoSelectPending = null;
  let firstCountryRendered = false;

  // Map ISO3 -> Country name (filled when we load countries)
  const iso3ToNameMap = {};            // 🔸 NEW

  // ISO3 to ISO2 conversion map (complete)
  const iso3toIso2Map = {
    "AFG": "AF", "ALA": "AX", "ALB": "AL", "DZA": "DZ", "ASM": "AS", "AND": "AD",
    "AGO": "AO", "AIA": "AI", "ATA": "AQ", "ATG": "AG", "ARG": "AR", "ARM": "AM",
    "ABW": "AW", "AUS": "AU", "AUT": "AT", "AZE": "AZ", "BHS": "BS", "BHR": "BH",
    "BGD": "BD", "BRB": "BB", "BLR": "BY", "BEL": "BE", "BLZ": "BZ", "BEN": "BJ",
    "BMU": "BM", "BTN": "BT", "BOL": "BO", "BES": "BQ", "BIH": "BA", "BWA": "BW",
    "BVT": "BV", "BRA": "BR", "IOT": "IO", "BRN": "BN", "BGR": "BG", "BFA": "BF",
    "BDI": "BI", "CPV": "CV", "KHM": "KH", "CMR": "CM", "CAN": "CA", "CYM": "KY",
    "CAF": "CF", "TCD": "TD", "CHL": "CL", "CHN": "CN", "CXR": "CX", "CCK": "CC",
    "COL": "CO", "COM": "KM", "COG": "CG", "COD": "CD", "COK": "CK", "CRI": "CR",
    "CIV": "CI", "HRV": "HR", "CUB": "CU", "CUW": "CW", "CYP": "CY", "CZE": "CZ",
    "DNK": "DK", "DJI": "DJ", "DMA": "DM", "DOM": "DO", "ECU": "EC", "EGY": "EG",
    "SLV": "SV", "GNQ": "GQ", "ERI": "ER", "EST": "EE", "ETH": "ET", "FLK": "FK",
    "FRO": "FO", "FJI": "FJ", "FIN": "FI", "FRA": "FR", "GUF": "GF", "PYF": "PF",
    "ATF": "TF", "GAB": "GA", "GMB": "GM", "GEO": "GE", "DEU": "DE", "GHA": "GH",
    "GIB": "GI", "GRC": "GR", "GRL": "GL", "GRD": "GD", "GLP": "GP", "GUM": "GU",
    "GTM": "GT", "GGY": "GG", "GIN": "GN", "GNB": "GW", "GUY": "GY", "HTI": "HT",
    "HMD": "HM", "VAT": "VA", "HND": "HN", "HKG": "HK", "HUN": "HU", "ISL": "IS",
    "IND": "IN", "IDN": "ID", "IRN": "IR", "IRQ": "IQ", "IRL": "IE", "IMN": "IM",
    "ISR": "IL", "ITA": "IT", "JAM": "JM", "JPN": "JP", "JEY": "JE", "JOR": "JO",
    "KAZ": "KZ", "KEN": "KE", "KIR": "KI", "PRK": "KP", "KOR": "KR", "KWT": "KW",
    "KGZ": "KG", "LAO": "LA", "LVA": "LV", "LBN": "LB", "LSO": "LS", "LBR": "LR",
    "LBY": "LY", "LIE": "LI", "LTU": "LT", "LUX": "LU", "MAC": "MO", "MKD": "MK",
    "MDG": "MG", "MWI": "MW", "MYS": "MY", "MDV": "MV", "MLI": "ML", "MLT": "MT",
    "MHL": "MH", "MTQ": "MQ", "MRT": "MR", "MUS": "MU", "MYT": "YT", "MEX": "MX",
    "FSM": "FM", "MDA": "MD", "MCO": "MC", "MNG": "MN", "MNE": "ME", "MSR": "MS",
    "MAR": "MA", "MOZ": "MZ", "MMR": "MM", "NAM": "NA", "NRU": "NR", "NPL": "NP",
    "NLD": "NL", "NCL": "NC", "NZL": "NZ", "NIC": "NI", "NER": "NE", "NGA": "NG",
    "NIU": "NU", "NFK": "NF", "MNP": "MP", "NOR": "NO", "OMN": "OM", "PAK": "PK",
    "PLW": "PW", "PSE": "PS", "PAN": "PA", "PNG": "PG", "PRY": "PY", "PER": "PE",
    "PHL": "PH", "PCN": "PN", "POL": "PL", "PRT": "PT", "PRI": "PR", "QAT": "QA",
    "REU": "RE", "ROU": "RO", "RUS": "RU", "RWA": "RW", "BLM": "BL", "SHN": "SH",
    "KNA": "KN", "LCA": "LC", "MAF": "MF", "SPM": "PM", "VCT": "VC", "WSM": "WS",
    "SMR": "SM", "STP": "ST", "SAU": "SA", "SEN": "SN", "SRB": "RS", "SYC": "SC",
    "SLE": "SL", "SGP": "SG", "SXM": "SX", "SVK": "SK", "SVN": "SI", "SLB": "SB",
    "SOM": "SO", "ZAF": "ZA", "SGS": "GS", "SSD": "SS", "ESP": "ES", "LKA": "LK",
    "SDN": "SD", "SUR": "SR", "SJM": "SJ", "SWZ": "SZ", "SWE": "SE", "CHE": "CH",
    "SYR": "SY", "TWN": "TW", "TJK": "TJ", "TZA": "TZ", "THA": "TH", "TLS": "TL",
    "TGO": "TG", "TKL": "TK", "TON": "TO", "TTO": "TT", "TUN": "TN", "TUR": "TR",
    "TKM": "TM", "TCA": "TC", "TUV": "TV", "UGA": "UG", "UKR": "UA", "ARE": "AE",
    "GBR": "GB", "USA": "US", "UMI": "UM", "URY": "UY", "UZB": "UZ", "VUT": "VU",
    "VEN": "VE", "VNM": "VN", "VGB": "VG", "VIR": "VI", "WLF": "WF", "ESH": "EH",
    "YEM": "YE", "ZMB": "ZM", "ZWE": "ZW"
  };

  // Marker clusters
  const citiesCluster = L.markerClusterGroup();
  const airportsCluster = L.markerClusterGroup();
  map.addLayer(citiesCluster);
  map.addLayer(airportsCluster);

const baseMaps = {
  'Streets': streets,
  'Satellite': satellite
};

const overlayMaps = {
  'Cities': citiesCluster,
  'Airports': airportsCluster
};

L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);

  // Utilities
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function hideLoading() {
    $('#loading').fadeOut(500);
  }

  function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = Date.parse(dateStr); // Date.js parse
  if (!d || isNaN(d.getTime())) return 'N/A';
  return d.toString('dd MMM yyyy'); // e.g. 13 Jan 2026
}

function formatNumber(n, fmt = '0,0') {
  if (n === null || n === undefined || n === '' || isNaN(n)) return 'N/A';
  return numeral(n).format(fmt);
}

  function isApiError(res) {
  return res && typeof res === 'object' && res.error;
}

function getApiError(res, fallback) {
  return (res && res.error) ? res.error : fallback;
}


  function getIso2FromIso3(iso3) {
    console.log(iso3)
    return iso3toIso2Map[iso3] || iso3.substring(0, 2);
  }

  // 🔘 5 buttons (no Reset) – using emoji
  const allButtons = [
    { iconHtml: '👥', title: 'Demographics', modalId: 'demographicsModal' },
    { iconHtml: '📖', title: 'Wiki',         modalId: 'wikiModal' },
    { iconHtml: '📰', title: 'News',         modalId: 'newsModal' },
    { iconHtml: '💱', title: 'Currency',     modalId: 'currencyModal' },
    { iconHtml: '⛅', title: 'Weather',      modalId: 'weatherModal' }
  ];

  // Add the 5 buttons on the left
  allButtons.forEach((btnConfig) => {
    L.easyButton({
      position: 'topleft',
      states: [{
        stateName: btnConfig.title.toLowerCase().replace(/ /g, ''),
        icon: `<span style="font-size: 16px; line-height: 26px;">${btnConfig.iconHtml}</span>`,
        title: btnConfig.title,
        onClick: function (btn, mapInstance) {
          if (!selectedCountryISO3) {
            alert('Please select a country first!');
          } else {
            loadModalContent(btnConfig.modalId, selectedCountryISO3, selectedCountryISO2);
          }
        }
      }]
    }).addTo(map);
  });

  // Geolocation
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(
  //     pos => {
  //       const { latitude: lat, longitude: lng } = pos.coords;
  //       console.log(`Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);

  //       L.circleMarker([lat, lng], {
  //         color: '#d63384',
  //         radius: 8,
  //         fillOpacity: 1
  //       }).addTo(map).bindPopup('<strong>You are here</strong>').openPopup();

  //       reverseGeocode(lat, lng, iso3 => {
  //         if (iso3) userAutoSelectPending = iso3.toUpperCase();
  //         hideLoading();
  //       });
  //     },
  //     err => {
  //       console.warn('Geolocation failed:', err.message);
  //       hideLoading();
  //     },
  //     { timeout: 10000 }
  //   );
  // } else {
  //   hideLoading();
  // }

  // Load countries dropdown
  $.getJSON('api/countries.php')
  .done(countries => {

    if (isApiError(countries) || !Array.isArray(countries)) {
      console.error('countries.php error:', getApiError(countries, 'Invalid countries list'));
      $('#loading').text('Failed to load country list').show();
      return;
    }

    const $select = $('#countrySelect');
    $select.find('option:not(:first)').remove();

    countries.forEach(c => {
      const code = (c.code || '').toUpperCase();
      const name = c.name || 'Unknown';
      if (code && code.length === 3) {
        iso3ToNameMap[code] = name;
        $select.append($('<option>').val(code).text(name));
      }
    });

    console.log(`Dropdown ready: ${$select.find('option').length - 1} countries`);

    if (userAutoSelectPending && $select.find(`option[value="${userAutoSelectPending}"]`).length) {
      console.log('Auto-selecting user country:', userAutoSelectPending);
      $select.val(userAutoSelectPending).trigger('change');
    }
    userAutoSelectPending = null;
  })
  .fail((jqxhr, status, err) => {
    console.error('Failed to load country list:', status, err);
    $('#loading').text('Failed to load country list').show();
  });

// Country selection handler
$('#countrySelect').on('change', function () {
  selectedCountryISO3 = $(this).val();
  selectedCountryISO2 = getIso2FromIso3(selectedCountryISO3);
  selectedCountryName = iso3ToNameMap[selectedCountryISO3] || null;

  // ✅ If News modal is currently open, refresh it for the new country
  if (selectedCountryISO3 && $('#newsModal').hasClass('show')) {
    loadModalContent('newsModal', selectedCountryISO3, selectedCountryISO2);
  }

  if (!selectedCountryISO3) return;

  console.log(
    `Country selected: ${selectedCountryISO3} (ISO2: ${selectedCountryISO2}) Name: ${selectedCountryName}`
  );

    // Clear previous layers
    if (countryLayer) map.removeLayer(countryLayer);
    citiesCluster.clearLayers();
    airportsCluster.clearLayers();

// Fetch border
$.getJSON('api/border.php', { code: selectedCountryISO3 })
  .done(feature => {

    if (isApiError(feature)) {
      console.error('border.php error:', getApiError(feature, 'Border error'));
      return;
    }

    if (!feature || !feature.geometry) {
      console.warn('No border geometry for', selectedCountryISO3);
      return;
    }

    countryLayer = L.geoJSON(feature, {
      style: { color: '#007bff', weight: 4, fillOpacity: 0.15 }
    }).addTo(map);

    map.fitBounds(countryLayer.getBounds(), { padding: [50, 50] });

    // Load cities & airports
  $.getJSON('api/geonames.php', { country: selectedCountryISO3 })
  .done(data => {

    if (isApiError(data)) {
      console.error('geonames.php error:', getApiError(data, 'GeoNames error'));

      // don't crash — just hide loader so user isn’t stuck
      if (!firstCountryRendered) {
        hideLoading();
        firstCountryRendered = true;
      }
      return;
    }

    (data.cities || []).forEach(city => {
      L.marker([city.lat, city.lng], { icon: cityIcon })
        .bindPopup(escapeHtml(city.name))
        .addTo(citiesCluster);
    });

    (data.airports || []).forEach(airport => {
      L.marker([airport.lat, airport.lng], { icon: airportIcon })
        .bindPopup(escapeHtml(airport.name))
        .addTo(airportsCluster);
    });

    if (!firstCountryRendered) {
      hideLoading();
      firstCountryRendered = true;
    }
  })
  .fail(() => {
    console.error('Failed to load GeoNames markers');

    if (!firstCountryRendered) {
      hideLoading();
      firstCountryRendered = true;
    }
  });

  })
  .fail((jqxhr, status, err) => {
    console.error('Failed to load border:', status, err);

    // (optional safety) hide loader if border fails on first load
    if (!firstCountryRendered) {
      hideLoading();
      firstCountryRendered = true;
    }
  });
  }); // <-- closes #countrySelect change handler

    // Modal content loader (5 modals)
  function loadModalContent(modalId, countryISO3, countryISO2) {
    const $modal = $(`#${modalId}`);

    const modalHandlers = {
      'demographicsModal': () => $.getJSON('api/country.php', { code: countryISO3 }),

      // ✅ use country NAME for Wikipedia, not ISO code
      'wikiModal': () => $.getJSON('api/wiki.php', { country: selectedCountryName }),

      'newsModal': () => $.getJSON('api/news.php', { country: countryISO2 }),
      'currencyModal': () => {
  return $.getJSON('api/country.php', { code: countryISO3 })
    .then(countryData => {
      const target = Object.keys(countryData[0]?.currencies || {})[0] || 'USD';

      // base fixed to USD, selected = target currency (Argentina -> ARS)
      return $.getJSON('api/exchange.php', { base: 'USD', currency: target });
    });
},
      'weatherModal': () => {
  return $.getJSON('api/country.php', { code: countryISO3 })
    .then(data => {
      const country = data[0] || {};

      // ✅ capital name (used as label)
      const capital = Array.isArray(country.capital)
        ? (country.capital[0] || '')
        : (country.capital || '');

      // ✅ capital coordinates
      const latlng = country.capitalInfo?.latlng;

      if (latlng && latlng.length === 2) {
        return $.getJSON('api/weather.php', {
          lat: latlng[0],
          lng: latlng[1],
          label: capital   // ✅ THIS is the fix
        });
      }

      // fallback if no capital coords
      return Promise.resolve({ location: capital || 'Weather', country: '', forecast: [] });
    });
}
    };

const handler = modalHandlers[modalId];

if (handler) {

  // ✅ 3A: show spinner overlay while weather is loading
  if (modalId === 'weatherModal') {
    $('#weather-preload').removeClass('fadeOut');
  }
    
  handler()
    .then(data => {
      switch (modalId) {
        case 'demographicsModal':
          populateDemographicsModal(data);
          break;

        case 'wikiModal':
          populateWikiModal(data);
          break;

        case 'newsModal':
          populateNewsModal(data);
          break;

        case 'currencyModal':
          populateCurrencyModal(data);
          break;

        case 'weatherModal':
          populateWeatherModal(data);
          break;
      }
    })
    .catch(() => {
      // use .text() / .append() only (no HTML strings)
      if (modalId === 'newsModal') {
        $('#news-list')
          .empty()
          .append($('<p>').addClass('text-danger').text('Failed to load news.'));
      } else if (modalId === 'wikiModal') {
        $('#wiki-summary').text('Failed to load Wikipedia summary.');
      } else if (modalId === 'currencyModal') {
        $('#currency-rate').text('Failed to load currency rate.');
        $('#currency-meta').text('');
      } else if (modalId === 'weatherModal') {
      $('#weather-preload').addClass('fadeOut');
      $('#weatherModalLabel').text('Weather');
      $('#todayConditions').text('Failed to load forecast.');
      $('#todayIcon').attr('src', '');
      $('#todayMaxTemp').text('—');
      $('#todayMinTemp').text('—');
      $('#day1Date, #day2Date').text('');
      $('#day1Icon, #day2Icon').attr('src', '');
      $('#day1MaxTemp, #day1MinTemp, #day2MaxTemp, #day2MinTemp').text('—');
      $('#lastUpdated').text('—');
      } else if (modalId === 'demographicsModal') {
        $('#demo-capital, #demo-continent, #demo-population, #demo-area, #demo-languages').text('N/A');
      }
    });
}

// Bootstrap 5 modal
const bsModal = bootstrap.Modal.getOrCreateInstance($modal[0]);
bsModal.show();

}

// Demographics: now shows Capital + Continent + Population + Area + Languages
function populateDemographicsModal(data) {
  const country = data[0] || {};

  // show loader while filling
  $('#demo-preload').removeClass('fadeOut');

  const capital = Array.isArray(country.capital)
    ? (country.capital[0] || 'N/A')
    : (country.capital || 'N/A');

  const continent = Array.isArray(country.continents)
    ? (country.continents[0] || 'N/A')
    : (country.region || 'N/A');

  const languages = country.languages
    ? Object.values(country.languages).join(', ')
    : 'N/A';

  const currencyCode = country.currencies
    ? (Object.keys(country.currencies)[0] || 'N/A')
    : 'N/A';

  // fill table cells (NEW ids)
  $('#capitalCity').text(capital);
  $('#continent').text(continent);
  $('#languages').text(languages);
  $('#currency').text(currencyCode);

  // use your selected ISO vars
  $('#isoAlpha2').text(selectedCountryISO2 || 'N/A');
  $('#isoAlpha3').text(selectedCountryISO3 || 'N/A');

  $('#population').text(formatNumber(country.population, '0,0'));
  $('#areaInSqKm').text(formatNumber(country.area, '0,0'));

  // hide loader
  $('#demo-preload').addClass('fadeOut');
}


function populateWikiModal(data) {
  $('#wiki-summary').text((data.extract || '').trim() || 'No summary available');
  $('#wiki-link').attr('href', data.wiki_url || '#');
}

function populateNewsModal(data) {
  const $list = $('#news-list');
  $list.empty();

  const articles = (data.articles || []).slice(0, 5);

  if (!articles.length) {
    $list.append($('<p>').addClass('text-muted mb-0').text('No recent news available.'));
    return;
  }

  articles.forEach((a, idx) => {
    const title = a.title || 'Untitled';
    const source = a.source?.name || a.source || 'Unknown source';
    const url = a.url || '#';

    // ✅ your API provides image_url + published
    const imgUrl = a.image_url || '';
    const published = formatDate(a.published); // uses your Date.js formatter

    const $table = $('<table>').addClass('table table-borderless mb-0');

    // Row 1: image + title link
    const $tr1 = $('<tr>');
    const $imgTd = $('<td>').attr('rowspan', '2').attr('width', '50%');

    const finalImg = imgUrl || 'assets/images/news-placeholder.jpg';

    $imgTd.append(
      $('<img>')
        .addClass('img-fluid rounded news-thumb')
        .attr('src', finalImg)
        .attr('alt', title)
        // if the real image fails to load, fall back to placeholder
        .on('error', function () {
          $(this).attr('src', 'assets/images/news-placeholder.jpg');
        })
    );

    const $titleTd = $('<td>');
    $titleTd.append(
      $('<a>')
        .addClass('fw-bold fs-6 text-black text-decoration-none')
        .attr('href', url)
        .attr('target', '_blank')
        .text(title)
    );

    $tr1.append($imgTd, $titleTd);

    // Row 2: "Source • Date" like BBC
    const $tr2 = $('<tr>');
    const $metaTd = $('<td>').addClass('align-bottom pb-0');

    const metaText = `${source} • ${published}`;
    $metaTd.append($('<p>').addClass('fw-light fs-6 mb-1').text(metaText));

    $tr2.append($metaTd);

    $table.append($tr1, $tr2);
    $list.append($table);

    if (idx !== articles.length - 1) {
      $list.append($('<hr>'));
    }
  });
}

function calcResult() {
  const fromVal = parseFloat($('#fromAmount').val());
  const rate = parseFloat($('#exchangeRate').val());

  if (!isFinite(fromVal) || !isFinite(rate)) {
    $('#toAmount').val('');
    return;
  }

  $('#toAmount').val(numeral(fromVal * rate).format("0,0.00"));
}

function populateCurrencyModal(data) {
  // Expected from exchange.php:
  // { base, selected, rates: [{code,name,rate}], source, timestamp }

  const base = data?.base || 'USD';
  const selected = data?.selected || 'USD';
  const rates = Array.isArray(data?.rates) ? data.rates : [];

  // Set "From USD"
  $('#fromLabel').text(`From ${base}`);

  // Build dropdown
  const $select = $('#exchangeRate');
  $select.empty();

  rates.forEach(r => {
    const code = (r.code || '').toUpperCase();
    const name = r.name || code;
    const rate = parseFloat(r.rate);

    if (!code || !isFinite(rate)) return;

    $select.append(
      $('<option>')
        .val(rate)
        .attr('data-code', code)
        .text(name)
    );
  });

  // Select the country currency (Argentina -> ARS)
  const $opt = $select.find(`option[data-code="${selected}"]`);
  if ($opt.length) {
    $opt.prop('selected', true);
  } else {
    $select.prop('selectedIndex', 0);
  }

  // Meta
const ts = data?.timestamp
  ? Date.parse(data.timestamp).toString("dS MMM yyyy")
  : '';

const meta = `${data?.source || ''}${ts ? ' • ' + ts : ''}`;
$('#currency-meta').text(meta.trim());

  // Init
  $('#fromAmount').val(1);
  calcResult();
}

// Bind currency events ONCE
(function bindCurrencyEventsOnce() {
  let bound = false;

  $(document).on('shown.bs.modal', '#currencyModal', function () {
    if (bound) return;
    bound = true;

    $('#fromAmount').on('keyup change', calcResult);
    $('#exchangeRate').on('change', calcResult);
  });

  $(document).on('hidden.bs.modal', '#currencyModal', function () {
    $('#fromAmount').val(1);
    $('#toAmount').val('');
  });
})();

function populateWeatherModal(data) {
  $('#weather-preload').addClass('fadeOut');

  const title = (data.location && data.country)
    ? `${data.location}, ${data.country}`
    : 'Weather';

  $('#weatherModalLabel').text(title);

  const forecast = Array.isArray(data.forecast) ? data.forecast : [];

  if (forecast.length < 3) {
    $('#todayConditions').text('No forecast available');
    $('#todayIcon').attr('src', '');
    $('#todayMaxTemp').text('—');
    $('#todayMinTemp').text('—');

    $('#day1Date, #day2Date').text('');
    $('#day1Icon, #day2Icon').attr('src', '');
    $('#day1MaxTemp, #day1MinTemp, #day2MaxTemp, #day2MinTemp').text('—');

    $('#lastUpdated').text(data.lastUpdated ? formatDate(data.lastUpdated) : '—');
    return;
  }

  // Today
  $('#todayConditions').text(forecast[0].conditionText || '');
  $('#todayIcon').attr('src', forecast[0].conditionIcon || '');
  $('#todayMaxTemp').text(forecast[0].maxC ?? '—');
  $('#todayMinTemp').text(forecast[0].minC ?? '—');

  // Day 1
  $('#day1Date').text(Date.parse(forecast[1].date).toString("ddd dS"));
  $('#day1Icon').attr('src', forecast[1].conditionIcon || '');
  $('#day1MaxTemp').text(forecast[1].maxC ?? '—');
  $('#day1MinTemp').text(forecast[1].minC ?? '—');

  // Day 2
  $('#day2Date').text(Date.parse(forecast[2].date).toString("ddd dS"));
  $('#day2Icon').attr('src', forecast[2].conditionIcon || '');
  $('#day2MaxTemp').text(forecast[2].maxC ?? '—');
  $('#day2MinTemp').text(forecast[2].minC ?? '—');

  $('#lastUpdated').text(
    data.lastUpdated ? Date.parse(data.lastUpdated).toString("HH:mm, dS MMM") : '—'
  );
}

  function reverseGeocode(lat, lng, cb) {
    $.getJSON('api/geocode.php', { lat, lng })
      .done(data => {
        const code = data?.results?.[0]?.components?.['ISO_3166-1_alpha-3'];
        cb(code ? code.toUpperCase() : null);
      })
      .fail(() => cb(null));
  }
});
