from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import spacy
import joblib
from google import genai
from main import predict_text_category
from intent import predict_intent
import win32com.client
from nltk.corpus import stopwords
import nltk
import re
import json
import pythoncom 
app = Flask(__name__)
CORS(app)

try:
    client = MongoClient("mongodb+srv://binitlenka:gxQ0UbxvgpfayVLo@blogin.lg79k.mongodb.net/?retryWrites=true&w=majority&appName=Blogin")
    db = client["ai_twin"]
    professionalism_collection = db["professionalism"]
    analysis_collection = db["text_analysis"]
    schedules_collection = db["schedules"]
    print("Database connected successfully!")
except Exception as e:
    print(f"Failed to connect to database: {e}")

vectorizer = joblib.load("ml_model/model/vectorizer.pkl")
model = joblib.load("ml_model/model/model.pkl")
nlp = spacy.load('en_core_web_md')
client2 = genai.Client(api_key="AIzaSyA-7uhf0jyKdHUktvZ-IBYlQaKv-RTgHz0")

@app.route("/")
def home():
    return jsonify({"response" : "Hello"})

@app.route("/api/get_response", methods=["POST"])
def get_response():
    data = request.json['text']
    score = model.predict(vectorizer.transform([data]))

    professionalism_data = list(professionalism_collection.find({}, {"p_score": 1, "t_score": 1, "_id": 0}))
    if professionalism_data:
        avg_p_score = sum(entry["p_score"] for entry in professionalism_data) / len(professionalism_data)
        avg_t_score = sum(entry["t_score"] for entry in professionalism_data) / len(professionalism_data)
    else:
        avg_p_score, avg_t_score = int(score[0][0]), int(score[0][1])  # Default to current scores if no data exists

    question = f"""
    "You are Adam, an AI designed to mimic the user's communication style. Your primary goal is to generate a response to the following text message while matching the user's personality and tone. Their style is rated as follows:

    Professionalism: {int(avg_p_score)} (1 = Highly Professional, 10 = Highly Casual)

    Tone: {int(avg_t_score)} (1 = Formal, 10 = Playful/Friendly)

    Respond to this message in the same manner the user would:
    Message: {data}

    Directly output the response without any formatting or explanations, as it will be displayed to the user."
    """

    response = client2.models.generate_content(
        model="gemini-2.0-flash", contents=question
    )

    store_professionalism(int(score[0][0]), int(score[0][1]))
    store_analysis(data)
    intent = predict_intent(data)

    return jsonify({"response": response.text, "intent" : intent})   
    
@app.route("/api/professionalism-score", methods=["POST"])
def get_professionalism_score():
    data = request.json['text']
    print(data)
    inpt = vectorizer.transform([data])
    ans = model.predict(inpt)
    return jsonify({"professionalism": int(ans[0][0]), "tone": int(ans[0][1])})

nltk.download('stopwords')
stop_words = set(stopwords.words('english'))
def clean_text(text):
    text = text.lower()  # Lowercasing
    text = re.sub(r'\r\n', ' ', text)  # Remove newlines
    text = re.sub(r'[^a-zA-Z\s]', '', text)  # Remove special characters
    text = ' '.join(word for word in text.split() if word not in stop_words)  # Remove stopwords
    return text

@app.route("/api/email-read-query", methods=["POST"])
def get_email_details():
    pythoncom.CoInitialize()  # Initialize COM
    try:
        outlook = win32com.client.Dispatch("Outlook.Application").GetNamespace("MAPI")
        inbox = outlook.GetDefaultFolder(6)
        messages = inbox.Items
        unread_message = messages.Restrict("[Unread] = true")

        if len(unread_message) == 0:
            return jsonify({"emails": []})

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
        print(data)
        response = [extract_event_details(d["Body"]) for d in data]

        return jsonify({"emails": response})

    finally:
        pythoncom.CoUninitialize()  # Uninitialize COM after use

@app.route('/api/predict-text-category', methods=['POST'])
def predict_text_category_route():
    data = request.json['text']
    predicted_probs = predict_text_category(data)
    converted_probs = {str(k): float(v) for k, v in predicted_probs.items()}
    return jsonify({"category": converted_probs})

@app.route("/api/text-analysis", methods=["GET"])
def get_text_analysis():
    data = request.json['text']
    doc = nlp(data)
    entity_dict = {entity.text: entity.label_ for entity in doc.ents}
    return jsonify({"analysis": entity_dict})

def store_professionalism(p_score, t_score):
    existing_entry = professionalism_collection.find_one({
        "p_score": p_score,
        "t_score": t_score
    })

    if existing_entry:
        professionalism_collection.update_one(
            {"_id": existing_entry["_id"]},
            {"$inc": {"count": 1}}
        )
        return jsonify({"message": "Professionalism score updated successfully."})
    else:
        data = {
            "p_score": p_score,
            "t_score": t_score,
            "count": 1
        }
        professionalism_collection.insert_one(data)
        return jsonify({"message": "Professionalism score stored successfully."})

def store_analysis(text):

    if not text:
        return jsonify({"error": "Text is required"}), 400

    doc = nlp(text)
    
    for entity in doc.ents:
        word = entity.text
        entity_type = entity.label_
        print(word, entity_type)

        existing_entry = analysis_collection.find_one({"Word": word, "Entity": entity_type})

        if existing_entry:
            analysis_collection.update_one(
                {"_id": existing_entry["_id"]},
                {"$inc": {"Frequency": 1}}
            )
        else:
            new_id = analysis_collection.count_documents({}) + 1
            analysis_collection.insert_one({
                "id": new_id,
                "Word": word,
                "Entity": entity_type,
                "Frequency": 1
            })

    return jsonify({"message": "Analysis stored successfully."})

@app.route("/api/analysis/<id>", methods=["PUT"])
def update_analysis(id):
    data = request.json
    analysis_collection.update_one({"_id": id}, {"$set": data})
    return jsonify({"message": "Analysis updated successfully."})

@app.route("/api/schedules", methods=["POST"])
def store_schedule():
    data = request.json
    schedules_collection.insert_one(data)
    return jsonify({"message": "Schedule stored successfully."})

@app.route("/api/schedules/<id>", methods=["PUT"])
def update_schedule(id):
    data = request.json
    schedules_collection.update_one({"_id": id}, {"$set": data})
    return jsonify({"message": "Schedule updated successfully."})

def extract_event_details(data):
    prompt = f"""
    Extract the following details from the given email:

    - **start_date**: The first mentioned date in the email. If multiple dates are present, return the earliest one in the format **MM/DD/YYYY**. If no date is found, return `"Not specified"`.
    - **deadline**: The last mentioned date in the email. If multiple dates are present, return the latest one in the format **MM/DD/YYYY**. If no deadline is found, return `"Not specified"`.
    - **topic**: The main topic or subject of the email.
    - **venue**: The location of the event if mentioned. If not found, return `"Not specified"`.
    - **time**: The time of the event if mentioned. If not found, return `"Not specified"`.

    ### Email Content:
    \"""  
    {data}  
    \"""  

    Provide the extracted details in **valid JSON format** with the following keys:  
    """
    
    response = client2.models.generate_content(
        model="gemini-2.0-flash", contents=prompt
    )
    
    try:
        extracted_data = json.loads((response.text.strip("```json\n\`")).strip("```").strip("`"))
        print(extracted_data)
    except json.JSONDecodeError:
        print(response.text)
        return jsonify({"error": "Invalid JSON response from AI"}), 500
    
    return {
        "date": extracted_data.get("start_date", "Not specified"),
        "topic": extracted_data.get("topic", "Not specified"),
        "venue": extracted_data.get("venue", "Not specified"),
        "time": extracted_data.get("time", "Not specified")
    }


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
