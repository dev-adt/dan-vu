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
      photo_url: '',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
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
      photo_url: '',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
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
      photo_url: '',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
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
      photo_url: '',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
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

  globalDb = {
    teams: initialTeams,
    judges: initialJudges,
    scorecards: initialScorecards,
    ballots: initialBallots
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
    const judge = db.judges.find((j: any) => j.email === email);
    
    const session = {
      access_token: 'mock-access-token',
      user: {
        id: judge ? judge.id : 'mock-judge-id',
        email: email,
        user_metadata: {
          full_name: judge ? judge.full_name : 'Giám Khảo Thử Nghiệm'
        }
      }
    };
    this.saveSessionToStorage(session);
    return { data: { user: session.user }, error: null };
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
    const session = this.getSessionFromStorage() || {
      user: {
        id: 'mock-voter-id',
        email: 'voter@example.com',
        user_metadata: {
          full_name: 'Khán Giả Thử Nghiệm'
        }
      }
    };
    return { data: { user: session.user }, error: null };
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
