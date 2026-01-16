
import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Search, 
  History as HistoryIcon, 
  ChefHat, 
  Info, 
  Dog, 
  Cat, 
  User,
  Activity,
  ArrowLeft,
  Loader2,
  Trash2,
  Languages
} from 'lucide-react';
import { analyzeFood } from './services/geminiService';
import { FoodAnalysisResponse, HistoryItem, Language } from './types';
import NutritionChart from './components/NutritionChart';
import SafetyBadge from './components/SafetyBadge';

const translations = {
  en: {
    title: "NutriGuard AI",
    tagline: "What are you eating today?",
    description: "Upload a photo or describe your meal to get a full nutritional breakdown and safety check for you and your pets.",
    textMode: "Text Description",
    imageMode: "Snap Photo",
    placeholder: "e.g., A large pepperoni pizza slice with extra cheese...",
    uploadLabel: "Click to upload or take a photo",
    uploadSub: "Supports PNG, JPG up to 10MB",
    analyzeBtn: "Analyze Food",
    analyzing: "Scanning ingredients...",
    analyzingSub: "Our AI is calculating nutrients and assessing safety risks.",
    newAnalysis: "New Analysis",
    estimates: "Values are estimates",
    nutritionFacts: "Nutrition Facts",
    calories: "Calories",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",
    humanSafety: "Human Safety",
    petSafetyDog: "Pet Safety (Dogs)",
    petSafetyCat: "Pet Safety (Cats)",
    history: "Your History",
    noHistory: "No scans yet. Start by analyzing some food!",
    backToScanner: "Back to Scanner"
  },
  zh: {
    title: "营养卫士 AI",
    tagline: "你今天吃什么？",
    description: "上传照片或描述您的餐食，获取完整的营养成分分析以及针对您和宠物的安全检查。",
    textMode: "文字描述",
    imageMode: "拍摄照片",
    placeholder: "例如：一个带有额外奶酪的大号腊肠披萨...",
    uploadLabel: "点击上传或拍摄照片",
    uploadSub: "支持 PNG, JPG 最大 10MB",
    analyzeBtn: "分析食物",
    analyzing: "正在扫描成分...",
    analyzingSub: "我们的 AI 正在计算营养并评估安全风险。",
    newAnalysis: "重新分析",
    estimates: "数值仅供参考",
    nutritionFacts: "营养成分",
    calories: "卡路里",
    protein: "蛋白质",
    carbs: "碳水",
    fat: "脂肪",
    humanSafety: "人体安全",
    petSafetyDog: "宠物安全 (狗)",
    petSafetyCat: "宠物安全 (猫)",
    history: "历史记录",
    noHistory: "尚无记录。开始分析您的食物吧！",
    backToScanner: "返回扫描器"
  },
  ja: {
    title: "NutriGuard AI",
    tagline: "今日は何を食べますか？",
    description: "写真をアップロードするか食事の内容を入力して、栄養素の分析と人間およびペットへの安全性チェックを確認しましょう。",
    textMode: "テキスト入力",
    imageMode: "写真撮影",
    placeholder: "例：チーズたっぷりの大きなペパロニピザ...",
    uploadLabel: "クリックしてアップロードまたは撮影",
    uploadSub: "PNG, JPG 最大 10MB 対応",
    analyzeBtn: "分析する",
    analyzing: "成分をスキャン中...",
    analyzingSub: "AIが栄養価の計算と安全性の評価を行っています。",
    newAnalysis: "新しい分析",
    estimates: "数値は推定値です",
    nutritionFacts: "栄養成分",
    calories: "カロリー",
    protein: "タンパク質",
    carbs: "炭水化物",
    fat: "脂質",
    humanSafety: "人間の安全性",
    petSafetyDog: "ペットの安全性 (犬)",
    petSafetyCat: "ペットの安全性 (猫)",
    history: "履歴",
    noHistory: "履歴はありません。食べ物を分析してみましょう！",
    backToScanner: "スキャナーに戻る"
  },
  ko: {
    title: "뉴트리가드 AI",
    tagline: "오늘 무엇을 드시나요?",
    description: "사진을 업로드하거나 식사 내용을 설명하여 영양 성분 분석과 반려동물을 위한 안전성 체크를 받아보세요.",
    textMode: "텍스트 설명",
    imageMode: "사진 촬영",
    placeholder: "예: 치즈가 듬뿍 들어간 큰 페퍼로니 피자 한 조각...",
    uploadLabel: "클릭하여 업로드하거나 촬영",
    uploadSub: "PNG, JPG 최대 10MB 지원",
    analyzeBtn: "음식 분석하기",
    analyzing: "성분 스캔 중...",
    analyzingSub: "AI가 영양소를 계산하고 안전 위험을 평가하고 있습니다.",
    newAnalysis: "새 분석",
    estimates: "수치는 추정치입니다",
    nutritionFacts: "영양 정보",
    calories: "칼로리",
    protein: "단백질",
    carbs: "탄수화물",
    fat: "지방",
    humanSafety: "사람 안전성",
    petSafetyDog: "반려견 안전성",
    petSafetyCat: "반려묘 안전성",
    history: "분석 기록",
    noHistory: "기록이 없습니다. 음식을 분석해 보세요!",
    backToScanner: "스캐너로 돌아가기"
  },
  pt: {
    title: "NutriGuard AI",
    tagline: "O que você vai comer hoje?",
    description: "Envie uma foto ou descreva sua refeição para obter uma análise nutricional completa e verificação de segurança para você e seus animais.",
    textMode: "Descrição de Texto",
    imageMode: "Tirar Foto",
    placeholder: "ex: Uma fatia grande de pizza de pepperoni com queijo extra...",
    uploadLabel: "Clique para enviar ou tirar foto",
    uploadSub: "Suporta PNG, JPG até 10MB",
    analyzeBtn: "Analisar Alimento",
    analyzing: "Escaneando ingredientes...",
    analyzingSub: "Nossa IA está calculando nutrientes e avaliando riscos de segurança.",
    newAnalysis: "Nova Análise",
    estimates: "Valores são estimativas",
    nutritionFacts: "Fatos Nutricionais",
    calories: "Calorias",
    protein: "Proteína",
    carbs: "Carboidratos",
    fat: "Gordura",
    humanSafety: "Segurança Humana",
    petSafetyDog: "Segurança Pet (Cães)",
    petSafetyCat: "Segurança Pet (Gatos)",
    history: "Seu Histórico",
    noHistory: "Nenhum scan ainda. Comece analisando algum alimento!",
    backToScanner: "Voltar ao Scanner"
  },
  es: {
    title: "NutriGuard AI",
    tagline: "¿Qué vas a comer hoy?",
    description: "Sube una foto o describe tu comida para obtener un desglose nutricional completo y un control de seguridad para ti y tus mascotas.",
    textMode: "Descripción de Texto",
    imageMode: "Tomar Foto",
    placeholder: "ej: Una rebanada grande de pizza de pepperoni con queso extra...",
    uploadLabel: "Haz clic para subir o tomar foto",
    uploadSub: "Soporta PNG, JPG hasta 10MB",
    analyzeBtn: "Analizar Alimento",
    analyzing: "Escaneando ingredientes...",
    analyzingSub: "Nuestra IA está calculando nutrientes y evaluando riesgos de seguridad.",
    newAnalysis: "Nuevo Análisis",
    estimates: "Los valores son estimaciones",
    nutritionFacts: "Información Nutricional",
    calories: "Calorías",
    protein: "Proteína",
    carbs: "Carbohidratos",
    fat: "Grasa",
    humanSafety: "Seguridad Humana",
    petSafetyDog: "Seguridad Pet (Perros)",
    petSafetyCat: "Seguridad Pet (Gatos)",
    history: "Tu Historial",
    noHistory: "Aún no hay escaneos. ¡Comienza analizando algo de comida!",
    backToScanner: "Volver al Escáner"
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [inputMode, setInputMode] = useState<'text' | 'image'>('text');
  const [textInput, setTextInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodAnalysisResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[lang];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setInputMode('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      let analysisResult: FoodAnalysisResponse;
      
      if (inputMode === 'image' && imagePreview) {
        const base64Data = imagePreview.split(',')[1];
        const mimeType = imagePreview.split(';')[0].split(':')[1];
        analysisResult = await analyzeFood({ data: base64Data, mimeType }, lang);
      } else {
        if (!textInput.trim()) return;
        analysisResult = await analyzeFood(textInput, lang);
      }

      setResult(analysisResult);
      
      const newHistoryItem: HistoryItem = {
        ...analysisResult,
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUrl: imagePreview || undefined
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 20));
    } catch (error) {
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setTextInput('');
    setImagePreview(null);
    setInputMode('text');
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-emerald-600">
            <ChefHat className="w-7 h-7" />
            <span className="hidden sm:inline">{t.title}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative flex items-center bg-gray-100 rounded-lg p-1">
              <Languages className="w-4 h-4 text-gray-400 ml-2" />
              <select 
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent text-sm font-semibold text-gray-600 focus:outline-none py-1 pl-1 pr-2 cursor-pointer appearance-none"
              >
                <option value="en">EN</option>
                <option value="zh">ZH</option>
                <option value="ja">JA</option>
                <option value="ko">KO</option>
                <option value="pt">PT</option>
                <option value="es">ES</option>
              </select>
            </div>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 hover:bg-gray-100 rounded-full relative transition-colors"
              title={t.history}
            >
              <HistoryIcon className="w-6 h-6 text-gray-600" />
              {history.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        {!result && !isAnalyzing && !showHistory && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                {t.tagline}
              </h1>
              <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed">
                {t.description}
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-gray-100">
              <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6">
                <button 
                  onClick={() => setInputMode('text')}
                  className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${inputMode === 'text' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Search className="w-5 h-5" />
                  {t.textMode}
                </button>
                <button 
                  onClick={() => setInputMode('image')}
                  className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${inputMode === 'image' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Camera className="w-5 h-5" />
                  {t.imageMode}
                </button>
              </div>

              {inputMode === 'text' ? (
                <textarea 
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={t.placeholder}
                  className="w-full h-40 p-4 rounded-2xl border-gray-200 border bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-lg transition-all"
                />
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all overflow-hidden relative"
                >
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <>
                      <div className="p-4 bg-emerald-100 rounded-full text-emerald-600">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div className="text-center px-4">
                        <p className="font-semibold text-gray-700">{t.uploadLabel}</p>
                        <p className="text-sm text-gray-400">{t.uploadSub}</p>
                      </div>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    className="hidden" 
                    capture="environment"
                  />
                </div>
              )}

              <button 
                onClick={startAnalysis}
                disabled={inputMode === 'text' ? !textInput.trim() : !imagePreview}
                className="w-full mt-6 bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
              >
                {t.analyzeBtn}
              </button>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-200 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <Loader2 className="w-16 h-16 text-emerald-600 animate-spin relative z-10" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">{t.analyzing}</h2>
              <p className="text-gray-500 animate-pulse px-4">{t.analyzingSub}</p>
            </div>
          </div>
        )}

        {result && !isAnalyzing && (
          <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={reset}
                className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-medium transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                {t.newAnalysis}
              </button>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Info className="w-4 h-4" />
                {t.estimates}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-8 bg-emerald-50/50 border-b border-gray-100 flex flex-col md:flex-row gap-6 items-start">
                {(imagePreview || result.imageUrl) && (
                  <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                    <img src={imagePreview || result.imageUrl} className="w-full h-full object-cover" alt="Analysed food" />
                  </div>
                )}
                <div className="space-y-2 flex-1">
                  <h1 className="text-3xl font-extrabold text-gray-900">{result.foodName}</h1>
                  <p className="text-gray-600 leading-relaxed italic">"{result.summary}"</p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    {result.ingredients.slice(0, 5).map((ing, i) => (
                      <span key={i} className="text-xs font-semibold bg-white border px-2 py-1 rounded-lg text-gray-500 uppercase tracking-wider">{ing}</span>
                    ))}
                    {result.ingredients.length > 5 && <span className="text-xs text-gray-400">+{result.ingredients.length - 5} more</span>}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-6 md:p-8 border-r border-gray-100">
                  <div className="flex items-center gap-2 mb-6">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-xl font-bold text-gray-900">{t.nutritionFacts}</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-1">{t.calories}</p>
                      <p className="text-2xl font-black text-gray-800">{result.nutrition.calories}<span className="text-sm font-normal text-gray-400 ml-1">kcal</span></p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-1">{t.protein}</p>
                      <p className="text-2xl font-black text-gray-800">{result.nutrition.protein}g</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-1">{t.carbs}</p>
                      <p className="text-2xl font-black text-gray-800">{result.nutrition.carbs}g</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-1">{t.fat}</p>
                      <p className="text-2xl font-black text-gray-800">{result.nutrition.fat}g</p>
                    </div>
                  </div>

                  <NutritionChart data={result.nutrition} />
                </div>

                <div className="p-6 md:p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-gray-900">{t.humanSafety}</h3>
                      </div>
                      <SafetyBadge level={result.humanSafety.level} />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{result.humanSafety.description}</p>
                    {result.humanSafety.warnings.length > 0 && (
                      <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl">
                        <ul className="list-disc list-inside text-amber-800 text-xs space-y-1">
                          {result.humanSafety.warnings.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Dog className="w-5 h-5 text-orange-600" />
                        <h3 className="font-bold text-gray-900">{t.petSafetyDog}</h3>
                      </div>
                      <SafetyBadge level={result.animalSafety.dogs.level} />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{result.animalSafety.dogs.description}</p>
                    {result.animalSafety.dogs.warnings.length > 0 && (
                      <div className="bg-red-50 border border-red-100 p-3 rounded-xl">
                        <ul className="list-disc list-inside text-red-800 text-xs space-y-1">
                          {result.animalSafety.dogs.warnings.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cat className="w-5 h-5 text-purple-600" />
                        <h3 className="font-bold text-gray-900">{t.petSafetyCat}</h3>
                      </div>
                      <SafetyBadge level={result.animalSafety.cats.level} />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{result.animalSafety.cats.description}</p>
                    {result.animalSafety.cats.warnings.length > 0 && (
                      <div className="bg-red-50 border border-red-100 p-3 rounded-xl">
                        <ul className="list-disc list-inside text-red-800 text-xs space-y-1">
                          {result.animalSafety.cats.warnings.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showHistory && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => setShowHistory(false)}
                className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-medium transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                {t.backToScanner}
              </button>
              <h2 className="text-xl font-bold text-gray-900">{t.history}</h2>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                <HistoryIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400">{t.noHistory}</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {history.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      setResult(item);
                      setImagePreview(item.imageUrl || null);
                      setShowHistory(false);
                    }}
                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.foodName} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ChefHat className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900 truncate">{item.foodName}</h3>
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1 mb-2">{item.summary}</p>
                      <div className="flex gap-2">
                        <div className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          {item.nutrition.calories} KCAL
                        </div>
                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.humanSafety.level === 'safe' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {item.humanSafety.level.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => deleteHistoryItem(item.id, e)}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all text-gray-400 self-center"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Action for Mobile */}
      {!result && !isAnalyzing && !showHistory && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 md:hidden">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-full font-bold shadow-2xl shadow-emerald-400 active:scale-95 transition-all"
          >
            <Camera className="w-6 h-6" />
            {t.imageMode}
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
