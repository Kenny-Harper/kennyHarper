$(document).ready(function () {
  console.log('Gazetteer loaded.');

  // Initialize map
  const map = L.map('map').setView([20, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

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
      $('#countrySelect').val(countryCode['data']).change();
     
    })
    .fail((jqxhr, status, err) => {
      console.log(jqxhr);
      console.error('Failed to get countryCode:', status, err);
      $('#loading').html('<div class="text-danger">Failed to get country code</div>').show();
    });


  });

  // State variables
  let countryLayer = null;
  let selectedCountryISO3 = null;
  let selectedCountryISO2 = null;
  let selectedCountryName = null;      // 🔸 NEW – for Wikipedia (country NAME)
  let userAutoSelectPending = null;

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

  L.control.layers(null, {
    'Cities': citiesCluster,
    'Airports': airportsCluster
  }, { collapsed: false }).addTo(map);

  // Utilities
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function hideLoading() {
    $('#loading').fadeOut(500);
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
      const $select = $('#countrySelect');
      $select.find('option:not(:first)').remove();

      countries.forEach(c => {
        const code = (c.code || '').toUpperCase();
        const name = c.name || 'Unknown';
        if (code && code.length === 3) {
          // 🔸 store mapping ISO3 -> name for Wikipedia
          iso3ToNameMap[code] = name;
          $select.append(`<option value="${code}">${escapeHtml(name)}</option>`);
        }
      });

      console.log(`Dropdown ready: ${$select.find('option').length - 1} countries`);

      if (userAutoSelectPending && $select.find(`option[value="${userAutoSelectPending}"]`).length) {
        console.log('Auto-selecting user country:', userAutoSelectPending);
        $select.val(userAutoSelectPending).trigger('change');
      }
      userAutoSelectPending = null;
      hideLoading();
    })
    .fail((jqxhr, status, err) => {
      console.error('Failed to load country list:', status, err);
      $('#loading').html('<div class="text-danger">Failed to load country list</div>').show();
    });

  // Country selection handler
  $('#countrySelect').on('change', function () {
    selectedCountryISO3 = $(this).val();
    selectedCountryISO2 = getIso2FromIso3(selectedCountryISO3);
    selectedCountryName = iso3ToNameMap[selectedCountryISO3] || null;   // 🔸 NEW – name for Wikipedia

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
            console.log(`Loaded ${data.cities.length} cities and ${data.airports.length} airports.`);
          })
          .fail(() => console.error('Failed to load GeoNames markers'));
      })
      .fail((jqxhr, status, err) => {
        console.error('Failed to load border:', status, err);
      });
  });

    // Modal content loader (5 modals)
  function loadModalContent(modalId, countryISO3, countryISO2) {
    const $modal = $(`#${modalId}`);
    const $body = $modal.find('.modal-body');
    $body.html('<div class="text-center"><div class="spinner-border" role="status"></div><p>Loading...</p></div>');

    const modalHandlers = {
      'demographicsModal': () => $.getJSON('api/country.php', { code: countryISO3 }),

      // ✅ use country NAME for Wikipedia, not ISO code
      'wikiModal': () => $.getJSON('api/wiki.php', { country: selectedCountryName }),

      'newsModal': () => $.getJSON('api/news.php', { country: countryISO2 }),
      'currencyModal': () => {
        return $.getJSON('api/country.php', { code: countryISO3 })
          .then(data => {
            const currency = Object.keys(data[0]?.currencies || {})[0] || 'USD';
            return $.getJSON('api/exchange.php', { currency });
          });
      },
      'weatherModal': () => {
        return $.getJSON('api/country.php', { code: countryISO3 })
          .then(data => {
            const latlng = data[0]?.capitalInfo?.latlng;
            if (latlng && latlng.length === 2) {
              return $.getJSON('api/weather.php', { lat: latlng[0], lng: latlng[1] });
            }
            return Promise.resolve({ main: {}, weather: [] });
          });
      }
    };

    const handler = modalHandlers[modalId];
    if (handler) {
      handler()
        .done(data => {
          let content = '';
          switch (modalId) {
            case 'demographicsModal':
              content = buildDemographicsContent(data);
              break;
            case 'wikiModal':
              content = buildWikiContent(data);
              break;
            case 'newsModal':
              content = buildNewsContent(data);
              break;
            case 'currencyModal':
              content = buildCurrencyContent(data);
              break;
            case 'weatherModal':
              content = buildWeatherContent(data);
              break;
            default:
              content = '<p>Content not available</p>';
          }
          $body.html(content);

          // 🔹 After HTML is inserted, wire up the converter
          if (modalId === 'currencyModal') {
            attachCurrencyConverter(data);
          }
        })
        .fail(() => {
          $body.html('<div class="alert alert-warning">Failed to load data. Please try again.</div>');
        });
    }

    // Bootstrap 5 modal
    const bsModal = new bootstrap.Modal($modal[0]);
    bsModal.show();
  }


// Demographics: now shows Capital + Continent + Population + Area + Languages
function buildDemographicsContent(data) {
  const country = data[0] || {};

  const population = country.population?.toLocaleString?.() || 'N/A';
  const area = country.area?.toLocaleString?.() || 'N/A';

  // Capital can be an array (REST Countries v3) or a string
  const capital = Array.isArray(country.capital)
    ? (country.capital[0] || 'N/A')
    : (country.capital || 'N/A');

  // Continent usually in `continents[0]`, fall back to `region`
  const continentRaw = Array.isArray(country.continents)
    ? (country.continents[0] || '')
    : (country.region || '');
  const continent = continentRaw || 'N/A';

  const languages = Object.values(country.languages || {}).join(', ') || 'N/A';

  return `
    <div class="row g-3 d-flex flex-column">
      <div class="col-md-12 flex-grow-1"><strong>Capital:</strong> ${escapeHtml(capital)}</div>
      <div class="col-md-12 flex-grow-1"><strong>Continent:</strong> ${escapeHtml(continent)}</div>
      <div class="col-md-12 flex-grow-1"><strong>Population:</strong> ${population}</div>
      <div class="col-md-12 flex-grow-1"><strong>Area:</strong> ${area} km²</div>
      <div class="col-md-12 flex-grow-1"><strong>Languages:</strong> ${escapeHtml(languages)}</div>
    </div>
  `;
}

function buildWikiContent(data) {
  // data comes from wiki.php: { wiki_url, extract }
  const summary = (data.extract || '').trim();
  const link = data.wiki_url || '#';

  if (!summary) {
    // If Wikipedia didn’t give us any text
    return `
      <p>No summary text was returned by Wikipedia for this country.</p>
      <a href="${link}" target="_blank" class="btn btn-primary w-100">
        Open full Wikipedia article
      </a>
    `;
  }

  return `
    <p>${summary}</p>
    <a href="${link}" target="_blank" class="btn btn-primary w-100">
      Wikipedia Page
    </a>
  `;
}

  function buildNewsContent(data) {
    return (data.articles || []).slice(0, 5).map(a =>
      `<div class="card mb-3 border-0 shadow-sm">
        <div class="card-body p-3">
          <h6 class="card-title mb-1">${escapeHtml(a.title)}</h6>
          <div class="text-muted small mb-1">${escapeHtml(a.source?.name || a.source)} • ${new Date(a.publishedAt || a.published).toLocaleDateString()}</div>
          <p class="small mb-2">${escapeHtml(a.description || '')}</p>
          <a href="${a.url}" target="_blank" class="btn btn-sm btn-outline-primary">Read more</a>
        </div>
      </div>`
    ).join('') || '<p class="text-muted">No recent news available</p>';
  }

  function buildCurrencyContent(data) {
    // Backend gives: { rate, currency, source, timestamp }
    const base = 'GBP'; // your PHP calculates 1 GBP = rate * CURRENCY
    const currency = data.currency || 'USD';
    const rateNum = parseFloat(data.rate);
    const rateText = (rateNum && isFinite(rateNum)) ? rateNum.toFixed(2) : 'N/A';

    const source = data.source || '';
    const ts = data.timestamp || '';

    return `
      <div class="text-center mb-3">
        <h5 class="mb-1">Exchange rate</h5>
        <p class="mb-0">
          <strong>1 ${escapeHtml(base)}</strong>
          ≈
          <strong>${rateText} ${escapeHtml(currency)}</strong>
        </p>
        <small class="text-muted">
          ${escapeHtml(source)}${ts ? ' • ' + escapeHtml(ts) : ''}
        </small>
      </div>

      <hr>

      <div>
        <h6 class="mb-2">Convert currency</h6>
        <div class="row g-2 align-items-center mb-2">
          <div class="col-5">
            <label for="currencyBaseAmount" class="form-label mb-1">${escapeHtml(base)} amount</label>
            <input type="number" class="form-control" id="currencyBaseAmount" min="0" step="0.01" />
          </div>

          <div class="col-2 text-center">
            <label for="currencyDirection" class="form-label mb-1">Direction</label>
            <select id="currencyDirection" class="form-select form-select-sm">
              <option value="baseToTarget">${escapeHtml(base)} → ${escapeHtml(currency)}</option>
              <option value="targetToBase">${escapeHtml(currency)} → ${escapeHtml(base)}</option>
            </select>
          </div>

          <div class="col-5">
            <label for="currencyTargetAmount" class="form-label mb-1">${escapeHtml(currency)} amount</label>
            <input type="number" class="form-control" id="currencyTargetAmount" min="0" step="0.01" />
          </div>
        </div>

        <small class="text-muted">
          Type in the left field to convert ${escapeHtml(base)} to ${escapeHtml(currency)},
          or switch direction to convert back.
        </small>
      </div>
    `;
  }

  function attachCurrencyConverter(data) {
    const base = 'GBP';
    const currency = data.currency || 'USD';
    const rate = parseFloat(data.rate);

    if (!rate || !isFinite(rate)) {
      console.warn('Invalid exchange rate:', data.rate);
      return;
    }

    const $baseInput = $('#currencyBaseAmount');
    const $targetInput = $('#currencyTargetAmount');
    const $direction = $('#currencyDirection');

    function recalc() {
      const direction = $direction.val();

      if (direction === 'baseToTarget') {
        const baseVal = parseFloat($baseInput.val());
        if (isNaN(baseVal)) {
          $targetInput.val('');
          return;
        }
        $targetInput.val((baseVal * rate).toFixed(2));
      } else {
        const targetVal = parseFloat($targetInput.val());
        if (isNaN(targetVal)) {
          $baseInput.val('');
          return;
        }
        $baseInput.val((targetVal / rate).toFixed(2));
      }
    }

    // When typing in base amount and direction is base -> target
    $baseInput.on('input', () => {
      if ($direction.val() === 'baseToTarget') recalc();
    });

    // When typing in target amount and direction is target -> base
    $targetInput.on('input', () => {
      if ($direction.val() === 'targetToBase') recalc();
    });

    // When changing direction, reset to 1 and recompute
    $direction.on('change', () => {
      $baseInput.val('1');
      recalc();
    });

    // Initialise with 1 unit
    $baseInput.val('1');
    $direction.val('baseToTarget');
    recalc();
  }

  function buildWeatherContent(data) {
    const temp = data.main?.temp !== undefined ? Math.round(data.main.temp) + '°C' : 'N/A';
    const feelsLike = data.main?.feels_like !== undefined ? Math.round(data.main.feels_like) + '°C' : 'N/A';
    const desc = data.weather?.[0]?.description || 'N/A';
    const icon = data.weather?.[0]?.icon;

    return `
      <div class="text-center py-4">
        <h2 class="text-primary">${temp}</h2>
        <p class="lead text-capitalize">${desc}</p>
        ${icon ? `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon" style="width: 80px;">` : ''}
        <div class="mt-3">
          <small class="text-muted">Feels like: ${feelsLike}</small>
        </div>
      </div>
    `;
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
