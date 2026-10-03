from schemas.ai_prediction import AIRequest, AIResponse
import re

# Keywords and phrases for dynamic matching
RESPIRATORY_MAP = {
    "cough": 2, "coughing": 2, "persistent cough": 3,
    "nasal discharge": 2, "runny nose": 2, "discharge": 1,
    "difficulty breathing": 3, "breathing difficulty": 3, "abnormal breathing": 2,
    "breathing": 2, "breath": 1, "respiratory": 2, "respiratory issue": 2,
    "sneezing": 2, "sneez": 2, "wheezing": 2, "wheez": 2
}

DIGESTIVE_MAP = {
    "vomiting": 2, "vomit": 2,
    "diarrhea": 2, "diarrhoea": 2, "loose motion": 2, "loose stool": 2,
    "colic": 3, "abdominal pain": 3, "bloat": 2, "indigestion": 2,
    "not eating": 2, "loss of appetite": 1, "reduced appetite": 1,
    "refusing feed": 2, "difficulty eating": 1, "eating slowly": 1,
    "abnormal droppings": 1, "reduced milk yield": 1, "reduced water intake": 1
}

MOBILITY_MAP = {
    "lameness": 3, "lame": 3, "limping": 3,
    "difficulty walking": 2, "abnormal movement": 2,
    "swollen joint": 2, "joint": 1, "hoof": 1, "leg": 1, "stiff": 1
}

INFECTION_MAP = {
    "fever": 2, "high temperature": 2, "temperature": 1,
    "lethargic": 1, "lethargy": 1, "weak": 1,
    "shivering": 1, "dull": 1, "swelling": 2, "weight loss": 1,
    "skin lesions": 2, "skin itching": 1, "hair loss": 1, "fluffed feathers": 1
}

BEHAVIOUR_MAP = {
    "very inactive": 2, "reduced activity": 1, "slightly reduced": 1,
    "not eating": 2, "reduced appetite": 1, "loss of appetite": 1,
    "refusing feed": 2, "difficulty eating": 1, "eating slowly": 1,
    "head down": 1, "isolation": 1, "restlessness": 1, "aggression": 1,
    "excessive vocalization": 1, "abnormal movement": 2
}

HEALTHY_PHRASES = [
    "no significant symptoms", "none", "healthy", "no symptoms", "normal",
    "no major concerns", "no concern", "all clear", "nil"
]


def clean_text(text: str) -> str:
    if not text:
        return ""
    return re.sub(r'[\s_]+', ' ', text.strip().lower())


def extract_matched(items: list, mapping: dict):
    score = 0
    matched = []
    for item in items:
        cleaned = clean_text(item)
        if not cleaned:
            continue
        for key, pts in mapping.items():
            if key in cleaned:
                score += pts
                matched.append(item.strip())
                break
    return score, matched


def assess_health(request: AIRequest) -> AIResponse:
    # 1. Parse symptoms
    raw_symptoms_str = f"{request.symptoms or ''} {request.symptomDescription or ''}"
    raw_symptoms = [s.strip() for s in (request.symptoms or "").split(",") if s.strip()]
    if request.symptomDescription and request.symptomDescription.strip():
        raw_symptoms.append(request.symptomDescription.strip())

    # 2. Parse behaviour
    behaviour_list = []
    if request.behaviourChanges:
        behaviour_list.extend([b.strip() for b in request.behaviourChanges.split(",") if b.strip()])
    if request.activityLevel and request.activityLevel.lower() not in ("normal", "none", "", "select activity level"):
        behaviour_list.append(request.activityLevel.strip())
    if request.appetite and request.appetite.lower() not in ("normal", "none", "", "select appetite"):
        behaviour_list.append(request.appetite.strip())
    if request.eatingBehaviour and request.eatingBehaviour.lower() not in ("normal", "none", "", "select eating behaviour"):
        behaviour_list.append(request.eatingBehaviour.strip())
    if request.otherBehaviour and request.otherBehaviour.lower() not in ("normal", "none", "", "select other behaviour"):
        behaviour_list.append(request.otherBehaviour.strip())

    # Deduplicate behaviour preserving case
    seen_beh = set()
    unique_behaviour = []
    for b in behaviour_list:
        norm = b.lower().strip()
        if norm and norm not in seen_beh:
            seen_beh.add(norm)
            unique_behaviour.append(b)
    behaviour_list = unique_behaviour

    # Check for healthy/no-symptom case
    is_healthy = False
    cleaned_all_symptoms = clean_text(raw_symptoms_str)
    has_no_reported_symptoms = (
        not raw_symptoms or
        any(hp == cleaned_all_symptoms for hp in HEALTHY_PHRASES) or
        (len(raw_symptoms) == 1 and any(hp in cleaned_all_symptoms for hp in HEALTHY_PHRASES))
    )
    if has_no_reported_symptoms and not behaviour_list and (request.temperature is None or request.temperature <= 39.2):
        is_healthy = True

    if is_healthy:
        animal_name = request.animalType or "animal"
        return AIResponse(
            riskLevel="LOW",
            predictedCondition="Healthy — No major concerns reported",
            severity="LOW",
            confidence=0.95,
            recommendations=[
                "Continue routine health and wellness monitoring.",
                "Maintain scheduled vaccinations and preventative deworming.",
                "Provide fresh drinking water and balanced, species-appropriate feed.",
                "Ensure clean, dry, and well-ventilated housing."
            ],
            veterinarianNeeded=False,
            matchedSymptoms=[],
            matchedBehaviourChanges=[],
            explanation=(
                f"No significant adverse symptoms or behavioural changes were detected for this {animal_name}. "
                "The reported health metrics are within normal parameters."
            ),
            disclaimer="This is an AI-assisted preliminary assessment and is not a definitive veterinary diagnosis."
        )

    # 3. Match across categories
    resp_score, resp_matched = extract_matched(raw_symptoms, RESPIRATORY_MAP)
    dig_score, dig_matched = extract_matched(raw_symptoms, DIGESTIVE_MAP)
    mob_score, mob_matched = extract_matched(raw_symptoms, MOBILITY_MAP)
    inf_score, inf_matched = extract_matched(raw_symptoms, INFECTION_MAP)

    # Match behaviour contributions (PART 12)
    beh_score, beh_matched = extract_matched(behaviour_list, BEHAVIOUR_MAP)
    # Behaviour also augments category scores
    beh_text = " ".join([b.lower() for b in behaviour_list])
    if any(k in beh_text for k in ["not eating", "reduced appetite", "refusing feed", "difficulty eating"]):
        dig_score += 2
    if any(k in beh_text for k in ["abnormal movement", "reluctance to move", "limp"]):
        mob_score += 2
    if any(k in beh_text for k in ["reduced activity", "very inactive", "lethargic", "head down"]):
        inf_score += 1

    # 4. Temperature contribution
    temp_score = 0
    temp_note = ""
    if request.temperature is not None:
        if request.temperature >= 40.5:
            temp_score = 3
            inf_score += 3
            temp_note = f"Severe High Temperature ({request.temperature}C)"
            raw_symptoms.append(temp_note)
        elif request.temperature >= 39.5:
            temp_score = 2
            inf_score += 2
            temp_note = f"High Temperature ({request.temperature}C)"
            raw_symptoms.append(temp_note)

    # If fever is present alongside respiratory signs, fever supports respiratory infection
    if resp_score > 0 and ("fever" in cleaned_all_symptoms or temp_score > 0):
        resp_score += 2

    # Total score calculation (PART 8)
    total_score = resp_score + dig_score + mob_score + inf_score + beh_score + temp_score

    # Determine dominant category: Specific organ symptoms take clinical precedence over generic systemic fever
    has_respiratory_signs = resp_score >= 2 and any(k in cleaned_all_symptoms for k in ["cough", "nasal", "breath", "wheez", "sneez"])
    has_digestive_signs = dig_score >= 2 and any(k in cleaned_all_symptoms or k in beh_text for k in ["vomit", "diarrhea", "diarrhoea", "loose", "colic"])
    has_mobility_signs = mob_score >= 2 and any(k in cleaned_all_symptoms for k in ["lame", "limp", "walk", "joint"])

    if has_respiratory_signs and (resp_score >= dig_score and resp_score >= mob_score):
        dominant_cat = "respiratory"
        max_cat_score = resp_score
    elif has_digestive_signs and (dig_score >= mob_score):
        dominant_cat = "digestive"
        max_cat_score = dig_score
    elif has_mobility_signs:
        dominant_cat = "mobility"
        max_cat_score = mob_score
    elif inf_score > 0:
        dominant_cat = "systemic"
        max_cat_score = inf_score
    else:
        scores = {
            "respiratory": resp_score,
            "digestive": dig_score,
            "mobility": mob_score,
            "systemic": inf_score
        }
        dominant_cat = max(scores, key=scores.get)
        max_cat_score = scores[dominant_cat]

    # Category conditions & recommendations (PART 7 & 10)
    if dominant_cat == "respiratory" and resp_score > 0:
        condition = "Possible Respiratory Infection"
        recommendations = [
            "Isolate the animal from the herd/flock in a warm, dry, well-ventilated space.",
            "Provide clean, fresh drinking water and palatable feed.",
            "Monitor body temperature and respiration rate twice daily.",
            "Maintain strict pen hygiene and reduce dust exposure.",
            "Consult a veterinarian promptly if coughing or fever persists/worsens."
        ]
    elif dominant_cat == "digestive" and dig_score > 0:
        condition = "Possible Digestive Disorder"
        recommendations = [
            "Provide fresh, clean water and electrolyte solution to prevent dehydration.",
            "Withhold solid feed temporarily if acute vomiting or severe diarrhea is present.",
            "Monitor stool consistency, frequency, and animal hydration status.",
            "Avoid sudden dietary transitions and check feed quality for mold/spoilage.",
            "Consult a veterinarian if symptoms persist beyond 24 hours."
        ]
    elif dominant_cat == "mobility" and mob_score > 0:
        condition = "Possible Musculoskeletal Problem"
        recommendations = [
            "Restrict strenuous movement and provide soft, dry, non-slip bedding.",
            "Inspect the affected limbs and hooves/paws for stones, cuts, or swelling.",
            "Avoid uneven or hard terrain during recovery.",
            "Consult a veterinarian if lameness or inability to bear weight persists beyond 24 hours."
        ]
    elif dominant_cat == "systemic" and inf_score > 0:
        condition = "Possible Systemic Infection or Fever"
        recommendations = [
            "Monitor rectal temperature every 4 to 6 hours.",
            "Keep the animal in a shaded, comfortable, stress-free environment.",
            "Provide clean drinking water with electrolytes if dehydrated.",
            "Seek veterinary consultation for diagnostic evaluation and targeted therapeutics."
        ]
    else:
        condition = "General Health Concern — Symptoms Observed"
        recommendations = [
            "Monitor vital signs and overall disposition closely.",
            "Ensure access to clean water, dry bedding, and balanced nutrition.",
            "Record symptom progression for veterinary review."
        ]

    # Risk level determination (PART 8)
    if total_score <= 3:
        risk = "LOW"
        severity = "LOW"
    elif total_score <= 7:
        risk = "MODERATE"
        severity = "MODERATE"
    elif total_score <= 18:
        risk = "HIGH"
        severity = "HIGH"
    else:
        risk = "CRITICAL"
        severity = "CRITICAL"

    if (request.temperature and request.temperature >= 41.0) and total_score >= 20:
        risk = "CRITICAL"
        severity = "CRITICAL"

    veterinarian_needed = risk in ("HIGH", "CRITICAL") or total_score >= 6

    # Dynamic confidence calculation (PART 9)
    # Scales dynamically with evidence count and score consistency
    evidence_count = len(raw_symptoms) + len(behaviour_list)
    calculated_conf = min(0.95, max(0.65, 0.70 + (evidence_count * 0.02) + (max_cat_score * 0.012)))
    confidence = round(calculated_conf, 2)

    # Observed symptoms & behaviour lists for UI (deduplicated & formatted)
    all_observed_symptoms = []
    for s in raw_symptoms:
        s_clean = s.strip()
        if s_clean and s_clean.lower() not in [x.lower() for x in all_observed_symptoms]:
            all_observed_symptoms.append(s_clean.capitalize())

    all_observed_behaviour = []
    for b in behaviour_list:
        b_clean = b.strip()
        if b_clean and b_clean.lower() not in [x.lower() for x in all_observed_behaviour]:
            all_observed_behaviour.append(b_clean.capitalize())

    # Dynamic explanation (PART 10)
    animal_type = request.animalType or "animal"
    symptom_summary = ", ".join(all_observed_symptoms[:4]) if all_observed_symptoms else "none"
    behaviour_summary = ", ".join(all_observed_behaviour[:3]) if all_observed_behaviour else "none"
    explanation = (
        f"Rule-based AI clinical assessment for this {animal_type}. "
        f"Key symptoms identified: {symptom_summary}. "
        f"Behavioural indicators: {behaviour_summary}. "
        f"The primary concern pattern matches {condition.lower()} with an aggregate evidence score of {total_score}."
    )

    return AIResponse(
        riskLevel=risk,
        predictedCondition=condition,
        severity=severity,
        confidence=confidence,
        recommendations=recommendations,
        veterinarianNeeded=veterinarian_needed,
        matchedSymptoms=all_observed_symptoms,
        matchedBehaviourChanges=all_observed_behaviour,
        explanation=explanation,
        disclaimer="This is an AI-assisted preliminary assessment and is not a definitive veterinary diagnosis."
    )
