// Create V1 to V28 input boxes

const featuresDiv = document.getElementById("features");

for (let i = 1; i <= 28; i++) {

    const label = document.createElement("label");
    label.innerText = "V" + i + ": ";

    const input = document.createElement("input");
    input.type = "number";
    input.id = "V" + i;
    input.step = "any";
    input.value = "0";

    const featureBox = document.createElement("div");

    featureBox.appendChild(label);
    featureBox.appendChild(input);

    featuresDiv.appendChild(featureBox);
}


// Check transaction

async function checkTransaction() {

    const button = document.querySelector("button");

    button.disabled = true;
    button.innerText = "Checking...";

    const amount = parseFloat(
        document.getElementById("Amount").value
    );

    const time = parseFloat(
        document.getElementById("Time").value
    );


    // Validate Amount

    if (isNaN(amount) || amount < 0) {

        document.getElementById("result").innerText =
            "Please enter a valid transaction amount.";

        button.disabled = false;
        button.innerText = "Check Transaction";

        return;
    }


    // Validate Time

    if (isNaN(time) || time < 0) {

        document.getElementById("result").innerText =
            "Please enter a valid transaction time.";

        button.disabled = false;
        button.innerText = "Check Transaction";

        return;
    }


    const data = {};


    // Get Time and Amount

    data["Time"] = time;
    data["Amount"] = amount;


    // Get V1 to V28

    for (let i = 1; i <= 28; i++) {

        const value =
            document.getElementById("V" + i).value;

        data["V" + i] = parseFloat(value);
    }


    console.log("Sending data:", data);


    // Show checking message

    document.getElementById("result").innerText =
        "Checking transaction...";


    try {

        // Send data to middleware

        const response = await fetch("https://fraud-detection-middleware.onrender.com/api/predict", 
            {
            
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );


        const result = await response.json();

        console.log("Prediction received:", result);


        // Check for error

        if (!response.ok) {

            document.getElementById("result").innerText =
                "Error: " +
                (result.error || "Prediction failed");

            button.disabled = false;
            button.innerText = "Check Transaction";

            return;
        }


        // Get result elements

        const resultBox =
            document.getElementById("result");

        const probabilityContainer =
            document.getElementById(
                "probability-container"
            );

        const probabilityText =
            document.getElementById(
                "probability-text"
            );

        const progress =
            document.getElementById("progress");

        const riskLevel =
            document.getElementById("risk-level");


        // Display prediction

        if (result.prediction === 1) {

            resultBox.innerHTML =
                "🚨 " + result.result;

        } else {

            resultBox.innerHTML =
                "✅ " + result.result;
        }


        // Enable button again

        button.disabled = false;
        button.innerText = "Check Transaction";


        // Show probability section

        probabilityContainer.style.display =
            "block";


        // Display probability

        probabilityText.innerText =
            result.fraud_probability + "%";
            saveTransactionHistory(
    time,
    amount,
    result.result,
    result.fraud_probability
);
showTransactionHistory();
updateStatistics();
// Clear transaction history

document.querySelector(".clear-history-btn").addEventListener("click", function () {

    localStorage.removeItem("transactionHistory");

    showTransactionHistory();

});


        // Update progress bar

        progress.style.width =
            result.fraud_probability + "%";


        // Determine risk level

        if (result.fraud_probability >= 70) {

            resultBox.style.backgroundColor =
                "#ffdddd";

            resultBox.style.color =
                "#cc0000";

            progress.style.backgroundColor =
                "#ef4444";

            riskLevel.innerText =
                "🔴 High Risk";

            riskLevel.style.color =
                "#cc0000";

        }

        else if (result.fraud_probability >= 30) {

            resultBox.style.backgroundColor =
                "#fff3cd";

            resultBox.style.color =
                "#b45309";

            progress.style.backgroundColor =
                "#f59e0b";

            riskLevel.innerText =
                "🟠 Medium Risk";

            riskLevel.style.color =
                "#b45309";

        }

        else {

            resultBox.style.backgroundColor =
                "#ddffdd";

            resultBox.style.color =
                "#008000";

            progress.style.backgroundColor =
                "#22c55e";

            riskLevel.innerText =
                "🟢 Low Risk";

            riskLevel.style.color =
                "#008000";
        }

    }


    catch (error) {

        console.error(
            "Connection error:",
            error
        );

        document.getElementById("result").innerText =
            "Error connecting to middleware.";

        button.disabled = false;
        button.innerText = "Check Transaction";
    }
}


// Reset form

function resetForm() {

    document.getElementById("Time").value = 0;

    document.getElementById("Amount").value = 100;


    // Reset V1 to V28

    for (let i = 1; i <= 28; i++) {

        document.getElementById(
            "V" + i
        ).value = 0;
    }


    // Clear result

    document.getElementById(
        "result"
    ).innerHTML = "";


    // Reset result styling

    document.getElementById(
        "result"
    ).style.backgroundColor =
        "#f2f2f2";

    document.getElementById(
        "result"
    ).style.color =
        "#000000";


    // Hide probability

    document.getElementById(
        "probability-container"
    ).style.display =
        "none";


    // Reset probability

    document.getElementById(
        "probability-text"
    ).innerText =
        "0%";


    // Reset progress bar

    document.getElementById(
        "progress"
    ).style.width =
        "0%";


    // Reset risk level

    document.getElementById(
        "risk-level"
    ).innerText =
        "";
}
// Save transaction history

function saveTransactionHistory(time, amount, result, probability) {

    let history =
        JSON.parse(localStorage.getItem("transactionHistory")) || [];

    history.unshift({
    checkedAt: new Date().toLocaleString(),
    time: time,
    amount: amount,
    result: result,
    probability: probability
});

    localStorage.setItem(
        "transactionHistory",
        JSON.stringify(history)
    );
}

// Show transaction history

function showTransactionHistory() {

    const historyList =
        document.getElementById("history-list");

    let history =
        JSON.parse(localStorage.getItem("transactionHistory")) || [];

    if (history.length === 0) {

        historyList.innerHTML =
            '<p class="no-history">No transactions checked yet.</p>';

        return;
    }

    historyList.innerHTML = "";

    history.forEach(function(transaction) {

        const item = document.createElement("div");

        item.className = "history-item";

       const isFraud = transaction.result === "Fraudulent Transaction";

item.innerHTML = `
    <p><strong>Checked:</strong> ${transaction.checkedAt || "Previously checked"}</p>
    <p><strong>Time:</strong> ${transaction.time}</p>
    <p><strong>Amount:</strong> ₹${transaction.amount}</p>
    <p>
        <strong>Result:</strong>
        <span class="${isFraud ? "fraud-status" : "safe-status"}">
            ${isFraud ? "🚨 " : "✅ "}${transaction.result}
        </span>
    </p>
    <p><strong>Fraud Probability:</strong> ${transaction.probability}%</p>
`;
        historyList.appendChild(item);
    });
}
showTransactionHistory();
updateStatistics();
// Update transaction statistics

function updateStatistics() {

    let history =
        JSON.parse(localStorage.getItem("transactionHistory")) || [];

    const total = history.length;

    const legitimate =
        history.filter(
            transaction =>
                transaction.result === "Legitimate Transaction"
        ).length;

    const fraudulent =
        history.filter(
            transaction =>
                transaction.result === "Fraudulent Transaction"
        ).length;

    let averageRisk = 0;

    if (total > 0) {

        const totalProbability =
            history.reduce(
                (sum, transaction) =>
                    sum + Number(transaction.probability),
                0
            );

        averageRisk =
            (totalProbability / total).toFixed(2);
    }

    document.getElementById("total-transactions").innerText =
        total;

    document.getElementById("legitimate-count").innerText =
        legitimate;

    document.getElementById("fraud-count").innerText =
        fraudulent;

    document.getElementById("average-risk").innerText =
        averageRisk + "%";
}