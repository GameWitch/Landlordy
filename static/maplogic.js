 // This will let you use the .remove() function later on
      if (!('remove' in Element.prototype)) {
        Element.prototype.remove = function() {
          if (this.parentNode) {
              this.parentNode.removeChild(this);
          }
        };
      }

 mapboxgl.accessToken = 'pk.eyJ1IjoiYmFsZmFkb3J0aGVzdHJhbmdlIiwiYSI6ImNrZmNyMHQ5eTAxOHUydHMwMGtybndneHUifQ.7gnpHt_vdwFZZU18pnsvqA';
      /**
       * Add the map to the page
      */
      var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [-104.984715, 39.739238],
        zoom: 15,
        scrollZoom: true
      });

 function loadJSONFile(callback) {
            callback(stores);
 }

// response was being taken in here but i'm not using it at all
loadJSONFile(function(response) {
      /**
       * Assign a unique id to each store. You'll use this `id`
       * later to associate each point on the map with a listing
       * in the sidebar.
*/



      /**
       * Wait until the map loads to make changes to the map.
      */
      map.on('load', function (e) {

      map.resize();
	 map.addLayer({
    "id": "locations",
    "type": "symbol",


	/**
         * This is where your '.addLayer()' used to be, instead
         * add only the source without styling a layer
        */
      "source": {
      "type": "geojson",
      "data": stores
    },
    "layout": {
      "icon-image": "castle-15",
      "icon-allow-overlap": true,
    }
     });

        /**
         * Add all the things to the page:
         * - The location listings on the side of the page
         * - The markers onto the map
        */
        //buildLocationList(stores);
        addMarkers();
      });

      /**
       * Add a marker to the map for every store listing.
      **/
      function addMarkers() {
        /* For each feature in the GeoJSON object above: */
        stores.features.forEach(function(marker) {
          /* Create a div element for the marker. */
          var el = document.createElement('div');
          /* Assign a unique `id` to the marker. */
          el.id = "marker-" + marker.properties.id;
          /* Assign the `marker` class to each marker for styling. */
          el.className = 'marker';

          /**
           * Create a marker using the div element
           * defined above and add it to the map.
          **/
          new mapboxgl.Marker(el, { offset: [0, 0] })
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);

          /**
           * Listen to the element and when it is clicked, do three things:
           * 1. Fly to the point
           * 2. Close all other popups and display popup for clicked store
           * 3. Highlight listing in sidebar (and remove highlight for all other listings)
          **/
          el.addEventListener('click', function(e){
            /* Fly to the point */
            flyToStore(marker);
            /* Close all other popups and display popup for clicked store */
            createPopUp(marker);
            /* Highlight listing in sidebar */

            sendPost(marker);

            var activeItem = document.getElementsByClassName('active');
            e.stopPropagation();
            if (activeItem[0]) {
              activeItem[0].classList.remove('active');
            }
            var listing = document.getElementById('listing-' + marker.properties.id);
            //listing.classList.add('active');
          });
        });
      }

      function buildLocationList(data) {
        var listings = document.getElementById('listings');

        listings.replaceChildren();

        data.forEach(function(prop, i){

          /* Add a new listing section to the sidebar. */
          var listing = listings.appendChild(document.createElement('div'));
          /* Assign a unique `id` to the listing. */
          listing.id = "listing-" + prop.id;
          /* Assign the `item` class to each listing for styling. */
          listing.className = 'item';

          /* Add the link to the individual listing created above. */
          var link = listing.appendChild(document.createElement('a'));
          link.href = '#';
          link.className = 'title';
          link.id = "link-" + prop.id;
          link.innerHTML = prop.ADDRESS;

          /* Add details to the individual listing. */
          // make the details.innerHTML a <ul></u> thing and then += <li>prop.all_the_things</li>
          var details = listing.appendChild(document.createElement('div'));
          details.innerHTML += '<ul></ul>'
          details_list = details.firstElementChild

          if (prop.SITE_MORE != ""){
          details_list.innerHTML += '<li> unit: ' + prop?.SITE_MORE + '</li>';
          }

          details_list.innerHTML += '<li> Owner: ' + prop?.OWNER + '</li>';
          details_list.innerHTML += '<li> Co-Owner: ' + prop?.CO_OWNER + '</li>';
          details_list.innerHTML += '<li> Owner Address: ' + prop?.OWNER_ADDRESS + '</li>';
          details_list.innerHTML += '<li> Property Value: $' + prop?.TOTAL_VALUE + '</li>';
          details_list.innerHTML += '<li> Assessed Value: $' + prop?.ASSESS_VALUE + '</li>';
          details_list.innerHTML += '<li> Assessment Taxable: $' + prop?.ASMT_TAXABLE + '</li>';
          details_list.innerHTML += '<li> Tax District: ' + prop?.TAX_DIST + '</li>';
          details_list.innerHTML += '<li> Building Name:' + prop?.BLD_NAME + '</li>';
          details_list.innerHTML += '<li> Total Square Feet:' + prop?.TOTL_SQFT + '</li>';
          details_list.innerHTML += '<li> Total Units:' + prop?.TOT_UNITS + '</li>';
          details_list.innerHTML += '<li> Number of Floors:' + prop?.NO_FLOORS + '</li>';
          details_list.innerHTML += '<li> Year of Construction:' + prop?.ORIG_YOC + '</li>';
          details_list.innerHTML += '<li> Class:' + prop?.D_CLASS_CN + '</li>';
          details_list.innerHTML += '<li> Neighborhood:' + prop?.NBHD_1_CN + '</li>';
          details_list.innerHTML += '<li> Zone:' + prop?.ZONE10 + '</li>';
          details_list.innerHTML += '<li> Tax District:' + prop?.TAX_DIST + '</li>';


          /**
           * Listen to the element and when it is clicked, do four things:
           * 1. Update the `currentFeature` to the store associated with the clicked link
           * 2. Fly to the point
           * 3. Close all other popups and display popup for clicked store
           * 4. Highlight listing in sidebar (and remove highlight for all other listings)
          **/
          link.addEventListener('click', function(e){

            for (var i=0; i < data.length; i++) {
            console.log(stores.features[data[i].id]);
              if (this.id === "link-" + stores.features[data[i].id].properties.id) {
                var clickedListing = stores.features[data[i].id];
                flyToStore(clickedListing);
                createPopUp(clickedListing);
              }
            }
            var activeItem = document.getElementsByClassName('active');
            if (activeItem[0]) {
              activeItem[0].classList.remove('active');
            }
            this.parentNode.classList.add('active');
          });

        });
      }

      /**
       * Use Mapbox GL JS's `flyTo` to move the camera smoothly
       * a given center point.
      **/
      function flyToStore(currentFeature) {
        map.flyTo({
          center: currentFeature.geometry.coordinates,
          zoom: 15
        });
      }

      /**
       * Create a Mapbox GL JS `Popup`.
      **/
      function createPopUp(currentFeature) {
        var popUps = document.getElementsByClassName('mapboxgl-popup');
        if (popUps[0]) popUps[0].remove();
        var popup = new mapboxgl.Popup({closeOnClick: true})
          .setLngLat(currentFeature.geometry.coordinates)
          .setHTML('<h3>' + currentFeature.properties.ADDRESS + '</h3>' )
          .addTo(map);
      }


     const sendPost = async (currentFeature) => {
        const url = '/owner?owner='+currentFeature.properties.OWNER_ADDRESS; // the URL to send the HTTP request to
        const body = '';
        const headers = {'Content-Type': 'application/json'};
        const method = 'GET';
        const response = await fetch(url, { method});
        var data = {}
        data = await response.json(); // or response.json() if your server returns JSON
        buildLocationList(data);
    }
   });