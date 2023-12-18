$(document).ready(function () {
  let currentStep = 1;
  let formData = {};

  // Next/Submit Button Click
  $("#actionBtn").click(function () {
    if (currentStep === 7) {
      if (validateCurrentStep()) {
        saveFormData(currentStep);
        console.log("Form Data:", formData);
        alert("Form submitted!");
        // Reset the form and set the step back to 1
        $("#multiStepModal form").trigger("reset");
        formData = {};
        currentStep = 1;
        $("#step1").addClass("active").show();
        loadFormData(currentStep);
        updateButtons();
        $("#multiStepModal").modal("hide");
      }
    } else {
      if (validateCurrentStep()) {
        saveFormData(currentStep);
        $("#step" + currentStep)
          .removeClass("active")
          .hide();
        currentStep++;
        $("#step" + currentStep)
          .addClass("active")
          .show();
        loadFormData(currentStep);
        updateButtons();
      }
    }
  });

  // validate current step's required fields
  function validateCurrentStep() {
    var isValid = true;
    var requiredFields = $("#formStep" + currentStep + " [required]");

    requiredFields.each(function () {
      if (!$(this).val()) {
        $(this).addClass("required-field");
        $(this).prev().addClass("required-label");
        isValid = false;
        return false;
      } else {
        $(this).removeClass("required-field");
        $(this).prev().removeClass("required-label");
      }
    });
    return isValid;
  }

  // Back Button Click
  $("#backBtn").click(function () {
    saveFormData(currentStep);
    $("#step" + currentStep)
      .removeClass("active")
      .hide();
    currentStep--;
    $("#step" + currentStep)
      .addClass("active")
      .show();
    loadFormData(currentStep);
    updateButtons();
  });

  // Step Indicator Click
  $(".step").click(function () {
    let clickedStep = parseInt($(this).attr("data-step"));
    if (validateSteps(clickedStep)) {
      if (clickedStep === currentStep + 1) {
        saveFormData(currentStep);
        $("#step" + currentStep)
          .removeClass("active")
          .hide();
        currentStep = clickedStep;
        $("#step" + currentStep)
          .addClass("active")
          .show();
        loadFormData(currentStep);
        updateButtons();
      } else if (clickedStep < currentStep) {
        saveFormData(currentStep);
        $("#step" + currentStep)
          .removeClass("active")
          .hide();
        currentStep = clickedStep;
        $("#step" + currentStep)
          .addClass("active")
          .show();
        loadFormData(currentStep);
        updateButtons();
      }
    }
  });

  // validate all previous steps
  function validateSteps(targetStep) {
    let isValid = true;
    for (let i = 1; i < targetStep; i++) {
      if (!validateStep(i)) {
        isValid = false;
        break;
      }
    }
    return isValid;
  }

  // validate individual step
  function validateStep(step) {
    let isValid = true;
    var requiredFields = $("#formStep" + step + " [required]");

    requiredFields.each(function () {
      if (!$(this).val()) {
        $(this).addClass("required-field");
        $(this).prev().addClass("required-label");
        isValid = false;
        return false;
      } else {
        $(this).removeClass("required-field");
        $(this).prev().removeClass("required-label");
      }
    });

    return isValid;
  }

  // Show Modal Event
  $("#multiStepModal").on("shown.bs.modal", function () {
    updateButtons();
  });

  // Update Button States
  function updateButtons() {
    if (currentStep === 7) {
      $("#actionBtn").text("Submit");
    } else {
      $("#actionBtn").text("Next");
    }

    $("#backBtn").prop("disabled", currentStep === 1);
    $(".step").removeClass("active complete");

    for (let i = 1; i < currentStep; i++) {
      $(".step[data-step='" + i + "']").addClass("complete");
    }

    $(".step[data-step='" + currentStep + "']").addClass("active");

    // Set image color based on the step status
    $(".step").each(function (index, element) {
      let stepNumber = $(element).attr("data-step");
      let stepColor = $(element).css("color");
      let backgroundColor = stepColor;
      let arrowColor = stepColor;

      if ($(element).hasClass("complete")) {
        backgroundColor = "green";
        arrowColor = "green";
      } else if ($(element).hasClass("active")) {
        backgroundColor = "red";
        arrowColor = "red";
      }

      // Set background color for the icon
      $(".step[data-step='" + stepNumber + "'] img").css(
        "background-color",
        backgroundColor
      );

      // Set color for the angle-right icon
      $(".step[data-step='" + stepNumber + "']")
        .next()
        .find("i")
        .css("color", arrowColor);
    });
  }

  // Save Form Data
  function saveFormData(step) {
    formData["step" + step] = {};
    $("#formStep" + step)
      .serializeArray()
      .forEach(function (field) {
        formData["step" + step][field.name] = field.value;
      });
  }

  // Load Form Data
  function loadFormData(step) {
    if (formData["step" + step]) {
      Object.entries(formData["step" + step]).forEach(function ([name, value]) {
        $("#formStep" + step)
          .find('[name="' + name + '"]')
          .val(value);
      });
    }
  }
});
