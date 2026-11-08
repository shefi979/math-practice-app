import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  RotateCcw, 
  Globe, 
  BookOpen, 
  Flame, 
  Zap, 
  GraduationCap, 
  Eye, 
  RefreshCw 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TRANSLATIONS = {
  az: {
    title: 'Riyaziyyat Dəftəri 📜',
    welcome: 'Dəftəri Açın! 📖',
    enterDetails: 'Adınızı və sinfinizi yazaraq başlayın:',
    nameLabel: 'AD VƏ SOYAD',
    gradeLabel: 'SİNİF',
    gradeSuffix: '-ci sinif',
    startBtn: 'Dərsə Başla 🖋️',
    student: 'Şagird',
    practice: 'Təcrübə',
    leaderboard: 'Top 10',
    dashboard: 'Müəllim Paneli',
    selectTopic: '1. MÖVZU SEÇİN',
    selectDiff: '2. ÇƏTİNLİK SƏVİYYƏSİ',
    solvePrompt: 'MISALI HƏLL EDİN 🖋️',
    timer: 'Taymer:',
    sec: 'san',
    checkBtn: 'Yoxla',
    nextBtn: 'Növbəti Sual',
    retryBtn: 'Təkrar Həll Et 🔄',
    showSolutionBtn: 'Həllə Bax 💡',
    rank: 'Sıra',
    solved: 'Həll Olunan',
    xp: 'Ümumi XP',
    time: 'Vaxt',
    result: 'Nəticə',
    correct: 'Düzgün',
    wrong: 'Səhv',
    solutionTitle: 'ADDIM-ADDIM HƏLL YOLU:',
    correctAnsLabel: 'Düzgün Cavab:',
    authorFooter: '✨ Hazırladı: S.Ş. | Bütün hüquqlar qorunur',
    topics: {
      integers_add_sub: '📜 Tam Ədədlər: Toplama & Çıxma',
      integers_mul_div: '🖋️ Tam Ədədlər: Vurma & Bölmə',
      fraction_ops: '🍕 Kəsrlər Üzərində Əməllər',
      factoring: '🧩 Ortaq Vuruğun Çıxarılması',
      expand_brackets: '🔓 Mənfi ilə Mötərizənin Açılması',
      algebraic_identities: '📐 Müxtəsər Vurma Düsturları'
    },
    diffs: { easy: '🟢 Asan', medium: '🟡 Orta', hard: '🔴 Çətin' }
  },
  en: {
    title: 'Math Notebook 📜',
    welcome: 'Open the Notebook! 📖',
    enterDetails: 'Enter your name and grade to start:',
    nameLabel: 'FULL NAME',
    gradeLabel: 'GRADE',
    gradeSuffix: 'th Grade',
    startBtn: 'Start Practice 🖋️',
    student: 'Student',
    practice: 'Practice',
    leaderboard: 'Top 10',
    dashboard: 'Teacher Dashboard',
    selectTopic: '1. SELECT TOPIC',
    selectDiff: '2. DIFFICULTY',
    solvePrompt: 'SOLVE THE PROBLEM 🖋️',
    timer: 'Timer:',
    sec: 'sec',
    checkBtn: 'Check',
    nextBtn: 'Next Question',
    retryBtn: 'Try Again 🔄',
    showSolutionBtn: 'View Solution 💡',
    rank: 'Rank',
    solved: 'Solved',
    xp: 'Total XP',
    time: 'Time',
    result: 'Result',
    correct: 'Correct',
    wrong: 'Wrong',
    solutionTitle: 'STEP-BY-STEP SOLUTION:',
    correctAnsLabel: 'Correct Answer:',
    authorFooter: '✨ Created by S.Ş. | All rights reserved',
    topics: {
      integers_add_sub: '📜 Integers: Add & Subtract',
      integers_mul_div: '🖋️ Integers: Multiply & Divide',
      fraction_ops: '🍕 Fraction Operations',
      factoring: '🧩 Factoring Out Factors',
      expand_brackets: '🔓 Expanding Negatives',
      algebraic_identities: '📐 Algebraic Identities'
    },
    diffs: { easy: '🟢 Easy', medium: '🟡 Medium', hard: '🔴 Hard' }
  }
};

const TOPICS = {
  INTEGER_ADD_SUB: 'integers_add_sub',
  INTEGER_MUL_DIV: 'integers_mul_div',
  FRACTION_OPS: 'fraction_ops',
  FACTORING: 'factoring',
  EXPAND_BRACKETS: 'expand_brackets',
  ALGEBRAIC_IDENTITIES: 'algebraic_identities'
};

const gcd = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { const t = b; b = a % b; a = t; }
  return a;
};

const lcm = (a, b) => {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a * b) / gcd(a, b));
};

const simplifyFraction = (num, den) => {
  if (den === 0) return { num: 0, den: 1 };
  if (den < 0) { num = -num; den = -den; }
  const common = gcd(num, den);
  return { num: num / common, den: den / common };
};

const FractionDisplay = ({ num, den }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', margin: '0 6px', fontSize: '0.85em' }}>
    <span style={{ borderBottom: '2px solid currentColor', padding: '0 6px', lineHeight: '1.1' }}>{num}</span>
    <span style={{ padding: '0 6px', lineHeight: '1.1' }}>{den}</span>
  </span>
);

export default function App() {
  const [lang, setLang] = useState('az');
  const t = TRANSLATIONS[lang];

  const [studentName, setStudentName] = useState(() => localStorage.getItem('math_student_name') || '');
  const [studentGrade, setStudentGrade] = useState(() => localStorage.getItem('math_student_grade') || '6');
  const [isProfileSaved, setIsProfileSaved] = useState(() => !!localStorage.getItem('math_student_name'));

  const [selectedTopic, setSelectedTopic] = useState(TOPICS.INTEGER_ADD_SUB);
  const [difficulty, setDifficulty] = useState('easy');

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [mcqSelection, setMcqSelection] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(null);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showDetailedExplanation, setShowDetailedExplanation] = useState(false);

  const [leaderboard, setLeaderboard] = useState(() => {
    const saved = localStorage.getItem('math_leaderboard');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('math_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (questionStartTime && !feedback?.isCorrect) {
        setQuestionTimer(Math.floor((Date.now() - questionStartTime) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [questionStartTime, feedback]);

  const saveProfile = (e) => {
    e.preventDefault();
    if (studentName.trim()) {
      localStorage.setItem('math_student_name', studentName.trim());
      localStorage.setItem('math_student_grade', studentGrade);
      setIsProfileSaved(true);
    }
  };

  const updateLeaderboard = (gainedXp) => {
    setLeaderboard(prev => {
      const existingIdx = prev.findIndex(item => item.name.toLowerCase() === studentName.toLowerCase() && item.grade === studentGrade);
      let updated = [...prev];
      if (existingIdx >= 0) {
        updated[existingIdx].xp += gainedXp;
        updated[existingIdx].totalSolved += 1;
      } else {
        updated.push({
          id: Date.now(),
          name: studentName,
          grade: studentGrade,
          xp: gainedXp,
          totalSolved: 1
        });
      }
      return updated.sort((a, b) => b.xp - a.xp).slice(0, 10);
    });
  };

  const generateQuestion = () => {
    setFeedback(null);
    setUserAnswer('');
    setMcqSelection(null);
    setAttempts(0);
    setShowDetailedExplanation(false);
    setQuestionStartTime(Date.now());
    setQuestionTimer(0);

    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randNonZero = (min, max) => {
      let res = 0;
      while (res === 0) res = rand(min, max);
      return res;
    };

    let q = {};

    if (selectedTopic === TOPICS.INTEGER_ADD_SUB) {
      let a, b, isAdd;
      if (difficulty === 'easy') {
        a = rand(1, 15);
        b = rand(1, 15);
        isAdd = Math.random() > 0.4;
      } else if (difficulty === 'medium') {
        a = rand(-20, 20);
        b = rand(-20, 20);
        isAdd = Math.random() > 0.5;
      } else {
        a = rand(-60, 60);
        b = rand(-60, 60);
        isAdd = Math.random() > 0.5;
      }
      
      let effectiveB = isAdd ? b : -b;
      const ans = a + effectiveB;

      const stepsAz = [];
      const stepsEn = [];

      if (!isAdd) {
        stepsAz.push(`Çıxma əməli toplama kimi yazılır: ${a} - (${b}) ➔ ${a} + (${-b})`);
        stepsEn.push(`Convert subtraction to addition: ${a} - (${b}) ➔ ${a} + (${-b})`);
      }

      const isANegative = a < 0;
      const isBNegative = effectiveB < 0;

      if ((isANegative && !isBNegative) || (!isANegative && isBNegative)) {
        const modA = Math.abs(a);
        const modB = Math.abs(effectiveB);
        const largerMod = modA > modB ? a : effectiveB;
        const largerVal = Math.max(modA, modB);
        const smallerVal = Math.min(modA, modB);
        const signStr = largerMod < 0 ? 'mənfi (-)' : 'müsbət (+)';
        const signStrEn = largerMod < 0 ? 'negative (-)' : 'positive (+)';

        stepsAz.push(`📌 Qayda: Misalda 1 mənfi, 1 müsbət var deyə modullarını çıxıb qarşısına modulu böyük olanın işarəsini yazırıq.`);
        stepsAz.push(`🔍 Vizual Hesablama: |${a}| = ${modA}, |${effectiveB}| = ${modB}. Böyük modul ${largerVal}-dir (işarəsi ${signStr}).`);
        stepsAz.push(`✏️ Qaydadan gələn cavab: ${largerVal} - ${smallerVal} = ${largerVal - smallerVal} ➔ Cavab: ${ans}`);

        stepsEn.push(`📌 Rule: Since there is 1 negative and 1 positive, subtract their absolute values and write the sign of the larger absolute value.`);
        stepsEn.push(`🔍 Visual Step: |${a}| = ${modA}, |${effectiveB}| = ${modB}. Larger value is ${largerVal} (sign: ${signStrEn}).`);
        stepsEn.push(`✏️ Calculation: ${largerVal} - ${smallerVal} = ${largerVal - smallerVal} ➔ Result: ${ans}`);
      } else {
        const signWordAz = isANegative ? 'mənfi' : 'müsbət';
        const signWordEn = isANegative ? 'negative' : 'positive';
        const signSymbol = isANegative ? '(-)' : '(+)';

        stepsAz.push(`📌 Qayda: Her ikisinin işarəsi eynidir (${signWordAz}) deyə toplayıb qarşısına bu ədədlərin işarəsini yazırıq.`);
        stepsAz.push(`🔍 Vizual Hesablama: ${Math.abs(a)} + ${Math.abs(effectiveB)} = ${Math.abs(ans)} ➔ İşarə ${signSymbol} ➔ Cavab: ${ans}`);

        stepsEn.push(`📌 Rule: Since both numbers have the same sign (${signWordEn}), add them up and keep their shared sign.`);
        stepsEn.push(`🔍 Visual Step: ${Math.abs(a)} + ${Math.abs(effectiveB)} = ${Math.abs(ans)} ➔ Shared sign ${signSymbol} ➔ Result: ${ans}`);
      }

      q = {
        type: 'text',
        renderQuestion: () => `${a} ${isAdd ? '+' : '-'} (${b})`,
        answer: ans.toString(),
        stepsAz,
        stepsEn
      };
    } else if (selectedTopic === TOPICS.INTEGER_MUL_DIV) {
      const isMul = Math.random() > 0.5;
      let a, b, ans;
      const mult = difficulty === 'hard' ? 20 : difficulty === 'medium' ? 12 : 6;
      
      if (isMul) {
        a = difficulty === 'easy' ? rand(1, 10) : randNonZero(-mult, mult);
        b = difficulty === 'easy' ? rand(1, 10) : randNonZero(-mult, mult);
        ans = a * b;
        q = {
          type: 'text',
          renderQuestion: () => `${a} × (${b})`,
          answer: ans.toString(),
          stepsAz: [
            `1. İşarəni təyin et: ${a < 0 && b < 0 ? 'İki mənfi ➔ Müsbət (+)' : (a < 0 || b < 0 ? 'Bir mənfi, bir müsbət ➔ Mənfi (-)' : 'İki müsbət ➔ Müsbət (+)')}`,
            `2. Ədədləri bir-birinə vur: |${a}| × |${b}| = ${Math.abs(ans)}`,
            `Nəticə: ${ans}`
          ],
          stepsEn: [
            `1. Determine sign: ${a < 0 && b < 0 ? 'Two negatives ➔ Positive (+)' : (a < 0 || b < 0 ? 'One negative, one positive ➔ Negative (-)' : 'Two positives ➔ Positive (+)')}`,
            `2. Multiply numbers: |${a}| × |${b}| = ${Math.abs(ans)}`,
            `Result: ${ans}`
          ]
        };
      } else {
        b = difficulty === 'easy' ? rand(1, 8) : randNonZero(-mult, mult);
        ans = difficulty === 'easy' ? rand(1, 10) : randNonZero(-mult, mult);
        a = b * ans;
        q = {
          type: 'text',
          renderQuestion: () => `${a} ÷ (${b})`,
          answer: ans.toString(),
          stepsAz: [
            `1. İşarəni təyin et: ${a < 0 && b < 0 ? 'İki mənfi ➔ Müsbət (+)' : (a < 0 || b < 0 ? 'Bir mənfi, bir müsbət ➔ Mənfi (-)' : 'İki müsbət ➔ Müsbət (+)')}`,
            `2. Bölməni yerinə yetir: |${a}| ÷ |${b}| = ${Math.abs(ans)}`,
            `Nəticə: ${ans}`
          ],
          stepsEn: [
            `1. Determine sign: ${a < 0 && b < 0 ? 'Two negatives ➔ Positive (+)' : (a < 0 || b < 0 ? 'One negative, one positive ➔ Negative (-)' : 'Two positives ➔ Positive (+)')}`,
            `2. Divide numbers: |${a}| ÷ |${b}| = ${Math.abs(ans)}`,
            `Result: ${ans}`
          ]
        };
      }
    } else if (selectedTopic === TOPICS.FRACTION_OPS) {
      let n1, d1, n2, d2, isAdd;
      if (difficulty === 'easy') {
        d1 = rand(3, 8);
        d2 = d1;
        n1 = rand(1, d1 - 1);
        n2 = rand(1, d2 - 1);
        isAdd = true;
      } else if (difficulty === 'medium') {
        d1 = rand(2, 6);
        d2 = rand(2, 6);
        n1 = rand(1, 6);
        n2 = rand(1, 6);
        isAdd = Math.random() > 0.5;
      } else {
        d1 = rand(4, 10);
        d2 = rand(4, 10);
        n1 = randNonZero(-8, 8);
        n2 = randNonZero(-8, 8);
        isAdd = Math.random() > 0.5;
      }

      const commonDen = lcm(d1, d2);
      const m1 = commonDen / d1;
      const m2 = commonDen / d2;
      const rawNum = isAdd ? (n1 * m1 + n2 * m2) : (n1 * m1 - n2 * m2);
      const simp = simplifyFraction(rawNum, commonDen);

      const stepsAz = [];
      const stepsEn = [];

      if (d1 === d2) {
        stepsAz.push(`Məxrəclər eynidir (${d1}), məxrəc olduğu kimi qalır.`);
        stepsAz.push(`Sürətlər ${isAdd ? 'toplanır' : 'çıxılır'}: ${n1} ${isAdd ? '+' : '-'} ${n2} = ${rawNum}.`);
        if (simp.num !== rawNum || simp.den !== commonDen) {
          stepsAz.push(`Kəsr ixtisar olunur: ${rawNum}/${commonDen} ➔ ${simp.den === 1 ? simp.num : `${simp.num}/${simp.den}`}`);
        }
        stepsAz.push(`Nəticə: ${simp.den === 1 ? simp.num : `${simp.num}/${simp.den}`}`);

        stepsEn.push(`The denominators are equal (${d1}), denominator stays the same.`);
        stepsEn.push(`Numerators are ${isAdd ? 'added' : 'subtracted'}: ${n1} ${isAdd ? '+' : '-'} ${n2} = ${rawNum}.`);
        if (simp.num !== rawNum || simp.den !== commonDen) {
          stepsEn.push(`Simplify fraction: ${rawNum}/${commonDen} ➔ ${simp.den === 1 ? simp.num : `${simp.num}/${simp.den}`}`);
        }
        stepsEn.push(`Result: ${simp.den === 1 ? simp.num : `${simp.num}/${simp.den}`}`);
      } else {
        stepsAz.push(`1. ƏKOB tapılır: ƏKOB(${d1}, ${d2}) = ${commonDen}.`);
        stepsAz.push(`2. Vuruqlar: I kəsr ×${m1}, II kəsr ×${m2}.`);
        stepsAz.push(`3. Sürətlər: (${n1}×${m1}) ${isAdd ? '+' : '-'} (${n2}×${m2}) = ${rawNum}.`);
        stepsAz.push(`4. İxtisar: ${rawNum}/${commonDen} ➔ ${simp.den === 1 ? simp.num : `${simp.num}/${simp.den}`}`);

        stepsEn.push(`1. Find LCD: LCD(${d1}, ${d2}) = ${commonDen}.`);
        stepsEn.push(`2. Multipliers: 1st ×${m1}, 2nd ×${m2}.`);
        stepsEn.push(`3. Numerators: (${n1}×${m1}) ${isAdd ? '+' : '-'} (${n2}×${m2}) = ${rawNum}.`);
        stepsEn.push(`4. Simplify: ${rawNum}/${commonDen} ➔ ${simp.den === 1 ? simp.num : `${simp.num}/${simp.den}`}`);
      }

      q = {
        type: 'fraction',
        renderQuestion: () => (
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <FractionDisplay num={n1} den={d1} /> {isAdd ? '+' : '-'} <FractionDisplay num={n2} den={d2} />
          </span>
        ),
        answerObj: simp,
        answerStr: simp.den === 1 ? `${simp.num}` : `${simp.num}/${simp.den}`,
        answerRender: () => simp.den === 1 ? <span>{simp.num}</span> : <FractionDisplay num={simp.num} den={simp.den} />,
        stepsAz,
        stepsEn
      };
    } else if (selectedTopic === TOPICS.FACTORING) {
      const factor = rand(2, difficulty === 'hard' ? 9 : 4);
      const a = rand(1, 5);
      const b = rand(1, 6);
      const sign = Math.random() > 0.5 ? '+' : '-';
      const ans = `${factor}(${a === 1 ? '' : a}x ${sign} ${b})`;
      q = {
        type: 'text',
        renderQuestion: () => `${factor * a}x ${sign} ${factor * b}`,
        answer: ans,
        stepsAz: [
          `1. Ortaya çıxan ƏBOB: ƏBOB(${factor * a}, ${factor * b}) = ${factor}.`,
          `2. ${factor} mötərizə xaricinə yazılır.`,
          `Nəticə: ${ans}`
        ],
        stepsEn: [
          `1. Find GCF: GCF(${factor * a}, ${factor * b}) = ${factor}.`,
          `2. Write ${factor} outside parenthesis.`,
          `Result: ${ans}`
        ]
      };
    } else if (selectedTopic === TOPICS.EXPAND_BRACKETS) {
      const a = rand(1, 7);
      const b = rand(1, 9);
      const sign = Math.random() > 0.5 ? '+' : '-';
      const ans = sign === '+' ? `-${a}x - ${b}` : `-${a}x + ${b}`;
      q = {
        type: 'text',
        renderQuestion: () => `-(${a}x ${sign} ${b})`,
        answer: ans,
        stepsAz: [
          `1. Mötərizə qarşısındakı mənfi (-) içəridəki HƏR İŞARƏNİ dəyişir.`,
          `Nəticə: ${ans}`
        ],
        stepsEn: [
          `1. Negative (-) in front flips EVERY sign inside.`,
          `Result: ${ans}`
        ]
      };
    } else if (selectedTopic === TOPICS.ALGEBRAIC_IDENTITIES) {
      const a = rand(1, 6);
      const isSquare = Math.random() > 0.5;
      if (isSquare) {
        const ans = `x² + ${2*a}x + ${a*a}`;
        q = {
          type: 'text',
          renderQuestion: () => `(x + ${a})²`,
          answer: ans,
          stepsAz: [
            `Düstur: (A + B)² = A² + 2AB + B²`,
            `Tətbiq: x² + 2·x·${a} + ${a}² = ${ans}`
          ],
          stepsEn: [
            `Formula: (A + B)² = A² + 2AB + B²`,
            `Apply: x² + 2·x·${a} + ${a}² = ${ans}`
          ]
        };
      } else {
        const ans = `(x - ${a})(x + ${a})`;
        q = {
          type: 'text',
          renderQuestion: () => `x² - ${a*a}`,
          answer: ans,
          stepsAz: [
            `Düstur: A² - B² = (A - B)(A + B)`,
            `Tətbiq: x² - ${a}² ➔ (x - ${a})(x + ${a})`
          ],
          stepsEn: [
            `Formula: A² - B² = (A - B)(A + B)`,
            `Apply: x² - ${a}² ➔ (x - ${a})(x + ${a})`
          ]
        };
      }
    }

    const options = [];
    const correctAnsStr = q.type === 'fraction' ? q.answerStr : q.answer;
    
    options.push({
      str: correctAnsStr,
      render: q.type === 'fraction' ? q.answerRender : () => <span>{q.answer}</span>
    });

    while (options.length < 4) {
      let fakeStr = '';
      let fakeRender = null;

      if (q.type === 'fraction') {
        const fakeN = q.answerObj.num + randNonZero(-3, 3);
        const fakeD = Math.max(2, q.answerObj.den + rand(-2, 2));
        const simpF = simplifyFraction(fakeN, fakeD);
        fakeStr = simpF.den === 1 ? `${simpF.num}` : `${simpF.num}/${simpF.den}`;
        fakeRender = () => simpF.den === 1 ? <span>{simpF.num}</span> : <FractionDisplay num={simpF.num} den={simpF.den} />;
      } else {
        const numAns = parseInt(q.answer);
        if (!isNaN(numAns)) {
          fakeStr = (numAns + randNonZero(-5, 5)).toString();
        } else {
          fakeStr = `-${rand(1, 5)}x + ${rand(1, 9)}`;
        }
        fakeRender = () => <span>{fakeStr}</span>;
      }

      if (!options.some(opt => opt.str === fakeStr)) {
        options.push({ str: fakeStr, render: fakeRender });
      }
    }
    q.options = options.sort(() => Math.random() - 0.5);

    setCurrentQuestion(q);
  };

  useEffect(() => {
    generateQuestion();
  }, [selectedTopic, difficulty]);

  const handleCheckAnswer = (selectedVal = null) => {
    const valToCheck = selectedVal !== null ? selectedVal : userAnswer.trim();
    if (!valToCheck) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const targetAnswer = currentQuestion.type === 'fraction' ? currentQuestion.answerStr : currentQuestion.answer;
    const isCorrect = valToCheck.replaceAll(' ', '') === targetAnswer.replaceAll(' ', '');

    if (isCorrect) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      const gainedXp = difficulty === 'hard' ? 30 : difficulty === 'medium' ? 20 : 10;
      setScore(prev => prev + gainedXp);
      setStreak(prev => prev + 1);
      setFeedback({ isCorrect: true, msg: lang === 'az' ? 'ƏLA! DÜZGÜN CAVAB! 🎉' : 'GREAT! CORRECT ANSWER! 🎉' });
      setShowDetailedExplanation(true);
      updateLeaderboard(gainedXp);
    } else {
      setStreak(0);
      setFeedback({ isCorrect: false, msg: lang === 'az' ? 'YENİDƏN SINAYIN! 💪' : 'TRY AGAIN! 💪' });
    }
  };

  const paperBg = '#fbf0d9';
  const cardBg = '#f4e4c1';
  const innerBg = '#fff8e7';
  const inkColor = '#3d2b1f';
  const borderStyle = '3px solid #6b4c35';

  if (!isProfileSaved) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: paperBg, padding: '20px', fontFamily: '"Courier New", Courier, monospace' }}>
        <div style={{ background: cardBg, borderRadius: '24px', padding: '40px', maxWidth: '450px', width: '100%', border: borderStyle, boxShadow: '8px 8px 0px #6b4c35', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <button onClick={() => setLang(lang === 'az' ? 'en' : 'az')} style={{ background: innerBg, border: '2px solid #6b4c35', padding: '6px 12px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={16} /> {lang.toUpperCase()}
            </button>
          </div>
          <div style={{ width: '80px', height: '80px', background: '#8c5a3c', color: '#fff', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '3px solid #3d2b1f' }}>
            <GraduationCap size={40} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: inkColor, marginBottom: '10px' }}>{t.welcome}</h1>
          <p style={{ color: '#5a4231', fontSize: '16px', marginBottom: '30px' }}>{t.enterDetails}</p>
          <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '800', color: inkColor, display: 'block', marginBottom: '8px' }}>{t.nameLabel}</label>
              <input
                type="text"
                required
                placeholder="Əli Məmmədov"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '2px solid #6b4c35', fontSize: '18px', boxSizing: 'border-box', background: innerBg, color: inkColor }}
              />
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '800', color: inkColor, display: 'block', marginBottom: '8px' }}>{t.gradeLabel}</label>
              <select
                value={studentGrade}
                onChange={(e) => setStudentGrade(e.target.value)}
                style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '2px solid #6b4c35', fontSize: '18px', boxSizing: 'border-box', background: innerBg, color: inkColor }}
              >
                <option value="5">5 {t.gradeSuffix}</option>
                <option value="6">6 {t.gradeSuffix}</option>
                <option value="7">7 {t.gradeSuffix}</option>
                <option value="8">8 {t.gradeSuffix}</option>
                <option value="9">9 {t.gradeSuffix}</option>
              </select>
            </div>
            <button type="submit" style={{ width: '100%', padding: '18px', background: '#8c5a3c', color: '#fff', fontSize: '18px', fontWeight: '900', border: '3px solid #3d2b1f', borderRadius: '14px', cursor: 'pointer', marginTop: '10px', boxShadow: '4px 4px 0px #3d2b1f' }}>
              {t.startBtn}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const stepsToRender = currentQuestion ? (lang === 'az' ? currentQuestion.stepsAz : currentQuestion.stepsEn) : [];

  return (
    <div style={{ minHeight: '100vh', background: paperBg, padding: '24px 16px', color: inkColor, fontFamily: '"Courier New", Courier, monospace' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* HEADER */}
        <header style={{ background: cardBg, padding: '20px 28px', borderRadius: '24px', border: borderStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '6px 6px 0px #6b4c35' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: '#8c5a3c', color: '#fff', padding: '14px', borderRadius: '16px', border: '2px solid #3d2b1f' }}>
              <Brain size={32} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: inkColor }}>{t.title}</h1>
              <p style={{ margin: '4px 0 0', fontSize: '15px', fontWeight: '800', color: '#8c5a3c' }}>
                {t.student}: {studentName} ({studentGrade} {t.gradeSuffix})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setLang(lang === 'az' ? 'en' : 'az')} style={{ background: innerBg, border: '2px solid #6b4c35', padding: '8px 14px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: inkColor }}>
              <Globe size={18} /> {lang.toUpperCase()}
            </button>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ background: innerBg, border: '2px solid #6b4c35', padding: '8px 14px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '900', color: '#b45309', fontSize: '15px' }}>
                <Zap size={18} color="#b45309" fill="#b45309" /> {score} XP
              </div>
              <div style={{ background: innerBg, border: '2px solid #6b4c35', padding: '8px 14px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '900', color: '#c2410c', fontSize: '15px' }}>
                <Flame size={18} color="#c2410c" fill="#c2410c" /> {streak}
              </div>
            </div>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          {/* SOL PANEL */}
          <div style={{ background: cardBg, padding: '24px', borderRadius: '24px', border: borderStyle, display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '6px 6px 0px #6b4c35' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '900', color: '#5a4231', display: 'block', marginBottom: '12px' }}>{t.selectTopic}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(t.topics).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTopic(key)}
                    style={{ textAlign: 'left', padding: '14px 16px', borderRadius: '14px', border: '2px solid #6b4c35', background: selectedTopic === key ? '#8c5a3c' : innerBg, color: selectedTopic === key ? '#fff' : inkColor, fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '900', color: '#5a4231', display: 'block', marginBottom: '12px' }}>{t.selectDiff}</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {Object.entries(t.diffs).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setDifficulty(id)}
                    style={{ padding: '12px', borderRadius: '14px', border: '2px solid #6b4c35', background: difficulty === id ? '#d97706' : innerBg, color: difficulty === id ? '#fff' : inkColor, fontWeight: '900', fontSize: '14px', cursor: 'pointer' }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SAĞ PANEL */}
          <div style={{ gridColumn: 'span 2', background: cardBg, padding: '36px', borderRadius: '24px', border: borderStyle, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '32px', boxShadow: '6px 6px 0px #6b4c35' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ background: innerBg, color: inkColor, padding: '8px 16px', borderRadius: '12px', fontWeight: '900', fontSize: '14px', border: '2px solid #6b4c35' }}>
                  {t.topics[selectedTopic]}
                </span>
                <span style={{ fontWeight: '800', fontSize: '15px', color: inkColor }}>{t.timer} <strong style={{ color: '#b45309', fontSize: '20px' }}>{questionTimer} {t.sec}</strong></span>
              </div>

              {currentQuestion && (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: innerBg, borderRadius: '24px', border: '3px dashed #6b4c35' }}>
                  <p style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '900', color: '#8c5a3c', letterSpacing: '1px' }}>{t.solvePrompt}</p>
                  <div style={{ fontSize: '38px', fontWeight: '900', color: inkColor, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {typeof currentQuestion.renderQuestion === 'function' ? currentQuestion.renderQuestion() : currentQuestion.renderQuestion} = ?
                  </div>
                </div>
              )}

              {/* OPTIONS / INPUT */}
              {currentQuestion?.options && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {currentQuestion.options.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={feedback?.isCorrect}
                      onClick={() => { setMcqSelection(opt.str); handleCheckAnswer(opt.str); }}
                      style={{ padding: '20px', borderRadius: '16px', border: '3px solid #6b4c35', background: mcqSelection === opt.str ? (feedback?.isCorrect ? '#a7f3d0' : '#fecaca') : innerBg, color: inkColor, fontSize: '22px', fontWeight: '900', cursor: 'pointer', boxShadow: '3px 3px 0px #6b4c35', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                      {opt.render()}
                    </button>
                  ))}
                </div>
              )}

              {/* CAVAB VƏ İDARƏETMƏ PANELİ */}
              {feedback && (
                <div style={{ padding: '24px', borderRadius: '16px', border: '3px solid #6b4c35', background: feedback.isCorrect ? '#d1fae5' : '#fee2e2', color: feedback.isCorrect ? '#065f46' : '#991b1b' }}>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>{feedback.msg}</p>
                  
                  {!feedback.isCorrect && (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
                      <button
                        onClick={() => setShowDetailedExplanation(true)}
                        style={{ padding: '10px 16px', background: '#d97706', color: '#fff', border: '2px solid #78350f', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Eye size={16} /> {t.showSolutionBtn}
                      </button>
                      <button
                        onClick={() => { setFeedback(null); setMcqSelection(null); setShowDetailedExplanation(false); }}
                        style={{ padding: '10px 16px', background: '#0284c7', color: '#fff', border: '2px solid #075985', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <RefreshCw size={16} /> {t.retryBtn}
                      </button>
                    </div>
                  )}

                  {/* İZAH PANELİ */}
                  {(showDetailedExplanation || feedback.isCorrect) && stepsToRender.length > 0 && (
                    <div style={{ marginTop: '20px', padding: '16px', background: innerBg, borderRadius: '14px', border: '2px solid #6b4c35', color: inkColor }}>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: '900', color: '#8c5a3c', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BookOpen size={18} /> {t.solutionTitle}
                      </h4>
                      <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '15px', fontWeight: '800', lineHeight: '1.7' }}>
                        {stepsToRender.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                      <div style={{ marginTop: '12px', padding: '8px 12px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b', fontSize: '14px', fontWeight: '900', color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        🎯 {t.correctAnsLabel} {currentQuestion.type === 'fraction' ? currentQuestion.answerRender() : currentQuestion.answer}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

            <div style={{ borderTop: '2px solid #6b4c35', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={generateQuestion}
                style={{ padding: '16px 32px', background: '#3d2b1f', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '4px 4px 0px #6b4c35' }}
              >
                {t.nextBtn} <RotateCcw size={18} />
              </button>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <footer style={{ textAlign: 'center', marginTop: '12px', padding: '8px', fontSize: '14px', fontWeight: '900', color: '#8c5a3c', letterSpacing: '1px' }}>
          {t.authorFooter}
        </footer>

      </div>
    </div>
  );
}
