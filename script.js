/* ============================================================
   11th ASVB — Script
   ============================================================ */

// Mobile nav toggle
const toggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => navLinks?.classList.toggle('open'));
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---------- HTML escape ----------
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ========== SCHEDULE ==========
async function loadSchedule() {
  const tabs = document.getElementById('scheduleTabs');
  const content = document.getElementById('scheduleContent');
  if (!tabs || !content) return;

  try {
    const res = await fetch('schedule-data.json');
    const data = await res.json();

    data.days.forEach((day, i) => {
      const btn = document.createElement('button');
      btn.textContent = day.date + ': ' + day.title;
      btn.dataset.index = i;
      btn.addEventListener('click', () => showDay(i));
      tabs.appendChild(btn);

      const card = document.createElement('div');
      card.className = 'day-card';
      card.id = 'day-' + i;
      card.innerHTML = buildDayHTML(day);
      content.appendChild(card);
    });

    showDay(1);
    tabs.children[1]?.classList.add('active');
  } catch (e) {
    content.innerHTML = '<p style="padding:24px;color:var(--muted)">Could not load schedule. <a href="assets/6.2-ASVB-Schedule.pdf" style="color:var(--blue-600)">Download the PDF here</a>.</p>';
  }
}

function showDay(index) {
  document.querySelectorAll('.day-card').forEach(c => c.classList.remove('visible'));
  document.querySelectorAll('#scheduleTabs button').forEach(b => b.classList.remove('active'));
  const card = document.getElementById('day-' + index);
  const btn = document.querySelector('#scheduleTabs button[data-index="' + index + '"]');
  if (card) card.classList.add('visible');
  if (btn) btn.classList.add('active');
}

function buildDayHTML(day) {
  const items = day.items.map(item => {
    // Section headers
    if (item.kind === 'section') {
      return '<li class="section-head"><strong>' + esc(item.title) + '</strong></li>';
    }

    // Determine row class
    let cls = '';
    if (item.kind === 'logistics') cls = 'logistics';
    if (item.kind === 'event') cls = 'logistics';
    if (item.title && (item.title.toLowerCase().includes('break') || item.title.toLowerCase().includes('lunch'))) {
      cls = 'break-row logistics';
    }

    // Build badges
    let badgesHTML = '';
    const badgeParts = [];
    if (item.people) badgeParts.push(...item.people.split(',').map(p => '<span class="badge">' + esc(p.trim()) + '</span>'));
    if (item.speaker) badgeParts.push('<span class="speaker-badge">' + esc(item.speaker) + '</span>');
    if (badgeParts.length) badgesHTML = '<div class="badges">' + badgeParts.join('') + '</div>';

    // Meta line
    let metaHTML = '';
    if (item.affiliation) {
      metaHTML = '<p class="meta">' + (item.country ? esc(item.country) + ' · ' : '') + esc(item.affiliation) + '</p>';
    }

    return '<li class="schedule-item ' + cls + '">'
      + '<time>' + esc(item.time) + '</time>'
      + '<div><h4>' + esc(item.title) + '</h4>' + metaHTML + badgesHTML + '</div>'
      + '</li>';
  }).join('');

  return '<div class="day-head">'
    + '<span>' + esc(day.weekday) + '</span>'
    + '<h3>' + esc(day.date) + '</h3>'
    + '<p>' + esc(day.title) + '</p>'
    + '<small>' + esc(day.venue) + '</small>'
    + '</div>'
    + '<ol class="schedule-list">' + items + '</ol>';
}

// ========== POSTERS ==========
const POSTERS = [
  {no:1, name:"Fanhao Kong", institution:"Southern University of Science and Technology", title:"CTSK\u207a Macrophage\u2013Driven Angiogenic Impairment Contributes to Pulmonary Hypertension"},
  {no:2, name:"Leying LI", institution:"City University of Hong Kong, Hong Kong SAR, China", title:"TBK1 functions as a novel regulator of vascular wall remodeling in hypertension"},
  {no:3, name:"Lingchao Miao", institution:"Guangdong Pharmaceutical University", title:"PSGL-1 mediated biomimetic drug delivery system for targeted and immune treatment of atherosclerosis"},
  {no:4, name:"Meitong Liu \u5218\u7f8e\u5f64", institution:"Southern University of Science and Technology", title:"Design, Synthesis and Activity Study of Glycosylated Antibody-Drug Conjugates"},
  {no:5, name:"Min Joung Lee", institution:"Chungnam National University School of Medicine", title:"NAD\u207a-mediated mitochondrial modulation protects blood\u2013brain barrier integrity in acute brain injury"},
  {no:6, name:"PAN, Jingwen", institution:"The University of Hong Kong", title:"Multilevel Dysregulation of Caveolin-1 in the Pathogenesis of Abdominal Aortic Aneurysm"},
  {no:7, name:"Ruixin Zhou", institution:"Southern University of Science and Technology", title:"Rewiring of 3D Enhancer-Promoter Interactome Underlies Diabetic Endothelial Dysfunction"},
  {no:8, name:"woo-seong Hong", institution:"Gyeongkuk National University", title:"Lutein Suppresses Macrophage Inflammasome Priming through Redox-Associated HO-1 Signaling"},
  {no:9, name:"Yiying Li", institution:"Shenzhen People\u2019s Hospital", title:"MAGP2 contributes to pulmonary vascular remodeling in hypoxic Pulmonary Hypertension"},
  {no:10, name:"Yuan Sun", institution:"The University of Hong Kong", title:"Cyclic Tensile Strain-Induced Ferroptosis in Human Aortic Smooth Muscle Cells"},
  {no:11, name:"ZHAO Yaping/\u8d75\u4e9a\u840d", institution:"City University of Hong Kong", title:"Distinct Sex-Specific Characteristics of Apoe and Ldlr Deficient Mice in Atherosclerosis"},
  {no:12, name:"Ziping Wang", institution:"Southern University of Science and Technology", title:"Targeting NKA\u03b11 with a Novel Peptide to Treat Pulmonary Fibrosis"},
  {no:13, name:"\u4e54\u519b Jun Qiao", institution:"Southern University of Science and Technology", title:"Genome-wide insights into the shared genetic landscape between MAFLD and cardiovascular diseases"},
  {no:14, name:"\u4f59\u5a77\u5a77 Tingting Yu", institution:"\u5929\u6d25\u533b\u79d1\u5927\u5b66/Tianjin Medical University", title:"Prostaglandin I\u2082 Receptor Activation Promotes Alveolar Regeneration via the JUN/p53 Pathway"},
  {no:15, name:"\u502a\u6d01 Jie Ni", institution:"Southern University of Science and Technology", title:"Tbx5 is required for postnatal ventricular cardiomyocyte cell cycle progression"},
  {no:16, name:"\u51af\u5029\u5029/Feng Qianqian", institution:"\u5929\u6d25\u533b\u79d1\u5927\u5b66/Tianjin Medical University", title:"The role of USP10-induced METTL3 deubiquitination in endothelium-dependent vasodilation impairment and hypertension"},
  {no:17, name:"\u5218\u663e\u5a01 Xianwei Liu", institution:"Southern University of Science and Technology", title:"Creb1-regulated slc39a1 attenuates alcoholic liver disease by orchestrating autophagy and mitophagy"},
  {no:18, name:"\u5218\u6893\u5ffb Zixin Liu", institution:"Southern University of Science and Technology", title:"VCAN accelerates extracellular matrix remodeling in pulmonary fibrosis by stabilizing TGF-\u03b2 receptor II"},
  {no:19, name:"\u5218\u82f1\u6770 Yingjie Liu", institution:"Southern University of Science and Technology", title:"Integrative genetic analyses identify emodin as a candidate modulator of STAT3 signaling in AAA"},
  {no:20, name:"\u5434\u9633\u707f WU Yangcan", institution:"Southern University of Science and Technology", title:"A Nanobody-based Biosensor as a Universal Platform for West Nile Virus NS3 Protein Detection"},
  {no:21, name:"\u5468\u51b0\u5bb8 Bingchen Zhou", institution:"Southern University of Science and Technology", title:"Development and Antitumor Mechanistic Study of Bifunctional Glyco-ADC Targeting Tumor-Associated MUC1"},
  {no:22, name:"\u5468\u6b23 Xin Zhou", institution:"\u5929\u6d25\u533b\u79d1\u5927\u5b66\u603b\u533b\u9662", title:"Association Between Aspirin Use Before 16 Weeks of Gestation and Early Postpartum Cardiometabolic Risk"},
  {no:23, name:"\u5c39\u6cfd\u7fa4 Zequn Yin", institution:"\u4e2d\u56fd\u79d1\u5b66\u6280\u672f\u5927\u5b66 USTC", title:"Intermittent Fasting Promotes Atherosclerotic Plaque Regression via the BMAL1-MERTK-Efferocytosis Axis"},
  {no:24, name:"\u5e84\u5b50\u7433 Zilin Zhuang", institution:"Southern University of Science and Technology", title:"Dissecting the Genetic Basis of Stenotrophomonas maltophilia-Phage Interactions"},
  {no:25, name:"\u5f20\u4f1a\u7530 Huitian Zhang", institution:"Southern University of Science and Technology", title:"Treatment of Pulmonary Fibrosis with RVG10, a peptide targeting Na+/K+ ATPase"},
  {no:26, name:"\u5f20\u5f1b Chi Zhang", institution:"Southern University of Science and Technology", title:"Macrophage GPNMB attenuates abdominal aortic aneurysm through promoting efferocytosis"},
  {no:27, name:"\u5f20\u9e4f\u5a01 Pengwei Zhang", institution:"Southern University of Science and Technology", title:"Dissecting the pleiotropic genetic architecture linking telomere biology to chronic respiratory diseases"},
  {no:28, name:"\u5f3a\u5a9e\u5a9e Titi Qiang", institution:"\u5929\u6d25\u533b\u79d1\u5927\u5b66", title:"Differential Impact of Recruited and Resident Macrophages on Hypoxia-Induced Pulmonary Hypertension"},
  {no:29, name:"\u674e\u4eac\u683c Jingge Li", institution:"\u5929\u6d25\u533b\u79d1\u5927\u5b66\u603b\u533b\u9662", title:"Association Between Aspirin Use Before 16 Weeks of Gestation and Early Postpartum Cardiometabolic Risk"},
  {no:30, name:"\u674e\u6653\u94b0 Xiaoyu Li", institution:"\u9996\u90fd\u533b\u79d1\u5927\u5b66", title:"Nitrate-Sialin2 Axis Couples ER-Mitochondrial Calcium Signaling with Fatty Acid Metabolism"},
  {no:31, name:"\u674e\u6d69\u541b LI HAOJUN", institution:"Southern University of Science and Technology", title:"An mRNA-based Fc-GDF15 therapy for obesity and metabolic disorders in mice"},
  {no:32, name:"\u674e\u827a\u54f2 Li Yizhe", institution:"\u5929\u6d25\u533b\u79d1\u5927\u5b66/Tianjin Medical University", title:"Senescent PASMCs drive pulmonary hypertension via H3K9 modification reprogramming"},
  {no:33, name:"\u6768\u4f73\u96ef YANG,Jiawen", institution:"Southern University of Science and Technology", title:"Cooperative neutralization of PldB toxicity by three immunity proteins in Pseudomonas aeruginosa"},
  {no:34, name:"\u6768\u6e05 Yang Qing", institution:"\u5929\u6d25\u533b\u79d1\u5927\u5b66\u603b\u533b\u9662", title:"Association Between Aspirin Use Before 16 Weeks of Gestation and Early Postpartum Cardiometabolic Risk"},
  {no:35, name:"\u6768\u7ea2\u7434 Hongqin Yang", institution:"Southern University of Science and Technology", title:"Splenic CD8+ T Cell-Derived Sema4D Promotes Pulmonary Hypertension"},
  {no:36, name:"\u6797\u4f5b\u5170 Folan Lin", institution:"Southern University of Science and Technology", title:"Structural basis of nucleosomal H4K20 recognition and methylation by SUV420H1 methyltransferase"},
  {no:37, name:"\u6881\u6653\u7389 Xiaoyu Liang", institution:"\u5929\u6d25\u5927\u5b66\u4e2d\u5fc3\u533b\u9662", title:"Bioengineered Macrophage Nanocarriers for Atorvastatin-Mediated Foam Cell Targeting in Atherosclerosis"},
  {no:38, name:"\u738b\u6615\u6ece Xinying Wang", institution:"Southern University of Science and Technology", title:"High-throughput dissection of mitochondrial uncharacterized proteins via in vivo perturb-seq"},
  {no:39, name:"\u738b\u6668 Chen Wang", institution:"Southern University of Science and Technology", title:"Engineering a versatile HCV protease-based platform for conditional protein manipulation"},
  {no:40, name:"\u8521\u6587\u658c Wenbin Cai", institution:"\u5929\u6d25\u533b\u79d1\u5927\u5b66/Tianjin Medical University", title:"Prostaglandin D2 Receptor (DP2) Aggravates Atherosclerosis by Inducing Endothelial Cell Ferroptosis"},
  {no:41, name:"\u8c2d\u8fdc\u6d0b Yuanyang Tan", institution:"\u5317\u4eac\u7406\u5de5\u5927\u5b66", title:"Angiopoietin-like 4 controls aberrant alveolar epithelial fate during lung fibrotic remodeling"},
  {no:42, name:"\u90d1\u5cb3\u73b2 Yueling Zheng", institution:"Southern University of Science and Technology", title:"Construction of a Ferritin-Based SpyTag-SpyCatcher Self-Assembling Vaccine"},
  {no:43, name:"\u9648\u6653\u7433 Xiaolin Chen", institution:"Southern University of Science and Technology", title:"EPHB2-EFNB1 Signaling Axis Regulates Macrophage-VSMC Crosstalk in Pulmonary Arterial Hypertension"},
  {no:44, name:"\u9648\u6842\u5170 Guilan Chen", institution:"Southern University of Science and Technology", title:"Visualizing Developmental Stalling in Pediatric Brain Tumors via Generative AI"},
  {no:45, name:"\u9648\u9ed8 Mo Chen", institution:"Southern University of Science and Technology", title:"Systemic ROS-Driven Oxidized Phospholipid-Platelet-NET Cascade Orchestrates Coronary No-Reflow"},
  {no:46, name:"\u9ad8\u661f\u60a6 Xingyue Gao", institution:"Southern University of Science and Technology", title:"A multivalent mRNA-LNP cocktail vaccine confers superior efficacy against Staphylococcus aureus infection"},
  {no:47, name:"\u9ec4\u598d\u8679 Huang Yanhong", institution:"Southern University of Science and Technology", title:"Human airway organoids for bacterial-host interaction studies"},
  {no:48, name:"\u9ec4\u5efa\u8363 Jianrong Huang", institution:"Southern University of Science and Technology", title:"Bioorthogonal Metabolic Labeling Identifies SGCG as a Surface Target for Cardiomyocyte-Derived sEVs"},
  {no:49, name:"\u9f99\u667a\u8f89 Zhihui Long", institution:"Southern University of Science and Technology", title:"Genetic Dissection of an Enhancer Controlling the Myh6-Myh7 Cluster in the heart"},
  {no:50, name:"Gang Fan", institution:"Shenzhen University Affiliated Nanshan Hospital", title:"A peptide-based PROTAC targeting TAK1 improves obesity-associated cerebrovascular dysfunction"},
  {no:51, name:"Xinyu Liu", institution:"Shenzhen University Affiliated Nanshan Hospital", title:"Hypothalamic SCGN Alleviates Sepsis-Induced Inflammation and Lung Injury via the OXT-OXTR Axis"},
  {no:52, name:"\u5b59\u5c71\u864e Shanhu Sun", institution:"Southern University of Science and Technology", title:"Exercise-Induced Metabolites Influence Health via Epigenetic Modifications"},
  {no:53, name:"Changzhi Liu", institution:"University of Hong Kong", title:"Association between Serum Chloride-to-Sodium Ratio and Risk of Abdominal Aortic Aneurysm"},
  {no:54, name:"Lei Lyu", institution:"The First Affiliated Hospital Of Kunming Medical University", title:"An unsupervised neural network for categorizing ascending thoracic aortic aneurysms into geometric subgroups and their hemodynamic properties"}
];

function renderPosters() {
  const grid = document.getElementById('posterGrid');
  if (!grid) return;

  grid.innerHTML = POSTERS.map(p => {
    const searchText = (p.name + ' ' + p.title + ' ' + p.institution).toLowerCase();
    return '<article class="poster-card" data-text="' + esc(searchText) + '">'
      + '<span class="poster-no">#' + p.no + '</span>'
      + '<h4>' + esc(p.title) + '</h4>'
      + '<p class="name">' + esc(p.name) + '</p>'
      + '<small>' + esc(p.institution) + '</small>'
      + '</article>';
  }).join('');
}

// ---------- Poster search ----------
function initPosterSearch() {
  const input = document.getElementById('posterSearch');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    document.querySelectorAll('.poster-card').forEach(c => {
      c.style.display = (c.dataset.text || '').includes(q) ? '' : 'none';
    });
  });
}

// ---------- Init ----------
loadSchedule();
renderPosters();
initPosterSearch();
