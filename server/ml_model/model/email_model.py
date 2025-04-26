import win32com.client

from transformers import BertTokenizer, BertForSequenceClassification
import torch
import pandas as pd
import joblib

load_directory = "D:/development/tracker_Web/server/ml_model/model/bert_intent_model"

tokenizer = BertTokenizer.from_pretrained(load_directory)

model = BertForSequenceClassification.from_pretrained(load_directory)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

vectorizer_p = joblib.load("D:/development/tracker_Web/server/ml_model/model/vectorizer.pkl")
model_p = joblib.load("D:/development/tracker_Web/server/ml_model/model/model.pkl")

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

def get_unred_message_without_priority():
    outlook = win32com.client.Dispatch("Outlook.Application").GetNamespace("MAPI")
    inbox = outlook.GetDefaultFolder(6)
    messages = inbox.Items
    unread_message = messages.Restrict("[Unread] = true")

    if (len(unread_message) == 0):
        return []
    data = []
    for message in unread_message:
        inten = predict_intent(message.Body)
        if inten == "calendar_set":
            data.append({
                "Subject": message.Subject,
                "Received Time": message.ReceivedTime.strftime("%Y-%m-%d %H:%M:%S"),
                "Sender Name": message.SenderName,
                "Body": message.Body
            })
    return data

a = get_unred_message_without_priority()
print(a)

def get_all_unread_message():
    inbox = outlook.GetDefaultFolder(6)
    messages = inbox.Items
    unread_message = messages #messages.Restrict("[Unread] = true")

    data = []

    for message in unread_message:
        inten = predict_intent(message.Body)
        if inten == "calendar_set":
            data.append({
                "Subject": message.Subject,
                "Received Time": message.ReceivedTime.strftime("%Y-%m-%d %H:%M:%S"),
                "Sender Name": message.SenderName,
                "Body": message.Body
            })
    df_messages = pd.DataFrame(data)

    if not df_messages.empty:
        sender_counts = df_messages["Sender Name"].value_counts()

        def assign_priority(row):
            sender_priority = 3  # Default priority
            if sender_counts[row["Sender Name"]] > 12:
                sender_priority = 0
            elif 2 <= sender_counts[row["Sender Name"]] <= 5:
                sender_priority = 1

            score = model_p.predict(vectorizer_p.transform([row["Body"]]))
            professionalism_score = score[0][0]
            tone_score = score[0][1]

            # Adjust priority based on scores
            if professionalism_score < 4 or tone_score < 4:
                sender_priority = max(sender_priority - 1, 0)  # Improve priority (lower value)
            elif professionalism_score > 8 and tone_score > 8:
                sender_priority = min(sender_priority + 1, 2)  # Decrease priority (higher value)

            return sender_priority

        df_messages["Priority"] = df_messages.apply(assign_priority, axis=1)

    print(df_messages)
    df_messages.to_csv("D:/development/tracker_Web/server/ml_model/data/unread_messages.csv")