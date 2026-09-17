async function predictStock() {

    // --------------------------------
    // GET USER INPUT
    // --------------------------------

    const tickerInput =
        document.getElementById("ticker");

    const ticker =
        tickerInput.value.trim().toUpperCase();


    // --------------------------------
    // GET HTML ELEMENTS
    // --------------------------------

    const loading =
        document.getElementById("loading");

    const error =
        document.getElementById("error");

    const button =
        document.getElementById("predictButton");


    // --------------------------------
    // VALIDATE INPUT
    // --------------------------------

    if (ticker === "") {

        error.innerText =
            "Please enter a stock symbol.";

        return;

    }


    // --------------------------------
    // SHOW LOADING
    // --------------------------------

    loading.style.display = "block";

    error.innerText = "";

    button.disabled = true;

    button.innerText = "Predicting...";


    // Clear previous results

    document.getElementById(
        "stockName"
    ).innerText = "-";

    document.getElementById(
        "currentPrice"
    ).innerText = "-";

    document.getElementById(
        "predictedPrice"
    ).innerText = "-";

    document.getElementById(
        "percentageChange"
    ).innerText = "-";

    document.getElementById(
        "direction"
    ).innerText = "-";

    document.getElementById(
        "mae"
    ).innerText = "-";


    try {

        // --------------------------------
        // SEND REQUEST TO FLASK
        // --------------------------------

        const response = await fetch(
            "/predict",
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    ticker: ticker
                })

            }
        );


        // --------------------------------
        // GET JSON RESPONSE
        // --------------------------------

        const result =
            await response.json();


        // --------------------------------
        // CHECK ERROR
        // --------------------------------

        if (!response.ok) {

            throw new Error(
                result.error ||
                "Prediction failed."
            );

        }


        if (result.error) {

            throw new Error(
                result.error
            );

        }


        // --------------------------------
        // DISPLAY STOCK
        // --------------------------------

        document.getElementById(
            "stockName"
        ).innerText =
            result.ticker;


        // --------------------------------
        // DISPLAY CURRENT PRICE
        // --------------------------------

        document.getElementById(
            "currentPrice"
        ).innerText =
            "₹" +
            Number(
                result.current_price
            ).toFixed(2);


        // --------------------------------
        // DISPLAY PREDICTED PRICE
        // --------------------------------

        document.getElementById(
            "predictedPrice"
        ).innerText =
            "₹" +
            Number(
                result.predicted_price
            ).toFixed(2);


        // --------------------------------
        // DISPLAY PERCENTAGE
        // --------------------------------

        document.getElementById(
            "percentageChange"
        ).innerText =
            Number(
                result.percentage_change
            ).toFixed(2) +
            "%";


        // --------------------------------
        // DISPLAY DIRECTION
        // --------------------------------

        document.getElementById(
            "direction"
        ).innerText =
            result.direction;


        // --------------------------------
        // DISPLAY MODEL ERROR
        // --------------------------------

        document.getElementById(
            "mae"
        ).innerText =
            Number(
                result.mae
            ).toFixed(2);


        // --------------------------------
        // CONSOLE
        // --------------------------------

        console.log(
            "Stock:",
            result.ticker
        );

        console.log(
            "Current:",
            result.current_price
        );

        console.log(
            "Predicted:",
            result.predicted_price
        );

        console.log(
            "Direction:",
            result.direction
        );

        console.log(
            "MAE:",
            result.mae
        );

    }


    catch (err) {

        console.error(err);

        error.innerText =
            "Error: " +
            err.message;

    }


    finally {

        // --------------------------------
        // HIDE LOADING
        // --------------------------------

        loading.style.display = "none";

        button.disabled = false;

        button.innerText = "Predict";

    }

}
