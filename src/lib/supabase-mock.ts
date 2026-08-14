import { createClient } from '@supabase/supabase-js';

// Global mock database state
let globalDb: any = null;

export function getGlobalDb() {
  if (globalDb) return globalDb;

  // Let's seed initial mock data
  const initialTeams = [
    {
      id: 'dc-001',
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      team_name: 'CLB Hoa Sen',
      performance_title: 'Liên khúc Dân ca Ba miền',
      category: 'dan_ca',
      status: 'approved',
      representative_name: 'Nguyễn Văn A',
      phone: '0987654321',
      email: 'clb.hoasen@gmail.com',
      duration: '6:15',
      description: 'Tiết mục dân ca ba miền đặc sắc.',
      technical_requirements: '2 micro không dây',
      photo_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      audio_url: 'https://soundcloud.com/example/beat-hoasen-1',
      performances: [
        {
          id: 'p1',
          title: 'Liên khúc Dân ca Ba miền',
          category: 'dan_ca',
          duration: '6:15',
          description: 'Hòa quyện điệu hò Nam Bộ, ca Huế ngọt ngào và quan họ Bắc Ninh thanh lịch.',
          technicalRequirements: '2 micro không dây, khói lạnh',
          audioUrl: 'https://soundcloud.com/example/beat-hoasen-1',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: 'p2',
          title: 'Trẩy hội đền Hùng',
          category: 'dan_ca',
          duration: '5:45',
          description: 'Hát xoan Phú Thọ ngợi ca cội nguồn dân tộc, trang phục truyền thống vùng đất Tổ.',
          technicalRequirements: 'Trống hội sân khấu, 4 micro cố định',
          audioUrl: 'https://soundcloud.com/example/beat-hoasen-2',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: 'p3',
          title: 'Đi cấy đêm trăng',
          category: 'dan_ca',
          duration: '5:00',
          description: 'Tái hiện sinh hoạt đồng quê Bắc Bộ rộn ràng tiếng cười dưới ánh trăng rằm.',
          technicalRequirements: 'Đèn vàng ấm, nón quai thao',
          audioUrl: 'https://soundcloud.com/example/beat-hoasen-3',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      ],
      password: '12345678',
      pending_changes: null,
      has_pending_update: false
    },
    {
      id: 'dv-002',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      team_name: 'Đoàn nghệ thuật Tây Bắc',
      performance_title: 'Vũ điệu Gặt Lúa Tây Bắc',
      category: 'dan_vu',
      status: 'approved',
      representative_name: 'Lò Văn B',
      phone: '0912345678',
      email: 'taybac.art@gmail.com',
      duration: '5:30',
      description: 'Mô tả điệu múa gặt lúa ngày mùa.',
      technical_requirements: 'Bục bệ sân khấu',
      photo_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      audio_url: 'https://soundcloud.com/example/beat-taybac-1',
      performances: [
        {
          id: 'p1',
          title: 'Vũ điệu Gặt Lúa Tây Bắc',
          category: 'dan_vu',
          duration: '5:30',
          description: 'Mô tả điệu múa gặt lúa ngày mùa trên những thửa ruộng bậc thang kỳ vĩ.',
          technicalRequirements: 'Bục bệ sân khấu, đạo cụ gùi lúa',
          audioUrl: 'https://soundcloud.com/example/beat-taybac-1',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: 'p2',
          title: 'Múa Xòe Hoa Tây Bắc',
          category: 'dan_vu',
          duration: '4:50',
          description: 'Điệu Xòe Thái duyên dáng kết nối tình đoàn kết giữa các dân tộc anh em.',
          technicalRequirements: 'Khăn piêu, đèn chiếu đổi màu',
          audioUrl: 'https://soundcloud.com/example/beat-taybac-2',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: 'p3',
          title: 'Tiếng Khèn Gọi Bạn',
          category: 'dan_vu',
          duration: '6:10',
          description: 'Vũ điệu khèn Mông sôi động nơi đỉnh đèo mây phủ trong phiên chợ tình vùng cao.',
          technicalRequirements: 'Đạo cụ khèn Mông thật, hiệu ứng sương mù',
          audioUrl: 'https://soundcloud.com/example/beat-taybac-3',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      ],
      password: '12345678',
      pending_changes: null,
      has_pending_update: false
    },
    {
      id: 'dc-003',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      team_name: 'CLB Hương Sắc Miền Trung',
      performance_title: 'Điệu Lý Giao Duyên Xứ Quảng',
      category: 'dan_ca',
      status: 'approved',
      representative_name: 'Trần Thị C',
      phone: '0905123456',
      email: 'mientrung.huong@gmail.com',
      duration: '6:45',
      description: 'Làn điệu dân ca ngọt ngào xứ Quảng.',
      technical_requirements: '3 micro, nhạc nền cổng AUX',
      photo_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      audio_url: 'https://soundcloud.com/example/beat-mientrung-1',
      performances: [
        {
          id: 'p1',
          title: 'Điệu Lý Giao Duyên Xứ Quảng',
          category: 'dan_ca',
          duration: '6:45',
          description: 'Làn điệu dân ca đối đáp đối duyên dí dỏm, chân chất của con người xứ Quảng.',
          technicalRequirements: '3 micro, nhạc nền cổng AUX',
          audioUrl: 'https://soundcloud.com/example/beat-mientrung-1',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: 'p2',
          title: 'Hò Khoan Lệ Thủy',
          category: 'dan_ca',
          duration: '5:20',
          description: 'Điệu hò sông nước Quảng Bình mộc mạc mang âm vang hào sảng của cha ông.',
          technicalRequirements: '2 micro thu âm nhạc cụ dân tộc',
          audioUrl: 'https://soundcloud.com/example/beat-mientrung-2',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: 'p3',
          title: 'Ca Huế Trên Sông Hương',
          category: 'dan_ca',
          duration: '6:00',
          description: 'Di sản nhã nhạc và ca Huế trầm lắng bên dòng sông Hương thơ mộng.',
          technicalRequirements: 'Trang phục áo dài ngũ thân cổ truyền',
          audioUrl: 'https://soundcloud.com/example/beat-mientrung-3',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      ],
      password: '12345678',
      pending_changes: null,
      has_pending_update: false
    },
    {
      id: 'dv-004',
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      team_name: 'Vũ đoàn Chăm Sài Gòn',
      performance_title: 'Vũ điệu Tháp Cổ Chămpa',
      category: 'dan_vu',
      status: 'approved',
      representative_name: 'Đạt An',
      phone: '0977888999',
      email: 'champa.sg@gmail.com',
      duration: '7:00',
      description: 'Điệu múa huyền bí bên tháp cổ.',
      technical_requirements: 'Hiệu ứng khói lạnh',
      photo_url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600&auto=format&fit=crop&q=80',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      audio_url: 'https://soundcloud.com/example/beat-cham-1',
      performances: [
        {
          id: 'p1',
          title: 'Vũ điệu Tháp Cổ Chămpa',
          category: 'dan_vu',
          duration: '7:00',
          description: 'Điệu múa Apsara huyền bí và uyển chuyển dưới chân tháp Chăm cổ kính.',
          technicalRequirements: 'Hiệu ứng khói lạnh, đèn đỏ cam',
          audioUrl: 'https://soundcloud.com/example/beat-cham-1',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: 'p2',
          title: 'Tiếng Trống Paranưng Ngày Hội Katê',
          category: 'dan_vu',
          duration: '5:15',
          description: 'Rộn rã thanh âm ngày Tết Katê thiêng liêng và tươi vui của đồng bào Chăm.',
          technicalRequirements: 'Đạo cụ trống Paranưng, kèn Saranai',
          audioUrl: 'https://soundcloud.com/example/beat-cham-2',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: 'p3',
          title: 'Vũ Khúc Khát Vọng Biển Đông',
          category: 'dan_vu',
          duration: '5:45',
          description: 'Vũ điệu vượt sóng vươn khơi bám biển của các ngư dân miền duyên hải.',
          technicalRequirements: 'Đạo cụ dải lụa xanh tượng trưng sóng biển',
          audioUrl: 'https://soundcloud.com/example/beat-cham-3',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      ],
      password: '12345678',
      pending_changes: null,
      has_pending_update: false
    }
  ];

  const initialJudges = [
    {
      id: 'mock-judge-id',
      email: 'giamkhao@nhipbuocvietnam.gov.vn',
      full_name: 'Lê Khánh Giám Khảo',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'mock-judge-2',
      email: 'giamkhao2@nhipbuocvietnam.gov.vn',
      full_name: 'Nguyễn Văn Chấm',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    }
  ];

  const initialScorecards = [
    {
      id: 'sc-1',
      team_id: 'dc-001',
      judge_id: 'mock-judge-id',
      score_concept: 28,
      score_technique: 38,
      score_costume: 19,
      score_stage: 9,
      total_score: 94,
      feedback: 'Tiết mục xuất sắc, có sự đầu tư công phu.',
      is_locked: true,
      submitted_at: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: 'sc-2',
      team_id: 'dv-002',
      judge_id: 'mock-judge-id',
      score_concept: 25,
      score_technique: 35,
      score_costume: 18,
      score_stage: 8,
      total_score: 86,
      feedback: 'Động tác tương đối đều, trang phục đẹp.',
      is_locked: false,
      submitted_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'sc-3',
      team_id: 'dv-004',
      judge_id: 'mock-judge-id',
      score_concept: 29,
      score_technique: 39,
      score_costume: 20,
      score_stage: 10,
      total_score: 98,
      feedback: 'Hiệu ứng sân khấu tuyệt vời, vũ đạo đỉnh cao.',
      is_locked: true,
      submitted_at: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ];

  const initialBallots = [
    {
      id: 'b-1',
      team_id: 'dc-001',
      voted_at: new Date(Date.now() - 60000).toISOString(),
      voter_ip: '113.161.42.10',
      voter_fingerprint: 'cf_abc123',
      voter_email: 'voter1@gmail.com',
      recaptcha_score: 0.12,
      is_valid: true
    },
    {
      id: 'b-2',
      team_id: 'dc-001',
      voted_at: new Date(Date.now() - 120000).toISOString(),
      voter_ip: '113.161.42.10',
      voter_fingerprint: 'cf_abc123',
      voter_email: 'voter2@gmail.com',
      recaptcha_score: 0.08,
      is_valid: true
    },
    {
      id: 'b-3',
      team_id: 'dv-002',
      voted_at: new Date(Date.now() - 300000).toISOString(),
      voter_ip: '14.161.12.34',
      voter_fingerprint: 'cf_xyz789',
      voter_email: 'voter3@gmail.com',
      recaptcha_score: 0.95,
      is_valid: true
    },
    {
      id: 'b-4',
      team_id: 'dc-003',
      voted_at: new Date(Date.now() - 400000).toISOString(),
      voter_ip: '118.70.122.90',
      voter_fingerprint: 'cf_mnopqr',
      voter_email: 'voter4@gmail.com',
      recaptcha_score: 0.88,
      is_valid: true
    }
  ];

  for (let i = 1; i <= 12; i++) {
    initialBallots.push({
      id: `b-fraud-${i}`,
      team_id: i % 2 === 0 ? 'dv-002' : 'dc-003',
      voted_at: new Date(Date.now() - 500000 - i * 100000).toISOString(),
      voter_ip: `192.168.1.${10 + i}`,
      voter_fingerprint: `cf_fraud_${i}`,
      voter_email: `bot${i}@gmail.com`,
      recaptcha_score: 0.1,
      is_valid: false
    });
  }

  const initialPosts = [
    {
      id: 'post-1',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      title: 'Khai mạc Festival Dân Ca Dân Vũ Quốc Tế 2026',
      title_en: 'Opening of the International Folk Song & Dance Festival 2026',
      content: '<p>Festival Dân Ca Dân Vũ Quốc Tế 2026 chính thức khai mạc với sự tham gia của hơn 50 đoàn nghệ thuật trong và ngoài nước. Đêm hội tụ văn hóa đậm đà bản sắc dân tộc.</p>',
      content_en: '<p>The International Folk Song & Dance Festival 2026 officially opened with over 50 domestic and international performance troupes. A grand night of cultural exchange and rich national heritage.</p>',
      photo_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
      status: 'published',
      is_featured: true,
      author: 'Ban Tổ Chức',
      format: 'html',
      summary: 'Khai mạc lễ hội dân ca dân vũ quốc tế quy tụ nhiều đoàn nghệ thuật trong nước và quốc tế.',
      summary_en: 'Grand opening of the international folk song & dance festival bringing together troupes from across the globe.',
      source: 'BTC Festival 2026'
    },
    {
      id: 'post-2',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      title: 'Công báo Hệ thống giải thưởng Nhịp Bước Việt Nam 2026',
      title_en: 'Official Announcement of Vietnam Rhythm 2026 Award System',
      content: '<p>Cơ cấu giải thưởng năm nay lên tới hàng trăm triệu đồng cùng nhiều hạng mục vinh danh chuyên đề sáng tạo mới mẻ.</p>',
      content_en: '<p>This year\'s prize structure totals hundreds of millions of VND alongside various creative special recognition categories.</p>',
      photo_url: 'https://images.unsplash.com/photo-1531050171654-7d6b379c54e2?w=800&auto=format&fit=crop&q=60',
      status: 'published',
      is_featured: true,
      author: 'Ban Tổ Chức',
      format: 'html',
      summary: 'Công bố cơ cấu giải thưởng chính thức với tổng trị giá giải thưởng lên tới hàng trăm triệu đồng.',
      summary_en: 'Official announcement of prize categories with total value reaching hundreds of millions of VND.',
      source: 'Ban Tổ Chức'
    },
    {
      id: 'post-3',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      title: 'Hướng dẫn tham gia Cổng bình chọn trực tuyến khán giả',
      title_en: 'User Guide for Online Public Voting Portal',
      content: '<p>Khán giả có thể đăng nhập bằng tài khoản Google để tham gia bình chọn Đội thi được yêu thích nhất mỗi ngày.</p>',
      content_en: '<p>Audience members can log in using a Google account to vote daily for their favorite performance teams.</p>',
      photo_url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=800&auto=format&fit=crop&q=60',
      status: 'published',
      is_featured: false,
      author: 'Ban Tổ Chức',
      format: 'html',
      summary: 'Chi tiết các bước đăng nhập và tiến hành bình chọn trực tuyến cho các đội thi bạn yêu thích.',
      summary_en: 'Detailed instructions on logging in and casting online votes for your favorite teams.',
      source: 'Ban Công Nghệ'
    }
  ];

  globalDb = {
    teams: initialTeams,
    judges: initialJudges,
    scorecards: initialScorecards,
    ballots: initialBallots,
    posts: initialPosts
  };

  return globalDb;
}

export function saveGlobalDb(db: any) {
  globalDb = db;
}

interface Filter {
  column: string;
  op: 'eq' | 'gte' | 'lte';
  value: any;
}

class MockQueryBuilder {
  private table: string;
  private filters: Filter[] = [];
  private orderCol: string | null = null;
  private orderAsc = true;
  private limitCount: number | null = null;
  private updateData: any = null;
  private deleteFlag = false;
  private insertData: any = null;
  private isSingle = false;
  private isMaybeSingle = false;
  private isCountExact = false;
  private upsertData: any = null;
  private upsertOptions: any = null;

  constructor(table: string) {
    this.table = table;
  }

  select(columns = '*', options?: any) {
    if (options?.count === 'exact') {
      this.isCountExact = true;
    }
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ column, op: 'eq', value });
    return this;
  }

  gte(column: string, value: any) {
    this.filters.push({ column, op: 'gte', value });
    return this;
  }

  lte(column: string, value: any) {
    this.filters.push({ column, op: 'lte', value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderCol = column;
    this.orderAsc = options?.ascending ?? true;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  update(obj: any) {
    this.updateData = obj;
    return this;
  }

  upsert(obj: any, options?: any) {
    this.upsertData = obj;
    this.upsertOptions = options;
    return this;
  }

  delete() {
    this.deleteFlag = true;
    return this;
  }

  insert(obj: any) {
    this.insertData = obj;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  maybeSingle() {
    this.isMaybeSingle = true;
    return this;
  }

  async then(resolve: any, reject: any) {
    try {
      const res = await this.execute();
      resolve(res);
    } catch (err) {
      reject(err);
    }
  }

  async execute() {
    const db = getGlobalDb();
    const dataList = db[this.table] || [];

    // 1. Handle insert
    if (this.insertData) {
      const newItems = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
      const inserted: any[] = [];
      for (const item of newItems) {
        const newItem = {
          id: item.id || `mock-${this.table}-${Math.random().toString(36).substring(2, 11)}`,
          created_at: new Date().toISOString(),
          ...item,
        };
        dataList.push(newItem);
        inserted.push(newItem);
      }
      saveGlobalDb(db);
      return { data: (this.isSingle || this.isMaybeSingle) ? inserted[0] : inserted, error: null, count: inserted.length };
    }

    // 2. Handle upsert
    if (this.upsertData) {
      const newItems = Array.isArray(this.upsertData) ? this.upsertData : [this.upsertData];
      const upserted: any[] = [];
      const onConflict = this.upsertOptions?.onConflict || '';
      const conflictKeys = onConflict.split(',').map((k: string) => k.trim());

      for (const item of newItems) {
        let existingIndex = -1;
        if (conflictKeys.length > 0) {
          existingIndex = dataList.findIndex((existing: any) => {
            return conflictKeys.every((key: string) => existing[key] === item[key]);
          });
        }

        if (existingIndex !== -1) {
          dataList[existingIndex] = {
            ...dataList[existingIndex],
            ...item,
            total_score: (item.score_concept ?? dataList[existingIndex].score_concept) +
                         (item.score_technique ?? dataList[existingIndex].score_technique) +
                         (item.score_costume ?? dataList[existingIndex].score_costume) +
                         (item.score_stage ?? dataList[existingIndex].score_stage)
          };
          upserted.push(dataList[existingIndex]);
        } else {
          const newItem = {
            id: item.id || `mock-${this.table}-${Math.random().toString(36).substring(2, 11)}`,
            created_at: new Date().toISOString(),
            ...item,
            total_score: (item.score_concept || 0) + (item.score_technique || 0) + (item.score_costume || 0) + (item.score_stage || 0)
          };
          dataList.push(newItem);
          upserted.push(newItem);
        }
      }
      saveGlobalDb(db);
      return { data: (this.isSingle || this.isMaybeSingle) ? upserted[0] : upserted, error: null };
    }

    // 3. Filter data
    let filtered = [...dataList];
    for (const f of this.filters) {
      filtered = filtered.filter(item => {
        if (f.op === 'eq') return item[f.column] === f.value;
        if (f.op === 'gte') return item[f.column] >= f.value;
        if (f.op === 'lte') return item[f.column] <= f.value;
        return true;
      });
    }

    // 4. Handle delete
    if (this.deleteFlag) {
      const remaining = dataList.filter((item: any) => !filtered.includes(item));
      db[this.table] = remaining;
      saveGlobalDb(db);
      return { data: null, error: null };
    }

    // 5. Handle update
    if (this.updateData) {
      filtered.forEach((item) => {
        Object.assign(item, this.updateData);
      });
      saveGlobalDb(db);
      return { data: (this.isSingle || this.isMaybeSingle) ? filtered[0] : filtered, error: null };
    }

    // 6. Handle order
    if (this.orderCol) {
      filtered.sort((a, b) => {
        const valA = a[this.orderCol!];
        const valB = b[this.orderCol!];
        if (valA < valB) return this.orderAsc ? -1 : 1;
        if (valA > valB) return this.orderAsc ? 1 : -1;
        return 0;
      });
    }

    // 7. Handle limit
    if (this.limitCount !== null) {
      filtered = filtered.slice(0, this.limitCount);
    }

    // 8. Handle joins (ballots -> teams)
    if (this.table === 'ballots') {
      filtered = filtered.map(b => {
        const team = db.teams.find((t: any) => t.id === b.team_id);
        return {
          ...b,
          teams: team ? { team_name: team.team_name } : null
        };
      });
    }

    // 9. Exact counts matching metrics instructions
    let count = this.isCountExact ? filtered.length : undefined;
    if (this.table === 'ballots' && this.isCountExact) {
      const isValidFilter = this.filters.find(f => f.column === 'is_valid');
      if (isValidFilter && isValidFilter.value === true) {
        count = 12060 + filtered.length;
      } else if (isValidFilter && isValidFilter.value === false) {
        count = filtered.length;
      } else {
        count = 12060 + filtered.length;
      }
    }

    return {
      data: (this.isSingle || this.isMaybeSingle) ? (filtered[0] || null) : filtered,
      error: null,
      count
    };
  }
}

class MockSupabaseAuth {
  private getSessionFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('mock_supabase_session');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  private saveSessionToStorage(session: any) {
    if (typeof window !== 'undefined') {
      if (session) {
        sessionStorage.setItem('mock_supabase_session', JSON.stringify(session));
      } else {
        sessionStorage.removeItem('mock_supabase_session');
      }
    }
  }

  async getSession() {
    const session = this.getSessionFromStorage();
    return { data: { session }, error: null };
  }

  onAuthStateChange(callback: any) {
    const session = this.getSessionFromStorage();
    if (callback) {
      callback('SIGNED_IN', session);
    }
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }

  async signInWithPassword({ email, password }: any) {
    const db = getGlobalDb();
    let judge = db.judges.find((j: any) => j.email?.toLowerCase() === email?.toLowerCase());
    
    if (!judge) {
      judge = {
        id: `mock-judge-${Math.random().toString(36).substring(2, 9)}`,
        email: email,
        full_name: email.split('@')[0] || 'Giám Khảo',
        created_at: new Date().toISOString(),
      };
      db.judges.push(judge);
      saveGlobalDb(db);
    }
    
    const session = {
      access_token: 'mock-access-token',
      user: {
        id: judge.id,
        email: judge.email,
        user_metadata: {
          role: 'judge',
          full_name: judge.full_name || 'Ban Giám Khảo'
        }
      }
    };
    this.saveSessionToStorage(session);
    return { data: { session, user: session.user }, error: null };
  }

  async signInWithOAuth({ provider, options }: any) {
    const session = {
      access_token: 'mock-oauth-access-token',
      user: {
        id: 'mock-voter-id',
        email: 'voter@example.com',
        user_metadata: {
          full_name: 'Khán Giả Thử Nghiệm'
        }
      }
    };
    this.saveSessionToStorage(session);
    if (typeof window !== 'undefined') {
      const targetUrl = options?.redirectTo || window.location.href;
      window.location.href = targetUrl;
    }
    return { data: {}, error: null };
  }

  async signOut() {
    this.saveSessionToStorage(null);
    return { error: null };
  }

  async exchangeCodeForSession(code: string) {
    return { data: {}, error: null };
  }

  async getUser(token: string) {
    const session = this.getSessionFromStorage();
    if (session?.user) {
      return { data: { user: session.user }, error: null };
    }
    const defaultJudge = {
      id: 'mock-judge-id',
      email: 'giamkhao@nhipbuocvietnam.gov.vn',
      user_metadata: {
        role: 'judge',
        full_name: 'Lê Khánh Giám Khảo'
      }
    };
    return { data: { user: defaultJudge }, error: null };
  }

  get admin() {
    return {
      createUser: async (params: any) => {
        const db = getGlobalDb();
        const userId = `mock-auth-user-${Math.random().toString(36).substring(2, 11)}`;
        const newJudge = {
          id: userId,
          email: params.email,
          full_name: params.user_metadata?.full_name || 'Giám Khảo Mới',
          created_at: new Date().toISOString(),
        };
        db.judges.push(newJudge);
        saveGlobalDb(db);
        return { data: { user: { id: userId } }, error: null };
      },
      deleteUser: async (id: string) => {
        const db = getGlobalDb();
        db.judges = db.judges.filter((j: any) => j.id !== id);
        db.scorecards = db.scorecards.filter((s: any) => s.judge_id !== id);
        saveGlobalDb(db);
        return { error: null };
      }
    };
  }
}

export const mockSupabase = {
  from: (table: string) => {
    return new MockQueryBuilder(table);
  },
  auth: new MockSupabaseAuth()
};
