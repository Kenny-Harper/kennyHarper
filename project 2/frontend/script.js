// ===============================
// CONFIG
// ===============================
const API_BASE = "http://localhost/companydirectory";

const ENDPOINTS = {
  // personnel
  getAll: `${API_BASE}/getAll.php`,
  searchAll: `${API_BASE}/searchAll.php`,
  getPersonnelByID: `${API_BASE}/getPersonnelByID.php`,
  updatePersonnelByID: `${API_BASE}/updatePersonnelByID.php`,
  deletePersonnelByID: `${API_BASE}/deletePersonnelByID.php`,
  insertPersonnel: `${API_BASE}/insertPersonnel.php`,

  // departments
  getAllDepartments: `${API_BASE}/getAllDepartments.php`,
  getDepartmentByID: `${API_BASE}/getDepartmentByID.php`,
  updateDepartmentByID: `${API_BASE}/updateDepartmentByID.php`,
  deleteDepartmentByID: `${API_BASE}/deleteDepartmentByID.php`,
  insertDepartment: `${API_BASE}/insertDepartment.php`,

  // locations
  getAllLocations: `${API_BASE}/getAllLocations.php`,
  getLocationByID: `${API_BASE}/getLocationByID.php`,
  insertLocation: `${API_BASE}/insertLocation.php`,
  updateLocationByID: `${API_BASE}/updateLocationByID.php`,
  deleteLocationByID: `${API_BASE}/deleteLocationByID.php`
};

// ===============================
// MODAL HELPERS
// ===============================
function hideModalById(modalId) {
  const el = document.getElementById(modalId);
  if (!el) return;
  const instance = bootstrap.Modal.getInstance(el);
  if (instance) instance.hide();
}

function showModalById(modalId) {
  const el = document.getElementById(modalId);
  if (!el) return null;
  const instance = bootstrap.Modal.getOrCreateInstance(el);
  instance.show();
  return instance;
}

// ===============================
// FORMATTERS
// ===============================
function formatEmployeeName(row) {
  const first = (row.firstName ?? "").toString().trim();
  const last = (row.lastName ?? "").toString().trim();

  if (!first && !last) return "(No name)";
  if (first && last) return `${last}, ${first}`;
  return last || first;
}

function includesText(haystack, needle) {
  return (haystack ?? "")
    .toString()
    .toLowerCase()
    .includes((needle ?? "").toString().toLowerCase());
}

// ===============================
// FILTER STATE (Personnel only)
// ===============================
let activeDepartmentFilter = 0;
let activeLocationFilter = 0;

function resetPersonnelFilters() {
  activeDepartmentFilter = 0;
  activeLocationFilter = 0;

  if ($("#filterDepartment").length) $("#filterDepartment").val("0");
  if ($("#filterLocation").length) $("#filterLocation").val("0");
}

// ===============================
// RENDER FUNCTIONS
// ===============================
function renderPersonnelRows(rows) {
  $("#personnelTableBody").html("");

  $.each(rows, function () {
    $("#personnelTableBody").append(
      $("<tr>").append(
        $("<td>")
          .addClass("align-middle text-nowrap")
          .text(formatEmployeeName(this)),

        $("<td>")
          .addClass("align-middle text-nowrap d-none d-md-table-cell")
          .text(this.department ?? ""),

        $("<td>")
          .addClass("align-middle text-nowrap d-none d-md-table-cell")
          .text(this.location ?? ""),

        $("<td>")
          .addClass("align-middle text-nowrap d-none d-md-table-cell")
          .text(this.email ?? ""),

        $("<td>")
          .addClass("text-end text-nowrap")
          .append(
            $("<button>")
              .attr("type", "button")
              .addClass("btn btn-primary btn-sm me-1")
              .attr("data-bs-toggle", "modal")
              .attr("data-bs-target", "#editPersonnelModal")
              .attr("data-id", this.id)
              .append($("<i>").addClass("fa-solid fa-pencil fa-fw")),

            $("<button>")
              .attr("type", "button")
              .addClass("btn btn-primary btn-sm")
              .attr("data-bs-toggle", "modal")
              .attr("data-bs-target", "#deletePersonnelModal")
              .attr("data-id", this.id)
              .append($("<i>").addClass("fa-solid fa-trash fa-fw"))
          )
      )
    );
  });
}

function renderDepartmentRows(rows) {
  $("#departmentTableBody").html("");

  $.each(rows, function () {
    $("#departmentTableBody").append(
      $("<tr>").append(
        $("<td>")
          .addClass("align-middle text-nowrap")
          .text(this.name ?? ""),

        $("<td>")
          .addClass("align-middle text-nowrap d-none d-md-table-cell")
          .text(this.location ?? ""),

        $("<td>")
          .addClass("align-middle text-end text-nowrap")
          .append(
            $("<button>")
              .attr("type", "button")
              .addClass("btn btn-primary btn-sm me-1")
              .attr("data-bs-toggle", "modal")
              .attr("data-bs-target", "#editDepartmentModal")
              .attr("data-id", this.id)
              .append($("<i>").addClass("fa-solid fa-pencil fa-fw")),

            $("<button>")
              .attr("type", "button")
              .addClass("btn btn-primary btn-sm")
              .attr("data-bs-toggle", "modal")
              .attr("data-bs-target", "#deleteDepartmentModal")
              .attr("data-id", this.id)
              .append($("<i>").addClass("fa-solid fa-trash fa-fw"))
          )
      )
    );
  });
}

function renderLocationRows(rows) {
  $("#locationTableBody").html("");

  $.each(rows, function () {
    $("#locationTableBody").append(
      $("<tr>").append(
        $("<td>")
          .addClass("align-middle text-nowrap")
          .text(this.name ?? ""),

        $("<td>")
          .addClass("align-middle text-end text-nowrap")
          .append(
            $("<button>")
              .attr("type", "button")
              .addClass("btn btn-primary btn-sm me-1")
              .attr("data-bs-toggle", "modal")
              .attr("data-bs-target", "#editLocationModal")
              .attr("data-id", this.id)
              .append($("<i>").addClass("fa-solid fa-pencil fa-fw")),

            $("<button>")
              .attr("type", "button")
              .addClass("btn btn-primary btn-sm")
              .attr("data-bs-toggle", "modal")
              .attr("data-bs-target", "#deleteLocationModal")
              .attr("data-id", this.id)
              .append($("<i>").addClass("fa-solid fa-trash fa-fw"))
          )
      )
    );
  });
}

// ===============================
// LOAD TABLES
// ===============================
function refreshPersonnelTable() {
  const isFiltered = activeDepartmentFilter > 0 || activeLocationFilter > 0;

  $.ajax({
    url: ENDPOINTS.getAll,
    type: "GET",
    dataType: "json",
    data: isFiltered
      ? { departmentID: activeDepartmentFilter, locationID: activeLocationFilter }
      : {},
    success: function (result) {
      if (result.status.code == 200) {
        renderPersonnelRows(result.data);
      } else {
        console.log("Error loading personnel table", result);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("Personnel AJAX error:", textStatus, errorThrown);
    }
  });
}

function refreshDepartmentTable() {
  $.ajax({
    url: ENDPOINTS.getAllDepartments,
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        renderDepartmentRows(result.data);
      } else {
        console.log("Error loading departments table", result);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("Departments AJAX error:", textStatus, errorThrown);
    }
  });
}

function refreshLocationTable() {
  $.ajax({
    url: ENDPOINTS.getAllLocations,
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        renderLocationRows(result.data);
      } else {
        console.log("Error loading locations table", result);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("Locations AJAX error:", textStatus, errorThrown);
    }
  });
}

// ===============================
// SEARCH (All tabs)
// ===============================
function searchPersonnel(txt) {
  $.ajax({
    url: ENDPOINTS.searchAll,
    type: "POST",
    dataType: "json",
    data: { txt },
    success: function (result) {
      if (result.status.code == 200) {
        let rows = [];
        if (Array.isArray(result.data)) rows = result.data;
        else if (result.data && Array.isArray(result.data.found)) rows = result.data.found;

        // normalize keys
        rows = rows.map(r => ({
          id: r.id,
          firstName: r.firstName,
          lastName: r.lastName,
          email: r.email,
          jobTitle: r.jobTitle,
          departmentID: r.departmentID,
          department: r.department ?? r.departmentName ?? "",
          location: r.location ?? r.locationName ?? ""
        }));

        renderPersonnelRows(rows);
      } else {
        console.log("Search personnel error:", result);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("Search personnel AJAX error:", textStatus, errorThrown);
    }
  });
}

function searchDepartments(txt) {
  $.ajax({
    url: ENDPOINTS.getAllDepartments,
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        const filtered = result.data.filter(d =>
          includesText(d.name, txt) || includesText(d.location, txt)
        );
        renderDepartmentRows(filtered);
      }
    }
  });
}

function searchLocations(txt) {
  $.ajax({
    url: ENDPOINTS.getAllLocations,
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        const filtered = result.data.filter(l => includesText(l.name, txt));
        renderLocationRows(filtered);
      }
    }
  });
}

function refreshActiveTabList() {
  if ($("#personnelBtn").hasClass("active")) refreshPersonnelTable();
  else if ($("#departmentsBtn").hasClass("active")) refreshDepartmentTable();
  else if ($("#locationsBtn").hasClass("active")) refreshLocationTable();
}

function runSearchForActiveTab(searchText) {
  if ($("#personnelBtn").hasClass("active")) searchPersonnel(searchText);
  else if ($("#departmentsBtn").hasClass("active")) searchDepartments(searchText);
  else if ($("#locationsBtn").hasClass("active")) searchLocations(searchText);
}

$("#searchInp").on("keyup", function () {
  const searchText = $("#searchInp").val().trim();

  if (searchText.length === 0) {
    refreshActiveTabList();
    return;
  }

  runSearchForActiveTab(searchText);
});

// ===============================
// REFRESH BUTTON (cycle icon)
// - clears search
// - resets personnel filters if active
// ===============================
$("#refreshBtn").on("click", function () {
  const searchText = $("#searchInp").val().trim();
  const onPersonnelTab = $("#personnelBtn").hasClass("active");
  const filtersActive = activeDepartmentFilter > 0 || activeLocationFilter > 0;

  if (searchText.length > 0) {
    $("#searchInp").val("");

    if (onPersonnelTab && filtersActive) {
      resetPersonnelFilters();
    }

    refreshActiveTabList();
    $("#searchInp").trigger("focus");
    return;
  }

  if (onPersonnelTab && filtersActive) {
    resetPersonnelFilters();
    refreshPersonnelTable();
    $("#searchInp").trigger("focus");
    return;
  }

  refreshActiveTabList();
});

// ===============================
// TAB BUTTONS
// ===============================
$("#personnelBtn").on("click", function () {
  $("#searchInp").val("");
  refreshPersonnelTable();
});

$("#departmentsBtn").on("click", function () {
  $("#searchInp").val("");
  refreshDepartmentTable();
});

$("#locationsBtn").on("click", function () {
  $("#searchInp").val("");
  refreshLocationTable();
});

// ===============================
// FILTER (Personnel only)
// ===============================
$("#filterBtn").on("click", function () {
  if (!$("#personnelBtn").hasClass("active")) return;
  showModalById("filterPersonnelModal");
});

$("#filterPersonnelModal").on("show.bs.modal", function () {
  $("#filterDepartment").html('<option value="0">All Departments</option>');
  $("#filterLocation").html('<option value="0">All Locations</option>');

  $.ajax({
    url: ENDPOINTS.getAllDepartments,
    type: "GET",
    dataType: "json",
    success: function (deptResult) {
      if (deptResult.status.code == 200) {
        $.each(deptResult.data, function () {
          $("#filterDepartment").append(
            $("<option>", { value: this.id, text: this.name })
          );
        });
        $("#filterDepartment").val(String(activeDepartmentFilter));
      }
    }
  });

  $.ajax({
    url: ENDPOINTS.getAllLocations,
    type: "GET",
    dataType: "json",
    success: function (locResult) {
      if (locResult.status.code == 200) {
        $.each(locResult.data, function () {
          $("#filterLocation").append(
            $("<option>", { value: this.id, text: this.name })
          );
        });
        $("#filterLocation").val(String(activeLocationFilter));
      }
    }
  });
});

$("#filterPersonnelForm").on("submit", function (e) {
  e.preventDefault();

  activeDepartmentFilter = parseInt($("#filterDepartment").val(), 10) || 0;
  activeLocationFilter = parseInt($("#filterLocation").val(), 10) || 0;

  hideModalById("filterPersonnelModal");
  $("#searchInp").val("");
  refreshPersonnelTable();
});

$("#clearFilterBtn").on("click", function () {
  resetPersonnelFilters();
  hideModalById("filterPersonnelModal");
  $("#searchInp").val("");
  refreshPersonnelTable();
});

// ===============================
// ADD BUTTON
// ===============================
$("#addBtn").on("click", function () {
  if ($("#personnelBtn").hasClass("active")) {
    $("#addPersonnelDepartment").html("");
    $.ajax({
      url: ENDPOINTS.getAllDepartments,
      type: "GET",
      dataType: "json",
      success: function (deptResult) {
        if (deptResult.status.code == 200) {
          $.each(deptResult.data, function () {
            $("#addPersonnelDepartment").append(
              $("<option>", { value: this.id, text: this.name })
            );
          });

          showModalById("addPersonnelModal");
          $("#addPersonnelFirstName").val("");
          $("#addPersonnelLastName").val("");
          $("#addPersonnelJobTitle").val("");
          $("#addPersonnelEmailAddress").val("");
          $("#addPersonnelFirstName").trigger("focus");
        } else {
          alert("Could not load departments");
        }
      },
      error: function () {
        alert("Could not load departments");
      }
    });
    return;
  }

  if ($("#departmentsBtn").hasClass("active")) {
    $("#addDepartmentLocation").html("");
    $.ajax({
      url: ENDPOINTS.getAllLocations,
      type: "GET",
      dataType: "json",
      success: function (locResult) {
        if (locResult.status.code == 200) {
          $.each(locResult.data, function () {
            $("#addDepartmentLocation").append(
              $("<option>", { value: this.id, text: this.name })
            );
          });

          showModalById("addDepartmentModal");
          $("#addDepartmentName").val("").trigger("focus");
        } else {
          alert("Could not load locations");
        }
      },
      error: function () {
        alert("Could not load locations");
      }
    });
    return;
  }

  if ($("#locationsBtn").hasClass("active")) {
    showModalById("addLocationModal");
    $("#addLocationName").val("").trigger("focus");
  }
});

// ===============================
// ADD DEPARTMENT
// ===============================
$("#addDepartmentForm").on("submit", function (e) {
  e.preventDefault();

  $.ajax({
    url: ENDPOINTS.insertDepartment,
    type: "POST",
    dataType: "json",
    data: {
      name: $("#addDepartmentName").val(),
      locationID: $("#addDepartmentLocation").val()
    },
    success: function (result) {
      if (result.status.code == 200) {
        refreshDepartmentTable();
        hideModalById("addDepartmentModal");
        $("#searchInp").trigger("focus");
      } else if (result.status.code == 409) {
        alert(result.status.description);
      } else {
        alert(result.status.description || "Insert failed");
      }
    },
    error: function () {
      alert("Insert failed");
    }
  });
});

// ===============================
// ADD PERSONNEL
// ===============================
$("#addPersonnelForm").on("submit", function (e) {
  e.preventDefault();

  $.ajax({
    url: ENDPOINTS.insertPersonnel,
    type: "POST",
    dataType: "json",
    data: {
      firstName: $("#addPersonnelFirstName").val(),
      lastName: $("#addPersonnelLastName").val(),
      jobTitle: $("#addPersonnelJobTitle").val(),
      email: $("#addPersonnelEmailAddress").val(),
      departmentID: $("#addPersonnelDepartment").val()
    },
    success: function (result) {
      if (result.status.code == 200) {
        refreshPersonnelTable();
        hideModalById("addPersonnelModal");
        $("#searchInp").trigger("focus");
      } else if (result.status.code == 409) {
        alert(result.status.description);
      } else {
        alert(result.status.description || "Insert failed");
      }
    },
    error: function () {
      alert("Insert failed");
    }
  });
});

// ===============================
// ADD LOCATION
// ===============================
$("#addLocationForm").on("submit", function (e) {
  e.preventDefault();

  $.ajax({
    url: ENDPOINTS.insertLocation,
    type: "POST",
    dataType: "json",
    data: { name: $("#addLocationName").val() },
    success: function (result) {
      if (result.status.code == 200) {
        refreshLocationTable();
        hideModalById("addLocationModal");
        $("#searchInp").trigger("focus");
      } else {
        alert(result.status.description || "Insert failed");
      }
    },
    error: function () {
      alert("Insert failed");
    }
  });
});

// ===============================
// EDIT/DELETE PERSONNEL
// ===============================
$("#editPersonnelModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: ENDPOINTS.getPersonnelByID,
    type: "POST",
    dataType: "json",
    data: { id: $(e.relatedTarget).attr("data-id") },
    success: function (result) {
      if (result.status.code == 200) {
        $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
        $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
        $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
        $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
        $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);

        $("#editPersonnelDepartment").html("");
        $.each(result.data.department, function () {
          $("#editPersonnelDepartment").append(
            $("<option>", { value: this.id, text: this.name })
          );
        });

        $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
      } else {
        $("#editPersonnelModal .modal-title").text("Error retrieving data");
      }
    },
    error: function () {
      $("#editPersonnelModal .modal-title").text("Error retrieving data");
    }
  });
});

$("#editPersonnelForm").on("submit", function (e) {
  e.preventDefault();

  $.ajax({
    url: ENDPOINTS.updatePersonnelByID,
    type: "POST",
    dataType: "json",
    data: {
      id: $("#editPersonnelEmployeeID").val(),
      firstName: $("#editPersonnelFirstName").val(),
      lastName: $("#editPersonnelLastName").val(),
      jobTitle: $("#editPersonnelJobTitle").val(),
      email: $("#editPersonnelEmailAddress").val(),
      departmentID: $("#editPersonnelDepartment").val()
    },
    success: function (result) {
      if (result.status.code == 200) {
        refreshPersonnelTable();
        hideModalById("editPersonnelModal");
        $("#searchInp").trigger("focus");
      } else {
        alert(result.status.description || "Save failed");
      }
    },
    error: function () {
      alert("Save failed");
    }
  });
});

$("#deletePersonnelModal").on("show.bs.modal", function (e) {
  $("#deletePersonnelEmployeeID").val($(e.relatedTarget).attr("data-id"));
});

$("#confirmDeletePersonnelBtn").on("click", function () {
  $.ajax({
    url: ENDPOINTS.deletePersonnelByID,
    type: "POST",
    dataType: "json",
    data: { id: $("#deletePersonnelEmployeeID").val() },
    success: function (result) {
      if (result.status.code == 200) {
        refreshPersonnelTable();
        hideModalById("deletePersonnelModal");
        $("#searchInp").trigger("focus");
      } else {
        alert(result.status.description || "Delete failed");
      }
    },
    error: function () {
      alert("Delete failed");
    }
  });
});

// ===============================
// EDIT DEPARTMENT (FIXES YOUR BLANK LOCATION DROPDOWN)
// ===============================
$("#editDepartmentModal").on("show.bs.modal", function (e) {
  const deptId = $(e.relatedTarget).attr("data-id");

  $("#editDepartmentID").val(deptId);
  $("#editDepartmentName").val("");
  $("#editDepartmentLocation").html("");

  // 1) get department (for name + locationID)
  $.ajax({
    url: ENDPOINTS.getDepartmentByID,
    type: "POST",
    dataType: "json",
    data: { id: deptId },
    success: function (deptResult) {
      // support either deptResult.data[0] OR deptResult.data.department[0] etc
      let dept = null;

      if (deptResult && Array.isArray(deptResult.data) && deptResult.data.length) {
        dept = deptResult.data[0];
      } else if (deptResult && deptResult.data && Array.isArray(deptResult.data.department) && deptResult.data.department.length) {
        dept = deptResult.data.department[0];
      }

      if (!dept) {
        $("#editDepartmentModal .modal-title").text("Error retrieving department");
        return;
      }

      $("#editDepartmentName").val(dept.name ?? "");

      const selectedLocationId = String(dept.locationID ?? dept.locationId ?? dept.location ?? "");

      // 2) load locations list into dropdown
      $.ajax({
        url: ENDPOINTS.getAllLocations,
        type: "GET",
        dataType: "json",
        success: function (locResult) {
          if (locResult.status.code == 200) {
            $("#editDepartmentLocation").html("");

            $.each(locResult.data, function () {
              $("#editDepartmentLocation").append(
                $("<option>", { value: this.id, text: this.name })
              );
            });

            // 3) set selected
            if (selectedLocationId) {
              $("#editDepartmentLocation").val(selectedLocationId);
            }

          } else {
            $("#editDepartmentModal .modal-title").text("Error retrieving locations");
          }
        },
        error: function () {
          $("#editDepartmentModal .modal-title").text("Error retrieving locations");
        }
      });
    },
    error: function () {
      $("#editDepartmentModal .modal-title").text("Error retrieving department");
    }
  });
});

// save department
$("#editDepartmentForm").on("submit", function (e) {
  e.preventDefault();

  $.ajax({
    url: ENDPOINTS.updateDepartmentByID,
    type: "POST",
    dataType: "json",
    data: {
      id: $("#editDepartmentID").val(),
      name: $("#editDepartmentName").val(),
      locationID: $("#editDepartmentLocation").val()
    },
    success: function (result) {
      if (result.status.code == 200) {
        refreshDepartmentTable();
        hideModalById("editDepartmentModal");
        $("#searchInp").trigger("focus");
      } else {
        alert(result.status.description || "Save failed");
      }
    },
    error: function () {
      alert("Save failed");
    }
  });
});

// ===============================
// DELETE DEPARTMENT (shows 409 message in modal)
// ===============================
$("#deleteDepartmentModal").on("show.bs.modal", function (e) {
  $("#deleteDepartmentID").val($(e.relatedTarget).attr("data-id"));
  $("#deleteDepartmentMessage").text("Are you sure you want to delete this department?");
});

$("#confirmDeleteDepartmentBtn").on("click", function () {
  $.ajax({
    url: ENDPOINTS.deleteDepartmentByID,
    type: "POST",
    dataType: "json",
    data: { id: $("#deleteDepartmentID").val() },
    success: function (result) {
      if (result.status.code == 200) {
        refreshDepartmentTable();
        hideModalById("deleteDepartmentModal");
        $("#searchInp").trigger("focus");
      } else if (result.status.code == 409) {
        $("#deleteDepartmentMessage").text(result.status.description);
      } else {
        alert(result.status.description || "Delete failed");
      }
    },
    error: function () {
      alert("Delete failed");
    }
  });
});

// ===============================
// EDIT LOCATION
// ===============================
$("#editLocationModal").on("show.bs.modal", function (e) {
  const locationId = $(e.relatedTarget).attr("data-id");

  $("#editLocationID").val(locationId);
  $("#editLocationName").val("");

  $.ajax({
    url: ENDPOINTS.getLocationByID,
    type: "GET",
    dataType: "json",
    data: { id: locationId },
    success: function (result) {
      if (result.status.code == 200 && Array.isArray(result.data) && result.data.length) {
        $("#editLocationName").val(result.data[0].name ?? "");
      } else {
        $("#editLocationModal .modal-title").text("Error retrieving location");
      }
    },
    error: function () {
      $("#editLocationModal .modal-title").text("Error retrieving location");
    }
  });
});

// save location
$("#editLocationForm").on("submit", function (e) {
  e.preventDefault();

  $.ajax({
    url: ENDPOINTS.updateLocationByID,
    type: "POST",
    dataType: "json",
    data: {
      id: $("#editLocationID").val(),
      name: $("#editLocationName").val()
    },
    success: function (result) {
      if (result.status.code == 200) {
        refreshLocationTable();
        hideModalById("editLocationModal");
        $("#searchInp").trigger("focus");
      } else {
        alert(result.status.description || "Save failed");
      }
    },
    error: function () {
      alert("Save failed");
    }
  });
});

// ===============================
// DELETE LOCATION (shows 409 message in modal)
// ===============================
$("#deleteLocationModal").on("show.bs.modal", function (e) {
  $("#deleteLocationID").val($(e.relatedTarget).attr("data-id"));
  $("#deleteLocationMessage").text("Are you sure you want to delete this location?");
});

$("#confirmDeleteLocationBtn").on("click", function () {
  $.ajax({
    url: ENDPOINTS.deleteLocationByID,
    type: "POST",
    dataType: "json",
    data: { id: $("#deleteLocationID").val() },
    success: function (result) {
      if (result.status.code == 200) {
        refreshLocationTable();
        hideModalById("deleteLocationModal");
        $("#searchInp").trigger("focus");
      } else if (result.status.code == 409) {
        $("#deleteLocationMessage").text(result.status.description);
      } else {
        alert(result.status.description || "Delete failed");
      }
    },
    error: function () {
      alert("Delete failed");
    }
  });
});

// ===============================
// INITIAL LOAD
// ===============================
$(document).ready(function () {
  refreshPersonnelTable();
});
