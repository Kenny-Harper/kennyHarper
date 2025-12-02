$(function () {
  // Confirm jQuery is loaded
  $("#output").text("jQuery is working!");

  // 🔹 Timezone button
  $("#btn-timezone").on("click", function () {
    let lat = $("#tz-lat").val();
    let lng = $("#tz-lng").val();

    $.ajax({
      url: "libs/php/getTimezone.php",
      type: "GET",
      dataType: "json",
      data: { lat: lat, lng: lng },
      success: function (result) {
        $("#result-timezone").text(JSON.stringify(result, null, 2));
      },
      error: function (xhr, status, error) {
        $("#result-timezone").text("Error: " + error);
      }
    });
  });

  // 🔹 Wikipedia button
  $("#btn-wiki").on("click", function () {
    let lat = $("#wiki-lat").val();
    let lng = $("#wiki-lng").val();

    $.ajax({
      url: "libs/php/getNearbyWikipedia.php",
      type: "GET",
      dataType: "json",
      data: { lat: lat, lng: lng },
      success: function (result) {
        $("#result-wiki").text(JSON.stringify(result, null, 2));
      },
      error: function (xhr, status, error) {
        $("#result-wiki").text("Error: " + error);
      }
    });
  });

  // 🔹 Earthquakes button
  $("#btn-quakes").on("click", function () {
    let north = $("#eq-north").val();
    let south = $("#eq-south").val();
    let east = $("#eq-east").val();
    let west = $("#eq-west").val();

    $.ajax({
      url: "libs/php/getEarthquakes.php",
      type: "GET",
      dataType: "json",
      data: { north: north, south: south, east: east, west: west },
      success: function (result) {
        $("#result-quakes").text(JSON.stringify(result, null, 2));
      },
      error: function (xhr, status, error) {
        $("#result-quakes").text("Error: " + error);
      }
    });
  });
});

