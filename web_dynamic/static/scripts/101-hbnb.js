const checkedIds = [];
const checkedNames = [];
const checkedCities = [];
const checkedStates = [];
const stateCityNames = [];

$(document).ready(function () {
  setInterval(changeApiStatus, 3000);
  updatePlaces();

  $('section.filters button').click(function () {
    updatePlaces();
  });

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
    displayNames(checkedNames, $('.amenities h4'));
  });

  $('.state').change(function () {
    const id = $(this).data('id');
    const name = $(this).data('name');

    // console.log(id);
    // console.log(name);
    if ($(this).is(':checked')) {
      if (!(checkedStates.includes(id))) {
        checkedStates.push(id);
        stateCityNames.push(name);
      }
    } else {
      if (checkedStates.includes(id)) {
        let i = checkedStates.indexOf(id);
        checkedStates.splice(i, 1);
        i = stateCityNames.indexOf(name);
        stateCityNames.splice(i, 1);
      }
    }
    displayNames(stateCityNames, $('.locations h4'));
  });

  $('.city').change(function () {
    const id = $(this).data('id');
    const name = $(this).data('name');

    // console.log(id);
    // console.log(name);
    if ($(this).is(':checked')) {
      if (!(checkedCities.includes(id))) {
        checkedCities.push(id);
        stateCityNames.push(name);
      }
    } else {
      if (checkedCities.includes(id)) {
        let i = checkedCities.indexOf(id);
        checkedCities.splice(i, 1);
        i = stateCityNames.indexOf(name);
        stateCityNames.splice(i, 1);
      }
    }
    displayNames(stateCityNames, $('.locations h4'));
  });

  $('body').on('click', 'span.toggle-btn', function () {
    const btn = $(this);
    const placeId = btn.attr('id');
    const text = btn.text();

    if (text === 'show') {
      const reviews = getReviews(placeId);
      if (reviews.length === 0) { return; }
      createReviews(placeId, reviews);
      btn.text('hide');
    } else {
      $('.reviews ul').remove();
      btn.text('show');
    }
    // console.log(placeId);
  });

  function updatePlaces () {
    const places = getPlaces();
    // console.log(places.length);
    if (places) { populatePlaces(places); }
  }

  function displayNames (names, element) {
    if (names.length > 0) {
      let text = '';
      for (const i in names.sort()) {
        if (i > 0) { text += ', '; }
        text += names[i];
      }
      element.text(text);
      $('.filters h4').css('overflow', 'hidden');
    } else {
      element.html('&nbsp;');
      $('.filters h4').css('overflow', 'inherit');
    }
  }

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

  function getPlaces () {
    let searchedPlaces = null;

    // console.log(checkedStates);
    // console.log(checkedCities);

    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:5001/api/v1/places_search',
      headers: {
        'Content-Type': 'application/json'
      },
      async: false,
      data: JSON.stringify({
        states: checkedStates,
        cities: checkedCities,
        amenities: checkedIds
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
    $('section.places').empty();
    for (const place of places) {
      $('section.places').append(createPlaceArticle(place));
    }
  }

  function createPlaceArticle (place) {
    const newArticle = $('<article></article>');
    newArticle.append(createTitle(place));
    newArticle.append(createInfo(place));
    newArticle.append(createDescription(place));
    newArticle.append(createReview(place));

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
    rooms.text(`${place.number_rooms} Bedroom${place.number_rooms !== 1
      ? 's'
      : ''}`);
    const bathrooms = $('<div></div>').addClass('number_bathrooms');
    bathrooms.text(`${place.number_bathrooms}
      Bathroom${place.number_bathrooms !== 1 ? 's' : ''}`);
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

  function createReview (place) {
    const review = $('<div></div>').addClass('reviews');
    review.addClass(place.id);

    const title = $('<div></div>').addClass('review-title');
    const h2 = $('<h2></h2>').text('Reviews');
    const span = $('<span></span>').addClass('toggle-btn')
      .text('show').attr('id', place.id);

    title.append(h2);
    title.append(span);

    review.append(title);

    return review;
  }

  function getReviews (id) {
    let reviews = null;
    $.ajax({
      type: 'get',
      url: `http://127.0.0.1:5001/api/v1/places/${id}/reviews`,
      async: false,
      success: function (data) {
        reviews = data;
      }
    });
    return reviews;
  }

  function createReviews (id, reviews) {
    const parent = $(`.${id}`);
    const reviewList = $('<ul></ul>');

    for (const review of reviews) {
      const reviewItem = createReviewItem(review);
      reviewList.append(reviewItem);
    }
    parent.append(reviewList);
  }

  function createReviewItem (review) {
    const date = getFormattedDate(review);
    const user = getUserById(review.user_id);
    const reviewItem = $('<li></li>');

    let fullName = 'John Doe';
    if (user != null) { fullName = `${user.first_name} ${user.last_name}`; }

    const reviewHeading = $('<h3></h3>').text(`From ${fullName} the ${date}`);
    const reviewText = $('<p></p>').html(review.text);

    reviewItem.append(reviewHeading);
    reviewItem.append(reviewText);

    return reviewItem;
  }

  function getFormattedDate (review) {
    const fullMonths = {
      1: 'January',
      2: 'February',
      3: 'March',
      4: 'April',
      5: 'May',
      6: 'June',
      7: 'July',
      8: 'August',
      9: 'September',
      10: 'October',
      11: 'November',
      12: 'December'
    };

    const reviewDate = new Date(review.updated_at);
    const day = reviewDate.getDate();
    const suffix = day % 10 === 1
      ? 'st'
      : day % 10 === 2
        ? 'nd'
        : day % 10 === 3 ? 'rd' : 'th';
    const month = fullMonths[reviewDate.getMonth() + 1];
    const year = reviewDate.getFullYear();

    return `${day}${suffix} ${month} ${year}`;
  }

  function getUserById (userId) {
    let user = null;

    $.ajax({
      type: 'GET',
      url: `http://127.0.0.1:5001/api/v1/users/${userId}`,
      async: false,
      success: function (data) {
        user = data;
      }
    });

    return user;
  }
});
