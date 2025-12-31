
import { GoogleGenAI } from "@google/genai";
import { DailySlot, Booking } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateBotResponse = async (
  message: string, 
  history: { role: string, parts: { text: string }[] }[],
  availability: DailySlot[],
  bookings: Booking[]
) => {
  const model = "gemini-3-flash-preview";
  
  const availabilityContext = availability
    .map(slot => `${slot.date}: ${slot.availableSpaces} vagas disponíveis`)
    .join("\n");

  const systemInstruction = `
    Você é um assistente virtual inteligente para o sistema de reservas "ZappReserve".
    Seu objetivo é ajudar clientes a fazerem reservas pelo WhatsApp.
    
    REGRAS:
    1. Seja educado, profissional e use emojis ocasionalmente para parecer amigável.
    2. Verifique a disponibilidade antes de confirmar qualquer reserva.
    3. Disponibilidade atual:
    ${availabilityContext}
    
    4. Se o cliente quiser reservar, peça o Nome e a Data/Hora desejada.
    5. Quando o cliente fornecer os dados e houver vaga, confirme a reserva dizendo: "RESERVA_CONFIRMADA: [Data] às [Hora] para [Nome]".
    6. Se não houver vaga, sugira outra data.
    7. Responda sempre em Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        { role: 'user', parts: [{ text: `INSTRUÇÃO DE SISTEMA: ${systemInstruction}` }] },
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: h.parts })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "Desculpe, tive um problema técnico. Pode repetir?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao processar sua mensagem. Verifique a conexão.";
  }
};
