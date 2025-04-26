from transformers import BertTokenizer, BertForSequenceClassification
import torch
import pandas as pd

load_directory = "ml_model/model/bert_intent_model"

tokenizer = BertTokenizer.from_pretrained(load_directory)

model = BertForSequenceClassification.from_pretrained(load_directory)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

df = pd.read_csv("D:/development/tracker_Web/server/ml_model/data/post_processed/processed_data.csv")

def predict_intent(text):
    model.eval()

    inputs = tokenizer(text, return_tensors="pt", padding="max_length", truncation=True, max_length=64)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    predicted_class = torch.argmax(logits, dim=1).item()

    if "labels" not in df.columns:
        raise KeyError("The 'labels' column is missing from the DataFrame.")

    if "intent" not in df.columns:
        print("⚠️ Warning: 'intent' column not found, using default labels.")
        df["intent"] = df["labels"].astype(str)

    intent_mapping = dict(zip(df["labels"].unique(), df["intent"].unique()))

    intent_label = intent_mapping.get(predicted_class, "Unknown Intent")

    return intent_label

print(predict_intent(""))