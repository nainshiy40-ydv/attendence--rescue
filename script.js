// ==========================================
// ATTENDANCE RESCUE
// JavaScript Attendance Planner
// Target Attendance = 75%
// ==========================================


// Main function
function calculateAttendance() {

    // Get values entered by the user
    let held = Number(document.getElementById("held").value);
    let attended = Number(document.getElementById("attended").value);


    // Get HTML elements that will display results
    let percentageText = document.getElementById("percentage");
    let status = document.getElementById("status");
    let message = document.getElementById("message");
    let progressBar = document.getElementById("progressBar");

    let classesNeededText = document.getElementById("classesNeeded");
    let currentPlanPercentage =
        document.getElementById("currentPlanPercentage");

    let futureResult = document.getElementById("futureResult");
    let skipResult = document.getElementById("skipResult");


    // ==========================================
    // VALIDATION
    // ==========================================

    // Check if fields are empty
    if (
        document.getElementById("held").value === "" ||
        document.getElementById("attended").value === ""
    ) {

        showError("Please enter both classes held and classes attended.");
        return;
    }


    // Classes cannot be negative
    if (held <= 0 || attended < 0) {

        showError("Please enter valid positive class values.");
        return;
    }


    // Classes must be whole numbers
    if (!Number.isInteger(held) || !Number.isInteger(attended)) {

        showError("Classes must be entered as whole numbers.");
        return;
    }


    // Attended cannot be greater than held
    if (attended > held) {

        showError(
            "Classes attended cannot be greater than total classes held."
        );

        return;
    }



    // ==========================================
    // CALCULATE ATTENDANCE PERCENTAGE
    // ==========================================

    let percentage = (attended / held) * 100;


    // Display percentage
    percentageText.innerHTML =
        percentage.toFixed(2) + "%";


    // Update recovery percentage
    currentPlanPercentage.innerHTML =
        percentage.toFixed(2) + "%";


    // Update progress bar
    progressBar.style.width =
        Math.min(percentage, 100) + "%";



    // ==========================================
    // CASE 1: EXCELLENT ATTENDANCE
    // 85% OR ABOVE
    // ==========================================

    if (percentage >= 85) {

        status.innerHTML =
            "💚 Excellent";

        message.innerHTML =
            "Your attendance is comfortably above the 75% requirement.";

        status.style.color = "#4ade80";
        percentageText.style.color = "#4ade80";


        // No recovery classes required
        classesNeededText.innerHTML = "0";

        futureResult.innerHTML =
            "No recovery needed — you have already crossed the 75% target.";


        // Calculate how many future classes can be missed
        calculateSkippableClasses(held, attended);

    }



    // ==========================================
    // CASE 2: SAFE ZONE
    // 75% TO 84.99%
    // ==========================================

    else if (percentage >= 75) {

        status.innerHTML =
            "🟢 Safe Zone";

        message.innerHTML =
            "Great! You have reached the required 75% attendance target.";

        status.style.color = "#4ade80";
        percentageText.style.color = "#4ade80";


        // No recovery required
        classesNeededText.innerHTML = "0";

        futureResult.innerHTML =
            "Target achieved! No additional recovery classes are required.";


        // Calculate classes student can miss
        calculateSkippableClasses(held, attended);

    }



    // ==========================================
    // CASE 3: RECOVERY ZONE
    // 65% TO BELOW 75%
    // ==========================================

    else if (percentage >= 65) {

        status.innerHTML =
            "🟡 Recovery Zone";

        message.innerHTML =
            "You're close to 75%. A short attendance recovery streak can get you there.";

        status.style.color = "#facc15";
        percentageText.style.color = "#facc15";


        calculateRecovery(
            held,
            attended,
            percentage
        );

    }



    // ==========================================
    // CASE 4: CRITICAL ATTENDANCE
    // BELOW 65%
    // ==========================================

    else {

        status.innerHTML =
            "🔴 Critical";

        message.innerHTML =
            "Your attendance is below the safe range. It's time for a recovery plan.";

        status.style.color = "#f87171";
        percentageText.style.color = "#f87171";


        calculateRecovery(
            held,
            attended,
            percentage
        );

    }

}



// ==========================================
// FUNCTION TO CALCULATE RECOVERY CLASSES
// ==========================================

function calculateRecovery(held, attended, percentage) {

    /*
        Formula:

        (attended + x) / (held + x) >= 0.75

        After solving:

        x >= (0.75 * held - attended) / 0.25
    */


    let exactClasses =
        (0.75 * held - attended) / 0.25;


    // Round UP because a student cannot
    // attend a fraction of a class
    let classesNeeded =
        Math.ceil(exactClasses);


    // Display number of classes needed
    document.getElementById("classesNeeded").innerHTML =
        classesNeeded;


    // Display current percentage
    document.getElementById("currentPlanPercentage").innerHTML =
        percentage.toFixed(2) + "%";


    // Calculate future totals
    let futureHeld =
        held + classesNeeded;

    let futureAttended =
        attended + classesNeeded;

    let futurePercentage =
        (futureAttended / futureHeld) * 100;


    // Display recovery explanation
    document.getElementById("futureResult").innerHTML =

        "Attend the next <strong>" +
        classesNeeded +
        " classes</strong> consecutively. " +

        "Your attendance will become <strong>" +
        futureAttended +
        " out of " +
        futureHeld +
        "</strong> classes (" +
        futurePercentage.toFixed(2) +
        "%).";


    // Student cannot skip classes while below target
    document.getElementById("skipResult").innerHTML =

        "⚠️ You're currently below 75%. Focus on the recovery plan before skipping classes.";

}



// ==========================================
// EXTRA FEATURE:
// CALCULATE HOW MANY CLASSES CAN BE MISSED
// ==========================================

function calculateSkippableClasses(held, attended) {

    /*
        If the student skips x future classes:

        attended / (held + x) >= 0.75

        x <= attended / 0.75 - held
    */


    let canSkip =
        Math.floor((attended / 0.75) - held);


    // Prevent negative results
    if (canSkip < 0) {

        canSkip = 0;

    }


    // Display result
    if (canSkip === 0) {

        document.getElementById("skipResult").innerHTML =

            "⚠️ You're at the safe limit. Missing the next class could drop your attendance below 75%.";

    }

    else if (canSkip === 1) {

        document.getElementById("skipResult").innerHTML =

            "😎 You could miss <strong>1 upcoming class</strong> and still remain at or above 75%.";

    }

    else {

        document.getElementById("skipResult").innerHTML =

            "😎 You could miss up to <strong>" +
            canSkip +
            " upcoming classes</strong> and still remain at or above 75%.";

    }

}



// ==========================================
// ERROR HANDLING FUNCTION
// ==========================================

function showError(errorMessage) {

    // Main result
    document.getElementById("percentage").innerHTML =
        "ERROR";

    document.getElementById("percentage").style.color =
        "#f87171";


    document.getElementById("status").innerHTML =
        "❌ Invalid Entry";

    document.getElementById("status").style.color =
        "#f87171";


    document.getElementById("message").innerHTML =
        errorMessage;


    // Reset progress bar
    document.getElementById("progressBar").style.width =
        "0%";


    // Reset recovery plan
    document.getElementById("classesNeeded").innerHTML =
        "--";

    document.getElementById("currentPlanPercentage").innerHTML =
        "--%";

    document.getElementById("futureResult").innerHTML =
        "Correct the values above to generate your recovery plan.";


    // Reset skip planner
    document.getElementById("skipResult").innerHTML =
        "Enter valid attendance data to use this feature.";

}



// ==========================================
// REQUIRED ASSIGNMENT TEST CASES
// ==========================================


// TEST CASE 1
// Student below target

function testBelow() {

    document.getElementById("held").value = 40;

    document.getElementById("attended").value = 25;

    calculateAttendance();

    // Scroll to result
    document.getElementById("resultCard").scrollIntoView({
        behavior: "smooth"
    });

}



// TEST CASE 2
// Student exactly at 75%

function testTarget() {

    document.getElementById("held").value = 40;

    document.getElementById("attended").value = 30;

    calculateAttendance();

    document.getElementById("resultCard").scrollIntoView({
        behavior: "smooth"
    });

}



// TEST CASE 3
// Invalid attendance entry

function testInvalid() {

    document.getElementById("held").value = 40;

    document.getElementById("attended").value = 45;

    calculateAttendance();

    document.getElementById("resultCard").scrollIntoView({
        behavior: "smooth"
    });

}