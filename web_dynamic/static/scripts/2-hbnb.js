const checkedIds = [];
const checkedNames = [];

$(window).on('load', () => {
  setInterval(changeApiStatus, 3000);

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
});
