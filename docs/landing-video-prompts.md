# Landing Page Background Generation Prompts

WebGLの品質課題を解決するため、AI生成動画（画像生成 → 動画生成）によるアプローチへの移行をサポートします。Poseidonの「AI-Governed (AIによる資産管理機能)」とFintechの洗練された雰囲気を表現するためのプロンプトを作成しました。

## 1. 画像生成用プロンプト (Nano banana pro 等の高品質画像モデル向け)

**テーマ:** 洗練されたAIと金融を象徴する、抽象的でダイナミックなデータウェーブ

> **Prompt:**
> A cinematic, abstract visualization of a futuristic financial data wave. Millions of glowing, microscopic cyan and teal particles forming a massive, elegant flowing wave. Dark deep navy blue background (#0B1221). Glassmorphism, highly detailed, premium fintech aesthetic, cutting-edge AI technology concept, subtle depth of field, sharp focus on the central wave crest, volumetric lighting, 8k resolution, photorealistic, clean and minimalist design, negative space at the top and left for typography. --ar 16:9 --style raw --v 6.0

*   **ポイント**: アプリのトーン＆マナー（ブランドカラーのCyan/Teal、背景色のダークネイビー）を指定し、配置されるテキストの視認性を確保するための余白（Negative space）を指示しています。

---

## 2. 動画生成用プロンプト (Veo 3.1 向け)

**テーマ:** 視線を奪いすぎない、穏やかでリッチなループアニメーション

> **Prompt:**
> Cinematic slow-motion movement. The glowing cyan and teal particle wave gently undulates and courses with data light flowing horizontally across the particles. Smooth, liquid-like motion, extremely stable camera, no sudden changes. The dark navy background remains deep and solid. Seamless loopable motion, 4k resolution, high bit-rate, elegant and premium corporate aesthetic.
>
> **Motion prompt / Camera instructions (if supported):**
> Static camera, very slow internal movement of the particles. Flowing from right to left smoothly.

*   **ポイント**: Landingページの背景であるため、動きが激しすぎるとテキスト（"Your Money. AI-Governed."）が読みづらくなります。「Slow-motion」「Smooth, liquid-like」「Static camera」を強調し、穏やかにループできるような指示を入れています。

---

## 3. Google Flow (ImageFX/VideoFX) 向けプロンプト

Googleの画像・動画生成モデル（Google ImageFX / VideoFX の Imagen 3 や Veo ベース）は、自然言語での具体的な描写や、メタファー（比喩）、カメラの動きを明確にするテキストプロンプトが得意です。流体（Flow）の性質を強調したプロンプトを作成しました。

**テーマ:** 流体のように滑らかで、AIによる制御（Govern）を感じさせる秩序あるデータフロー

> **Prompt:**
> A mesmerizing, slow-motion loop of a futuristic financial data flow. The scene features millions of microscopic, glowing cyan and teal particles moving together flawlessly like a calm, elegant liquid stream across the screen. The background is a pure, deep navy blue (#0B1221). The particles gently undulate in a synchronized, horizontal wave pattern without turbulence or chaotic splashes. High-end fintech aesthetic, embodying artificial intelligence governance and precision. Clean composition with negative space on the top and left sides for text overlay. Photorealistic, 4k resolution, smooth and stable cinematic static camera, subtle depth of field with the center in crisp focus.

*   **ポイント**: Googleのモデルは「どのように動くか」（like a calm, elegant liquid stream, without turbulence）という自然な英語の描写をよく理解します。激しい動きにならないように、滑らかさと秩序（precision, governance）を強調しています。

---

## 4. 次のステップ（Landing への取り込み）

動画（`.mp4` または `.webm` 推奨、可能であれば軽量な `.webm` がベターです）が完成しましたら、プロジェクト内の `public/assets/videos/` 等に配置してください。
その後、現在の `ParticleWave` コンポーネントを削除し、以下のような `<video>` タグを用いた背景実装へコードを書き換えます（オーバーレイのグラデーションも併せて調整します）。

準備ができましたら、動画のファイルパスをお知らせください。実装の書き換えを直ちに実行します！
