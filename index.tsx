import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

const API_KEY_KEY = 'gemini_api_key';

const App = () => {
    const [apiKey, setApiKey] = useState('');
    const [crisisDescription, setCrisisDescription] = useState('');
    const [generatedStatement, setGeneratedStatement] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);

    useEffect(() => {
        try {
            const savedApiKey = localStorage.getItem(API_KEY_KEY) || '';
            setApiKey(savedApiKey);
        } catch (e) {
            console.error("Failed to access localStorage:", e);
            setError("無法讀取您的設定。請確保您的瀏覽器允許使用 localStorage。");
        }
    }, []);

    useEffect(() => {
        if (isLoading || showCompletionAnimation) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isLoading, showCompletionAnimation]);
    
    const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newApiKey = e.target.value;
        setApiKey(newApiKey);
        try {
            localStorage.setItem(API_KEY_KEY, newApiKey);
        } catch (e) {
             console.error("Failed to save API key to localStorage:", e);
             setError("無法儲存您的 API 金鑰。")
        }
    };


    const handleGenerate = useCallback(async () => {
        if (!apiKey.trim()) {
            setError('請先輸入您的 Gemini API 金鑰！');
            return;
        }

        if (!crisisDescription.trim()) {
            setError('請先描述您遇到的公關危機！');
            return;
        }

        setIsLoading(true);
        setError('');
        setGeneratedStatement('');

        try {
            const ai = new GoogleGenAI({ apiKey });
            
            const systemInstruction = `你是一位登峰造極的公關災難大師，專門撰寫能引發史上最大炎上的『提油救火』聲明稿。你的核心目標是：徹底摧毀品牌形象，點燃所有人的怒火，展現出無與倫比的愚蠢與狂妄。

你的指導原則如下，必須嚴格遵守：
1.  **極致傲慢與達克效應：** 你的語氣必須高高在上，充滿了無知的自信。你要用專家的口吻，講出最荒謬的歪理，彷彿消費者是無理取鬧的無知群眾。你的任務是『教育』大眾，讓他們明白自己的知識是多麼淺薄。透露出「我們不是在跟你解釋，我們是在給你上課」的態度。
2.  **指鹿為馬，顛倒黑白：** 絕對不能承認任何錯誤。要將公司的過失，扭曲成是消費者的誤解、濫用、或是競爭對手的惡意抹黑。直接指責提出問題的人「別有用心」。
3.  **扭曲科學的定義：** 你不只是引用科學，你是『重新定義』科學。要理直氣壯地扭曲基礎科學原理來為自己辯護。將任何對公司不利的證據，都斥責為「過時的牛頓思維」或「不理解非線性動力學的膚淺看法」。自信地提出你自創的、無法驗證的「超對稱產品穩定性理論」或「多維使用者體驗矩陣」等偽科學概念，並把它們當作行業金標準。
4.  **發明並濫用偽科學術語：** 你必須在聲明中，自然而然地穿插以下這些你發明的、聽起來高深莫測但實則毫無意義的專業術語。你要把它們當作是業界公認的標準，彷彿不知道的人才是外行。術語列表：『量子糾纏行銷 (Quantum Entanglement Marketing)』、『時序摺疊奇點都合規性 (Chrono-Synclastic Infundibulum Compliance)』、『新行為典範轉移 (Neo-Behavioral Paradigm Shift)』、『超維度消費者中心性 (Hyper-dimensional consumer-centricity)』、『生物合成協同矩陣 (Bio-synthetic synergy matrix)』、『非對稱市場共振 (Asymmetrical market resonance)』、『整體品牌滲透學 (Holistic brand osmology)』、『後牛頓時代聲譽物理學 (Post-Newtonian reputational physics)』。
5.  **災難性類比：** 使用極其不當且冒犯的比喻來解釋情況，讓問題看起來更嚴重、更可笑。
6.  **威脅與恫嚇：** 在聲明稿中，要暗示或明示將對「散播不實言論者」採取法律行動，但用詞要空洞，顯得色厲內荏。
7.  **空洞的企業術語：** 大量使用意義不明的商業術語（如：賦能、生態系、閉環、抓手）來混淆視聽，讓人覺得公司不僅傲慢，而且脫離現實。
8.  **虛偽的「道歉」：** 如果要道歉，只能用「對於造成部分人士的『不佳觀感』，我們深感遺憾」這種句式，將責任完全推給受害者的情緒。
9.  **時機不對的自我吹捧：** 在危機聲明的結尾，要硬生生地插入一段關於公司偉大成就或新產品的宣傳，展現出令人作嘔的麻木不仁。

你的任務是將客戶提供的危機描述，轉化為一篇能讓公司被永久釘在恥辱柱上的公關聲明。開始吧，製造混亂！`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: crisisDescription,
                config: {
                    systemInstruction: systemInstruction
                }
            });

            setGeneratedStatement(response.text);
            
            setShowCompletionAnimation(true);
            setTimeout(() => {
                setShowCompletionAnimation(false);
            }, 2500);

        } catch (e) {
            console.error(e);
            setError('糟糕，產生器好像也出包了。請檢查您的 API 金鑰是否正確、網路連線或稍後再試。');
            setShowCompletionAnimation(false);
        } finally {
            setIsLoading(false);
        }
    }, [crisisDescription, apiKey]);

    return (
        <div className="container">
            <header>
                <h1>提油救火公關稿產生器</h1>
                <p>把小火苗燒成燎原大火，自備油罐車的我們是專業的！</p>
            </header>
            <main>
                <div className="form-group">
                    <div className="label-row">
                         <label htmlFor="api-key">Gemini API 金鑰</label>
                         <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                            (取得金鑰)
                        </a>
                    </div>
                    <input
                        type="password"
                        id="api-key"
                        value={apiKey}
                        onChange={handleApiKeyChange}
                        placeholder="請在此貼上您的 Gemini API 金鑰"
                        aria-required="true"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="crisis-description">公關危機說明</label>
                    <textarea
                        id="crisis-description"
                        value={crisisDescription}
                        onChange={(e) => setCrisisDescription(e.target.value)}
                        placeholder="請簡述您遇到的公關危機，例如：「我們公司的產品被發現含有對人體無害但聽起來很可怕的化學物質。」"
                        rows={6}
                        aria-required="true"
                    ></textarea>
                </div>
                <button
                    onClick={handleGenerate}
                    className="btn btn-primary"
                    disabled={isLoading || !apiKey.trim()}
                    aria-label="產生提油救火公關稿"
                >
                    {isLoading ? <div className="loading-spinner"></div> : '🔥'}
                    {isLoading ? '火速生成中...' : '產生公關稿'}
                </button>

                {error && <div className="error-message" role="alert">{error}</div>}

                <section className="result-section" aria-labelledby="result-heading">
                    <h2 id="result-heading">官方聲明稿</h2>
                    <div className="result-content">
                        {generatedStatement ? (
                            generatedStatement
                        ) : (
                            <p className="placeholder-text">您的完美災難將會顯示在這裡...</p>
                        )}
                    </div>
                </section>
            </main>
            
            {(isLoading || showCompletionAnimation) && (
                <div className="animation-overlay">
                    {isLoading && (
                        <div className="flame-wrapper">
                            <div className="flame"></div>
                            <div className="flame"></div>
                            <div className="flame"></div>
                        </div>
                    )}
                    {!isLoading && showCompletionAnimation && (
                        <div className="ash-wrapper">
                            <div className="disaster-icon">!</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);