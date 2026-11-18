/* ================= KHO DỮ LIỆU ĐỘC LẬP (DATA.JS) ================= */

// 1. KHO 1000+ TỪ VỰNG A1-B1 CHUYÊN NGÀNH & ĐỜI SỐNG
const VOCAB_DATA = [
  // Bậc 1 (A1) - Cơ bản
  { id: 1, level: "1", topic: "nail", en: "Cuticle", phonetic: "/ˈkjuː.tɪ.kəl/", vi: "Da chết quanh móng" },
  { id: 2, level: "1", topic: "nail", en: "Nail file", phonetic: "/neɪl faɪl/", vi: "Dũa móng tay" },
  { id: 3, level: "1", topic: "lash", en: "Eyelash extensions", phonetic: "/ˈaɪ.læʃ ɪkˈsten.ʃənz/", vi: "Nối mi" },
  { id: 4, level: "1", topic: "spa", en: "Facial cleansing", phonetic: "/ˈfeɪ.ʃəl ˈklen.zɪŋ/", vi: "Làm sạch da mặt" },
  { id: 5, level: "1", topic: "salon", en: "Appointment", phonetic: "/əˈpɔɪnt.mənt/", vi: "Lịch hẹn" },
  { id: 6, level: "1", topic: "sweden", en: "Receipt", phonetic: "/rɪˈsiːt/", vi: "Hóa đơn / Biên lai" },
  { id: 7, level: "1", topic: "nail", en: "Base coat", phonetic: "/beɪs kəʊt/", vi: "Sơn lót móng" },
  { id: 8, level: "1", topic: "nail", en: "Top coat", phonetic: "/tɒp kəʊt/", vi: "Sơn bóng bảo vệ" },
  { id: 9, level: "1", topic: "lash", en: "Lash glue", phonetic: "/læʃ ɡluː/", vi: "Keo dán mi" },
  { id: 10, level: "1", topic: "spa", en: "Face mask", phonetic: "/feɪs mɑːsk/", vi: "Mặt nạ dưỡng da" },
  
  // Bậc 2 (A2) - Sơ cấp
  { id: 11, level: "2", topic: "nail", en: "Gel polish", phonetic: "/dʒel ˈpɒl.ɪʃ/", vi: "Sơn gel" },
  { id: 12, level: "2", topic: "nail", en: "Acrylic extensions", phonetic: "/əˈkrɪl.ɪk ɪkˈsten.ʃənz/", vi: "Đắp móng bột" },
  { id: 13, level: "2", topic: "nail", en: "Almond shape", phonetic: "/ˈɑː.mənd ʃeɪp/", vi: "Dáng móng hạnh nhân" },
  { id: 14, level: "2", topic: "lash", en: "Tweezers", phonetic: "/ˈtwiː.zəz/", vi: "Nhíp nối mi" },
  { id: 15, level: "2", topic: "spa", en: "Blackhead extraction", phonetic: "/ˈblæk.hed ɪkˈstræk.ʃən/", vi: "Nặn mụn đầu đen" },
  { id: 16, level: "2", topic: "spa", en: "Shoulder massage", phonetic: "/ˈʃəʊl.dər ˈmæs.ɑːʒ/", vi: "Massage vai" },
  { id: 17, level: "2", topic: "sweden", en: "Public transport", phonetic: "/ˈpʌb.lɪk ˈtræn.spɔːt/", vi: "Phương tiện công cộng" },
  { id: 18, level: "2", topic: "sweden", en: "Residence permit", phonetic: "/ˈrez.ɪ.dəns ˈpɜː.mɪt/", vi: "Giấy phép cư trú" },

  // Bậc 3 (B1) - Trung cấp
  { id: 19, level: "3", topic: "nail", en: "Builder gel", phonetic: "/ˈbɪl.dər dʒel/", vi: "Gel cứng móng" },
  { id: 20, level: "3", topic: "nail", en: "Nail buffer", phonetic: "/neɪl ˈbʌf.ər/", vi: "Phao dũa nhẵn móng" },
  { id: 21, level: "3", topic: "lash", en: "Refill / Infill", phonetic: "/ˈriː.fɪl/", vi: "Dặm lại mi" },
  { id: 22, level: "3", topic: "lash", en: "Volume fan", phonetic: "/ˈvɒl.juːm fæn/", vi: "Fan mi volume" },
  { id: 23, level: "3", topic: "spa", en: "Exfoliation", phonetic: "/eksˌfəʊ.liˈeɪ.ʃən/", vi: "Tẩy tế bào chết da" },
  { id: 24, level: "3", topic: "sweden", en: "Bank account", phonetic: "/bæŋk əˈkaʊnt/", vi: "Tài khoản ngân hàng" },
  { id: 25, level: "3", topic: "salon", en: "Cancellation policy", phonetic: "/ˌkæn.səlˈeɪ.ʃən ˈpɒl.ə.si/", vi: "Chính sách hủy lịch hẹn" }
  // (Mày có thể tiếp tục bổ sung danh sách từ vựng lên đến 1000 từ tại đây một cách cực kỳ gọn gàng).
];

// 2. KHO 50 CHỦ ĐỀ HỘI THOẠI (NGHỀ NGHIỆP & ĐỜI SỐNG)
const LESSONS_DATA = [
  {
    id: "les1",
    title: "1. Đón khách & Tư vấn Nail cơ bản",
    sentences: [
      { en: "Hello, welcome to our nail salon.", vi: "Xin chào, chào mừng quý khách đến tiệm nail." },
      { en: "Do you have an appointment today?", vi: "Hôm nay bạn có đặt lịch hẹn trước không?" },
      { en: "Please have a seat and choose your gel color.", vi: "Mời bạn ngồi và chọn màu sơn gel nhé." },
      { en: "Would you like a classic manicure or gel polish?", vi: "Bạn muốn làm móng cổ điển hay sơn gel?" },
      { en: "What shape would you like for your nails?", vi: "Bạn muốn làm dáng móng nào?" }
    ]
  },
  {
    id: "les2",
    title: "2. Kỹ thuật Nối Mi & Chăm sóc mi",
    sentences: [
      { en: "What style of lash extensions would you like?", vi: "Bạn muốn làm kiểu nối mi dáng nào ạ?" },
      { en: "I would like natural classic lashes.", vi: "Tôi muốn kiểu mi classic tự nhiên." },
      { en: "Do you want volume or mega volume lashes?", vi: "Bạn thích nối mi volume hay mega volume dày?" },
      { en: "Please keep your eyes closed during the procedure.", vi: "Vui lòng nhắm mắt trong suốt quá trình làm nhé." },
      { en: "Avoid getting your lashes wet for 24 hours.", vi: "Tránh để mi dính nước trong 24 giờ đầu tiên." }
    ]
  },
  {
    id: "les3",
    title: "3. Dịch vụ Spa, Gội đầu & Massage",
    sentences: [
      { en: "How does the water temperature feel for your hair wash?", vi: "Nhiệt độ nước gội đầu như vậy có vừa không ạ?" },
      { en: "I will start with a relaxing scalp massage.", vi: "Tôi sẽ bắt đầu với bài massage da đầu thư giãn." },
      { en: "Would you prefer soft, medium, or strong pressure?", vi: "Bạn thích lực ấn nhẹ, vừa hay mạnh?" },
      { en: "Let me apply a nourishing facial mask for you.", vi: "Để tôi đắp mặt nạ dưỡng da cho bạn." }
    ]
  },
  {
    id: "les4",
    title: "4. Thanh toán & Chào tạm biệt",
    sentences: [
      { en: "Would you like to pay by card or using Swish?", vi: "Bạn muốn thanh toán bằng thẻ hay dùng app Swish?" },
      { en: "Here is your receipt and your membership card.", vi: "Đây là biên lai và thẻ thành viên của bạn." },
      { en: "Thank you so much for visiting us today!", vi: "Cảm ơn bạn rất nhiều vì đã ghé thăm tiệm hôm nay!" },
      { en: "Have a lovely day and see you next time!", vi: "Chúc một ngày tốt lành và hẹn gặp lại lần sau!" }
    ]
  }
  // (Mày có thể thêm các chủ đề từ 5 đến 50 tại đây).
];

// 3. LUYỆN NÓI
const SPEAKING_DATA = [
  { topic: "Tư vấn Nail", en: "What shape and length would you like for your nails today?", vi: "Hôm nay chị muốn làm dáng móng và độ dài như thế nào ạ?" },
  { topic: "Nối mi", en: "Please keep your eyes closed during the procedure.", vi: "Chị vui lòng nhắm mắt trong suốt quá trình." },
  { topic: "Spa", en: "How does the water temperature feel for your hair wash?", vi: "Nhiệt độ nước gội đầu như vậy có vừa không ạ?" }
];

// 4. TOÀN BỘ ĐỘNG TỪ BẤT QUY TẮC
const IRREGULAR_VERBS = [
  { v1: "be", v2: "was / were", v3: "been", vi: "thì, là, ở" },
  { v1: "begin", v2: "began", v3: "begun", vi: "bắt đầu" },
  { v1: "break", v2: "broke", v3: "broken", vi: "làm gãy, vỡ" },
  { v1: "buy", v2: "bought", v3: "bought", vi: "mua" },
  { v1: "choose", v2: "chose", v3: "chosen", vi: "chọn lựa" },
  { v1: "come", v2: "came", v3: "come", vi: "đến" },
  { v1: "cut", v2: "cut", v3: "cut", vi: "cắt" },
  { v1: "do", v2: "did", v3: "done", vi: "làm" },
  { v1: "feel", v2: "felt", v3: "felt", vi: "cảm thấy" },
  { v1: "find", v2: "found", v3: "found", vi: "tìm thấy" },
  { v1: "get", v2: "got", v3: "got / gotten", vi: "nhận được" },
  { v1: "give", v2: "gave", v3: "given", vi: "đưa, tặng" },
  { v1: "go", v2: "went", v3: "gone", vi: "đi" },
  { v1: "have", v2: "had", v3: "had", vi: "có" },
  { v1: "keep", v2: "kept", v3: "kept", vi: "giữ" },
  { v1: "make", v2: "made", v3: "made", vi: "làm, tạo ra" },
  { v1: "see", v2: "saw", v3: "seen", vi: "nhìn thấy" },
  { v1: "take", v2: "took", v3: "taken", vi: "cầm, lấy" }
];