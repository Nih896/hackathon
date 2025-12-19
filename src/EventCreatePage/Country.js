export const CURRENCIES = {
  jpy: { symbol: "¥", name: "日本円", flag: ["JP"], country: ["日本","Japan"] },
  usd: { 
    symbol: "$", name: "米ドル", 
    flag: ["US","EC","SV","PA","ZW","TL"], 
    country: ["アメリカ合衆国","United States","エクアドル","Ecuador","エルサルバドル","El Salvador","パナマ","Panama","ジンバブエ","Zimbabwe","東ティモール","Timor-Leste"]
  },
  eur: { 
    symbol: "€", name: "ユーロ", 
    flag: ["AT", "BE", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LU", "MT", "NL", "PT", "SK", "SI", "ES", "LT", "LV", "HR"], 
    country: [
      "オーストリア","Austria","ベルギー","Belgium","キプロス","Cyprus","エストニア","Estonia","フィンランド","Finland","フランス","France",
      "ドイツ","Germany","ギリシャ","Greece","アイルランド","Ireland","イタリア","Italy","ルクセンブルク","Luxembourg","マルタ","Malta",
      "オランダ","Netherlands","ポルトガル","Portugal","スロバキア","Slovakia","スロベニア","Slovenia","スペイン","Spain","リトアニア","Lithuania",
      "ラトビア","Latvia","クロアチア","Croatia"
    ]
  },
  krw: { symbol: "₩", name: "韓国ウォン", flag: ["KR"], country: ["韓国","South Korea"] },
  cny: { symbol: "元", name: "中国元", flag: ["CN"], country: ["中国","China"] },
  aed: { symbol: "د.إ", name: "UAEディルハム", flag: ["AE"], country: ["アラブ首長国連邦","United Arab Emirates"] },
  aud: {
    symbol: "A$", name: "豪ドル", 
    flag: ["AU","KI","NR","TV"], 
    country: ["オーストラリア","Australia","キリバス","Kiribati","ナウル","Nauru","ツバル","Tuvalu"]
  },
  brl: { symbol: "R$", name: "ブラジルレアル", flag: ["BR"], country: ["ブラジル","Brazil"] },
  cad: { symbol: "C$", name: "カナダドル", flag: ["CA"], country: ["カナダ","Canada"] },
  chf: { 
    symbol: "CHF", name: "スイスフラン", 
    flag: ["🇨🇭","🇱🇮"], 
    country: ["スイス","Switzerland","リヒテンシュタイン","Liechtenstein"]
  },
  dkk: { symbol: "kr", name: "デンマーククローネ", flag: ["DK"], country: ["デンマーク","Denmark"] },
  egp: { symbol: "E£", name: "エジプトポンド", flag: ["EG"], country: ["エジプト","Egypt"] },
  gbp: { symbol: "£", name: "英ポンド", flag: ["GB"], country: ["イギリス","United Kingdom"] },
  hkd: { symbol: "HK$", name: "香港ドル", flag: ["HK"], country: ["香港","Hong Kong"] },
  idr: { symbol: "Rp", name: "インドネシアルピア", flag: ["ID"], country: ["インドネシア","Indonesia"] },
  ils: { symbol: "₪", name: "イスラエルシェケル", flag: ["IL","PS"], country: ["イスラエル","Israel","パレスチナ自治区","Palestine"] },
  inr: { symbol: "₹", name: "インドルピー", flag: ["IN"], country: ["インド","India"] },
  kwd: { symbol: "KD", name: "クウェートディナール", flag: ["KW"], country: ["クウェート","Kuwait"] },
  mxn: { symbol: "Mex$", name: "メキシコペソ", flag: ["MX"], country: ["メキシコ","Mexico"] },
  myr: { symbol: "RM", name: "マレーシアリンギット", flag: ["MY"], country: ["マレーシア","Malaysia"] },
  nok: { symbol: "kr", name: "ノルウェークローネ", flag: ["NO"], country: ["ノルウェー","Norway"] },
  nzd: { 
    symbol: "NZ$", name: "ニュージーランドドル", 
    flag: ["NZ","CK","NU","TK"], 
    country: ["ニュージーランド","New Zealand","クック諸島","Cook Islands","ニウエ","Niue","トケラウ","Tokelau"]
  },
  php: { symbol: "₱", name: "フィリピンペソ", flag: ["PH"], country: ["フィリピン","Philippines"] },
  pkr: { symbol: "Rs", name: "パキスタンルピー", flag: ["PK"], country: ["パキスタン","Pakistan"] },
  pln: { symbol: "zł", name: "ポーランドズロチ", flag: ["PL"], country: ["ポーランド","Poland"] },
  rub: { symbol: "₽", name: "ロシアルーブル", flag: ["RU"], country: ["ロシア","Russia"] },
  sar: { symbol: "﷼", name: "サウジアラビアリアル", flag: ["SA"], country: ["サウジアラビア","Saudi Arabia"] },
  sek: { symbol: "kr", name: "スウェーデンクローナ", flag: ["SE"], country: ["スウェーデン","Sweden"] },
  sgd: { symbol: "S$", name: "シンガポールドル", flag: ["SG"], country: ["シンガポール","Singapore"] },
  thb: { symbol: "฿", name: "タイバーツ", flag: ["TH"], country: ["タイ","Thailand"] },
  try: { symbol: "₺", name: "トルコリラ", flag: ["TR"], country: ["トルコ","Turkey"] },
  twd: { symbol: "NT$", name: "台湾ドル", flag: ["TW"], country: ["台湾","Taiwan"] },
  vnd: { symbol: "₫", name: "ベトナムドン", flag: ["VN"], country: ["ベトナム","Vietnam"] },
  zar: { 
    symbol: "R", name: "南アフリカランド", 
    flag: ["ZA","LS","SZ","NA"], 
    country: ["南アフリカ","South Africa","レソト","Lesotho","エスワティニ","Eswatini","ナミビア","Namibia"]
  },
};
export default CURRENCIES;