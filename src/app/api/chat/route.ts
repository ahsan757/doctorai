import { connectDB } from "@/lib/db";
import Chat from "@/models/chat.model";
import { diagnosis_to_specializations } from "@/utils/diagnosis";
import { haversineDistance } from "@/utils/haversine";
import csv from "csv-parser";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import path from "path";

interface Doctor {
  name: string;
  specialization: string;
  latitude: number;
  longitude: number;
  hospital: string;
}

const emergency_map: Record<string, string[]> = {
  "heart attack": ["CARDIOLOGIST", "ELECTROPHYSIOLOGIST", "HEART FAILURE"],
  "chest pain": ["CARDIOLOGIST", "ELECTROPHYSIOLOGIST", "HEART FAILURE"],
  "stroke": ["NEUROLOGIST", "PAEDIATRIC NEUROLOGIST"],
  "shortness of breath": ["PULMONOLOGIST", "CARDIOLOGIST"],
  "difficulty breathing": ["PULMONOLOGIST", "CARDIOLOGIST"],
  "loss of consciousness": ["NEUROLOGIST", "PAEDIATRIC NEUROLOGIST", "EMERGENCY MEDICINE"],
  "seizures": ["NEUROLOGIST", "PAEDIATRIC NEUROLOGIST"],
  "sudden vision loss": ["OPHTHALMOLOGIST", "NEUROLOGIST", "PAEDIATRIC NEUROLOGIST"],
  "head trauma": ["NEUROLOGIST", "PAEDIATRIC NEUROLOGIST", "NEUROSURGEON"],
  "severe bleeding": ["EMERGENCY MEDICINE", "GENERAL SURGEON"],
  "high fever with confusion": ["INFECTIOUS DISEASE", "NEUROLOGIST", "PAEDIATRIC NEUROLOGIST"],
  "vomiting blood": ["GASTROENTEROLOGIST", "EMERGENCY MEDICINE"],
  "blood in stool": ["GASTROENTEROLOGIST"],
  "abdominal pain": ["GASTROENTEROLOGIST", "GENERAL SURGEON"],
  "sudden paralysis": ["NEUROLOGIST", "PAEDIATRIC NEUROLOGIST"],
  "breathing stopped": ["EMERGENCY MEDICINE"],
  "severe allergic reaction": ["ALLERGIST", "EMERGENCY MEDICINE"],
  "severe burns": ["PLASTIC SURGEON", "EMERGENCY MEDICINE"],
  "poisoning": ["TOXICOLOGIST", "EMERGENCY MEDICINE"],
  "snake bite": ["TOXICOLOGIST", "EMERGENCY MEDICINE"],
  "drug overdose": ["TOXICOLOGIST", "EMERGENCY MEDICINE"],
  "wheezing with blue skin": ["PULMONOLOGIST", "EMERGENCY MEDICINE"],
  "palpitations with dizziness": ["CARDIOLOGIST", "ELECTROPHYSIOLOGIST"],
  "uncontrolled tremors": ["NEUROLOGIST", "PAEDIATRIC NEUROLOGIST"],
  "speech difficulty": ["NEUROLOGIST", "PAEDIATRIC NEUROLOGIST"],
  "fracture with bone exposed": ["ORTHOPEDIC SURGEON"],
  "major accident injury": ["EMERGENCY MEDICINE", "TRAUMA SURGEON"],
  "labor pain (unexpected)": ["GYNECOLOGIST", "OBSTETRICIAN"],
  "preterm labor": ["OBSTETRICIAN"],
  "newborn not breathing": ["PEDIATRICIAN", "EMERGENCY MEDICINE"],
  "meningitis": ["INFECTIOUS DISEASE", "NEUROLOGIST", "PAEDIATRIC NEUROLOGIST"],
  "pulmonary embolism": ["PULMONOLOGIST", "CARDIOLOGIST"],
  "deep vein thrombosis": ["VASCULAR SURGEON", "INTERNAL MEDICINE"],
  "internal bleeding": ["EMERGENCY MEDICINE", "GENERAL SURGEON"],
  "heat stroke": ["EMERGENCY MEDICINE"]
};

async function loadDoctorsFromCSV(): Promise<Doctor[]> {
  const filePath = path.join(process.cwd(), "public", "data", "doctors.csv");
  return new Promise((resolve, reject) => {
    const results: Doctor[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (rawdata) => {
        try {
          const data = Object.fromEntries(
            Object.entries(rawdata).map(([key, value]) => [key.trim().replace(/\uFEFF/g, ""), value])
          ) as Record<string, string>;

          results.push({
            name: data.name,
            specialization: data.specialization,
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            hospital: data.hospital_name || "N/A",
          });
        } catch (e) {
          console.error("Invalid row:", e);
        }
      })
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

function matchDoctors(doctors: Doctor[], specs: string[], lat?: number, lng?: number, limit = 3) {
  const specSet = new Set(specs.map(s => s.toLowerCase()));
  const matches = doctors
    .filter(doc => specSet.has(doc.specialization.toLowerCase()))
    .map(doc => {
      const distance = lat !== undefined && lng !== undefined
        ? haversineDistance(lat, lng, doc.latitude, doc.longitude)
        : null;
      return { ...doc, distance };
    });

  return matches
    .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
    .slice(0, limit);
}

function isFollowupQuestion(content: string) {
  const phrases = [
    "how long", "can you describe", "are you experiencing",
    "any other symptoms", "please tell me more", "could you specify", "could you explain"
  ];
  const lower = content.toLowerCase();
  return phrases.some(p => lower.includes(p));
}

const openai = new OpenAI({ apiKey: process.env.OPEN_API_SECRET_KEY });

export async function POST(req: NextRequest) {
  try {

    await connectDB();

    const data = await req.json();

    let latitude: number = 0;
    let longitude: number = 0;

    try {
      latitude = parseFloat(data.latitude);
      longitude = parseFloat(data.longitude);
    } catch {
      latitude = 0;
      longitude = 0;
    }

    const message = (data.message || '').trim();
    const conversation = data.conversation || [];

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const followup_count = conversation.filter(
      (msg: any) => msg.role === 'assistant' && isFollowupQuestion(msg.content)
    ).length;

    if (followup_count >= 2) {
      const diagnosis_prompt = {
        role: 'system',
        content: 'You are Doctor AI, a medical assistant. Based on previous conversation, give a brief possible diagnosis and ask if the user wants doctor recommendation.'
      };

      const messages = [diagnosis_prompt, ...conversation, { role: 'user', content: message }];
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 400,
        temperature: 0.7
      });

      const diagnosis_reply = response.choices[0].message?.content?.trim() || '';
      conversation.push({ role: 'user', content: message });
      conversation.push({ role: 'assistant', content: diagnosis_reply });

      const userMsg = { sender: "user", type: "text", text: message };
      const botMsg = { sender: "bot", type: "text", text: diagnosis_reply };

      await Chat.findOneAndUpdate(
        { sessionId: data.sessionId },
        { $push: { messages: [userMsg, botMsg] } },
        { upsert: true, new: true }
      );


      return NextResponse.json({ response: diagnosis_reply, conversation });
    }

    const system_prompt = {
      role: 'system',
      content: `
        You are Doctor AI, a helpful virtual healthcare assistant.

        Rules:
        1. Based on user symptoms, identify possible medical conditions.
        2. If symptoms are unclear, ask 1–2 follow-up questions.
        3. If the condition is clear (e.g., flu, migraine, heart attack), immediately say:
        "Based on your symptoms, you may be experiencing X. Would you like me to recommend a specialized doctor?"
        4. If it's a critical issue (e.g., heart attack, stroke, chest pain), say:
        "⚠️ This could be a medical emergency. Please seek immediate help."
        5. Do NOT list doctor names yourself — the backend will recommend them.
        6. Be brief, clear, and avoid non-medical topics.
      `
    };

    const messages = [system_prompt, ...conversation, { role: 'user', content: message }];
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 400,
      temperature: 0.7
    });

    const ai_reply = response.choices[0].message?.content?.trim() || "Sorry, I couldn't generate a response.";
    conversation.push({ role: 'user', content: message });
    conversation.push({ role: 'assistant', content: ai_reply });

    const lower_reply = ai_reply.toLowerCase();
    const user_message_lower = message.toLowerCase();

    const critical_keywords = ["heart attack", "stroke", "chest pain", "shortness of breath", "difficulty breathing"];
    const is_critical = critical_keywords.some(term =>
      lower_reply.includes(term) || user_message_lower.includes(term)
    );

    if (is_critical) {
      const matched_specs = new Set<string>();
      for (const [keyword, specs] of Object.entries(emergency_map)) {
        if (lower_reply.includes(keyword) || user_message_lower.includes(keyword)) {
          specs.forEach(spec => matched_specs.add(spec));
        }
      }

      const allDoctors = await loadDoctorsFromCSV();
      const matched_doctors = matchDoctors(allDoctors, Array.from(matched_specs), latitude, longitude, 3);


      if (matched_doctors.length) {
        let suggestion = "\n\n👨‍⚕️ Since this might be critical, here are few nearest specialized doctors you can consult:\n";
        matched_doctors.forEach((doc, i) => {
          let name = doc.name;
          if (!name.toLowerCase().startsWith("dr.")) {
            name = "Dr. " + name;
          }
          suggestion += `${i + 1}. ${name} - ${doc.specialization}, ${doc.hospital || 'N/A'} (${doc.distance?.toFixed(2) ?? 'N/A'} km away)\n`;
        });

        const userMsg = { sender: "user", type: "text", text: message };
        const botMsg = { sender: "bot", type: "doctor-suggestion", text: ai_reply + suggestion };

        await Chat.findOneAndUpdate(
          { sessionId: data.sessionId },
          { $push: { messages: [userMsg, botMsg] } },
          { upsert: true, new: true }
        );

        return NextResponse.json({ response: ai_reply + suggestion, conversation });
      } else {
        const userMsg = { sender: "user", type: "text", text: message };
        const botMsg = { sender: "bot", type: "text", text: ai_reply };

        await Chat.findOneAndUpdate(
          { sessionId: data.sessionId },
          { $push: { messages: [userMsg, botMsg] } },
          { upsert: true, new: true }
        );
        return NextResponse.json({
          response: ai_reply + "\n\n⚠️ This might be a medical emergency, but no relevant doctors were found in the system.",
          conversation
        });
      }
    }

    const negative_responses = ["no", "none", "not really", "nope", "nothing"];
    const user_replied_no = negative_responses.includes(user_message_lower.trim());

    if (
      user_replied_no &&
      conversation.some(
        (msg: any) =>
          msg.role === 'assistant' &&
          msg.content.toLowerCase().includes("are you experiencing")
      )
    ) {
      const diagnosis_prompt = {
        role: 'system',
        content: 'You are Doctor AI, a medical assistant. Based on previous conversation, give a brief possible diagnosis and ask if the user wants doctor recommendation.'
      };

      const messages = [
        diagnosis_prompt,
        ...conversation,
        {
          role: 'user',
          content:
            'Based on previous info, provide a brief diagnosis and ask if I want doctor recommendation.'
        }
      ];

      const diag_response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 400,
        temperature: 0.7
      });

      const diagnosis_reply = diag_response.choices[0].message?.content?.trim() || '';
      conversation.push({ role: 'assistant', content: diagnosis_reply });

      const userMsg = { sender: "user", type: "text", text: message };
      const botMsg = { sender: "bot", type: "text", text: ai_reply };

      await Chat.findOneAndUpdate(
        { sessionId: data.sessionId },
        { $push: { messages: [userMsg, botMsg] } },
        { upsert: true, new: true }
      );

      return NextResponse.json({ response: diagnosis_reply, conversation });
    }

    if (lower_reply.includes("would you like me to recommend a specialized doctor")) {
      const userMsg = { sender: "user", type: "text", text: message };
      const botMsg = { sender: "bot", type: "text", text: ai_reply };

      await Chat.findOneAndUpdate(
        { sessionId: data.sessionId },
        { $push: { messages: [userMsg, botMsg] } },
        { upsert: true, new: true }
      );
      return NextResponse.json({ response: ai_reply, conversation });
    }

    const yes_words = ["yes", "yeah", "yep", "please", "sure", "ok", "okay", "recommend a doctor", "need doctor"];
    if (yes_words.some(w => user_message_lower.includes(w))) {
      let diagnosis: string | null = null;

      for (let i = conversation.length - 1; i >= 0; i--) {
        const msg = conversation[i];
        if (msg.role === "assistant") {
          const content_lower = msg.content.toLowerCase();
          if (content_lower.includes("based on your symptoms")) {
            const start = content_lower.indexOf("based on your symptoms") + "based on your symptoms".length;
            diagnosis = content_lower.slice(start).split(".")[0].trim();
            break;
          }
        }
      }

      const matched_specs: Set<string> = new Set();
      if (diagnosis) {
        for (const [key, specs] of Object.entries(diagnosis_to_specializations)) {
          if (diagnosis.includes(key)) {
            specs.forEach(s => matched_specs.add(s));
          }
        }
      }

      const allDoctors = await loadDoctorsFromCSV();

      const matched_doctors = matchDoctors(
        allDoctors,                  // Doctor[]
        Array.from(matched_specs),   // string[]
        latitude,
        longitude,
        3
      );

      if (matched_doctors.length) {
        let suggestion = "\n\n👨‍⚕️ Here are few nearest doctors specialized for your condition:\n";
        matched_doctors.forEach((doc, i) => {
          let name = doc.name;
          if (!name.toLowerCase().startsWith("dr.")) {
            name = "Dr. " + name;
          }
          suggestion += `${i + 1}. ${name} - ${doc.specialization}, ${doc.hospital || 'N/A'} (${doc.distance?.toFixed(2) ?? 'N/A'} km away)\n`;
        });

        const userMsg = { sender: "user", type: "text", text: message };
        const botMsg = { sender: "bot", type: "doctor-suggestion", text: suggestion };

        await Chat.findOneAndUpdate(
          { sessionId: data.sessionId },
          { $push: { messages: [userMsg, botMsg] } },
          { upsert: true, new: true }
        );

        return NextResponse.json({ response: suggestion, conversation });
      } else {
        const userMsg = { sender: "user", type: "text", text: message };
        const botMsg = { sender: "bot", type: "text", text: "Sorry, no doctors found matching your condition." };

        await Chat.findOneAndUpdate(
          { sessionId: data.sessionId },
          { $push: { messages: [userMsg, botMsg] } },
          { upsert: true, new: true }
        );
        return NextResponse.json({
          response: "Sorry, no doctors found matching your condition.",
          conversation
        });
      }
    }

    const userMsg = { sender: "user", type: "text", text: message };
    const botMsg = { sender: "bot", type: "text", text: ai_reply };

    await Chat.findOneAndUpdate(
      { sessionId: data.sessionId },
      { $push: { messages: [userMsg, botMsg] } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ response: ai_reply, conversation });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
