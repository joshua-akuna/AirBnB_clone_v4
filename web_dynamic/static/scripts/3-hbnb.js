const checkedIds = [];
const checkedNames = [];

$(window).on('load', () => {
  setInterval(changeApiStatus, 3000);
  const places = updatePlaces();
  if (places) { populatePlaces(places); }

  $('.amenity').change(function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');
    // console.log(id);

    if ($(this).is(':checked')) {
      if (!(checkedIds.includes(amenityId))) {
        checkedIds.push(amenityId);
        checkedNames.push(amenityName);
      }
    } else {
      if (checkedIds.includes(amenityId)) {
        let index = checkedIds.indexOf(amenityId);
        checkedIds.splice(index, 1);
        index = checkedNames.indexOf(amenityName);
        checkedNames.splice(index, 1);
      }
    }
    if (checkedNames.length > 0) {
      let text = '';
      for (const i in checkedNames.sort()) {
        if (i > 0) { text += ', '; }
        text += checkedNames[i];
      }
      $('div.amenities h4').text(text);
      $('div.amenities h4').css('overflow', 'hidden');
    } else {
      $('div.amenities h4').html('&nbsp;');
      $('div.amenities h4').css('overflow', 'inherit');
    }
  });

  function changeApiStatus () {
    const status = getStatus();
    if (status === 'OK') {
      if (!$('div#api_status').hasClass('available')) {
        $('div#api_status').addClass('available');
      }
    } else {
      if ($('div#api_status').hasClass('available')) {
        $('div#api_status').removeClass('available');
      }
    }
  }

  function getStatus () {
    let status = null;
    $.ajax({
      url: 'http://127.0.0.1:5001/api/v1/status/',
      type: 'get',
      async: false,
      success: function (data) {
        status = data.status;
      }
    });
    return status;
  }

  function updatePlaces () {
    let searchedPlaces = null;
    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:5001/api/v1/places_search',
      headers: {
        'Content-Type': 'application/json'
      },
      async: false,
      data: JSON.stringify({
      }),
      dataType: 'json',
      success: function (data) {
        searchedPlaces = data;
      }
    });
    return searchedPlaces;
  }

  function populatePlaces (places) {
    if (!places) { return; }
    for (const place of places) {
      $('section.places').append(createPlaceArticle(place));
    }
  }

  function createPlaceArticle (place) {
    const newArticle = $('<article></article>');
    newArticle.append(createTitle(place));
    newArticle.append(createInfo(place));
    newArticle.append(createDescription(place));

    return newArticle;
  }

  function createTitle (place) {
    const div = $('<div></div>').addClass('title_box');
    const h2 = $('<h2></h2>').text(place.name);
    const priceTag = $('<div></div>').addClass('price_by_night');
    priceTag.text(place.price_by_night);
    div.append(h2);
    div.append(priceTag);

    return div;
  }

  function createInfo (place) {
    const infoDiv = $('<div></dvi>').addClass('information');
    const maxGuest = $('<div></div>').addClass('max_guest');
    maxGuest.text(`${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}`);
    const rooms = $('<div></div>').addClass('number_rooms');
    rooms.text(`${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}`);
    const bathrooms = $('<div></div>').addClass('number_bathrooms');
    bathrooms.text(`${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}`);
    infoDiv.append(maxGuest);
    infoDiv.append(rooms);
    infoDiv.append(bathrooms);

    return infoDiv;
  }

  function createDescription (place) {
    const desc = $('<div></div>').addClass('description');
    desc.html(place.description);

    return desc;
  }
});
