import type { Request, Response } from "express";
const express = require("express");
const { OpenAI } = require("openai");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/memo-ai-completions/normal", async (req: Request, res: Response) => {
  try {
    const { memo_type, user_memo, user_tags } = req.body;
    const response = await openai.responses.create({
      model: "o4-mini",
      text: { format: { type: "json_object" } },
      reasoning: { effort: "medium" },
      input: [
        {
          role: "system",
          content:
            "あなたは、AIプログラミングメモ帳というwebアプリに組み込まれたAIです。このアプリでは、ユーザーが入力したメモやコードをもとに、AIがタイトル、解説、タグを生成します。JSONフォーマットでレスポンスを返してください。",
        },
        {
          role: "user",
          content: `
            #入力情報
            ##メモの種類:
            ${memo_type}
            ## ユーザー入力内容:
            ${user_memo}
            ## ユーザー指定タグ (存在する場合):
            ${JSON.stringify(user_tags)}

            # 指示
            1.  **タイトルの生成**:
              *   ユーザー入力内容を最もよく表す簡潔なタイトルを1つ生成してください（メモの内容がパッとわかるタイトル）。
              *   最大30文字程度でお願いします。

            2.  **解説の生成**:
              *   メモの種類が「${memo_type}」であることを踏まえ、ユーザー入力内容について、その要点、目的、背景、または（コードの場合）機能や簡単な使用方法などを分かりやすく解説してください。
              *   ${memo_type}が"code"の場合は、コードの言語を推測し、適切なマークダウン（コードブロックなど）を使用して解説してください。
              *   REPLで300文字前後でお願いします。

            3.  **タグの生成**:
              *   ユーザー入力内容と生成した解説に基づいて、関連性の高いキーワードタグを、ユーザー指定タグと合わせて、最大で5個提案してください。
              *   ユーザー指定タグが存在する場合は、それらと重複せず、かつ関連性の高いタグを選んでください。

            # 出力形式
            必ず以下のJSON形式で応答してください。
            {
            "title": "{生成されたタイトル}",
            "explanation": "{生成された解説}",
            "ai_tags": ["タグ1", "タグ2", "タグ3"]
            }
          `,
        },
      ],
    });
    // console.log(response);
    const jsonContent = response.output_text;
    res.json(JSON.parse(jsonContent));
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
});

app.post("/memo-ai-completions/quick", async (req: Request, res: Response) => {
  try {
    const { user_memo } = req.body;
    const response = await openai.responses.create({
      model: "o4-mini",
      text: { format: { type: "json_object" } },
      reasoning: { effort: "medium" },
      input: [
        {
          role: "system",
          content:
            "あなたは、AIプログラミングメモ帳というwebアプリに組み込まれたAIです。このアプリでは、ユーザーが入力したメモやコードをもとに、AIがタイトル、メモタイプ、解説、タグを生成します。JSONフォーマットでレスポンスを返してください。",
        },
        {
          role: "user",
          content: `
              # ユーザー入力内容:
              ${user_memo}
  
              # 指示
              1.  **タイトルの生成**:
                *   ユーザー入力内容を最もよく表す簡潔なタイトルを1つ生成してください（メモの内容がパッとわかるタイトル）。
                *   最大30文字程度でお願いします。
              
              2.  **メモタイプの生成**:
                *   ユーザー入力内容を元に、メモのタイプが'text'もしくは'code'かを判断し、出力してください。
  
              3.  **解説の生成**:
                *   ユーザー入力内容について、その要点、目的、背景、または（コードの場合）機能や簡単な使用方法などを分かりやすく解説してください。
                *   ユーザー入力内容がコードであると推測される場合は、コードの言語を推測し、適切なマークダウン（コードブロックなど）を使用して解説してください。
                *   出力はREPLで300文字前後でお願いします。
  
              4.  **タグの生成**:
                *   ユーザー入力内容と生成した解説に基づいて、関連性の高いキーワードタグを、最大で5個提案してください。
  
              # 出力形式
              必ず以下のJSON形式で応答してください。
              {
              "title": "{生成されたタイトル}",
              "memo_type": "{'text' | 'code'}"
              "explanation": "{生成された解説}",
              "ai_tags": ["タグ1", "タグ2", "タグ3"]
              }
            `,
        },
      ],
    });
    // console.log(response);
    const jsonContent = response.output_text;
    res.json(JSON.parse(jsonContent));
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
