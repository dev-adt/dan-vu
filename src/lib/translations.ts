export type Language = 'vi' | 'en';

export interface TranslationDictionary {
  [key: string]: {
    vi: string;
    en: string;
  };
}

export const translations: TranslationDictionary = {
  // Brand & General
  'brand.title': {
    vi: 'NHỊP BƯỚC VIỆT NAM',
    en: 'VIETNAM RHYTHM',
  },
  'brand.subtitle': {
    vi: 'Festival 2026',
    en: 'Festival 2026',
  },
  'brand.hero_badge': {
    vi: 'Festival Dân Ca Dân Vũ Quốc Tế 2026',
    en: 'International Folk Song & Dance Festival 2026',
  },
  'brand.theme': {
    vi: 'Chủ đề: "Kết nối văn hóa - Lan tỏa hòa bình - Vươn tầm hội nhập"',
    en: 'Theme: "Connecting Cultures - Spreading Peace - Reaching Integration"',
  },
  'brand.event_details': {
    vi: '📍 Từ 28/08 đến 02/09/2026 tại Quảng trường 7/5, phường Điện Biên Phủ, tỉnh Điện Biên',
    en: '📍 Aug 28 - Sep 02, 2026 at May 7th Square, Dien Bien Phu Ward, Dien Bien Province',
  },

  // Navbar Links
  'nav.home': {
    vi: 'Trang Chủ',
    en: 'Home',
  },
  'nav.vote': {
    vi: 'Cổng Bình Chọn',
    en: 'Voting Portal',
  },
  'nav.register': {
    vi: 'Đăng Ký Dự Thi',
    en: 'Registration',
  },
  'nav.team_portal': {
    vi: 'Cổng Đội Thi',
    en: 'Team Portal',
  },
  'nav.news': {
    vi: 'Tin Tức',
    en: 'News',
  },
  'nav.videos': {
    vi: 'Videos',
    en: 'Videos',
  },
  'nav.guides': {
    vi: 'Hướng Dẫn',
    en: 'User Guide',
  },
  'nav.language': {
    vi: 'Ngôn ngữ',
    en: 'Language',
  },

  // Hero Actions
  'hero.register_btn': {
    vi: 'Đăng Ký Dự Thi',
    en: 'Register Now',
  },
  'hero.vote_btn': {
    vi: 'Bình Chọn Tiết Mục',
    en: 'Vote Performance',
  },
  'hero.download_rules': {
    vi: 'Tải Thể Lệ Chi Tiết (PDF)',
    en: 'Download Detailed Rules (PDF)',
  },

  // Narrative / Culture Section
  'narrative.tag': {
    vi: 'Văn Hóa & Sứ Mệnh',
    en: 'Culture & Mission',
  },
  'narrative.title': {
    vi: 'Giao thoa giữa di sản ngàn năm & vũ điệu đương đại',
    en: 'Intersection of Millennium Heritage & Contemporary Dance',
  },
  'narrative.description': {
    vi: 'Festival Dân ca Dân vũ Quốc tế "Nhịp Bước Việt Nam 2026" chào mừng 81 năm Quốc khánh (02/9/1945 - 02/9/2026). Đây là ngày hội văn hóa quy tụ các đoàn nghệ thuật dân gian, dân vũ trong nước và quốc tế (Lào, Thái Lan, Trung Quốc,...), kết nối di sản văn hóa phi vật thể và quảng bá hình ảnh đất nước, con người Việt Nam cùng tỉnh Điện Biên.',
    en: 'International Folk Song & Dance Festival "Vietnam Rhythm 2026" celebrates 81 years of National Day (Sep 02, 1945 - Sep 02, 2026). This cultural festival gathers domestic and international folk performance troupes (Laos, Thailand, China,...), connecting intangible cultural heritages and promoting the image of Vietnam and Dien Bien province.',
  },
  'narrative.stat1_value': {
    vi: '50-100',
    en: '50-100',
  },
  'narrative.stat1_label': {
    vi: 'Đoàn NT & CLB dự thi',
    en: 'Troupe & Club Teams',
  },
  'narrative.stat2_value': {
    vi: '300',
    en: '300',
  },
  'narrative.stat2_label': {
    vi: 'Gian hàng hội chợ & OCOP',
    en: 'Trade & OCOP Booths',
  },
  'narrative.stat3_value': {
    vi: 'Khinh Khí Cầu',
    en: 'Hot Air Balloons',
  },
  'narrative.stat3_label': {
    vi: 'Trình diễn độc đáo',
    en: 'Unique Air Show',
  },
  'narrative.video_intro_btn': {
    vi: 'Xem Video Giới Thiệu Sự Kiện',
    en: 'Watch Event Intro Video',
  },
  'narrative.video_preview_cover': {
    vi: 'Xem Ảnh Bìa',
    en: 'View Cover',
  },
  'narrative.video_fullscreen': {
    vi: 'Phóng To',
    en: 'Fullscreen',
  },

  // Event Timeline
  'timeline.tag': {
    vi: 'Lịch Trình Festival',
    en: 'Festival Schedule',
  },
  'timeline.title': {
    vi: 'Hành Trình Sự Kiện 2026',
    en: 'Event Timeline 2026',
  },
  'timeline.phase1_tag': {
    vi: 'Giai Đoạn 1',
    en: 'Phase 1',
  },
  'timeline.phase1_title': {
    vi: 'Mở Cổng Đăng Ký & Bình Chọn Online',
    en: 'Registration & Online Voting Opens',
  },
  'timeline.phase1_date': {
    vi: '15/05/2026 - 15/08/2026',
    en: 'May 15, 2026 - Aug 15, 2026',
  },
  'timeline.phase1_desc': {
    vi: 'Các đoàn nghệ thuật gửi hồ sơ đăng ký dự thi. Cổng bình chọn trực tuyến mở công khai cho khán giả toàn quốc.',
    en: 'Performance troupes submit registration profiles. Public online voting opens nationwide.',
  },
  'timeline.phase2_tag': {
    vi: 'Giai Đoạn 2',
    en: 'Phase 2',
  },
  'timeline.phase2_title': {
    vi: 'Hội Đồng Chấm Sơ Khảo',
    en: 'Preliminary Round Judging',
  },
  'timeline.phase2_date': {
    vi: '16/08/2026 - 20/08/2026',
    en: 'Aug 16, 2026 - Aug 20, 2026',
  },
  'timeline.phase2_desc': {
    vi: 'Hội đồng Giám khảo quốc tế và trong nước đánh giá video dự thi, chọn ra các tiết mục xuất sắc nhất bước vào Vòng Chung Kết.',
    en: 'International and national jury panel evaluates submitted videos, selecting top performances for the Grand Finals.',
  },
  'timeline.phase3_tag': {
    vi: 'Giai Đoạn 3',
    en: 'Phase 3',
  },
  'timeline.phase3_title': {
    vi: 'Chung Kết & Lễ Trao Giải Trực Tiếp',
    en: 'Grand Finals & Award Ceremony Live',
  },
  'timeline.phase3_date': {
    vi: '28/08/2026 - 02/09/2026',
    en: 'Aug 28, 2026 - Sep 02, 2026',
  },
  'timeline.phase3_desc': {
    vi: 'Trình diễn sân khấu trực tiếp tại Quảng trường 7/5, Điện Biên Phủ và Đêm Gala trao giải vinh danh các nhà vô địch.',
    en: 'Live stage performances at May 7th Square, Dien Bien Phu and Gala Night awarding the champions.',
  },

  // Logo Contest Section
  'logo_contest.tag': {
    vi: 'Cuộc Thi Thiết Kế Chính Thức',
    en: 'Official Design Contest',
  },
  'logo_contest.title': {
    vi: 'PHÁT ĐỘNG CUỘC THI THIẾT KẾ LOGO VÀ BỘ NHẬN DIỆN FESTIVAL',
    en: 'LAUNCHING FESTIVAL LOGO & BRAND IDENTITY DESIGN CONTEST',
  },
  'logo_contest.description': {
    vi: 'Tìm kiếm biểu trưng chính thức cho Festival Dân ca Dân vũ Quốc tế 2026. Dành cho các công dân Việt Nam và người nước ngoài có năng lực sáng tạo mỹ thuật & thiết kế.',
    en: 'Searching for the official logo for the International Folk Song & Dance Festival 2026. Open to Vietnamese and foreign citizens with artistic & design creative skills.',
  },
  'logo_contest.deadline_label': {
    vi: 'Thời gian tiếp nhận',
    en: 'Submission Period',
  },
  'logo_contest.deadline_dates': {
    vi: '21/07/2026 – 30/07/2026',
    en: 'Jul 21, 2026 – Jul 30, 2026',
  },
  'logo_contest.status_closed': {
    vi: '✓ Đã Kết Thúc Hồ Sơ',
    en: '✓ Submission Closed',
  },
  'logo_contest.awards_title': {
    vi: 'Cơ Cấu Giải Thưởng Cuộc Thi Logo',
    en: 'Logo Contest Award Structure',
  },
  'logo_contest.first_prize_title': {
    vi: '01 Giải Nhất:',
    en: '01 First Prize:',
  },
  'logo_contest.first_prize_amount': {
    vi: '20.000.000 VNĐ',
    en: '20,000,000 VND',
  },
  'logo_contest.first_prize_reward': {
    vi: '+ Chuyến du lịch nước ngoài.',
    en: '+ Overseas Trip Package.',
  },
  'logo_contest.first_prize_note': {
    vi: 'Tác phẩm đạt giải sẽ được lựa chọn làm Logo chính thức của Festival.',
    en: 'The winning design will be selected as the official Festival Logo.',
  },
  'logo_contest.consolation_title': {
    vi: '02 Giải Khuyến Khích:',
    en: '02 Consolation Prizes:',
  },
  'logo_contest.consolation_amount': {
    vi: '5.000.000 VNĐ / giải',
    en: '5,000,000 VND / prize',
  },
  'logo_contest.consolation_reward': {
    vi: '+ Chuyến du lịch Điện Biên.',
    en: '+ Dien Bien Tour Trip.',
  },
  'logo_contest.submission_title': {
    vi: 'Hồ Sơ & Địa Chỉ Tiếp Nhận',
    en: 'Submission & Contact Address',
  },
  'logo_contest.submission_req': {
    vi: 'Tác phẩm dự thi bảo đảm tính sáng tạo, tính biểu trưng, khả năng ứng dụng cao và chưa từng tham gia hoặc đạt giải tại các cuộc thi khác.',
    en: 'Entries must ensure originality, symbolism, high applicability, and have not previously competed or won awards in other contests.',
  },
  'logo_contest.submit_address_label': {
    vi: 'Hồ sơ gửi về:',
    en: 'Send entries to:',
  },
  'logo_contest.submit_address': {
    vi: 'Văn phòng Ban Tổ chức, số 53 Nguyễn Du, phường Hai Bà Trưng, thành phố Hà Nội.',
    en: 'Organizing Committee Office, No. 53 Nguyen Du, Hai Ba Trung Ward, Hanoi City.',
  },
  'logo_contest.media_head_label': {
    vi: 'Trưởng Ban Truyền Thông:',
    en: 'Head of Communications:',
  },
  'logo_contest.media_head_value': {
    vi: 'Mrs. Hương - 0966 925 606',
    en: 'Mrs. Huong - (+84) 966 925 606',
  },
  'logo_contest.official_email_label': {
    vi: 'Email chính thức:',
    en: 'Official Email:',
  },

  // Awards Section
  'awards.tag': {
    vi: 'Cơ Cấu Giải Thưởng Festival',
    en: 'Festival Award Structure',
  },
  'awards.title': {
    vi: 'Giải Thưởng Toàn Đoàn & Chuyên Đề',
    en: 'Overall & Special Category Awards',
  },
  'awards.first_prize_badge': {
    vi: 'Danh Giá Nhất',
    en: 'Most Prestigious',
  },
  'awards.first_prize_title': {
    vi: '01 Giải Nhất Toàn Đoàn',
    en: '01 Grand Championship First Prize',
  },
  'awards.first_prize_amount': {
    vi: '150.000.000 VNĐ',
    en: '150,000,000 VND',
  },
  'awards.first_prize_reward': {
    vi: 'Cúp Vàng, Cờ & Chứng nhận',
    en: 'Gold Cup, Flag & Certificate',
  },
  'awards.first_prize_desc': {
    vi: 'Trao cho đoàn nghệ thuật xuất sắc nhất kết hợp trọn vẹn bản sắc dân gian và tinh hoa vũ đạo.',
    en: 'Awarded to the best artistic troupe combining rich folk identity and dance excellence.',
  },
  'awards.second_prize_badge': {
    vi: '02 Giải Nhì',
    en: '02 Second Prizes',
  },
  'awards.second_prize_title': {
    vi: '02 Giải Nhì',
    en: '02 Second Prizes',
  },
  'awards.second_prize_amount': {
    vi: '100.000.000 VNĐ',
    en: '100,000,000 VND',
  },
  'awards.second_prize_reward': {
    vi: 'Mỗi giải / Cờ & Chứng nhận',
    en: 'Each Prize / Flag & Certificate',
  },
  'awards.second_prize_desc': {
    vi: 'Vinh danh các tập thể xuất sắc có kỹ thuật đồng đều và ý tưởng dàn dựng đột phá.',
    en: 'Honoring outstanding troupes with synchronized technique and breakthrough choreography.',
  },
  'awards.third_prize_badge': {
    vi: '03 Giải Ba',
    en: '03 Third Prizes',
  },
  'awards.third_prize_title': {
    vi: '03 Giải Ba',
    en: '03 Third Prizes',
  },
  'awards.third_prize_amount': {
    vi: '80.000.000 VNĐ',
    en: '80,000,000 VND',
  },
  'awards.third_prize_reward': {
    vi: 'Mỗi giải / Cờ & Chứng nhận',
    en: 'Each Prize / Flag & Certificate',
  },
  'awards.third_prize_desc': {
    vi: 'Trao cho các đoàn biểu diễn nhiệt huyết, giàu cảm xúc truyền tải di sản.',
    en: 'Awarded to passionate teams with rich artistic expression and heritage presentation.',
  },
  'awards.consolation_section_title': {
    vi: 'Các Giải Khuyến Khích',
    en: 'Consolation Prizes',
  },
  'awards.consolation_section_desc': {
    vi: 'Mỗi giải trị giá dự kiến 50.000.000 VNĐ, kèm Cờ lưu niệm & Giấy chứng nhận của Ban Tổ chức.',
    en: 'Each prize estimated at 50,000,000 VND, including Commemorative Flag & Certificate from the Committee.',
  },
  'awards.special_section_title': {
    vi: 'Hệ Thống Giải Chuyên Đề',
    en: 'Special Category Awards',
  },
  'awards.special_section_desc': {
    vi: 'Các giải: Tiết mục xuất sắc, Biên đạo xuất sắc, Đội hình đẹp nhất, Trang phục đẹp nhất, Giải Sáng tạo, Giải được khán giả yêu thích, Giải Giao lưu quốc tế. Mỗi giải trị giá 30.000.000 VNĐ kèm Cúp (Biểu trưng), Giấy chứng nhận & Kỷ niệm chương.',
    en: 'Awards: Outstanding Performance, Best Choreographer, Best Formation, Best Costume, Creative Award, Most Popular Award, International Exchange Award. Each valued at 30,000,000 VND with Trophy, Certificate & Medal.',
  },

  // News / Blog Section
  'news.tag': {
    vi: 'TIN TỨC & HOẠT ĐỘNG',
    en: 'NEWS & ACTIVITIES',
  },
  'news.featured_title': {
    vi: 'Tin nổi bật',
    en: 'Featured News',
  },
  'news.title': {
    vi: 'Cập Nhật Tin Tức Festival',
    en: 'Festival News & Updates',
  },
  'news.subtitle': {
    vi: 'Cập nhật mới nhất về Festival Dân Ca Dân Vũ Quốc Tế – Nhịp Bước Việt Nam 2026.',
    en: 'Latest updates on the International Folk Song & Dance Festival 2026.',
  },
  'news.view_all': {
    vi: 'Xem tất cả tin tức',
    en: 'View All News',
  },
  'news.no_posts': {
    vi: 'Hiện tại chưa có bài viết tin tức nào được xuất bản.',
    en: 'No news articles published yet.',
  },
  'news.read_more': {
    vi: 'Đọc Bài Viết',
    en: 'Read Article',
  },
  'news.read_post': {
    vi: 'Đọc bài',
    en: 'Read',
  },
  'news.loading': {
    vi: 'Đang tải tin tức mới nhất...',
    en: 'Loading latest news...',
  },
  'news.featured_badge': {
    vi: 'NỔI BẬT ★',
    en: 'FEATURED ★',
  },
  'news.author_default': {
    vi: 'Ban Tổ Chức',
    en: 'Organizing Committee',
  },
  'news.search_placeholder': {
    vi: 'Tìm kiếm tin tức...',
    en: 'Search news articles...',
  },
  'news.search_btn': {
    vi: 'Tìm kiếm',
    en: 'Search',
  },
  'news.filter_featured': {
    vi: 'Chỉ tin nổi bật',
    en: 'Featured only',
  },

  // Videos Section
  'videos.tag': {
    vi: 'THƯ VIỆN VIDEO & CLIPS',
    en: 'VIDEO & CLIP GALLERY',
  },
  'videos.featured_title': {
    vi: 'Video nổi bật',
    en: 'Featured Videos',
  },
  'videos.title': {
    vi: 'Kho Video Sân Khấu & Tư Liệu',
    en: 'Stage & Documentary Video Library',
  },
  'videos.subtitle': {
    vi: 'Tổng hợp những tiết mục xuất sắc, phỏng vấn và hình ảnh nổi bật tại Festival Dân Ca Dân Vũ Quốc Tế 2026.',
    en: 'Collection of outstanding performances, interviews, and highlights of the 2026 Festival.',
  },
  'videos.view_all': {
    vi: 'Xem tất cả Video',
    en: 'View All Videos',
  },
  'videos.watch_btn': {
    vi: 'Xem Video',
    en: 'Watch Video',
  },
  'videos.loading': {
    vi: 'Đang tải video mới nhất...',
    en: 'Loading latest videos...',
  },
  'videos.no_videos': {
    vi: 'Hiện tại chưa có video nào được xuất bản.',
    en: 'No videos published yet.',
  },
  'videos.featured_badge': {
    vi: 'NỔI BẬT ★',
    en: 'FEATURED ★',
  },
  'videos.search_placeholder': {
    vi: 'Tìm kiếm video...',
    en: 'Search videos...',
  },
  'videos.filter_featured': {
    vi: 'Chỉ video nổi bật',
    en: 'Featured only',
  },

  // Tour Section
  'tour.tag': {
    vi: 'TRẢI NGHIỆM DU LỊCH',
    en: 'TOURISM EXPERIENCE',
  },
  'tour.title': {
    vi: 'Tour Khám Phá Điện Biên',
    en: 'Dien Bien Discovery Tours',
  },
  'tour.subtitle': {
    vi: 'Hành trình khám phá di sản lịch sử lừng lẫy, thiên nhiên hùng vĩ và bản sắc văn hóa độc đáo.',
    en: 'Journey to explore historic heritage, majestic landscapes, and rich cultural traditions.',
  },
  'tour.prev_btn': {
    vi: 'Tour Trước',
    en: 'Previous Tour',
  },
  'tour.next_btn': {
    vi: 'Tour Tiếp',
    en: 'Next Tour',
  },
  'tour.duration_label': {
    vi: 'Thời Gian',
    en: 'Duration',
  },
  'tour.transport_label': {
    vi: 'Phương Tiện',
    en: 'Transport',
  },
  'tour.highlights_label': {
    vi: 'Điểm Đáng Chú Ý',
    en: 'Tour Highlights',
  },
  'tour.cuisine_label': {
    vi: 'Ẩm Thực Tây Bắc Đặc Sắc Bao Gồm:',
    en: 'Featured Northwest Cuisine Includes:',
  },
  'tour.view_itinerary_btn': {
    vi: 'Xem Lịch Trình Chi Tiết',
    en: 'View Detailed Itinerary',
  },
  'tour.hotline_btn': {
    vi: 'Hotline Đặt Tour: 0966 925 606',
    en: 'Booking Hotline: (+84) 966 925 606',
  },
  'tour.modal_title': {
    vi: 'LỊCH TRÌNH CHI TIẾT',
    en: 'DETAILED ITINERARY',
  },
  'tour.modal_time_label': {
    vi: 'Thời gian',
    en: 'Duration',
  },
  'tour.modal_transport_label': {
    vi: 'Phương tiện',
    en: 'Transport',
  },
  'tour.modal_hotel_label': {
    vi: 'Khách sạn',
    en: 'Hotel',
  },
  'tour.modal_hotel_value': {
    vi: 'Tiêu chuẩn 3 Sao Trung Tâm',
    en: '3-Star City Center Standard',
  },
  'tour.modal_inclusions_label': {
    vi: 'DỊCH VỤ BAO GỒM',
    en: 'INCLUSIONS',
  },
  'tour.modal_exclusions_label': {
    vi: 'KHÔNG BAO GỒM',
    en: 'EXCLUSIONS',
  },
  'tour.modal_banner_title': {
    vi: 'TƯ VẤN & ĐẶT TOUR DU LỊCH ĐIỆN BIÊN',
    en: 'DIEN BIEN TOUR CONSULTATION & BOOKING',
  },
  'tour.modal_banner_desc': {
    vi: 'Liên hệ Ban Tổ Chức Festival / Vietravel để được hỗ trợ xếp đoàn & nhận ưu đãi đặc biệt.',
    en: 'Contact Festival Committee / Vietravel for group arrangements & special offers.',
  },

  // Voting Page (`/vote`)
  'vote.title': {
    vi: 'Cổng Bình Chọn Trực Tuyến',
    en: 'Online Voting Portal',
  },
  'vote.subtitle': {
    vi: 'Hãy bình chọn cho tiết mục ấn tượng nhất mà bạn yêu thích trong Festival Dân Ca Dân Vũ Quốc Tế 2026.',
    en: 'Vote for your favorite performance in International Folk Song & Dance Festival 2026.',
  },
  'vote.search_placeholder': {
    vi: 'Tìm tên tiết mục, tên đội thi, trưởng đoàn...',
    en: 'Search performance title, team name, leader...',
  },
  'vote.all_categories': {
    vi: 'Tất Cả Thể Loại',
    en: 'All Categories',
  },
  'vote.cat_danca': {
    vi: 'Dân Ca',
    en: 'Folk Song',
  },
  'vote.cat_danvu': {
    vi: 'Dân Vũ',
    en: 'Folk Dance',
  },
  'vote.sort_votes': {
    vi: 'Nhiều Lượt Bình Chọn Nhất',
    en: 'Most Voted',
  },
  'vote.sort_newest': {
    vi: 'Mới Đăng Ký Nhất',
    en: 'Newest Registered',
  },
  'vote.btn_vote': {
    vi: 'Bình Chọn Ngay',
    en: 'Vote Now',
  },
  'vote.btn_voted': {
    vi: 'Đã Bình Chọn',
    en: 'Voted',
  },
  'vote.votes_count': {
    vi: 'lượt bình chọn',
    en: 'votes',
  },
  'vote.login_req_title': {
    vi: 'Xác Thực Tài Khoản Đăng Nhập',
    en: 'Account Verification Required',
  },
  'vote.login_req_desc': {
    vi: 'Để đảm bảo tính công bằng và chống gian lận, vui lòng đăng nhập bằng Google để tiến hành bình chọn.',
    en: 'To ensure voting integrity, please sign in with Google to cast your vote.',
  },
  'vote.login_google_btn': {
    vi: 'Đăng Nhập Với Google',
    en: 'Sign in with Google',
  },
  'vote.logout_btn': {
    vi: 'Đăng Xuất',
    en: 'Sign Out',
  },

  // Candidate Card Component
  'card.representative': {
    vi: 'Trưởng đoàn:',
    en: 'Leader:',
  },
  'card.duration': {
    vi: 'Thời lượng:',
    en: 'Duration:',
  },
  'card.view_detail': {
    vi: 'Xem Chi Tiết',
    en: 'View Details',
  },

  // Registration Page (`/register`)
  'reg.wizard_title': {
    vi: 'Hồ Sơ Đăng Ký Dự Thi',
    en: 'Festival Registration Form',
  },
  'reg.step1': {
    vi: '1. Thông Tin Đội Thi',
    en: '1. Team Information',
  },
  'reg.step2': {
    vi: '2. Tiết Mục & Kỹ Thuật',
    en: '2. Performance Details',
  },
  'reg.step3': {
    vi: '3. Tư Liệu & Đính Kèm',
    en: '3. Media & Uploads',
  },
  'reg.step4': {
    vi: '4. Xác Nhận & Gửi',
    en: '4. Confirm & Submit',
  },
  'reg.draft_saved': {
    vi: 'Hệ thống tự động lưu bản nháp hồ sơ',
    en: 'Draft automatically saved',
  },
  'reg.draft_restored': {
    vi: 'Đã khôi phục bản nháp trước đó!',
    en: 'Restored previous draft!',
  },
  'reg.team_name': {
    vi: 'Tên Đội Thi / Câu Lạc Bộ *',
    en: 'Team / Club Name *',
  },
  'reg.team_name_placeholder': {
    vi: 'Nhập tên đội thi hoặc câu lạc bộ...',
    en: 'Enter team or club name...',
  },
  'reg.organization': {
    vi: 'Đơn Vị Trực Thuộc / Tỉnh Thành *',
    en: 'Affiliated Organization / Province *',
  },
  'reg.organization_placeholder': {
    vi: 'VD: Trung tâm Văn hóa Tỉnh Điện Biên',
    en: 'e.g., Cultural Center of Dien Bien',
  },
  'reg.member_count': {
    vi: 'Số Lượng Thành Viên *',
    en: 'Number of Members *',
  },
  'reg.member_count_placeholder': {
    vi: 'VD: 25',
    en: 'e.g., 25',
  },
  'reg.rep_name': {
    vi: 'Họ và Tên Trưởng Đoàn *',
    en: 'Leader Full Name *',
  },
  'reg.rep_name_placeholder': {
    vi: 'Nhập họ tên trưởng đoàn...',
    en: 'Enter leader full name...',
  },
  'reg.phone': {
    vi: 'Số Điện Thoại Liên Hệ *',
    en: 'Contact Phone Number *',
  },
  'reg.phone_placeholder': {
    vi: '0988xxxxxx',
    en: '+84988xxxxxx',
  },
  'reg.email': {
    vi: 'Email Liên Hệ *',
    en: 'Contact Email *',
  },
  'reg.email_placeholder': {
    vi: 'truongdoan@gmail.com',
    en: 'leader@gmail.com',
  },
  'reg.pass': {
    vi: 'Mật Khẩu Đăng Nhập Cổng Đội Thi *',
    en: 'Team Portal Password *',
  },
  'reg.pass_placeholder': {
    vi: 'Tối thiểu 6 ký tự',
    en: 'Minimum 6 characters',
  },
  'reg.confirm_pass': {
    vi: 'Xác Nhận Mật Khẩu *',
    en: 'Confirm Password *',
  },
  'reg.confirm_pass_placeholder': {
    vi: 'Nhập lại mật khẩu...',
    en: 'Re-enter password...',
  },
  'reg.performance_title': {
    vi: 'Tên Tiết Mục Dự Thi *',
    en: 'Performance Title *',
  },
  'reg.performance_title_placeholder': {
    vi: 'VD: Múa Xòe Đêm Hội Tây Bắc',
    en: 'e.g., Northwest Xoe Dance Night',
  },
  'reg.category': {
    vi: 'Thể Loại Dự Thi *',
    en: 'Performance Category *',
  },
  'reg.cat_dan_ca': {
    vi: 'Dân Ca',
    en: 'Folk Song',
  },
  'reg.cat_dan_vu': {
    vi: 'Dân Vũ',
    en: 'Folk Dance',
  },
  'reg.cat_both': {
    vi: 'Cả Dân Ca & Dân Vũ',
    en: 'Both Folk Song & Folk Dance',
  },
  'reg.duration': {
    vi: 'Thời Lượng Tiết Mục (phút) *',
    en: 'Performance Duration (mins) *',
  },
  'reg.duration_placeholder': {
    vi: 'VD: 7-10 phút',
    en: 'e.g., 7-10 minutes',
  },
  'reg.description': {
    vi: 'Mô Tả Tiết Mục / Ý Tưởng Nghệ Thuật *',
    en: 'Performance Description / Artistic Concept *',
  },
  'reg.description_placeholder': {
    vi: 'Tóm tắt ý tưởng, nội dung bài thi và trang phục...',
    en: 'Summarize artistic concept, performance content and costumes...',
  },
  'reg.tech_req': {
    vi: 'Yêu Cầu Sân Khấu & Kỹ Thuật (Đạo cụ, ánh sáng...)',
    en: 'Stage & Technical Requirements (Props, lighting...)',
  },
  'reg.tech_req_placeholder': {
    vi: 'VD: Cần 2 micro cầm tay, khói lạnh...',
    en: 'e.g., Requires 2 handheld mics, low fog...',
  },
  'reg.video_link': {
    vi: 'Đường Dẫn Video Demo (Youtube/Drive) *',
    en: 'Demo Video Link (Youtube/Drive) *',
  },
  'reg.video_link_placeholder': {
    vi: 'https://youtube.com/watch?v=...',
    en: 'https://youtube.com/watch?v=...',
  },
  'reg.photo_upload': {
    vi: 'Tải Ảnh Đội Thi (Tối đa 5MB) *',
    en: 'Upload Team Photo (Max 5MB) *',
  },
  'reg.photo_drag_drop': {
    vi: 'Kéo thả ảnh vào đây hoặc nhấp để chọn tệp',
    en: 'Drag & drop image here or click to select file',
  },
  'reg.photo_uploaded': {
    vi: 'Đã tải lên ảnh đại diện đội thi thành công!',
    en: 'Team photo uploaded successfully!',
  },
  'reg.photo_change': {
    vi: 'Thay ảnh khác',
    en: 'Change image',
  },
  'reg.photo_remove': {
    vi: 'Xóa ảnh',
    en: 'Remove image',
  },
  'reg.step3_confirm_head': {
    vi: 'XÁC NHẬN THÔNG TIN HỒ SƠ',
    en: 'CONFIRM PROFILE INFORMATION',
  },
  'reg.step3_confirm_sub': {
    vi: 'Vui lòng kiểm tra kỹ các thông tin trước khi nhấn Gửi Hồ Sơ.',
    en: 'Please carefully review details before submitting.',
  },
  'reg.next_btn': {
    vi: 'Tiếp Theo',
    en: 'Next Step',
  },
  'reg.prev_btn': {
    vi: 'Quay Lại',
    en: 'Previous',
  },
  'reg.submit_btn': {
    vi: 'Hoàn Tất Đăng Ký Dự Thi',
    en: 'Submit Registration',
  },
  'reg.submitting': {
    vi: 'Đang Gửi Hồ Sơ...',
    en: 'Submitting Form...',
  },
  'reg.success_title': {
    vi: 'Gửi Hồ Sơ Đăng Ký Thành Công!',
    en: 'Registration Submitted Successfully!',
  },
  'reg.success_desc': {
    vi: 'Hồ sơ dự thi của bạn đã được tiếp nhận. Ban tổ chức sẽ duyệt hồ sơ và phản hồi qua email.',
    en: 'Your registration profile has been received. The organizing committee will review and respond via email.',
  },
  'reg.go_team_portal': {
    vi: 'Vào Cổng Đội Thi Ngay',
    en: 'Go to Team Portal Now',
  },
  'reg.go_home': {
    vi: 'Về Trang Chủ',
    en: 'Return to Home',
  },

  // Team Portal & Login (`/team/login`, `/team/dashboard`)
  'team.login_tag': {
    vi: 'Dành Cho Các Đội/Nhóm Dự Thi',
    en: 'For Contest Troupes & Teams',
  },
  'team.login_title': {
    vi: 'CỔNG ĐĂNG NHẬP ĐỘI THI',
    en: 'TEAM PORTAL LOGIN',
  },
  'team.login_desc': {
    vi: 'Đăng nhập bằng Email & Mật khẩu đã đăng ký để quản lý hồ sơ và cập nhật thông tin tiết mục.',
    en: 'Sign in with registered Email & Password to manage your profile and update performance details.',
  },
  'team.email_label': {
    vi: 'Email Đã Đăng Ký *',
    en: 'Registered Email *',
  },
  'team.email_placeholder': {
    vi: 'example@gmail.com',
    en: 'example@gmail.com',
  },
  'team.pass_label': {
    vi: 'Mật Khẩu *',
    en: 'Password *',
  },
  'team.pass_placeholder': {
    vi: '••••••••',
    en: '••••••••',
  },
  'team.forgot_pass': {
    vi: 'Quên mật khẩu?',
    en: 'Forgot password?',
  },
  'team.btn_login': {
    vi: 'Đăng Nhập Cổng Đội Thi',
    en: 'Log In to Team Portal',
  },
  'team.authenticating': {
    vi: 'Đang xác thực...',
    en: 'Authenticating...',
  },
  'team.no_account': {
    vi: 'Đội của bạn chưa gửi hồ sơ đăng ký?',
    en: 'Has your team not submitted a profile yet?',
  },
  'team.register_new': {
    vi: 'Đăng Ký Hồ Sơ Mới Ngay',
    en: 'Register New Profile Now',
  },
  'team.forgot_pass_title': {
    vi: 'Khôi Phục Mật Khẩu Đội Thi',
    en: 'Reset Team Password',
  },
  'team.forgot_pass_desc': {
    vi: 'Nhập email đăng ký để nhận liên kết đặt lại mật khẩu.',
    en: 'Enter your registered email to receive a password reset link.',
  },
  'team.forgot_pass_send_btn': {
    vi: 'Gửi Liên Kết Khôi Phục',
    en: 'Send Reset Link',
  },
  'team.forgot_pass_back': {
    vi: 'Quay lại Đăng nhập',
    en: 'Back to Login',
  },
  'team.dashboard_title': {
    vi: 'Bảng Quản Lý Đội Thi',
    en: 'Team Dashboard',
  },
  'team.profile_tab': {
    vi: 'Hồ Sơ Đội Thi',
    en: 'Team Profile',
  },
  'team.scorecard_tab': {
    vi: 'Kết Quả Chấm Điểm',
    en: 'Scoring Results',
  },

  // User Guide Page (`/guide`)
  'guide.breadcrumb_home': {
    vi: 'Trang Chủ',
    en: 'Home',
  },
  'guide.breadcrumb_current': {
    vi: 'Hướng Dẫn Sử Dụng',
    en: 'User Guide',
  },
  'guide.title': {
    vi: 'Cẩm Nang & Hướng Dẫn Sử Dụng',
    en: 'Handbook & User Guide',
  },
  'guide.subtitle': {
    vi: 'Tài liệu chi tiết hướng dẫn dành cho Đội thi, Khán giả bình chọn và Người dùng Festival Dân Ca Dân Vũ Quốc Tế 2026.',
    en: 'Detailed user guide for Troupes, Voting Audience, and Users of the International Folk Song & Dance Festival 2026.',
  },
  'guide.menu_title': {
    vi: 'Danh mục Hướng dẫn',
    en: 'Guide Directory',
  },
  'guide.support_title': {
    vi: 'Hỗ trợ trực tiếp 24/7',
    en: 'Direct 24/7 Support',
  },
  'guide.support_desc': {
    vi: 'Nếu bạn cần hỗ trợ kỹ thuật hoặc có thắc mắc trong quá trình đăng ký, vui lòng liên hệ Ban Tổ Chức:',
    en: 'If you need technical support or have questions during registration, please contact the Committee:',
  },
  'guide.hotline_label': {
    vi: '📞 Hotline:',
    en: '📞 Hotline:',
  },

  // Guide Section 1
  'guide.sec1_nav': {
    vi: '1. Tổng quan & Trang chủ',
    en: '1. Overview & Home',
  },
  'guide.sec1_title': {
    vi: 'Tổng Quan Trang Chủ & Giao Diện Chính',
    en: 'Home Overview & Main Interface',
  },
  'guide.sec1_subtitle': {
    vi: 'Khám phá các tính năng chính trên website Festival 2026',
    en: 'Discover key features on the Festival 2026 website',
  },
  'guide.sec1_desc1': {
    vi: 'Website Festival Dân Ca Dân Vũ Quốc Tế – Nhịp Bước Việt Nam 2026 là cổng thông tin chính thức kết nối Ban Tổ Chức, các Đoàn nghệ thuật / Đội thi dự thi và Khán giả trên toàn quốc.',
    en: 'The International Folk Song & Dance Festival – Vietnam Rhythm 2026 website is the official portal connecting the Organizing Committee, Troupes/Teams, and Audiences nationwide.',
  },
  'guide.sec1_item1': {
    vi: 'Thanh điều hướng chính (Navbar): Truy cập nhanh Trang chủ, Cổng bình chọn, Đăng ký dự thi, Cổng Đội Thi.',
    en: 'Main Navigation Bar (Navbar): Quick access to Home, Voting Portal, Registration, Team Portal.',
  },
  'guide.sec1_item2': {
    vi: 'Bảng tin tức & Video: Cập nhật liên tục tin tức báo chí, video thông điệp và hình ảnh festival.',
    en: 'News & Video Board: Continuous updates of press news, message videos, and festival media.',
  },
  'guide.sec1_item3': {
    vi: 'Cổng bình chọn khán giả: Theo dõi bảng điểm và bình chọn trực tiếp cho đội yêu thích.',
    en: 'Audience Voting Portal: Track scores and vote directly for your favorite troupe.',
  },
  'guide.sec1_img_caption': {
    vi: 'Hình 1.1: Giao diện Trang chủ chính thức với các phân vùng chức năng',
    en: 'Figure 1.1: Official Home interface with functional sections',
  },

  // Guide Section 2
  'guide.sec2_nav': {
    vi: '2. Đăng ký Đội dự thi',
    en: '2. Team Registration',
  },
  'guide.sec2_title': {
    vi: 'Hướng Dẫn Đăng Ký Đội Dự Thi',
    en: 'Team Registration Guide',
  },
  'guide.sec2_subtitle': {
    vi: 'Quy trình nộp hồ sơ tham gia Festival dành cho các Đội nhóm / Câu lạc bộ',
    en: 'Application submission process for Troupes / Clubs',
  },
  'guide.sec2_step1': {
    vi: 'Trên thanh Menu chính, chọn "Đăng Ký Dự Thi" hoặc truy cập đường dẫn /register.',
    en: 'On the main menu, click "Registration" or go to /register.',
  },
  'guide.sec2_step2': {
    vi: 'Điền đầy đủ thông tin vào Form đăng ký:',
    en: 'Fill in all information in the registration form:',
  },
  'guide.sec2_item1': {
    vi: 'Tên Đoàn / CLB / Đội thi: Nhập chính xác tên đơn vị biểu diễn.',
    en: 'Troupe / Club / Team Name: Enter exact performing unit name.',
  },
  'guide.sec2_item2': {
    vi: 'Thể loại dự thi: Chọn Dân Ca, Dân Vũ hoặc Cả hai thể loại.',
    en: 'Performance Category: Select Folk Song, Folk Dance, or Both.',
  },
  'guide.sec2_item3': {
    vi: 'Thông tin đại diện: Họ tên người đại diện, Số điện thoại và Email chính xác.',
    en: 'Leader Info: Leader full name, valid Phone and Email.',
  },
  'guide.sec2_item4': {
    vi: 'Thông tin tiết mục: Tên tiết mục, thời lượng, mô tả ý tưởng và yêu cầu kỹ thuật.',
    en: 'Performance Info: Title, duration, concept description, and technical requirements.',
  },
  'guide.sec2_item5': {
    vi: 'Mật khẩu quản trị đội thi: Tạo mật khẩu bảo mật (tối thiểu 6 ký tự).',
    en: 'Team Admin Password: Create a secure password (min 6 chars).',
  },
  'guide.sec2_step3': {
    vi: 'Kiểm tra kỹ thông tin và nhấn nút "Gửi Hồ Sơ Đăng Ký".',
    en: 'Double-check details and click "Submit Registration".',
  },
  'guide.sec2_img_caption': {
    vi: 'Hình 2.1: Giao diện Form nộp hồ sơ đăng ký tham gia Festival 2026',
    en: 'Figure 2.1: Festival 2026 Registration Form Interface',
  },

  // Guide Section 3
  'guide.sec3_nav': {
    vi: '3. Cổng Đội Thi & Dashboard',
    en: '3. Team Portal & Dashboard',
  },
  'guide.sec3_title': {
    vi: 'Cổng Đội Thi & Dashboard Quản Lý Hồ Sơ',
    en: 'Team Portal & Profile Management Dashboard',
  },
  'guide.sec3_subtitle': {
    vi: 'Đăng nhập tài khoản đội thi, theo dõi trạng thái duyệt & nộp file nhạc/ảnh',
    en: 'Log in to team account, track approval status & upload music/photos',
  },
  'guide.sec3_desc1': {
    vi: 'Sau khi đăng ký thành công, mỗi Đội thi có một Dashboard riêng để quản lý toàn bộ hồ sơ dự thi.',
    en: 'After successful registration, each team receives a dedicated Dashboard to manage their application.',
  },
  'guide.sec3_login_title': {
    vi: 'Đăng nhập Cổng Đội Thi',
    en: 'Log in to Team Portal',
  },
  'guide.sec3_login_desc': {
    vi: 'Chọn menu "Cổng Đội Thi" hoặc truy cập /team/login. Đăng nhập bằng Email & Mật khẩu đã tạo.',
    en: 'Select "Team Portal" menu or visit /team/login. Log in with your registered Email & Password.',
  },
  'guide.sec3_status_title': {
    vi: 'Trạng thái Phê duyệt',
    en: 'Approval Status',
  },
  'guide.sec3_status_desc': {
    vi: 'Hồ sơ sẽ hiển thị nhãn trạng thái: Chờ duyệt, Đã duyệt hoặc Từ chối.',
    en: 'Profile displays status badges: Pending, Approved, or Rejected.',
  },
  'guide.sec3_img1_caption': {
    vi: 'Hình 3.1: Giao diện đăng nhập tài khoản Đội thi',
    en: 'Figure 3.1: Team Account Login Interface',
  },
  'guide.sec3_img2_caption': {
    vi: 'Hình 3.2: Giao diện Dashboard Quản lý Hồ sơ Đội thi',
    en: 'Figure 3.2: Team Profile Management Dashboard Interface',
  },

  // Guide Section 4
  'guide.sec4_nav': {
    vi: '4. Bình chọn Khán giả',
    en: '4. Audience Voting',
  },
  'guide.sec4_title': {
    vi: 'Hướng Dẫn Khán Giả Đăng Nhập & Bình Chọn',
    en: 'Audience Login & Voting Guide',
  },
  'guide.sec4_subtitle': {
    vi: 'Bình chọn trực tuyến cho các tiết mục yêu thích để tranh giải "Đội thi được yêu thích nhất"',
    en: 'Vote online for favorite performances to compete for the "Most Popular Team" award',
  },
  'guide.sec4_desc1': {
    vi: 'Khán giả toàn quốc có thể tham gia bình chọn miễn phí thông qua Cổng Bình Chọn Trực Tuyến.',
    en: 'Audiences nationwide can vote for free through the Online Voting Portal.',
  },
  'guide.sec4_step1': {
    vi: 'Truy cập Cổng Bình Chọn tại /vote.',
    en: 'Visit the Voting Portal at /vote.',
  },
  'guide.sec4_step2': {
    vi: 'Đăng nhập tài khoản Google để bảo mật và chống spam bình chọn.',
    en: 'Sign in with Google account to secure votes and prevent spam.',
  },
  'guide.sec4_step3': {
    vi: 'Tìm kiếm đội thi và nhấn nút "Bình Chọn Ngay".',
    en: 'Search for your team and click "Vote Now".',
  },
  'guide.sec4_img_caption': {
    vi: 'Hình 4.1: Giao diện Cổng Bình Chọn Trực Tuyến dành cho Khán giả',
    en: 'Figure 4.1: Online Audience Voting Portal Interface',
  },

  // Guide Section 5
  'guide.sec5_nav': {
    vi: '5. Đổi thông tin Hồ sơ',
    en: '5. Update Profile Info',
  },
  'guide.sec5_title': {
    vi: 'Hướng Dẫn Chỉnh Sửa Hồ Sơ Đội Thi',
    en: 'Editing Team Profile Guide',
  },
  'guide.sec5_subtitle': {
    vi: 'Cập nhật thông tin tiết mục, thành viên và bổ sung tài liệu trước hạn chót',
    en: 'Update performance details, members, and upload documents before deadline',
  },
  'guide.sec5_desc1': {
    vi: 'Đội thi có thể điều chỉnh thông tin hồ sơ bất kỳ lúc nào tại Cổng Đội Thi.',
    en: 'Teams can update their profile information at any time in the Team Portal.',
  },

  // Guide Section 6
  'guide.sec6_nav': {
    vi: '6. Tin tức & Thư viện Video',
    en: '6. News & Video Library',
  },
  'guide.sec6_title': {
    vi: 'Khám Phá Tin Tức & Thư Viện Video Festival',
    en: 'Explore Festival News & Video Library',
  },
  'guide.sec6_subtitle': {
    vi: 'Theo dõi thông điệp truyền thông, các phóng sự và clip trình diễn sân khấu',
    en: 'Follow media messages, reports, and stage performance clips',
  },

  // Footer & Common
  'footer.organizer_title': {
    vi: 'BAN TỔ CHỨC FESTIVAL 2026',
    en: 'FESTIVAL 2026 ORGANIZING COMMITTEE',
  },
  'footer.location': {
    vi: 'Địa điểm: Quảng trường 7/5, Phường Điện Biên Phủ, Tỉnh Điện Biên.',
    en: 'Location: May 7th Square, Dien Bien Phu Ward, Dien Bien Province.',
  },
  'footer.hotline': {
    vi: 'Hotline Hỗ Trợ: 0988.123.456',
    en: 'Support Hotline: (+84) 988.123.456',
  },
  'footer.email': {
    vi: 'Email: contact@nhipbuocvietnam2026.vn',
    en: 'Email: contact@nhipbuocvietnam2026.vn',
  },
  'footer.links_title': {
    vi: 'LIÊN KẾT NHANH',
    en: 'QUICK LINKS',
  },
  'footer.admin_judge_link': {
    vi: 'Cổng Giám Sát Admin / Giám Khảo',
    en: 'Admin / Judge Monitoring Portal',
  },
  'footer.copyright': {
    vi: '© 2026 Festival Dân Ca Dân Vũ Quốc Tế - Nhịp Bước Việt Nam. Tất cả quyền được bảo lưu.',
    en: '© 2026 International Folk Song & Dance Festival - Vietnam Rhythm. All rights reserved.',
  },

  // Common UI
  'common.loading': {
    vi: 'Đang tải dữ liệu...',
    en: 'Loading data...',
  },
  'common.back': {
    vi: 'Quay lại',
    en: 'Back',
  },
  'common.close': {
    vi: 'Đóng',
    en: 'Close',
  },
  'common.confirm': {
    vi: 'Xác nhận',
    en: 'Confirm',
  },
  'common.cancel': {
    vi: 'Hủy',
    en: 'Cancel',
  },
};
