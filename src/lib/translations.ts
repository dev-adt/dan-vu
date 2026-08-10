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

  // Awards Section
  'awards.tag': {
    vi: 'Cơ Cấu Giải Thưởng',
    en: 'Award Structure',
  },
  'awards.title': {
    vi: 'Vinh Danh Tài Năng Nghệ Thuật',
    en: 'Honoring Artistic Talent',
  },
  'awards.first_prize_badge': {
    vi: 'Danh Giá Nhất',
    en: 'Most Prestigious',
  },
  'awards.first_prize_title': {
    vi: '01 Giải Nhất Vô Địch',
    en: '01 Grand Championship First Prize',
  },
  'awards.first_prize_amount': {
    vi: '30.000.000 VNĐ',
    en: '30,000,000 VND',
  },
  'awards.first_prize_reward': {
    vi: 'Cúp Vàng & Cờ lưu niệm',
    en: 'Gold Cup & Commemorative Flag',
  },
  'awards.first_prize_desc': {
    vi: 'Tiết mục đỉnh cao kết hợp trọn vẹn yếu tố dân gian bản địa và hơi thở sân khấu đương đại.',
    en: 'Pinnacle performance combining native folk heritage and contemporary stage expression.',
  },
  'awards.second_prize_title': {
    vi: '02 Giải Nhì',
    en: '02 Second Prizes',
  },
  'awards.second_prize_amount': {
    vi: '15.000.000 VNĐ',
    en: '15,000,000 VND',
  },
  'awards.second_prize_reward': {
    vi: 'Cờ lưu niệm & Chứng nhận',
    en: 'Commemorative Flag & Certificate',
  },
  'awards.second_prize_desc': {
    vi: 'Vinh danh các tiết mục xuất sắc có kỹ thuật đồng đều và ý tưởng đột phá.',
    en: 'Honoring outstanding performances with synchronized technique and breakthrough concepts.',
  },
  'awards.third_prize_title': {
    vi: '03 Giải Ba',
    en: '03 Third Prizes',
  },
  'awards.third_prize_amount': {
    vi: '10.000.000 VNĐ',
    en: '10,000,000 VND',
  },
  'awards.third_prize_reward': {
    vi: 'Cờ lưu niệm & Chứng nhận',
    en: 'Commemorative Flag & Certificate',
  },
  'awards.third_prize_desc': {
    vi: 'Trao cho các đội biểu diễn đầy nhiệt huyết, giàu cảm xúc truyền tải.',
    en: 'Awarded to passionate teams with rich artistic expression and emotion.',
  },
  'awards.subsidiary_title': {
    vi: 'Giải Phụ Khác:',
    en: 'Special Awards:',
  },
  'awards.subsidiary_desc': {
    vi: 'Đội có trang phục đẹp nhất, Đội được yêu thích nhất (bình chọn online), Biên đạo xuất sắc nhất.',
    en: 'Best Costume Design, Most Popular Team (Online Vote), Best Choreographer.',
  },

  // News / Blog Section
  'news.tag': {
    vi: 'Tin Tức Nổi Bật',
    en: 'Featured News',
  },
  'news.title': {
    vi: 'Cập Nhật Tin Tức Festival',
    en: 'Festival News & Updates',
  },
  'news.view_all': {
    vi: 'Xem Tất Cả Tin Tức',
    en: 'View All News',
  },
  'news.no_posts': {
    vi: 'Chưa có bài viết nào.',
    en: 'No news articles found.',
  },
  'news.read_more': {
    vi: 'Đọc Bài Viết',
    en: 'Read Article',
  },

  // Videos Section
  'videos.tag': {
    vi: 'Thư Viện Video',
    en: 'Video Gallery',
  },
  'videos.title': {
    vi: 'Kho Video Sân Khấu & Tư Liệu',
    en: 'Stage & Documentary Video Library',
  },
  'videos.view_all': {
    vi: 'Xem Tất Cả Video',
    en: 'View All Videos',
  },

  // Tour Section
  'tour.tag': {
    vi: 'Trải Nghiệm Du Lịch',
    en: 'Tourism Experience',
  },
  'tour.title': {
    vi: 'Tour Khám Phá Điện Biên',
    en: 'Dien Bien Discovery Tours',
  },
  'tour.book_btn': {
    vi: 'Đăng Ký Tour',
    en: 'Book Tour',
  },
  'tour.contact_hotline': {
    vi: 'Hotline Tư Vấn Tour:',
    en: 'Tour Hotline:',
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
    vi: '2. Thông Tin Tiết Mục',
    en: '2. Performance Details',
  },
  'reg.step3': {
    vi: '3. Xác Nhận & Gửi',
    en: '3. Confirm & Submit',
  },
  'reg.team_name': {
    vi: 'Tên Đội Thi / Câu Lạc Bộ *',
    en: 'Team / Club Name *',
  },
  'reg.organization': {
    vi: 'Đơn Vị Trực Thuộc / Tỉnh Thành *',
    en: 'Affiliated Organization / Province *',
  },
  'reg.member_count': {
    vi: 'Số Lượng Thành Viên *',
    en: 'Number of Members *',
  },
  'reg.rep_name': {
    vi: 'Họ và Tên Trưởng Đoàn *',
    en: 'Leader Full Name *',
  },
  'reg.phone': {
    vi: 'Số Điện Thoại Liên Hệ *',
    en: 'Contact Phone Number *',
  },
  'reg.email': {
    vi: 'Email Liên Hệ *',
    en: 'Contact Email *',
  },
  'reg.pass': {
    vi: 'Mật Khẩu Đăng Nhập Cổng Đội Thi *',
    en: 'Team Portal Password *',
  },
  'reg.confirm_pass': {
    vi: 'Xác Nhận Mật Khẩu *',
    en: 'Confirm Password *',
  },
  'reg.performance_title': {
    vi: 'Tên Tiết Mục Dự Thi *',
    en: 'Performance Title *',
  },
  'reg.category': {
    vi: 'Thể Loại Dự Thi *',
    en: 'Performance Category *',
  },
  'reg.duration': {
    vi: 'Thời Lượng Tiết Mục (phút) *',
    en: 'Performance Duration (mins) *',
  },
  'reg.description': {
    vi: 'Mô Tả Tiết Mục / Ý Tưởng Nghệ Thuật *',
    en: 'Performance Description / Artistic Concept *',
  },
  'reg.tech_req': {
    vi: 'Yêu Cầu Sân Khấu & Kỹ Thuật (Đạo cụ, ánh sáng...)',
    en: 'Stage & Technical Requirements (Props, lighting...)',
  },
  'reg.video_link': {
    vi: 'Đường Dẫn Video Demo (Youtube/Drive) *',
    en: 'Demo Video Link (Youtube/Drive) *',
  },
  'reg.photo_upload': {
    vi: 'Tải Ảnh Đội Thi (Tối đa 5MB) *',
    en: 'Upload Team Photo (Max 5MB) *',
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

  // Team Portal (`/team/login`, `/team/dashboard`)
  'team.login_title': {
    vi: 'Đăng Nhập Cổng Đội Thi',
    en: 'Team Portal Login',
  },
  'team.login_desc': {
    vi: 'Dành cho trưởng đoàn quản lý thông tin tiết mục và theo dõi kết quả.',
    en: 'For team leaders to manage performance information and track results.',
  },
  'team.forgot_pass': {
    vi: 'Quên Mật Khẩu?',
    en: 'Forgot Password?',
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
