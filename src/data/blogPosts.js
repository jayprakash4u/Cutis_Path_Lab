/**
 * Blog posts.
 *
 * Static for now — there is no Blog table in the database and no admin editor,
 * so posts are edited here. Moving this to the DB later means adding a `blogpost`
 * table, an /api/blog route and an admin page; the page components read the same
 * shape either way.
 */
export const blogPosts = [
  {
    id: 1,
    slug: "how-to-prepare-for-a-blood-test",
    title: "How to prepare for a blood test",
    excerpt:
      "Fasting, hydration and timing all affect your results. Here is what to do the night before and the morning of your test.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-08-04",
    readMinutes: 4,
    image: "/images/blogs/how-to-prepare-for-a-blood-test.png",
  },
  {
    id: 2,
    slug: "understanding-your-cbc-report",
    title: "Understanding your CBC report",
    excerpt:
      "Haemoglobin, WBC, platelets — a plain-language guide to the numbers on a complete blood count and what falls outside the normal range.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-07-28",
    readMinutes: 6,
    image: "/images/blogs/understanding-your-cbc-report.png",
  },
  {
    id: 4,
    slug: "thyroid-testing-explained",
    title: "Thyroid testing explained",
    excerpt:
      "TSH, T3 and T4 measure different things. Understand which test your doctor ordered and why the results are read together.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-07-11",
    readMinutes: 5,
    image: "/images/blogs/thyroid-testing-explained.png",
  },
  {
    id: 6,
    slug: "diabetes-screening-who-should-test",
    title: "Diabetes screening: who should test, and how often",
    excerpt:
      "Fasting glucose, HbA1c and the risk factors that mean you should be screening yearly rather than waiting for symptoms.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-06-24",
    readMinutes: 6,
    image: "/images/blogs/diabetes-screening-who-should-test.png",
  },

  // --- Nutrition & herbs -----------------------------------------------
  // `image: null` renders the branded fallback tile. Drop a photo into
  // public/images/blog/ and set the path here to replace it.
  {
    id: 7,
    slug: "coriander-seed-benefits-and-side-effects",
    title: "Coriander Seed Benefits and Side Effects",
    excerpt:
      "Dhania seeds are a kitchen staple with a long place in Indian home remedies. What the evidence says about digestion and blood sugar, and who should go easy on them.",
    category: "Blog",
    author: "Cutis Path Lab",
    date: "2026-08-12",
    readMinutes: 5,
    image: "/images/blogs/coriander-seed-benefits-and-side-effects.png",
  },
  {
    id: 8,
    slug: "benefits-of-broccoli-and-its-nutrition",
    title: "Benefits of Broccoli and Its Nutrition",
    excerpt:
      "A cup of broccoli carries vitamin C, vitamin K and fibre for very few calories. How to cook it without losing the nutrients you are eating it for.",
    category: "Blog",
    author: "Cutis Path Lab",
    date: "2026-08-09",
    readMinutes: 4,
    image: "/images/blogs/benefits-of-broccoli-and-its-nutrition.png",
  },
  {
    id: 9,
    slug: "benefits-of-eating-carrots-and-side-effects",
    title: "Benefits of Eating Carrots and Its Side Effects",
    excerpt:
      "Beta-carotene, eye health and fibre — plus what actually happens if you eat carrots every single day.",
    category: "Blog",
    author: "Cutis Path Lab",
    date: "2026-08-06",
    readMinutes: 4,
    image: "/images/blogs/benefits-of-eating-carrots-and-side-effects.png",
  },
  {
    id: 10,
    slug: "isabgol-ko-bhus-ka-faida-ra-befaida",
    title: "इसबगोलको भुसका फाइदा र बेफाइदा",
    excerpt:
      "कब्जियत र पेटको स्वास्थ्यका लागि इसबगोल सबैभन्दा प्रचलित घरेलु उपाय हो। यसलाई सेवन गर्ने सही तरिका, मात्रा र कस्ता व्यक्तिले सावधानी अपनाउनुपर्छ भन्ने जान्नुहोस्।",
    category: "Blog",
    author: "Cutis Path Lab",
    date: "2026-08-02",
    readMinutes: 5,
    image: "/images/blogs/isabgol-ko-bhus-ka-faida-ra-befaida.png",
  },
  {
    id: 11,
    slug: "benefits-of-fenugreek-seeds-and-side-effects",
    title: "Benefits of Fenugreek Seeds (Methi) and Side Effects",
    excerpt:
      "Methi dana is widely used for blood sugar and cholesterol. What is supported, what is overstated, and why it interacts with some medicines.",
    category: "Blog",
    author: "Cutis Path Lab",
    date: "2026-07-30",
    readMinutes: 6,
    image: "/images/blogs/benefits-of-fenugreek-seeds-and-side-effects.png",
  },
  {
    id: 12,
    slug: "benefits-of-turmeric-and-side-effects",
    title: "Benefits of Turmeric and Its Side Effects",
    excerpt:
      "Curcumin is poorly absorbed on its own. How turmeric is best taken, the doses studied for inflammation, and when it is worth avoiding.",
    category: "Blog",
    author: "Cutis Path Lab",
    date: "2026-07-26",
    readMinutes: 5,
    image: "/images/blogs/benefits-of-turmeric-and-side-effects.png",
  },
  {
    id: 13,
    slug: "benefits-of-amla-and-its-nutrition",
    title: "Benefits of Amla and Its Nutrition",
    excerpt:
      "Indian gooseberry is one of the richest natural sources of vitamin C. Its nutrition profile, and the difference between fresh, juice and powder.",
    category: "Blog",
    author: "Cutis Path Lab",
    date: "2026-07-23",
    readMinutes: 4,
    image: "/images/blogs/benefits-of-amla-and-its-nutrition.png",
  },
  {
    id: 14,
    slug: "gurjo-giloy-ko-faida-ra-befaida",
    title: "गुर्जो (गिलोय) का फाइदा र बेफाइदा",
    excerpt:
      "गुर्जो रोग प्रतिरोधात्मक क्षमता बढाउन प्रयोग गरिन्छ। यसका सम्भावित फाइदा, सेवन गर्ने तरिका र कलेजोसँग सम्बन्धित ध्यान दिनुपर्ने सावधानीहरू।",
    category: "Blog",
    author: "Cutis Path Lab",
    date: "2026-07-20",
    readMinutes: 5,
    image: "/images/blogs/gurjo-giloy-ko-faida-ra-befaida.png",
  },
  {
    id: 15,
    slug: "benefits-of-flaxseed-and-side-effects",
    title: "Benefits of Flaxseed and Side Effects",
    excerpt:
      "Alsi is a plant source of omega-3 and fibre. Why ground beats whole, how much is sensible in a day, and who should check with a doctor first.",
    category: "Blog",
    author: "Cutis Path Lab",
    date: "2026-07-16",
    readMinutes: 4,
    image: "/images/blogs/benefits-of-flaxseed-and-side-effects.png",
  },
  {
    id: 16,
    slug: "benefits-of-beetroot-and-side-effects",
    title: "Benefits of Beetroot and Its Side Effects",
    excerpt:
      "Beetroot is studied for blood pressure and stamina thanks to dietary nitrates. Also why it can turn your urine pink — and when that is worth a test.",
    category: "Blog",
    author: "Cutis Path Lab",
    date: "2026-07-13",
    readMinutes: 4,
    image: "/images/blogs/benefits-of-beetroot-and-side-effects.png",
  },
  {
    id: 17,
    slug: "tulsi-ko-pat-ka-faida-ra-befaida",
    title: "तुलसीको पातका फाइदा र बेफाइदा",
    excerpt:
      "रुघाखोकीदेखि तनावसम्म धेरै घरेलु उपचारमा तुलसी प्रयोग हुन्छ। यसका फाइदा र कुन अवस्थामा यसबाट टाढा रहनुपर्छ भन्ने कुरा जान्नुहोस्।",
    category: "Blog",
    author: "Cutis Path Lab",
    date: "2026-07-09",
    readMinutes: 4,
    image: "/images/blogs/tulsi-ko-pat-ka-faida-ra-befaida.png",
  },
  {
    id: 18,
    slug: "benefits-of-garlic-and-side-effects",
    title: "Benefits of Garlic and Its Side Effects",
    excerpt:
      "Allicin, cholesterol and blood pressure — what raw versus cooked garlic changes, and why it matters if you are on blood thinners.",
    category: "Blog",
    author: "Cutis Path Lab",
    date: "2026-07-05",
    readMinutes: 5,
    image: "/images/blogs/benefits-of-garlic-and-side-effects.png",
  },
  {
    id: 19,
    slug: "benefits-of-spinach-and-its-nutrition",
    title: "Benefits of Spinach and Its Nutrition",
    excerpt:
      "Palak is rich in iron, folate and vitamin K — but absorption depends on what you eat it with. A practical look at getting the most from it.",
    category: "Blog",
    author: "Cutis Path Lab",
    date: "2026-07-01",
    readMinutes: 4,
    image: "/images/blogs/benefits-of-spinach-and-its-nutrition.png",
  },
  {
    id: 20,
    slug: "ashwagandha-ko-faida-ra-befaida",
    title: "अश्वगन्धाका फाइदा र बेफाइदा",
    excerpt:
      "तनाव, निद्रा र ऊर्जाका लागि अश्वगन्धाको प्रयोग बढ्दै गएको छ। अनुसन्धानले के भन्छ, उपयुक्त मात्रा कति हो र कसले यसबाट बच्नुपर्छ भन्ने बुझ्नुहोस्।",
    category: "Blog",
    author: "Cutis Path Lab",
    date: "2026-06-27",
    readMinutes: 6,
    image: "/images/blogs/ashwagandha-ko-faida-ra-befaida.png",
  },
  {
    id: 21,
    slug: "benefits-of-ginger-and-side-effects",
    title: "Benefits of Ginger and Side Effects",
    excerpt:
      "Adrak is best evidenced for nausea and digestion. Sensible daily amounts, and the heartburn and bleeding cautions worth knowing.",
    category: "Blog",
    author: "Cutis Path Lab",
    date: "2026-06-22",
    readMinutes: 4,
    image: "/images/blogs/benefits-of-ginger-and-side-effects.png",
  },
  {
    id: 22,
    slug: "benefits-of-almonds-and-side-effects",
    title: "Benefits of Almonds and Side Effects",
    excerpt:
      "Badam for heart health and satiety — how many a day is reasonable, whether soaking changes anything, and the calorie reality.",
    category: "Blog",
    author: "Cutis Path Lab",
    date: "2026-06-18",
    readMinutes: 4,
    image: "/images/blogs/benefits-of-almonds-and-side-effects.png",
  },

  // --- Diagnostics & practical health ----------------------------------
  {
    id: 23,
    slug: "early-detection-of-ild-kl6-serum-biomarker-test",
    title:
      "Early Detection of Interstitial Lung Disease (ILD) — Now Possible with Non-Invasive KL-6 Serum Biomarker Test",
    excerpt:
      "KL-6 is a serum marker of alveolar epithelial injury, used to help assess interstitial lung disease activity from a simple blood draw rather than imaging alone. What it measures and how clinicians read it alongside HRCT and lung function.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-08-14",
    readMinutes: 7,
    image: "/images/blogs/early-detection-of-ild-kl6-serum-biomarker-test.png",
  },
  {
    id: 24,
    slug: "early-detection-of-alzheimers-blood-and-csf-biomarker-test",
    title:
      "Early Detection of Alzheimer's — Now Possible with FDA-Approved Blood & CSF Biomarker Test",
    excerpt:
      "Blood-based p-tau217 and amyloid ratio tests are now cleared to help evaluate adults already showing cognitive symptoms. What these biomarkers indicate, how they compare with CSF testing, and why they are not a screening test for people without symptoms.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-08-11",
    readMinutes: 8,
    image: "/images/blogs/early-detection-of-alzheimers-blood-and-csf-biomarker-test.png",
  },
  {
    id: 25,
    slug: "how-to-consume-flax-seeds",
    title: "How to Consume Flax Seeds",
    excerpt:
      "Whole flaxseed passes through largely undigested. Grinding, dosage, storage, and the simplest ways to add alsi to everyday meals without it going rancid.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-08-08",
    readMinutes: 4,
    image: "/images/blogs/how-to-consume-flax-seeds.png",
  },
  {
    id: 26,
    slug: "goat-milk-benefits-and-side-effects",
    title: "Goat Milk Benefits and Its Side Effects",
    excerpt:
      "Goat milk differs from cow milk in fat globule size and protein profile, which is why some people find it easier to digest. What it does not solve — including cow milk allergy.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-08-05",
    readMinutes: 5,
    image: "/images/blogs/goat-milk-benefits-and-side-effects.png",
  },
  {
    id: 27,
    slug: "lipoprotein-a-test-inherited-heart-risk",
    title: "Lp(a) Testing — The Inherited Heart Risk Most People Never Check",
    excerpt:
      "Lipoprotein(a) is largely genetically determined and is not covered by a standard lipid profile. Why guidelines increasingly suggest measuring it once in a lifetime.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-08-01",
    readMinutes: 6,
    image: "/images/blogs/lipoprotein-a-test-inherited-heart-risk.png",
  },
  {
    id: 28,
    slug: "anti-ccp-test-early-rheumatoid-arthritis",
    title: "Anti-CCP Testing for Early Rheumatoid Arthritis",
    excerpt:
      "Anti-CCP antibodies can appear years before joint damage becomes visible on imaging. How the test is used with RF and inflammatory markers to catch RA early.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-07-29",
    readMinutes: 6,
    image: "/images/blogs/anti-ccp-test-early-rheumatoid-arthritis.png",
  },
  {
    id: 29,
    slug: "hba1c-vs-fasting-glucose-prediabetes",
    title: "HbA1c vs Fasting Glucose — Which Catches Prediabetes Sooner?",
    excerpt:
      "The two tests measure different things over different timeframes, and they do not always agree. What each one tells you and why doctors often order both.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-07-25",
    readMinutes: 6,
    image: "/images/blogs/hba1c-vs-fasting-glucose-prediabetes.png",
  },
  {
    id: 30,
    slug: "cystatin-c-kidney-function-test",
    title: "Cystatin C — A Sharper Look at Kidney Function",
    excerpt:
      "Creatinine depends on muscle mass, which makes eGFR unreliable in some people. Where cystatin C gives a clearer estimate of kidney filtration.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-07-22",
    readMinutes: 5,
    image: "/images/blogs/cystatin-c-kidney-function-test.png",
  },
  {
    id: 31,
    slug: "vitamin-d-deficiency-testing-and-symptoms",
    title: "Vitamin D Deficiency — Symptoms, Testing and Sensible Correction",
    excerpt:
      "Deficiency is common and often silent. What the 25(OH)D test measures, how to read the ranges, and why very high supplement doses carry their own risk.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-07-18",
    readMinutes: 5,
    image: "/images/blogs/vitamin-d-deficiency-testing-and-symptoms.png",
  },
  {
    id: 32,
    slug: "ferritin-test-iron-deficiency-before-anaemia",
    title: "Ferritin Testing — Catching Iron Deficiency Before Anaemia",
    excerpt:
      "Haemoglobin can stay normal while iron stores are already low. Why ferritin falls first, and how inflammation can mask a genuine deficiency.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-07-15",
    readMinutes: 5,
    image: "/images/blogs/ferritin-test-iron-deficiency-before-anaemia.png",
  },
  {
    id: 33,
    slug: "thyroid-antibodies-anti-tpo-test",
    title: "Anti-TPO Antibodies — When TSH Alone Is Not the Whole Picture",
    excerpt:
      "Thyroid antibodies point to an autoimmune cause behind an abnormal TSH. What a positive result means for monitoring, and what it does not mean.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-07-12",
    readMinutes: 5,
    image: "/images/blogs/thyroid-antibodies-anti-tpo-test.png",
  },
  {
    id: 34,
    slug: "hs-crp-test-inflammation-and-heart-risk",
    title: "hs-CRP — Measuring the Inflammation Behind Heart Risk",
    excerpt:
      "High-sensitivity CRP detects low-grade inflammation ordinary CRP misses. How it is used for cardiovascular risk, and why timing the test matters.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-07-08",
    readMinutes: 5,
    image: "/images/blogs/hs-crp-test-inflammation-and-heart-risk.png",
  },
  {
    id: 35,
    slug: "celiac-disease-blood-test-ttg-iga",
    title: "Celiac Disease Testing — Why You Must Not Go Gluten-Free First",
    excerpt:
      "tTG-IgA serology only works while gluten is still in the diet. The correct order of testing, and the total IgA check that prevents a false negative.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-07-04",
    readMinutes: 6,
    image: "/images/blogs/celiac-disease-blood-test-ttg-iga.png",
  },
  {
    id: 36,
    slug: "faecal-calprotectin-test-ibs-vs-ibd",
    title: "Faecal Calprotectin — Telling IBS Apart from IBD",
    excerpt:
      "A stool marker that distinguishes inflammatory bowel disease from irritable bowel syndrome, and can spare some patients an unnecessary colonoscopy.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-06-30",
    readMinutes: 5,
    image: "/images/blogs/faecal-calprotectin-test-ibs-vs-ibd.png",
  },
  {
    id: 37,
    slug: "hpv-dna-test-cervical-cancer-screening",
    title: "HPV DNA Testing in Cervical Cancer Screening",
    excerpt:
      "HPV testing is now the primary screening method in many guidelines, ahead of cytology alone. Screening intervals, and how it pairs with the Pap smear.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-06-26",
    readMinutes: 6,
    image: "/images/blogs/hpv-dna-test-cervical-cancer-screening.png",
  },
  {
    id: 38,
    slug: "how-to-consume-chia-seeds",
    title: "How to Consume Chia Seeds",
    excerpt:
      "Chia absorbs many times its weight in water, which is exactly why dry spoonfuls are a bad idea. Soaking, portioning and adding them to Indian meals.",
    category: "Health",
    author: "Cutis Path Lab",
    date: "2026-06-21",
    readMinutes: 4,
    image: "/images/blogs/how-to-consume-chia-seeds.png",
  },
];

/**
 * Fixed list — every post must use one of these two. Declared explicitly rather
 * than derived from the posts, so a typo in a `category` field shows up as an
 * empty filter instead of silently adding a third chip.
 */
export const BLOG_CATEGORIES = ["Blog", "Health"];

export const blogCategories = ["All", ...BLOG_CATEGORIES];
