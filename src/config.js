/**
 * =============================================================================
 * BLUSH COUTURE - WEDDING GIFT CONFIGURATION / CẤU HÌNH QUÀ CƯỚI
 * =============================================================================
 * 
 * Đây là file DUY NHẤT bạn cần chỉnh sửa để cá nhân hóa toàn bộ món quà cưới này.
 * This is the ONLY file you need to edit to personalize this entire wedding gift.
 * 
 * Mọi nội dung hiển thị, hình ảnh, âm thanh, màu sắc đều bắt nguồn từ cấu hình này.
 * All visible text, images, audio, and colors originate from this config.
 */

export const CONFIG = {
  // --- Monogram biểu tượng chữ lồng / Couple monogram ---
  monogram: "H & K", // Biểu tượng đôi lứa (H: Hiền, K: Kiên) / Couple monogram on wax seal & headers

  // --- Danh sách tên các chương biên tập / Editorial Chapter Titles ---
  chapters: [
    "Lời mở đầu",    // Chapter I: 3D Sealed Envelope & Gold Dust Morph
    "Đếm ngược",     // Chapter II: Headline Story & Live Countdown
    "Lá thư",        // Chapter III: The Friend's Heartfelt Editorial Letter
    "Khoảnh khắc",   // Chapter IV: Runway Photo Archive & Lightbox
    "Hợp đồng",      // Chapter V: Marriage Contract & Wax Seal Stamp
    "Lời chúc",      // Chapter VI: Pearl & Glass Capsule Wish Vault
    "Đêm pháo hoa",  // Chapter VII: Gold Foil Scratch & Night Sky Finale
  ],

  // --- Bảng màu chủ đạo & Biến CSS / Color Theme Palette ---
  theme: {
    ivory: "#FBF4EE",      // Nền sáng chính trang nhã / Primary light background
    blush: "#F3D9D4",      // Hồng phấn dịu, tông nhận diện / Warm cashmere blush, brand tone
    pink: "#E8B4B8",       // Hồng cánh sen ấm / Soft warm petal pink
    roseGold: "#C98B8B",   // Vàng hồng điểm nhấn / Rose-gold accent
    champagne: "#D4AF7A",  // Vàng sâm panh, viền kim loại / Champagne gold, hairlines & foil
    wine: "#3A1F26",       // Đỏ rượu vang đậm (chương tương phản) / Deep bordeaux wine
    night: "#1E1218",      // Bầu trời đêm sâu thẳm / Night sky contrast background
    ink: "#2B1A1E",        // Màu mực chữ trên nền sáng / Deep ink text on light background
    paper: "#FFFDFB",      // Màu giấy thủ công cao cấp / High-end artisanal paper
  },

  // --- Bộ phông chữ chuẩn Google Fonts (Hỗ trợ tiếng Việt trọn vẹn) / Typography ---
  fonts: {
    display: "Cormorant Garamond", // Tiêu đề lớn sang trọng / Large editorial headlines
    body: "Be Vietnam Pro",        // Nội dung & giao diện hiện đại / Modern body & UI
    script: "Pinyon Script",       // Nét bút ký cảm xúc / Script signature flourishes
  },

  // --- Thông tin cô dâu chú rể / Couple Information ---
  couple: {
    bride: "Thúy Hiền",   // Tên cô dâu / Bride's name
    groom: "Trung Kiên",  // Tên chú rể / Groom's name
  },

  // --- Thông tin người gửi món quà / Gift Sender Information ---
  sender: "[TÊN CỦA BẠN]",            // Tên người tặng quà / Sender's name
  senderRole: "bạn thân của cô dâu",  // Mối quan hệ thân thiết / Relationship role

  // --- Ngày giờ tổ chức đám cưới (Định dạng ISO UTC+7) ---
  // Wedding Date & Time (ISO format, UTC+7 Vietnam time, e.g. "2026-11-20T18:00:00+07:00")
  weddingDate: "[YYYY-MM-DD]T[HH:MM]:00+07:00",

  // --- Dải chữ chạy vô tận phong cách tuần báo / Infinite Marquee Band ---
  marquee: [
    "THÚY HIỀN",
    "TRUNG KIÊN",
    "CHÚC MỪNG HẠNH PHÚC",
    "TRĂM NĂM HẢO HỢP",
    "CHÍNH THỨC VỀ CHUNG MỘT NHÀ",
    "BLUSH COUTURE",
  ],

  // --- Màn hình tải ban đầu (Loader) / Preloader Screen Messages ---
  loader: {
    messages: [
      "ĐANG TẢI TÌNH YÊU...",
      "ĐANG TÌM NHẪN...",
      "ĐANG ÉP KIÊN MẶC VEST...",
      "SẮP XONG RỒI, ĐỪNG KHÓC SỚM!",
    ],
  },

  // --- Màn hình mở phong thư 3D & Hạt bụi vàng / 3D Envelope & Particle Text Intro ---
  intro: {
    title: "Món quà độc bản gửi hai bạn",              // Tiêu đề bì thư / Envelope title
    hint: "Chạm để phá dấu sáp",                     // Lời nhắc trang trọng / Interaction hint
    particleText: ["Thúy Hiền", "&", "Trung Kiên"],  // Chữ morph từ bụi vàng / Words morphed in gold dust
    skipText: "Bỏ qua",                             // Nút bỏ qua / Skip label
  },

  // --- Phần đầu trang (Hero) / Editorial Hero Section ---
  hero: {
    kicker: "Bản tin đặc biệt: Hai người này sắp về chung một nhà.",
    headline: "Chính thức chốt đơn trọn đời.",
    subtitle: "Một đám cưới được mong chờ nhất mùa thu này.",
    scrollBadge: "SCROLL • KÉO XUỐNG •",
  },

  // --- Băng thông báo nổi kính mờ / Frosted Glass Notification Toasts ---
  notifications: [
    { app: "MESSENGER", text: "Thúy Hiền vừa cập nhật trạng thái: Đã kết hôn" },
    { app: "NGÂN HÀNG", text: "Tài khoản của Trung Kiên đã được chuyển sang chế độ 'chồng'." },
    { app: "LỊCH", text: "Nhắc nhở: Ngày hối hận đã hết hạn." },
    { app: "ZALO", text: "Hội bạn thân: tụi mình đã chuẩn bị tinh thần ăn cỗ." },
  ],

  // --- Tính năng ẩn (Easter Egg) khi chạm 5 lần vào tên cô dâu ---
  easterEgg: {
    taps: 5, // Số lần chạm để kích hoạt / Number of taps on bride's name
    message: "Bí mật: Hiền ơi, tớ đã khóc lúc viết cái này (hơi hơi). Thương hai cậu nhiều lắm!",
  },

  // --- Đồng hồ đếm ngược hoàng gia / Royal Editorial Countdown ---
  countdown: {
    title: "Đếm ngược đến ngày chung đôi",
    subtitle: "Từng giây từng phút trôi qua đều hướng về khoảnh khắc thiêng liêng nhất",
    labels: {
      days: "NGÀY",
      hours: "GIỜ",
      minutes: "PHÚT",
      seconds: "GIÂY",
    },
    doneTitle: "HÔM NAY LÀ NGÀY CỦA HAI BẠN!",
    doneSubtitle: "Về chung một nhà thôi, hết giờ hối hận rồi nha!",
  },

  // --- Bộ sưu tập 6 bức ảnh khoảnh khắc / 6 Moments Photo Gallery ---
  photos: [
    {
      src: "/photos/photo-1.jpg",
      caption: "Lúc chưa biết mình sắp bị 'trói' trọn đời.",
      orientation: "portrait",
    },
    {
      src: "/photos/photo-2.jpg",
      caption: "Nụ cười của người vừa tìm thấy cả thế giới.",
      orientation: "portrait",
    },
    {
      src: "/photos/photo-3.jpg",
      caption: "Bằng chứng không thể chối cãi: Hai người này sinh ra là dành cho nhau.",
      orientation: "portrait",
    },
    {
      src: "/photos/photo-4.jpg",
      caption: "Khoảnh khắc nhí nhố đáng yêu, bên nhau là ngập tràn tiếng cười.",
      orientation: "portrait",
    },
    {
      src: "/photos/photo-5.jpg",
      caption: "Nét duyên truyền thống trong bộ lễ phục Nhật Bình & Ngũ Thân rực rỡ.",
      orientation: "portrait",
    },
    {
      src: "/photos/photo-6.jpg",
      caption: "Trọn đời gắn kết, trăm năm hạnh phúc vẹn tròn.",
      orientation: "portrait",
    },
  ],

  // --- Bức thư tâm tình biên tập / Heartfelt Letter from Sender ---
  letter: {
    greeting: "Gửi Thúy Hiền và Trung Kiên,",
    paragraphs: [
      "Hiền ơi, cuối cùng cậu cũng chốt đơn thành công rồi! Tớ vừa mừng vừa tiếc: mừng vì cậu tìm được người đủ kiên nhẫn chịu đựng cậu cả đời, tiếc vì từ nay mấy buổi cà phê tối thứ Sáu của tụi mình sẽ bị cắt giảm đáng kể.",
      "Kiên ơi, chúc mừng cậu đã trúng giải độc đắc. Một lời khuyên: vợ luôn đúng. Còn nếu thấy vợ sai thì hãy xem lại câu đầu tiên.",
      "Chúc hai cậu cùng nhau già đi, cùng nhau lên cân, wifi luôn mạnh, ví luôn đầy, và không bao giờ cãi nhau vì câu hỏi muôn thuở 'tối nay ăn gì'. Mà có cãi thì cuối cùng cũng đi ăn lẩu.",
      "Cảm ơn hai cậu vì đã cho tớ chứng kiến một chuyện tình đáng yêu như vậy. Nhớ để dành bàn gần sân khấu cho tớ nha, tớ đến sớm để ăn là chính, chúc mừng là phụ.",
    ],
    closing: "Yêu hai cậu thật nhiều,",
    signature: "[TÊN CỦA BẠN]",
  },

  // --- Hợp đồng hôn nhân trọn đời & Dấu sáp / Marriage Contract ---
  contract: {
    title: "HỢP ĐỒNG HÔN NHÂN TRỌN ĐỜI",
    subtitle: "SỐ HIỆU: 001/HP/THÚYHIỀN-TRUNGKIÊN",
    clauses: [
      "Điều 1: Vợ luôn đúng.",
      "Điều 2: Trong trường hợp vợ sai, áp dụng Điều 1.",
      "Điều 3: Remote TV thuộc quyền quản lý chung, ưu tiên người đang xem phim hay hơn.",
      "Điều 4: Khi được hỏi 'tối nay ăn gì', cả hai trả lời 'gì cũng được' thì mặc định đi ăn lẩu.",
      "Điều 5: Rửa chén luân phiên, cấm giả vờ quên.",
      "Điều 6: Hợp đồng có hiệu lực vĩnh viễn, không có điều khoản hủy.",
    ],
    signHint: "Ký tên bằng ngón tay hoặc chuột vào khung tương ứng",
    signLabels: {
      bride: "Bên A: Thúy Hiền",
      groom: "Bên B: Trung Kiên",
    },
    stampText: "ĐÃ DUYỆT",
    doneMessage: "Hợp đồng chính thức có hiệu lực. Không đổi trả, không hoàn tiền!",
  },

  // --- 12 Lời chúc dí dỏm cho Bể ước nguyện / 12 Witty Wishes for Wish Vault ---
  wishes: [
    "Chúc hai bạn trăm năm hạnh phúc, và trăm năm không ai giành remote TV.",
    "Chúc Kiên luôn nhớ ngày kỷ niệm. Chúc Hiền luôn nhớ rằng Kiên đã cố gắng nhớ.",
    "Chúc hai bạn ăn gì cũng ngon, ngủ đâu cũng say, cãi nhau năm phút là làm lành.",
    "Chúc nhà mình luôn có tiếng cười, và hóa đơn điện nước luôn thấp hơn dự kiến.",
    "Chúc Hiền mãi xinh đẹp, chúc Kiên mãi nhớ rằng câu trả lời an toàn nhất là 'em đúng'.",
    "Chúc hai bạn mãi như lúc mới yêu, nhưng bớt xem điện thoại trên bàn ăn.",
    "Chúc tình yêu của hai bạn bền như pin điện thoại hồi mới mua, chứ đừng như pin hiện tại.",
    "Chúc hai bạn ngày nào cũng có lý do để cười, kể cả khi không ai nhớ lý do là gì.",
    "Chúc Kiên rửa chén giỏi, chúc Hiền nấu ăn ngon, và chúc cả hai đều biết gọi đồ ăn ngoài.",
    "Chúc hai bạn đi đâu cũng có nhau, trừ lúc đi vệ sinh.",
    "Chúc cuộc hôn nhân này ngọt như kẹo, bền như keo, và vui như đi Tết.",
    "Chúc hai bạn sớm có tin vui.",
  ],

  // --- Từ ngắn cho các hạt ngọc & nang trang trí / Short Words for Pearls & Capsules ---
  decorWords: [
    "Hạnh phúc", "Bình yên", "Tiếng cười", "Sức khỏe", "Tiền về đầy ví",
    "Ăn ngon ngủ khỏe", "Bên nhau trọn đời", "Wifi mạnh", "Không giận quá 5 phút",
  ],

  // --- Bể lời chúc vật lý (Physics Wish Pit) / Interactive Matter.js Wish Pit ---
  wishPit: {
    title: "Bể ước nguyện ngọc trai",
    subtitle: "Những lời chúc dí dỏm và chân thành được kết tinh thành nang thủy tinh viền vàng và ngọc trai",
    shakeHint: "Thử kéo thả các viên ngọc hoặc chạm nút 'Lắc bể ngọc' để cảm nhận tương tác",
  },

  // --- Thẻ cào dát vàng & Lời nhắn xúc động / Gold Foil Scratch Cards & Finale ---
  scratch: {
    title: "Khai mở khoảnh khắc dát vàng",
    subtitle: "Dùng ngón tay hoặc chuột cào nhẹ lớp nhũ vàng champagne để mở từng ký ức",
    items: [
      { photo: "/photos/photo-1.jpg", caption: "Giây phút chưa biết mình sắp thuộc về nhau trọn đời" },
      { photo: "/photos/photo-2.jpg", caption: "Nụ cười của người vừa tìm thấy cả thế giới của riêng mình" },
      { photo: "/photos/photo-3.jpg", caption: "Bằng chứng không thể chối cãi: Hai người sinh ra là dành cho nhau" },
      { photo: "/photos/photo-4.jpg", caption: "Chụp lén nhưng đẹp tựa thước phim điện ảnh" },
      { photo: "/photos/photo-5.jpg", caption: "Cặp đôi mà bất kỳ ai ngắm nhìn cũng muốn mỉm cười" },
      { photo: "/photos/photo-6.jpg", caption: "Khoảnh khắc ngọt ngào hơn tất cả những bản tình ca" },
    ],
    // Khoảnh khắc lắng đọng, chân thành duy nhất gần cuối trang / The ONE sincere moment
    finale: {
      photo: "/photos/photo-6.jpg",
      message: "Chúc hai bạn một đời bình an, cùng nhau đi qua mọi phong ba bão táp, và mãi giữ chặt bàn tay nhau trọn vẹn như hôm nay.",
    },
  },

  // --- Tùy chọn video điện ảnh / Cinema Video Message Option ---
  video: {
    show: false, // true = hiện video, false = ẩn / true = show video, false = hide
    src: "/video/loi-chuc.mp4",
    poster: "/photos/photo-1.jpg",
    title: "Thước phim kỷ niệm gửi tặng hai bạn",
  },

  // --- Thông tin địa điểm tổ chức tiệc cưới / Wedding Venue Info ---
  venue: {
    show: true, // true = hiển thị / true = show section
    title: "Hẹn gặp hai bạn tại tiệc cưới",
    name: "[TÊN ĐỊA ĐIỂM TIỆC CƯỚI]",
    address: "[ĐỊA CHỈ TRANG TRỌNG]",
    time: "[GIỜ, NGÀY TỔ CHỨC]",
    mapLink: "https://maps.google.com/?q=[ĐỊA+CHỈ]",
    buttonLabel: "Xem bản đồ chỉ đường",
  },

  // --- Đêm pháo hoa & Đèn trời kết thúc / Night Sky Finale ---
  finale: {
    lines: [
      "Chúc mừng hạnh phúc",
      "Thúy Hiền & Trung Kiên",
      "Từ [TÊN CỦA BẠN] với tất cả yêu thương",
    ],
    lanternWishes: [
      "Bình an",
      "Hạnh phúc",
      "Sớm có tin vui",
      "Tài lộc đong đầy",
      "Bên nhau trọn đời",
      "Luôn luôn thấu hiểu",
      "Trăm năm son sắt",
    ],
  },

  // --- Lời chào kết trang & Bộ đếm lời chúc / Outro & Congrats Counter ---
  outro: {
    message: "Gửi hai bạn, từ [TÊN CỦA BẠN], với tất cả yêu thương (và một chút đùa dai).",
    buttonLabel: "Chúc mừng!",
    counterLabel: "lượt chúc mừng",
  },

  // --- Thiết lập nhạc nền đám cưới / Background Audio Settings ---
  music: {
    src: "/music/nhac.mp3", // File nhạc trong public/music / Audio file in public/music
    volume: 0.5,            // Âm lượng 0.0 - 1.0 / Volume level 0.0 - 1.0
    loop: true,             // Lặp lại bài hát / Loop playback
  },
};
