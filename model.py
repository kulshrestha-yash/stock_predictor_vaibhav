import yfinance as yf
import pandas as pd

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error


def train_model(ticker):

    print("Downloading data for:", ticker)

    data = yf.download(
        ticker,
        period="5y",
        interval="1d",
        auto_adjust=True,
        progress=False
    )

    # Check data
    if data.empty:
        raise ValueError(
            "No stock data found. Check the ticker symbol."
        )

    # Sometimes yfinance can return MultiIndex columns
    if isinstance(data.columns, pd.MultiIndex):
        data.columns = data.columns.get_level_values(0)

    # Required columns
    features = [
        "Open",
        "High",
        "Low",
        "Close",
        "Volume"
    ]

    # Check columns
    for column in features:
        if column not in data.columns:
            raise ValueError(
                f"Missing column: {column}"
            )
    data = data[features].dropna()

    # Target:
    # Tomorrow's closing price
    data["Target"] = data["Close"].shift(-1)

    # Remove final row because it has no tomorrow price
    data = data.dropna()

    # Features
    X = data[features]

    # Target
    y = data["Target"]


    split = int(len(data) * 0.8)

    X_train = X.iloc[:split]
    X_test = X.iloc[split:]

    y_train = y.iloc[:split]
    y_test = y.iloc[split:]

    print("Training rows:", len(X_train))
    print("Testing rows:", len(X_test))


    model = RandomForestRegressor(
        n_estimators=200,
        random_state=42,
        n_jobs=-1
    )

    # Train model
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mae = mean_absolute_error(
        y_test,
        predictions
    )

    print("Model MAE:", round(mae, 2))

    # --------------------------------
    # PREDICT NEXT DAY
    # --------------------------------

    # Get the latest available row
    latest_data = X.iloc[[-1]]

    next_day_prediction = model.predict(
        latest_data
    )[0]

    # Latest closing price
    current_price = float(
        data["Close"].iloc[-1]
    )

    # Calculate percentage change
    percentage_change = (
        (next_day_prediction - current_price)
        / current_price
    ) * 100

    # Direction
    if next_day_prediction > current_price:
        direction = "UP"
    else:
        direction = "DOWN"

    return {
        "ticker": ticker,
        "current_price": current_price,
        "predicted_price": float(
            next_day_prediction
        ),
        "percentage_change": float(
            percentage_change
        ),
        "direction": direction,
        "mae": float(mae)
    }
