import React, { useState, useEffect } from 'react';
import { 
  Brain, RotateCcw, Globe, BookOpen, Flame, Zap, 
  GraduationCap, Eye, RefreshCw, LogOut, Trophy, UserCheck, Key, School 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TRANSLATIONS = {
  az: {
    title: 'Riyaziyyat Dəftəri 📜',
    welcome: 'Xoş Gəldiniz! 📖',
    enterDetails: 'Profil növünü seçin və daxil olun:',
    roleStudent: 'Şagird',
    roleTeacher: 'Müəllim',
    nameLabel: 'AD VƏ SOYAD',
    gradeLabel: 'SİNİF',
    gradeSuffix: '-ci sinif',
    teacherKeyLabel: 'MÜƏLLİM AÇARI (DISTINCT KEY)',
    teacherKeyPlaceholder: 'Məsələn: MATH-TEACHER-99',
    newTeacherBtn: 'Yeni Müəllim Qeydiyyatı',
    existingTeacherBtn: 'Kodu Olan Müəllim Girişi',
    startBtn: 'Daxil Ol 🔑',
    signOutBtn: 'Çıxış Et 🚪',
    student: 'Şagird',
    teacher: 'Müəllim',
    practice: 'Təcrübə',
    leaderboardTitle: '🏆 Liderlər Lövhəsi (Top 10)',
    teacherSpaceTitle: '👨‍🏫 Müəllim Paneli',
    selectTopic: '1. MÖVZU SEÇİN',
    selectDiff: '2. ÇƏTİNLİK SƏVİYYƏSİ',
    solvePrompt: 'MISALI HƏLL EDİN 🖋️',
    timer: 'Taymer:',
    sec: 'san',
    checkBtn: 'Yoxla',
    nextBtn: 'Növbəti Sual',
    retryBtn: 'Təkrar Həll Et 🔄',
    showSolutionBtn: 'Həllə Bax 💡',
    xp: 'Ümumi XP',
    solutionTitle: 'ADDIM-ADDIM HƏLL YOLU:',
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
    welcome: 'Welcome! 📖',
    enterDetails: 'Select your role and sign in:',
    roleStudent: 'Student',
    roleTeacher: 'Teacher',
    nameLabel: 'FULL NAME',
    gradeLabel: 'GRADE',
    gradeSuffix: 'th Grade',
    teacherKeyLabel: 'DISTINCT TEACHER KEY',
    teacherKeyPlaceholder: 'e.g. MATH-TEACHER-99',
    newTeacherBtn: 'New Teacher Sign Up',
    existingTeacherBtn: 'Existing Key Login',
    startBtn: 'Sign In 🔑',
    signOutBtn: 'Sign Out 🚪',
    student: 'Student',
    teacher: 'Teacher',
    practice: 'Practice',
    leaderboardTitle: '🏆 Leaderboard (Top 10)',
    teacherSpaceTitle: '👨‍🏫 Teacher Space',
    selectTopic: '1. SELECT TOPIC',
    selectDiff: '2. DIFFICULTY',
    solvePrompt: 'SOLVE THE PROBLEM 🖋️',
    timer: 'Timer:',
    sec: 'sec',
    checkBtn: 'Check',
    nextBtn: 'Next Question',
    retryBtn: 'Try Again 🔄',
    showSolutionBtn: 'View Solution 💡',
    xp: 'Total XP',
    solutionTitle: 'STEP-BY-STEP SOLUTION:',
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
  a = Math.abs(a); b = Math.abs(b);
  while (b) { const t = b; b = a % b; a = t; }
  return a;
};

const lcm = (a, b) => (a === 0 || b === 0) ? 0 : Math.abs((a * b) / gcd(a, b));

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

  const [userRole, setUserRole] = useState(() => localStorage.getItem('math_user_role') || 'student');
  const [studentName, setStudentName] = useState(() => localStorage.getItem('math_student_name') || '');
  const [studentGrade, setStudentGrade] = useState(() => localStorage.getItem('math_student_grade') || '6');
  const [teacherKey, setTeacherKey] = useState(() => localStorage.getItem('math_teacher_key') || '');
  const [isNewTeacher, setIsNewTeacher] = useState(false);
  const [teacherNameInput, setTeacherNameInput] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(() => !!localStorage.getItem('math_student_name') || !!localStorage.getItem('math_teacher_key'));

  const [activeTab, setActiveTab] = useState('practice');
  const [selectedTopic, setSelectedTopic] = useState(TOPICS.INTEGER_ADD_SUB);
  const [difficulty, setDifficulty] = useState('easy');

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [mcqSelection, setMcqSelection] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [lastQuestionKey, setLastQuestionKey] = useState('');

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showDetailedExplanation, setShowDetailedExplanation] = useState(false);

  const [leaderboard, setLeaderboard] = useState([]);

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

  const generateTeacherKey = (name) => {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4) || 'TEACHER';
    return `${cleanName}-${randNum}`;
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (userRole === 'student' && studentName.trim()) {
      localStorage.setItem('math_user_role', 'student');
      localStorage.setItem('math_student_name', studentName.trim());
      localStorage.setItem('math_student_grade', studentGrade);
      setIsSignedIn(true);
    } else if (userRole === 'teacher') {
      if (isNewTeacher) {
        if (!teacherNameInput.trim()) return;
        const generatedKey = generateTeacherKey(teacherNameInput.trim());
        setTeacherKey(generatedKey);
        localStorage.setItem('math_user_role', 'teacher');
        localStorage.setItem('math_teacher_key', generatedKey);
        localStorage.setItem('math_student_name', teacherNameInput.trim());
        setIsSignedIn(true);
        setActiveTab('teacher_space');
      } else {
        if (!teacherKey.trim()) return;
        localStorage.setItem('math_user_role', 'teacher');
        localStorage.setItem('math_teacher_key', teacherKey.trim());
        localStorage.setItem('math_student_name', `Müəllim (${teacherKey.trim()})`);
        setIsSignedIn(true);
        setActiveTab('teacher_space');
      }
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('math_student_name');
    localStorage.removeItem('math_student_grade');
    localStorage.removeItem('math_teacher_key');
    localStorage.removeItem('math_user_role');
    setIsSignedIn(false);
    setStudentName('');
    setTeacherKey('');
  };

  const updateLeaderboard = (xpDelta, isCorrect = true) => {
    setLeaderboard(prev => {
      const existingIdx = prev.findIndex(item => item.name.toLowerCase() === studentName.toLowerCase() && item.grade === studentGrade);
      let updated = [...prev];
      if (existingIdx >= 0) {
        updated[existingIdx].xp = Math.max(0, updated[existingIdx].xp + xpDelta);
        if (isCorrect) updated[existingIdx].totalSolved += 1;
      } else {
        updated.push({
          id: Date.now(),
          name: studentName,
          grade: studentGrade,
          xp: Math.max(0, xpDelta),
          totalSolved: isCorrect ? 1 : 0
        });
      }
      return updated.sort((a, b) => b.xp - a.xp).slice(0, 10);
    });
  };

  const generateQuestion = () => {
    setFeedback(null);
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
    let qKey = '';

    do {
      if (selectedTopic === TOPICS.INTEGER_ADD_SUB) {
        let a = rand(-20, 20);
        let b = rand(-20, 20);
        let isAdd = Math.random() > 0.5;
        let effectiveB = isAdd ? b : -b;
        const ans = a + effectiveB;
        qKey = `${a}_${isAdd ? '+' : '-'}_${b}`;

        const distractors = [(-ans).toString(), (ans + 1).toString(), (ans - 1).toString()].filter(d => d !== ans.toString());

        const modA = Math.abs(a);
        const modB = Math.abs(effectiveB);
        const stepsAz = [];
        const stepsEn = [];

        if (!isAdd) {
          stepsAz.push(`1. Çıxma əməli toplama kimi yazılır: ${a} - (${b}) ➔ ${a} + (${effectiveB})`);
          stepsEn.push(`1. Convert subtraction to addition: ${a} - (${b}) ➔ ${a} + (${effectiveB})`);
        }

        if ((a < 0 && effectiveB > 0) || (a > 0 && effectiveB < 0)) {
          const largerMod = modA > modB ? a : effectiveB;
          const largerVal = Math.max(modA, modB);
          const smallerVal = Math.min(modA, modB);
          const signStr = largerMod < 0 ? 'mənfi (-)' : 'müsbət (+)';

          stepsAz.push(`📌 İşarələr müxtəlifdir: biri mənfi, digəri müsbətdir.`);
          stepsAz.push(`🔍 Modulların müqayisəsi: |${a}| = ${modA}, |${effectiveB}| = ${modB}. Modulu böyük olan ${largerVal}-dir (işarəsi ${signStr}).`);
          stepsAz.push(`✏️ Hesablama: Modulu böyük olandan kiçiyi çıxırıq: ${largerVal} - ${smallerVal} = ${largerVal - smallerVal}.`);
          stepsAz.push(`💡 Yekun: Nəticəyə modulu böyük olanın işarəsi yazılır ➔ Cavab: ${ans}`);

          stepsEn.push(`📌 Signs are different: one is negative, one is positive.`);
          stepsEn.push(`🔍 Compare absolute values: |${a}| = ${modA}, |${effectiveB}| = ${modB}. Larger absolute value is ${largerVal}.`);
          stepsEn.push(`✏️ Calculation: Subtract smaller from larger: ${largerVal} - ${smallerVal} = ${largerVal - smallerVal}.`);
          stepsEn.push(`💡 Result: Apply sign of larger absolute value ➔ Result: ${ans}`);
        } else {
          stepsAz.push(`📌 İşarələr eynidir: hər iki ədəd ${a < 0 ? 'mənfidir' : 'müsbətdir'}.`);
          stepsAz.push(`✏️ Hesablama: Modulları toplayırıq: ${modA} + ${modB} = ${modA + modB}.`);
          stepsAz.push(`💡 Yekun: Ortaq işarə saxlanılır ➔ Cavab: ${ans}`);

          stepsEn.push(`📌 Signs are the same: both are ${a < 0 ? 'negative' : 'positive'}.`);
          stepsEn.push(`✏️ Calculation: Add absolute values: ${modA} + ${modB} = ${modA + modB}.`);
          stepsEn.push(`💡 Result: Keep common sign ➔ Result: ${ans}`);
        }

        q = {
          type: 'text',
          renderQuestion: () => `${a} ${isAdd ? '+' : '-'} (${b})`,
          answer: ans.toString(),
          distractors,
          stepsAz,
          stepsEn
        };
      } else {
        let a = rand(2, 6);
        let ans = `(x - ${a})(x + ${a})`;
        qKey = `id_${a}`;
        q = {
          type: 'text',
          renderQuestion: () => `x² - ${a*a}`,
          answer: ans,
          distractors: [`(x - ${a})(x - ${a})`, `(x + ${a})(x + ${a})`],
          stepsAz: [`A² - B² = (A - B)(A + B) ➔ (x - ${a})(x + ${a})`],
          stepsEn: [`A² - B² = (A - B)(A + B) ➔ (x - ${a})(x + ${a})`]
        };
      }
    } while (qKey === lastQuestionKey);

    setLastQuestionKey(qKey);

    const options = [{ str: q.answer, render: () => <span>{q.answer}</span> }];
    q.distractors.forEach(dist => {
      if (options.length < 4 && !options.some(o => o.str === dist)) {
        options.push({ str: dist, render: () => <span>{dist}</span> });
      }
    });

    while (options.length < 4) {
      const fake = `-${rand(1, 5)}x + ${rand(1, 9)}`;
      if (!options.some(o => o.str === fake)) options.push({ str: fake, render: () => <span>{fake}</span> });
    }

    q.options = options.sort(() => Math.random() - 0.5);
    setCurrentQuestion(q);
  };

  useEffect(() => {
    if (isSignedIn) generateQuestion();
  }, [selectedTopic, difficulty, isSignedIn]);

  const handleCheckAnswer = (selectedVal) => {
    if (!selectedVal) return;

    const currentAttempts = attempts;
    setAttempts(prev => prev + 1);

    const targetAnswer = currentQuestion.answer;
    const isCorrect = selectedVal.replaceAll(' ', '') === targetAnswer.replaceAll(' ', '');

    if (isCorrect) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      let gainedXp = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15;
      setScore(prev => prev + gainedXp);
      setStreak(prev => (currentAttempts === 0 ? prev + 1 : prev));
      setFeedback({ 
        isCorrect: true, 
        msg: lang === 'az' ? `ƏLA! DÜZGÜN CAVAB! 🎉 (+${gainedXp} XP)` : `GREAT! CORRECT ANSWER! 🎉 (+${gainedXp} XP)` 
      });
      setShowDetailedExplanation(false);
      updateLeaderboard(gainedXp, true);
    } else {
      setStreak(0);
      let penaltyXp = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15;
      setScore(prev => Math.max(0, prev - penaltyXp));
      setFeedback({ 
        isCorrect: false, 
        msg: lang === 'az' ? `⚠️ SƏHV CAVAB! -${penaltyXp} XP çıxıldı, Streak 0 oldu.` : `⚠️ WRONG ANSWER! -${penaltyXp} XP deducted, Streak reset to 0.` 
      });
      updateLeaderboard(-penaltyXp, false);
    }
  };

  const paperBg = '#fbf0d9';
  const cardBg = '#f4e4c1';
  const innerBg = '#fff8e7';
  const inkColor = '#3d2b1f';
  const borderStyle = '3px solid #6b4c35';

  if (!isSignedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: paperBg, padding: '20px', fontFamily: '"Courier New", Courier, monospace' }}>
        <div style={{ background: cardBg, borderRadius: '24px', padding: '36px', maxWidth: '450px', width: '100%', border: borderStyle, boxShadow: '8px 8px 0px #6b4c35', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <button onClick={() => setLang(lang === 'az' ? 'en' : 'az')} style={{ background: innerBg, border: '2px solid #6b4c35', padding: '6px 12px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={16} /> {lang.toUpperCase()}
            </button>
          </div>
          
          <div style={{ width: '70px', height: '70px', background: '#8c5a3c', color: '#fff', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '3px solid #3d2b1f' }}>
            <GraduationCap size={36} />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '900', color: inkColor, marginBottom: '8px' }}>{t.welcome}</h1>
          <p style={{ color: '#5a4231', fontSize: '15px', marginBottom: '24px' }}>{t.enterDetails}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
            <button onClick={() => setUserRole('student')} style={{ padding: '12px', borderRadius: '12px', border: '2px solid #6b4c35', background: userRole === 'student' ? '#8c5a3c' : innerBg, color: userRole === 'student' ? '#fff' : inkColor, fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <UserCheck size={18} /> {t.roleStudent}
            </button>
            <button onClick={() => setUserRole('teacher')} style={{ padding: '12px', borderRadius: '12px', border: '2px solid #6b4c35', background: userRole === 'teacher' ? '#8c5a3c' : innerBg, color: userRole === 'teacher' ? '#fff' : inkColor, fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Key size={18} /> {t.roleTeacher}
            </button>
          </div>

          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'left' }}>
            {userRole === 'student' ? (
              <>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '800', color: inkColor, display: 'block', marginBottom: '6px' }}>{t.nameLabel}</label>
                  <input type="text" required placeholder="Əli Məmmədov" value={studentName} onChange={(e) => setStudentName(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #6b4c35', fontSize: '16px', boxSizing: 'border-box', background: innerBg, color: inkColor }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '800', color: inkColor, display: 'block', marginBottom: '6px' }}>{t.gradeLabel}</label>
                  <select value={studentGrade} onChange={(e) => setStudentGrade(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #6b4c35', fontSize: '16px', boxSizing: 'border-box', background: innerBg, color: inkColor }}>
                    <option value="5">5 {t.gradeSuffix}</option>
                    <option value="6">6 {t.gradeSuffix}</option>
                    <option value="7">7 {t.gradeSuffix}</option>
                    <option value="8">8 {t.gradeSuffix}</option>
                    <option value="9">9 {t.gradeSuffix}</option>
                  </select>
                </div>
              </>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <button type="button" onClick={() => setIsNewTeacher(false)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #6b4c35', background: !isNewTeacher ? '#8c5a3c' : innerBg, color: !isNewTeacher ? '#fff' : inkColor, fontWeight: '800', fontSize: '12px' }}>{t.existingTeacherBtn}</button>
                  <button type="button" onClick={() => setIsNewTeacher(true)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #6b4c35', background: isNewTeacher ? '#8c5a3c' : innerBg, color: isNewTeacher ? '#fff' : inkColor, fontWeight: '800', fontSize: '12px' }}>{t.newTeacherBtn}</button>
                </div>
                {isNewTeacher ? (
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '800', color: inkColor, display: 'block', marginBottom: '6px' }}>{t.nameLabel}</label>
                    <input type="text" required placeholder="Müəllim Adı" value={teacherNameInput} onChange={(e) => setTeacherNameInput(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #6b4c35', fontSize: '16px', boxSizing: 'border-box', background: innerBg, color: inkColor }} />
                  </div>
                ) : (
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '800', color: inkColor, display: 'block', marginBottom: '6px' }}>{t.teacherKeyLabel}</label>
                    <input type="text" required placeholder={t.teacherKeyPlaceholder} value={teacherKey} onChange={(e) => setTeacherKey(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #6b4c35', fontSize: '16px', boxSizing: 'border-box', background: innerBg, color: inkColor }} />
                  </div>
                )}
              </div>
            )}

            <button type="submit" style={{ width: '100%', padding: '16px', background: '#8c5a3c', color: '#fff', fontSize: '16px', fontWeight: '900', border: '3px solid #3d2b1f', borderRadius: '14px', cursor: 'pointer', marginTop: '10px', boxShadow: '4px 4px 0px #3d2b1f' }}>
              {t.startBtn}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: paperBg, padding: '24px 16px', color: inkColor, fontFamily: '"Courier New", Courier, monospace' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <header style={{ background: cardBg, padding: '20px 28px', borderRadius: '24px', border: borderStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '6px 6px 0px #6b4c35' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: '#8c5a3c', color: '#fff', padding: '12px', borderRadius: '16px', border: '2px solid #3d2b1f' }}>
              <Brain size={30} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: inkColor }}>{t.title}</h1>
              <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: '800', color: '#8c5a3c' }}>
                {userRole === 'teacher' ? `${t.teacher}: ${teacherKey}` : `${t.student}: ${studentName} (${studentGrade} ${t.gradeSuffix})`}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setLang(lang === 'az' ? 'en' : 'az')} style={{ background: innerBg, border: '2px solid #6b4c35', padding: '8px 12px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: inkColor }}>
              <Globe size={18} /> {lang.toUpperCase()}
            </button>
            <button onClick={() => setActiveTab('practice')} style={{ padding: '8px 14px', borderRadius: '12px', border: '2px solid #6b4c35', background: activeTab === 'practice' ? '#8c5a3c' : innerBg, color: activeTab === 'practice' ? '#fff' : inkColor, fontWeight: '900', cursor: 'pointer' }}>
              {t.practice}
            </button>
            <button onClick={() => setActiveTab('leaderboard')} style={{ padding: '8px 14px', borderRadius: '12px', border: '2px solid #6b4c35', background: activeTab === 'leaderboard' ? '#8c5a3c' : innerBg, color: activeTab === 'leaderboard' ? '#fff' : inkColor, fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trophy size={16} /> Top 10
            </button>
            {userRole === 'teacher' && (
              <button onClick={() => setActiveTab('teacher_space')} style={{ padding: '8px 14px', borderRadius: '12px', border: '2px solid #6b4c35', background: activeTab === 'teacher_space' ? '#8c5a3c' : innerBg, color: activeTab === 'teacher_space' ? '#fff' : inkColor, fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <School size={16} /> Space
              </button>
            )}
            <button onClick={handleSignOut} style={{ background: '#ef4444', color: '#fff', border: '2px solid #991b1b', padding: '8px 14px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LogOut size={16} /> {t.signOutBtn}
            </button>
          </div>
        </header>

        {activeTab === 'practice' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ background: cardBg, padding: '24px', borderRadius: '24px', border: borderStyle, display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '6px 6px 0px #6b4c35' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '900', color: '#5a4231', display: 'block', marginBottom: '12px' }}>{t.selectTopic}</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(t.topics).map(([key, label]) => (
                    <button key={key} onClick={() => setSelectedTopic(key)} style={{ textAlign: 'left', padding: '14px 16px', borderRadius: '14px', border: '2px solid #6b4c35', background: selectedTopic === key ? '#8c5a3c' : innerBg, color: selectedTopic === key ? '#fff' : inkColor, fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '900', color: '#5a4231', display: 'block', marginBottom: '12px' }}>{t.selectDiff}</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {Object.entries(t.diffs).map(([id, label]) => (
                    <button key={id} onClick={() => setDifficulty(id)} style={{ padding: '12px', borderRadius: '14px', border: '2px solid #6b4c35', background: difficulty === id ? '#d97706' : innerBg, color: difficulty === id ? '#fff' : inkColor, fontWeight: '900', fontSize: '14px', cursor: 'pointer' }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ gridColumn: 'span 2', background: cardBg, padding: '36px', borderRadius: '24px', border: borderStyle, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '32px', boxShadow: '6px 6px 0px #6b4c35' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: innerBg, color: inkColor, padding: '8px 16px', borderRadius: '12px', fontWeight: '900', fontSize: '14px', border: '2px solid #6b4c35' }}>
                    {t.topics[selectedTopic]}
                  </span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ background: innerBg, border: '2px solid #6b4c35', padding: '6px 12px', borderRadius: '10px', fontWeight: '900', color: '#b45309' }}><Zap size={16} /> {score} XP</span>
                    <span style={{ background: innerBg, border: '2px solid #6b4c35', padding: '6px 12px', borderRadius: '10px', fontWeight: '900', color: '#c2410c' }}><Flame size={16} /> {streak}</span>
                  </div>
                </div>

                {currentQuestion && (
                  <div style={{ textAlign: 'center', padding: '24px 12px', background: innerBg, borderRadius: '24px', border: '3px dashed #6b4c35', overflowX: 'auto' }}>
                    <p style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '900', color: '#8c5a3c' }}>{t.solvePrompt}</p>
                    <div style={{ fontSize: 'clamp(22px, 6vw, 36px)', fontWeight: '900', color: inkColor, display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                      {currentQuestion.renderQuestion()} = ?
                    </div>
                  </div>
                )}

                {currentQuestion?.options && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                    {currentQuestion.options.map((opt, idx) => (
                      <button key={idx} disabled={feedback?.isCorrect} onClick={() => { setMcqSelection(opt.str); handleCheckAnswer(opt.str); }} style={{ padding: '20px', borderRadius: '16px', border: '3px solid #6b4c35', background: mcqSelection === opt.str ? (feedback?.isCorrect ? '#a7f3d0' : '#fecaca') : innerBg, color: inkColor, fontSize: '20px', fontWeight: '900', cursor: 'pointer', boxShadow: '3px 3px 0px #6b4c35', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {opt.render()}
                      </button>
                    ))}
                  </div>
                )}

                {feedback && (
                  <div style={{ padding: '20px', borderRadius: '16px', border: '3px solid #6b4c35', background: feedback.isCorrect ? '#d1fae5' : '#fee2e2', color: feedback.isCorrect ? '#065f46' : '#991b1b' }}>
                    <p style={{ margin: 0, fontSize: '18px', fontWeight: '900' }}>{feedback.msg}</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                      {!showDetailedExplanation && (
                        <button onClick={() => setShowDetailedExplanation(true)} style={{ padding: '8px 14px', background: '#d97706', color: '#fff', border: '2px solid #78350f', borderRadius: '10px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Eye size={16} /> {t.showSolutionBtn}
                        </button>
                      )}
                      {!feedback.isCorrect && (
                        <button onClick={() => { setFeedback(null); setMcqSelection(null); }} style={{ padding: '8px 14px', background: '#0284c7', color: '#fff', border: '2px solid #075985', borderRadius: '10px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <RefreshCw size={16} /> {t.retryBtn}
                        </button>
                      )}
                    </div>
                    {showDetailedExplanation && (
                      <div style={{ marginTop: '16px', padding: '14px', background: innerBg, borderRadius: '12px', border: '2px solid #6b4c35', color: inkColor }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '900', color: '#8c5a3c' }}>{t.solutionTitle}</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', fontWeight: '800' }}>
                          {(lang === 'az' ? currentQuestion.stepsAz : currentQuestion.stepsEn).map((step, sIdx) => <li key={sIdx}>{step}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ borderTop: '2px solid #6b4c35', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={generateQuestion} style={{ padding: '14px 28px', background: '#3d2b1f', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '4px 4px 0px #6b4c35' }}>
                  {t.nextBtn} <RotateCcw size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div style={{ background: cardBg, padding: '32px', borderRadius: '24px', border: borderStyle, boxShadow: '6px 6px 0px #6b4c35' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '24px', fontWeight: '900', color: inkColor, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Trophy color="#d97706" /> {t.leaderboardTitle}
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '3px solid #6b4c35', background: innerBg }}>
                  <th style={{ padding: '14px' }}>#</th>
                  <th style={{ padding: '14px' }}>{t.nameLabel}</th>
                  <th style={{ padding: '14px' }}>{t.gradeLabel}</th>
                  <th style={{ padding: '14px' }}>{t.xp}</th>
                  <th style={{ padding: '14px' }}>Həll Olunan</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Hələ ki göstərici yoxdur.</td></tr>
                ) : (
                  leaderboard.map((item, idx) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #6b4c35', background: idx === 0 ? '#fef08a' : 'transparent' }}>
                      <td style={{ padding: '14px', fontWeight: '900' }}>{idx + 1}</td>
                      <td style={{ padding: '14px', fontWeight: '900' }}>{item.name}</td>
                      <td style={{ padding: '14px' }}>{item.grade} {t.gradeSuffix}</td>
                      <td style={{ padding: '14px', fontWeight: '900', color: '#b45309' }}>{item.xp} XP</td>
                      <td style={{ padding: '14px' }}>{item.totalSolved} misal</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'teacher_space' && userRole === 'teacher' && (
          <div style={{ background: cardBg, padding: '32px', borderRadius: '24px', border: borderStyle, boxShadow: '6px 6px 0px #6b4c35' }}>
            <h2 style={{ margin: '0 0 10px', fontSize: '24px', fontWeight: '900', color: inkColor, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <School color="#8c5a3c" /> {t.teacherSpaceTitle}
            </h2>
            <p style={{ color: '#5a4231', fontWeight: '800', marginBottom: '24px' }}>
              Sənin müəllim açarın: <strong style={{ background: innerBg, padding: '4px 8px', borderRadius: '6px', border: '1px solid #6b4c35' }}>{teacherKey}</strong>
            </p>
            <div style={{ background: innerBg, padding: '20px', borderRadius: '16px', border: '2px solid #6b4c35' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: '900' }}>Şagird Statistikaları</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>Bu açarla birləşdirilmiş şagirdlərin real vaxt rejimində XP və aktivlik nəticələri burada əks olunur.</p>
            </div>
          </div>
        )}

        <footer style={{ textAlign: 'center', marginTop: '12px', padding: '8px', fontSize: '14px', fontWeight: '900', color: '#8c5a3c', letterSpacing: '1px' }}>
          {t.authorFooter}
        </footer>
      </div>
    </div>
  );
}
