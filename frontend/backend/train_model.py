import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import joblib

# Load dataset
data = pd.read_csv("data/creditcard.csv")

print("Dataset loaded successfully!")
print("Dataset shape:", data.shape)

# Separate input features and target
X = data.drop("Class", axis=1)
y = data["Class"]

# Scale the Amount column
scaler = StandardScaler()
X["Amount"] = scaler.fit_transform(X[["Amount"]])

# Split dataset into training and testing data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Create the model
model = LogisticRegression(
    max_iter=1000,
    class_weight="balanced"
)

# Train the model
print("Training model...")
model.fit(X_train, y_train)

# Test the model
y_pred = model.predict(X_test)

# Display results
print("\nModel Evaluation:")
print(classification_report(y_test, y_pred))

# Save the model and scaler
joblib.dump(model, "fraud_model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("\nModel saved successfully!")
print("Created: fraud_model.pkl")
print("Created: scaler.pkl")