const checkedIds = [];
const checkedNames = [];

$(window).on('load', () => {
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
});
