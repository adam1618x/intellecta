import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const pool = new Pool({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

type Translation = {
  locale: "ar" | "en" | "fr" | "ms";
  title: string;
  excerpt: string;
  content: string;
};

type SeedPublication = {
  category: "courses" | "programming" | "mathematics" | "sciences" | "business" | "languages";
  author: string;
  publishedAt: string;
  image?: string;
  enrolled?: number;
  completed?: number;
  translations: Translation[];
};

const publications: SeedPublication[] = [
  {
    category: "courses",
    author: "Intellecta Academy",
    publishedAt: "2026-09-12T10:00:00Z",
    translations: [
      { locale: "en", title: "How to Build a Sustainable Study Routine", excerpt: "A practical guide to planning focused study sessions without burning out.", content: "# Build a Sustainable Study Routine\n\nA good routine balances **consistency, focus, and recovery**.\n\n## A simple framework\n1. Choose one clear objective for each session.\n2. Work in focused blocks of 45–60 minutes.\n3. Take a short break between blocks.\n4. End by writing down the next action.\n\n> Progress comes from repeatable systems, not perfect days." },
      { locale: "fr", title: "Construire une routine d’étude durable", excerpt: "Une méthode pratique pour organiser des sessions efficaces sans s’épuiser.", content: "# Construire une routine d’étude durable\n\nUne bonne routine équilibre **régularité, concentration et récupération**.\n\n## Méthode simple\n1. Choisir un objectif clair pour chaque session.\n2. Travailler par blocs de 45 à 60 minutes.\n3. Faire une courte pause entre les blocs.\n4. Terminer en notant la prochaine action." },
      { locale: "ar", title: "كيف تبني روتينًا دراسيًا مستدامًا", excerpt: "دليل عملي لتنظيم جلسات دراسة مركزة وفعالة دون إرهاق.", content: "# بناء روتين دراسي مستدام\n\nيعتمد الروتين الجيد على **الاستمرارية والتركيز والراحة**.\n\n## منهج بسيط\n1. حدّد هدفًا واضحًا لكل جلسة.\n2. اعمل في فترات تركيز من 45 إلى 60 دقيقة.\n3. خذ استراحة قصيرة بين الفترات.\n4. اختم الجلسة بتحديد الخطوة التالية." },
      { locale: "ms", title: "Membina Rutin Belajar yang Mampan", excerpt: "Panduan praktikal untuk sesi pembelajaran yang fokus tanpa keletihan berlebihan.", content: "# Membina Rutin Belajar yang Mampan\n\nRutin yang baik mengimbangi **konsistensi, fokus dan rehat**.\n\n## Kaedah mudah\n1. Tetapkan satu matlamat yang jelas bagi setiap sesi.\n2. Belajar dalam blok fokus 45–60 minit.\n3. Ambil rehat ringkas antara blok.\n4. Catat tindakan seterusnya sebelum berhenti." },
    ],
  },
  {
    category: "courses",
    author: "Dr. Lina Haddad",
    publishedAt: "2026-09-08T10:00:00Z",
    translations: [
      { locale: "en", title: "Learning Faster with Active Recall", excerpt: "Use retrieval practice to turn passive reading into durable learning.", content: "# Active Recall\n\nActive recall means trying to **retrieve an idea before looking at the answer**.\n\n## Try this\n- Close your notes and explain the concept aloud.\n- Create short questions after each lesson.\n- Review difficult questions more often than easy ones.\n\nThis works especially well when combined with spaced repetition." },
      { locale: "fr", title: "Apprendre plus vite avec le rappel actif", excerpt: "Transformez la lecture passive en apprentissage durable grâce à la récupération active.", content: "# Rappel actif\n\nLe rappel actif consiste à **retrouver une idée avant de consulter la réponse**.\n\n- Fermez vos notes et expliquez le concept à voix haute.\n- Créez de petites questions après chaque leçon.\n- Révisez plus souvent les questions difficiles." },
      { locale: "ar", title: "التعلّم أسرع باستخدام الاسترجاع النشط", excerpt: "حوّل القراءة السلبية إلى تعلّم ثابت من خلال استرجاع المعلومات من الذاكرة.", content: "# الاسترجاع النشط\n\nيعني الاسترجاع النشط محاولة **استحضار الفكرة قبل النظر إلى الإجابة**.\n\n- أغلق ملاحظاتك واشرح المفهوم بصوت مرتفع.\n- أنشئ أسئلة قصيرة بعد كل درس.\n- راجع الأسئلة الصعبة أكثر من السهلة." },
      { locale: "ms", title: "Belajar Lebih Cepat dengan Ingatan Aktif", excerpt: "Tukarkan pembacaan pasif kepada pembelajaran yang lebih kekal melalui latihan mengingat semula.", content: "# Ingatan Aktif\n\nIngatan aktif bermaksud cuba **mengingat idea sebelum melihat jawapan**.\n\n- Tutup nota dan terangkan konsep dengan suara sendiri.\n- Bina soalan ringkas selepas setiap pelajaran.\n- Ulang kaji soalan yang sukar dengan lebih kerap." },
    ],
  },
  {
    category: "programming",
    author: "Youssef Ben Ali",
    publishedAt: "2026-09-11T09:00:00Z",
    translations: [
      { locale: "en", title: "Understanding REST APIs", excerpt: "Learn the core ideas behind resources, HTTP methods, status codes, and API design.", content: "# REST APIs\n\nA REST API exposes resources through predictable URLs and standard HTTP semantics.\n\n| Method | Typical use |\n|---|---|\n| GET | Read a resource |\n| POST | Create a resource |\n| PATCH | Update part of a resource |\n| DELETE | Remove a resource |\n\nGood APIs also validate input and return meaningful status codes." },
      { locale: "fr", title: "Comprendre les API REST", excerpt: "Découvrez les ressources, méthodes HTTP, codes de statut et principes de conception d’API.", content: "# API REST\n\nUne API REST expose des ressources avec des URL prévisibles et les conventions HTTP.\n\n| Méthode | Usage |\n|---|---|\n| GET | Lire |\n| POST | Créer |\n| PATCH | Modifier partiellement |\n| DELETE | Supprimer |\n\nUne bonne API valide également les entrées." },
      { locale: "ar", title: "فهم واجهات REST API", excerpt: "تعرّف إلى الموارد وطرق HTTP ورموز الحالة وأساسيات تصميم الواجهات البرمجية.", content: "# واجهات REST API\n\nتعرض واجهة REST الموارد عبر عناوين واضحة وتستخدم دلالات HTTP القياسية.\n\n| الطريقة | الاستخدام |\n|---|---|\n| GET | قراءة مورد |\n| POST | إنشاء مورد |\n| PATCH | تعديل جزئي |\n| DELETE | حذف مورد |\n\nيجب أيضًا التحقق من المدخلات وإرجاع رموز حالة مفيدة." },
      { locale: "ms", title: "Memahami API REST", excerpt: "Pelajari sumber, kaedah HTTP, kod status dan prinsip asas reka bentuk API.", content: "# API REST\n\nAPI REST mendedahkan sumber melalui URL yang boleh dijangka dan semantik HTTP standard.\n\n| Kaedah | Kegunaan |\n|---|---|\n| GET | Membaca sumber |\n| POST | Mencipta sumber |\n| PATCH | Mengemas kini sebahagian |\n| DELETE | Memadam sumber |\n\nAPI yang baik turut mengesahkan input dan menggunakan kod status yang jelas." },
    ],
  },
  {
    category: "programming",
    author: "Intellecta Engineering",
    publishedAt: "2026-09-05T09:00:00Z",
    translations: [
      { locale: "en", title: "TypeScript Patterns for Safer Applications", excerpt: "Practical patterns for narrowing types, modeling API responses, and avoiding unsafe assumptions.", content: "# Safer TypeScript\n\nPrefer explicit models at system boundaries.\n\n## Useful patterns\n- Validate external data before using it.\n- Use discriminated unions for state machines.\n- Keep nullable values explicit.\n- Let the compiler guide refactoring.\n\nTypes improve reliability when they describe real application invariants." },
      { locale: "fr", title: "Patterns TypeScript pour des applications plus sûres", excerpt: "Des pratiques pour modéliser les réponses API et réduire les hypothèses dangereuses.", content: "# TypeScript plus sûr\n\nUtilisez des modèles explicites aux frontières du système.\n\n- Validez les données externes.\n- Utilisez les unions discriminées.\n- Rendez les valeurs nullables explicites.\n- Laissez le compilateur guider les refactorisations." },
      { locale: "ar", title: "أنماط TypeScript لتطبيقات أكثر أمانًا", excerpt: "ممارسات عملية للتحقق من الأنواع وتمثيل استجابات API وتجنب الافتراضات غير الآمنة.", content: "# TypeScript أكثر أمانًا\n\nاستخدم نماذج واضحة عند حدود النظام.\n\n- تحقّق من البيانات الخارجية قبل استخدامها.\n- استخدم الاتحادات المميّزة لتمثيل الحالات.\n- اجعل القيم القابلة لـ null واضحة.\n- دع المترجم يساعدك في إعادة الهيكلة." },
      { locale: "ms", title: "Corak TypeScript untuk Aplikasi Lebih Selamat", excerpt: "Corak praktikal untuk memodelkan respons API dan mengelakkan andaian yang tidak selamat.", content: "# TypeScript Lebih Selamat\n\nGunakan model yang jelas pada sempadan sistem.\n\n- Sahkan data luaran sebelum digunakan.\n- Gunakan discriminated unions.\n- Nyatakan nilai nullable dengan jelas.\n- Biarkan compiler membantu proses refaktor." },
    ],
  },
  {
    category: "mathematics",
    author: "Prof. Sami Trabelsi",
    publishedAt: "2026-09-10T08:00:00Z",
    translations: [
      { locale: "en", title: "A Visual Introduction to Derivatives", excerpt: "Understand derivatives as local rates of change before working with formal rules.", content: "# Derivatives\n\nThe derivative measures how quickly a function changes near a point.\n\nFor a function `f(x)`, the derivative is the limit of the average rate of change as the interval approaches zero.\n\n## Intuition\nIf the graph becomes steeper, the magnitude of the derivative increases. If the graph is locally flat, the derivative is near zero." },
      { locale: "fr", title: "Introduction visuelle aux dérivées", excerpt: "Comprendre les dérivées comme des taux de variation locaux avant les règles formelles.", content: "# Dérivées\n\nLa dérivée mesure la vitesse à laquelle une fonction varie autour d’un point.\n\nL’intuition graphique est simple : plus la courbe est inclinée, plus la valeur absolue de la dérivée est grande." },
      { locale: "ar", title: "مقدمة بصرية إلى المشتقات", excerpt: "افهم المشتقة بوصفها معدل التغير المحلي قبل الانتقال إلى القواعد الرسمية.", content: "# المشتقات\n\nتقيس المشتقة مدى سرعة تغيّر الدالة بالقرب من نقطة معينة.\n\nبيانيًا، كلما أصبح المنحنى أكثر انحدارًا زادت القيمة المطلقة للمشتقة، وعندما يكون المنحنى أفقيًا تقريبًا تقترب المشتقة من الصفر." },
      { locale: "ms", title: "Pengenalan Visual kepada Terbitan", excerpt: "Fahami terbitan sebagai kadar perubahan setempat sebelum mempelajari peraturan formal.", content: "# Terbitan\n\nTerbitan mengukur kadar perubahan sesuatu fungsi berhampiran satu titik.\n\nSecara visual, semakin curam graf, semakin besar magnitud terbitan." },
    ],
  },
  {
    category: "mathematics",
    author: "Intellecta Mathematics",
    publishedAt: "2026-09-02T08:00:00Z",
    translations: [
      { locale: "en", title: "Probability: From Counting to Expected Value", excerpt: "Build probability intuition with counting, conditional probability, and expected value.", content: "# Probability Foundations\n\nStart with simple counting before introducing formulas.\n\n### Key ideas\n- Sample space: all possible outcomes.\n- Event: a subset of outcomes.\n- Conditional probability: probability after receiving information.\n- Expected value: the long-run average of a random variable.\n\nPractice with small examples first; the notation becomes easier afterward." },
      { locale: "fr", title: "Probabilités : du dénombrement à l’espérance", excerpt: "Construisez votre intuition avec le dénombrement, les probabilités conditionnelles et l’espérance.", content: "# Fondements des probabilités\n\nCommencez par le dénombrement avant les formules.\n\n- Univers : tous les résultats possibles.\n- Événement : sous-ensemble de résultats.\n- Probabilité conditionnelle : probabilité après une information.\n- Espérance : moyenne à long terme." },
      { locale: "ar", title: "الاحتمالات: من العدّ إلى القيمة المتوقعة", excerpt: "ابنِ حدسك في الاحتمالات من خلال العد والاحتمال الشرطي والقيمة المتوقعة.", content: "# أساسيات الاحتمالات\n\nابدأ بالعدّ البسيط قبل الانتقال إلى الصيغ.\n\n- فضاء العينة: جميع النتائج الممكنة.\n- الحدث: مجموعة جزئية من النتائج.\n- الاحتمال الشرطي: احتمال بعد الحصول على معلومة.\n- القيمة المتوقعة: المتوسط على المدى الطويل." },
      { locale: "ms", title: "Kebarangkalian: Daripada Pengiraan kepada Nilai Jangkaan", excerpt: "Bina intuisi kebarangkalian melalui pengiraan, kebarangkalian bersyarat dan nilai jangkaan.", content: "# Asas Kebarangkalian\n\nMulakan dengan pengiraan mudah sebelum menggunakan formula.\n\n- Ruang sampel: semua hasil yang mungkin.\n- Peristiwa: subset hasil.\n- Kebarangkalian bersyarat: kebarangkalian selepas menerima maklumat.\n- Nilai jangkaan: purata jangka panjang." },
    ],
  },
  {
    category: "sciences",
    author: "Dr. Nour Mansour",
    publishedAt: "2026-09-09T11:00:00Z",
    translations: [
      { locale: "en", title: "Why the Sky Changes Color", excerpt: "Explore the physics of sunlight scattering through Earth's atmosphere.", content: "# Why is the sky blue?\n\nSunlight contains many wavelengths. Molecules in the atmosphere scatter shorter wavelengths more strongly than longer wavelengths.\n\nAt sunset, light travels through a longer atmospheric path, so more of the shorter wavelengths are scattered away before the light reaches your eyes." },
      { locale: "fr", title: "Pourquoi le ciel change de couleur", excerpt: "Découvrez la diffusion de la lumière solaire dans l’atmosphère terrestre.", content: "# Pourquoi le ciel est-il bleu ?\n\nLa lumière solaire contient plusieurs longueurs d’onde. Les molécules de l’atmosphère diffusent davantage les courtes longueurs d’onde.\n\nAu coucher du soleil, le trajet dans l’atmosphère est plus long, ce qui modifie les couleurs observées." },
      { locale: "ar", title: "لماذا تتغير ألوان السماء؟", excerpt: "استكشف فيزياء تشتت ضوء الشمس أثناء مروره عبر الغلاف الجوي.", content: "# لماذا تبدو السماء زرقاء؟\n\nيحتوي ضوء الشمس على أطوال موجية متعددة. وتشتت جزيئات الغلاف الجوي الأطوال الموجية الأقصر بدرجة أكبر.\n\nعند الغروب يمر الضوء في مسار أطول داخل الغلاف الجوي، فتتشتت بعض الألوان قبل وصول الضوء إلى أعيننا." },
      { locale: "ms", title: "Mengapa Warna Langit Berubah", excerpt: "Terokai fizik penyebaran cahaya matahari melalui atmosfera Bumi.", content: "# Mengapa langit berwarna biru?\n\nCahaya matahari mengandungi pelbagai panjang gelombang. Molekul atmosfera menyebarkan panjang gelombang yang lebih pendek dengan lebih kuat.\n\nSemasa matahari terbenam, cahaya melalui laluan atmosfera yang lebih panjang dan menghasilkan warna yang berbeza." },
    ],
  },
  {
    category: "sciences",
    author: "Intellecta Science Lab",
    publishedAt: "2026-08-30T11:00:00Z",
    translations: [
      { locale: "en", title: "The Scientific Method in Practice", excerpt: "Turn a question into a testable hypothesis and a reproducible experiment.", content: "# The Scientific Method\n\nA useful investigation moves from a question to evidence.\n\n1. Observe a phenomenon.\n2. Form a testable hypothesis.\n3. Design a controlled test.\n4. Record results carefully.\n5. Compare the evidence with the hypothesis.\n6. Communicate methods and limitations." },
      { locale: "fr", title: "La méthode scientifique en pratique", excerpt: "Transformez une question en hypothèse testable puis en expérience reproductible.", content: "# Méthode scientifique\n\nUne bonne démarche part d’une question et conduit vers des preuves.\n\n1. Observer.\n2. Formuler une hypothèse testable.\n3. Concevoir un test contrôlé.\n4. Mesurer et consigner les résultats.\n5. Comparer les preuves à l’hypothèse.\n6. Présenter la méthode et les limites." },
      { locale: "ar", title: "المنهج العلمي في التطبيق", excerpt: "حوّل السؤال إلى فرضية قابلة للاختبار وتجربة يمكن تكرارها.", content: "# المنهج العلمي\n\nتنتقل الدراسة الجيدة من السؤال إلى الأدلة.\n\n1. ملاحظة الظاهرة.\n2. صياغة فرضية قابلة للاختبار.\n3. تصميم اختبار مضبوط.\n4. تسجيل النتائج بدقة.\n5. مقارنة الأدلة بالفرضية.\n6. توثيق المنهج والحدود." },
      { locale: "ms", title: "Kaedah Saintifik dalam Amalan", excerpt: "Tukarkan soalan kepada hipotesis yang boleh diuji dan eksperimen yang boleh diulang.", content: "# Kaedah Saintifik\n\nPenyiasatan yang baik bergerak daripada soalan kepada bukti.\n\n1. Perhatikan fenomena.\n2. Bina hipotesis yang boleh diuji.\n3. Reka ujian terkawal.\n4. Rekod keputusan dengan teliti.\n5. Bandingkan bukti dengan hipotesis.\n6. Nyatakan kaedah dan batasan." },
    ],
  },
  {
    category: "business",
    author: "Meriem Kallel",
    publishedAt: "2026-09-07T13:00:00Z",
    translations: [
      { locale: "en", title: "From Idea to a Simple Business Model", excerpt: "Map customers, value, channels, costs, and revenue before building a full product.", content: "# Simple Business Model\n\nA business model explains how an organization creates and captures value.\n\n## Start with five questions\n- Who is the customer?\n- What problem is being solved?\n- Why is the solution useful?\n- How will customers discover and access it?\n- What are the major costs and revenue sources?\n\nKeep the first version concrete and testable." },
      { locale: "fr", title: "De l’idée à un modèle économique simple", excerpt: "Définissez clients, valeur, canaux, coûts et revenus avant de construire un produit complet.", content: "# Modèle économique simple\n\nUn modèle économique explique comment une organisation crée et capte de la valeur.\n\nCommencez par identifier le client, le problème, la proposition de valeur, les canaux, les coûts et les revenus." },
      { locale: "ar", title: "من الفكرة إلى نموذج عمل بسيط", excerpt: "حدّد العملاء والقيمة والقنوات والتكاليف والإيرادات قبل بناء المنتج الكامل.", content: "# نموذج عمل بسيط\n\nيشرح نموذج العمل كيف تنشئ المؤسسة القيمة وتحصل على عائد منها.\n\nابدأ بخمسة أسئلة: من العميل؟ ما المشكلة؟ لماذا الحل مفيد؟ كيف يصل العميل إليه؟ وما أهم مصادر التكلفة والإيراد؟" },
      { locale: "ms", title: "Daripada Idea kepada Model Perniagaan Ringkas", excerpt: "Kenal pasti pelanggan, nilai, saluran, kos dan hasil sebelum membina produk penuh.", content: "# Model Perniagaan Ringkas\n\nModel perniagaan menerangkan cara organisasi mencipta dan memperoleh nilai.\n\nMulakan dengan pelanggan, masalah, nilai, saluran, kos utama dan sumber hasil." },
    ],
  },
  {
    category: "business",
    author: "Intellecta Business",
    publishedAt: "2026-08-25T13:00:00Z",
    translations: [
      { locale: "en", title: "Reading a Cash Flow Statement", excerpt: "Learn to distinguish operating, investing, and financing cash flows.", content: "# Cash Flow Basics\n\nCash flow tracks money moving into and out of an organization.\n\n### Three common sections\n- **Operating:** day-to-day business activity.\n- **Investing:** assets and long-term investments.\n- **Financing:** borrowing, repayment, and capital transactions.\n\nProfit and cash flow are related but not identical." },
      { locale: "fr", title: "Lire un tableau des flux de trésorerie", excerpt: "Apprenez à distinguer les flux d’exploitation, d’investissement et de financement.", content: "# Flux de trésorerie\n\nLes flux suivent les entrées et sorties de liquidités.\n\n- **Exploitation :** activité courante.\n- **Investissement :** actifs et investissements à long terme.\n- **Financement :** emprunts, remboursements et opérations sur le capital." },
      { locale: "ar", title: "قراءة قائمة التدفقات النقدية", excerpt: "تعلّم التمييز بين التدفقات التشغيلية والاستثمارية والتمويلية.", content: "# أساسيات التدفق النقدي\n\nيتتبع التدفق النقدي حركة الأموال الداخلة والخارجة.\n\n- **التشغيل:** النشاط اليومي.\n- **الاستثمار:** الأصول والاستثمارات طويلة الأجل.\n- **التمويل:** الاقتراض والسداد ومعاملات رأس المال." },
      { locale: "ms", title: "Membaca Penyata Aliran Tunai", excerpt: "Pelajari perbezaan antara aliran operasi, pelaburan dan pembiayaan.", content: "# Asas Aliran Tunai\n\nAliran tunai menjejaki wang yang masuk dan keluar.\n\n- **Operasi:** aktiviti harian.\n- **Pelaburan:** aset dan pelaburan jangka panjang.\n- **Pembiayaan:** pinjaman, bayaran balik dan transaksi modal." },
    ],
  },
  {
    category: "languages",
    author: "Intellecta Languages",
    publishedAt: "2026-09-06T15:00:00Z",
    translations: [
      { locale: "en", title: "Everyday English: Asking Better Questions", excerpt: "A practical lesson on forming clear questions in everyday conversations.", content: "# Asking Better Questions\n\nClear questions make conversations easier.\n\n## Useful patterns\n- **What do you…?** for routines and preferences.\n- **How did you…?** for past experiences.\n- **Could you explain…?** for clarification.\n\nPractice by turning statements into questions." },
      { locale: "fr", title: "Anglais quotidien : poser de meilleures questions", excerpt: "Une leçon pratique pour formuler des questions claires dans les conversations courantes.", content: "# Poser de meilleures questions\n\nLes questions claires facilitent les échanges.\n\nEntraînez-vous à transformer des phrases affirmatives en questions avec des structures simples." },
      { locale: "ar", title: "الإنجليزية اليومية: طرح أسئلة أفضل", excerpt: "درس عملي لصياغة أسئلة واضحة في المحادثات اليومية.", content: "# طرح أسئلة أفضل\n\nتجعل الأسئلة الواضحة المحادثات أسهل.\n\nتدرّب على تحويل الجمل الخبرية إلى أسئلة باستخدام تراكيب مثل: ماذا تفعل؟ كيف فعلت ذلك؟ هل يمكنك التوضيح؟" },
      { locale: "ms", title: "Bahasa Inggeris Harian: Bertanya dengan Lebih Baik", excerpt: "Pelajaran praktikal untuk membina soalan yang jelas dalam perbualan harian.", content: "# Bertanya dengan Lebih Baik\n\nSoalan yang jelas menjadikan perbualan lebih mudah.\n\nLatih diri menukar ayat penyata kepada soalan menggunakan struktur yang mudah." },
    ],
  },
  {
    category: "languages",
    author: "Salma Gharbi",
    publishedAt: "2026-08-22T15:00:00Z",
    translations: [
      { locale: "en", title: "French for Beginners: Introducing Yourself", excerpt: "Learn the essential phrases for names, origins, studies, and simple introductions.", content: "# Se présenter en français\n\nUseful phrases:\n\n- Bonjour, je m'appelle…\n- Je suis étudiant(e)…\n- J'habite à…\n- Enchanté(e) !\n\nRepeat each phrase aloud and then combine them into a short introduction." },
      { locale: "fr", title: "Français débutant : se présenter", excerpt: "Apprenez les expressions essentielles pour parler de votre nom, origine et études.", content: "# Se présenter\n\nExpressions utiles :\n\n- Bonjour, je m'appelle…\n- Je suis étudiant(e)…\n- J'habite à…\n- Enchanté(e) !\n\nRépétez chaque phrase à voix haute puis combinez-les." },
      { locale: "ar", title: "الفرنسية للمبتدئين: التعريف بالنفس", excerpt: "تعلّم العبارات الأساسية للحديث عن الاسم والأصل والدراسة والتعريف بالنفس.", content: "# التعريف بالنفس بالفرنسية\n\nعبارات مفيدة:\n\n- Bonjour, je m'appelle…\n- Je suis étudiant(e)…\n- J'habite à…\n- Enchanté(e) !\n\nكرر كل عبارة بصوت مرتفع ثم اجمعها في تقديم قصير." },
      { locale: "ms", title: "Bahasa Perancis untuk Pemula: Memperkenalkan Diri", excerpt: "Pelajari frasa penting untuk nama, asal, pengajian dan pengenalan ringkas.", content: "# Memperkenalkan Diri dalam Bahasa Perancis\n\nFrasa berguna:\n\n- Bonjour, je m'appelle…\n- Je suis étudiant(e)…\n- J'habite à…\n- Enchanté(e) !\n\nUlang setiap frasa dengan kuat dan gabungkannya menjadi pengenalan ringkas." },
    ],
  },
];

const books = [
  { title: "Clean Code", author: "Robert C. Martin", description: "A practical reference for writing readable, maintainable software.", year: "2008", pages: "464", downloadUrl: "https://example.com/books/clean-code" },
  { title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", description: "Principles and practices for developing robust software and improving your craft.", year: "2019", pages: "352", downloadUrl: "https://example.com/books/pragmatic-programmer" },
  { title: "Introduction to Algorithms", author: "Thomas H. Cormen et al.", description: "A broad reference covering fundamental algorithms and data structures.", year: "2022", pages: "1312", downloadUrl: "https://example.com/books/introduction-to-algorithms" },
  { title: "A Mathematician's Apology", author: "G. H. Hardy", description: "A classic reflection on mathematical creativity and the life of a mathematician.", year: "1940", pages: "153", downloadUrl: "https://example.com/books/mathematicians-apology" },
  { title: "The Lean Startup", author: "Eric Ries", description: "A framework for testing ideas, learning from customers, and iterating quickly.", year: "2011", pages: "336", downloadUrl: "https://example.com/books/lean-startup" },
  { title: "English Grammar in Use", author: "Raymond Murphy", description: "A practical grammar reference and practice book for learners of English.", year: "2019", pages: "394", downloadUrl: "https://example.com/books/english-grammar-in-use" },
];

const contacts = [
  { name: "Amine Ben Salah", email: "amine@example.test", subject: "Course suggestion", message: "Could you add a beginner course about SQL and relational databases?", locale: "en" },
  { name: "Sana Trabelsi", email: "sana@example.test", subject: "اقتراح محتوى", message: "أقترح إضافة دروس مبسطة في الإحصاء والاحتمالات.", locale: "ar" },
  { name: "Claire Martin", email: "claire@example.test", subject: "Suggestion de livre", message: "Serait-il possible d'ajouter davantage de ressources pour apprendre le français ?", locale: "fr" },
  { name: "Hafiz Rahman", email: "hafiz@example.test", subject: "Feedback", message: "The multilingual course pages are very useful. A search feature would be helpful.", locale: "en" },
  { name: "Nadia Ben Youssef", email: "nadia@example.test", subject: "Ressources", message: "J'aimerais voir des ressources supplémentaires sur la gestion de projet.", locale: "fr" },
];

async function main() {
  const adminUsername = process.env.SEED_ADMIN_USERNAME ?? "admin";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.admin.upsert({
    where: { username: adminUsername },
    update: { password: passwordHash },
    create: { username: adminUsername, password: passwordHash },
  });

  for (const item of publications) {
    const english = item.translations.find((t) => t.locale === "en") ?? item.translations[0];
    let publication = await prisma.publication.findFirst({
      where: {
        category: item.category,
        translations: { some: { locale: english.locale, title: english.title } },
      },
    });

    if (!publication) {
      publication = await prisma.publication.create({
        data: {
          category: item.category,
          author: item.author,
          publishedAt: new Date(item.publishedAt),
        },
      });
    } else {
      publication = await prisma.publication.update({
        where: { id: publication.id },
        data: { author: item.author, publishedAt: new Date(item.publishedAt) },
      });
    }

    for (const t of item.translations) {
      await prisma.publicationTranslation.upsert({
        where: { publicationId_locale: { publicationId: publication.id, locale: t.locale } },
        update: { title: t.title, excerpt: t.excerpt, content: t.content },
        create: {
          publicationId: publication.id,
          locale: t.locale,
          title: t.title,
          excerpt: t.excerpt,
          content: t.content,
        },
      });
    }
  }

  for (const book of books) {
    const existing = await prisma.book.findFirst({ where: { title: book.title, author: book.author } });
    if (existing) {
      await prisma.book.update({ where: { id: existing.id }, data: book });
    } else {
      await prisma.book.create({ data: book });
    }
  }

  const existingContacts = await prisma.contactMessage.count();
  if (existingContacts === 0) {
    await prisma.contactMessage.createMany({ data: contacts });
  }

  console.log(`Seed complete: ${publications.length} publications, ${books.length} books.`);
  console.log(`Admin login: ${adminUsername} / ${adminPassword}`);
  console.log("Change the seed password before using this database outside local development.");
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
