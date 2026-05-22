// Zmenu PWA — 5 hi-fi screens v4 · WHITE-LABEL (industry-neutral)
// Mobile-first 390px · NO AI · NO online payment · NO F&B-only terms

const C = {
  navy: '#01406D',
  teal: '#01B4BA',
  bg: '#F5FEFE',
  orange: '#FF7A0F',
  ink: '#0E1B26',
  ink2: '#5A6B78',
  ink3: '#92A1AE',
  line: '#E3EEF1',
  card: '#FFFFFF',
  green: '#16A34A',
  greenBg: '#E8F8EE',
  redBg: '#FCE4E4',
  red: '#C2272D',
};

const HEAD = '"Be Vietnam Pro", "Inter", -apple-system, system-ui, sans-serif';
const BODY = '"Inter", -apple-system, system-ui, sans-serif';

function ZLogo({ w = 88, dark = false, color }) {
  const text = color || (dark ? '#F5FEFE' : C.navy);
  const bar2 = color || (dark ? '#F5FEFE' : C.navy);
  return (
    <svg width={w} height={w * (24 / 92)} viewBox="0 0 92 24" fill="none">
      <rect x="0" y="3" width="14" height="3" rx="1" fill={C.teal}/>
      <rect x="0" y="9" width="19" height="3" rx="1" fill={bar2}/>
      <rect x="0" y="15" width="11" height="3" rx="1" fill={bar2}/>
      <circle cx="22" cy="16.5" r="1.4" fill={C.orange}/>
      <text x="28" y="18" fontFamily="Be Vietnam Pro, sans-serif" fontWeight="700" fontSize="16" letterSpacing="-0.5" fill={text}>Zmenu</text>
    </svg>
  );
}

const I = {
  search: (s = 18, c = C.ink2) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={c} strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  back: (s = 22, c = C.ink) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus: (s = 16, c = '#fff') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={c} strokeWidth="2.6" strokeLinecap="round"/></svg>,
  cart: (s = 18, c = '#fff') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 4h2.5l2.4 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 1.95-1.55L21 8H6.2" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="10" cy="20" r="1.4" fill={c}/><circle cx="17" cy="20" r="1.4" fill={c}/></svg>,
  arrow: (s = 16, c = '#fff') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  tag: (s = 12, c = '#fff') => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M3 12V4h8l10 10-8 8z" opacity="0.9"/><circle cx="7.5" cy="7.5" r="1.5" fill="#01406D"/></svg>,
  qr: (s = 14, c = C.ink2) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke={c} strokeWidth="1.6"/><rect x="14" y="3" width="7" height="7" rx="1" stroke={c} strokeWidth="1.6"/><rect x="3" y="14" width="7" height="7" rx="1" stroke={c} strokeWidth="1.6"/><path d="M14 14h3v3M21 14v3M14 21h7M17 17h4" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  pin: (s = 14, c = C.teal) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><circle cx="12" cy="10" r="2.5" stroke={c} strokeWidth="1.8"/></svg>,
  check: (s = 14, c = '#fff') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  receipt: (s = 22, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 8h6M9 12h6M9 16h4" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  catalog: (s = 22, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.8"/><rect x="14" y="4" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.8"/></svg>,
  user: (s = 22, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.8"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  home: (s = 22, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  chart: (s = 22, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  cog: (s = 22, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.8"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  bell: (s = 18, c = C.ink) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M6 8a6 6 0 0 1 12 0v4l1.5 3h-15L6 12z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><path d="M10 18a2 2 0 0 0 4 0" stroke={c} strokeWidth="1.8"/></svg>,
  warn: (s = 16, c = C.orange) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 3l10 18H2z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 10v5M12 18.5v.1" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  msg: (s = 14, c = C.teal) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M4 5h16v12H8l-4 4z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><circle cx="9" cy="11" r="1" fill={c}/><circle cx="13" cy="11" r="1" fill={c}/><circle cx="17" cy="11" r="1" fill={c}/></svg>,
};

function ItemPh({ label, h = 130, hue = 0, badge }) {
  const palettes = [
    ['#DCEAF3', '#C5DBEA', C.navy],
    ['#D6F3F4', '#BDEAEC', C.teal],
    ['#FFE6D1', '#FFD2AE', C.orange],
    ['#E8F2F4', '#D4E8EB', C.navy],
  ];
  const p = palettes[hue % palettes.length];
  return (
    <div style={{
      position: 'relative', width: '100%', height: h, borderRadius: 12, overflow: 'hidden',
      background: `repeating-linear-gradient(135deg, ${p[0]} 0 10px, ${p[1]} 10px 20px)`,
    }}>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 9.5, letterSpacing: 0.4,
        color: p[2], opacity: 0.7, textTransform: 'uppercase', textAlign: 'center', padding: 8,
      }}>{label}</div>
      {badge}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// S01 — END USER · CATALOG (white-label)
// ═══════════════════════════════════════════════════════════════
function S01_Catalog() {
  const cats = ['Tất cả', '[Danh mục 1]', '[Danh mục 2]', '[Danh mục 3]'];
  const items = [
    { name: '[Sản phẩm A]', price: '45.000đ', ph: 'PRODUCT · A', hue: 0 },
    { name: '[Sản phẩm B]', price: '55.000đ', ph: 'PRODUCT · B', hue: 3, promo: true },
    { name: '[Sản phẩm C]', price: '35.000đ', ph: 'PRODUCT · C', hue: 1 },
    { name: '[Sản phẩm D]', price: '79.000đ', ph: 'PRODUCT · D', hue: 0, promo: true },
    { name: '[Sản phẩm E]', price: '25.000đ', ph: 'PRODUCT · E', hue: 3 },
    { name: '[Sản phẩm F]', price: '30.000đ', ph: 'PRODUCT · F', hue: 1 },
  ];

  return (
    <div style={{ background: C.bg, minHeight: '100%', fontFamily: BODY, color: C.ink }}>
      <div style={{ height: 54 }} />

      <div style={{ padding: '10px 16px 14px', background: C.navy, color: '#fff',
        borderBottomLeftRadius: 22, borderBottomRightRadius: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div style={{
              background: '#fff', padding: '6px 9px', borderRadius: 8,
              display: 'flex', alignItems: 'center',
            }}>
              <ZLogo w={66} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 14, lineHeight: 1.1 }}>[Tên Cửa Hàng]</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: C.greenBg, color: C.green,
                  fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: C.green }} />
                  Đang mở
                </span>
                <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.7)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {I.qr(11, 'rgba(255,255,255,0.7)')} [Mã vị trí]
                </span>
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.14)', borderRadius: 999, padding: 3,
            border: '1px solid rgba(255,255,255,0.18)',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 999, background: '#fff', color: C.navy }}>VI</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 9px', color: 'rgba(255,255,255,0.85)' }}>EN</span>
          </div>
        </div>

        <div style={{
          marginTop: 14, display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff', borderRadius: 12, padding: '10px 12px',
        }}>
          {I.search(16, C.ink2)}
          <span style={{ color: C.ink3, fontSize: 13.5 }}>Tìm sản phẩm, dịch vụ...</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '14px 16px 6px', overflow: 'hidden' }}>
        {cats.map((c, i) => (
          <div key={i} style={{
            flex: 'none', padding: '8px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 600,
            background: i === 0 ? C.navy : '#fff',
            color: i === 0 ? '#fff' : C.ink,
            border: i === 0 ? 'none' : `1px solid ${C.line}`,
          }}>{c}</div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 16px 10px' }}>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 17 }}>Phổ biến hôm nay</div>
        <div style={{ fontSize: 12, color: C.teal, fontWeight: 600 }}>Xem tất cả</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px 130px' }}>
        {items.map((p, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 16, padding: 8,
            boxShadow: '0 1px 2px rgba(1,64,109,0.04), 0 4px 16px rgba(1,64,109,0.05)',
          }}>
            <div style={{ position: 'relative' }}>
              <ItemPh label={p.ph} h={120} hue={p.hue} badge={p.promo && (
                <div style={{
                  position: 'absolute', top: 6, left: 6, display: 'flex', alignItems: 'center', gap: 4,
                  background: C.orange, color: '#fff',
                  fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 999,
                  boxShadow: '0 2px 6px rgba(255,122,15,0.4)',
                }}>
                  {I.tag(10)} Khuyến mãi
                </div>
              )} />
            </div>
            <div style={{ padding: '8px 4px 4px' }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.25, color: C.ink, minHeight: 34 }}>{p.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 14.5, color: C.orange }}>{p.price}</div>
                <button style={{
                  border: 'none', cursor: 'pointer',
                  width: 28, height: 28, borderRadius: 999, background: C.navy,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(1,64,109,0.25)',
                }}>{I.plus(14, '#fff')}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', left: 12, right: 12, bottom: 44 }}>
        <div style={{
          background: C.navy, color: '#fff', borderRadius: 16,
          padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 10px 30px rgba(1,64,109,0.35)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              position: 'relative', width: 36, height: 36, borderRadius: 10,
              background: 'rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {I.cart(18)}
              <div style={{
                position: 'absolute', top: -4, right: -4,
                minWidth: 18, height: 18, borderRadius: 999, background: C.orange,
                color: '#fff', fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
              }}>2</div>
            </div>
            <div>
              <div style={{ fontSize: 11, opacity: 0.7, lineHeight: 1 }}>Giỏ hàng · 2 sản phẩm</div>
              <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 16, marginTop: 2 }}>90.000đ</div>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: C.orange, padding: '10px 14px', borderRadius: 12, fontWeight: 700, fontSize: 13.5,
          }}>
            Xem giỏ {I.arrow(14)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// S02 — CONFIRM ORDER (white-label, COD only)
// ═══════════════════════════════════════════════════════════════
function S02_Confirm() {
  const items = [
    { name: '[Sản phẩm A]', qty: 1, price: '45.000đ', ph: 'A', hue: 0 },
    { name: '[Sản phẩm C]', qty: 1, price: '35.000đ', ph: 'C', hue: 1 },
    { name: '[Sản phẩm F]', qty: 1, price: '10.000đ', ph: 'F', hue: 2 },
  ];
  return (
    <div style={{ background: C.bg, minHeight: '100%', fontFamily: BODY, color: C.ink }}>
      <div style={{ height: 54 }} />

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 14px 12px', background: C.bg,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 999, background: '#fff',
          border: `1px solid ${C.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{I.back()}</div>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 16 }}>Xác nhận đơn hàng</div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={{
          background: '#fff', borderRadius: 16, padding: 4,
          boxShadow: '0 1px 2px rgba(1,64,109,0.04), 0 4px 16px rgba(1,64,109,0.05)',
        }}>
          {items.map((it, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px', borderTop: i ? `1px solid ${C.line}` : 'none',
            }}>
              <div style={{ width: 56, height: 56, flex: 'none' }}>
                <ItemPh label={it.ph} h={56} hue={it.hue} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{it.name}</div>
                <div style={{ fontSize: 11.5, color: C.ink2, marginTop: 2 }}>Phương án tiêu chuẩn</div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: C.bg, borderRadius: 999, padding: '4px 6px',
                border: `1px solid ${C.line}`,
              }}>
                <div style={{ width: 22, height: 22, borderRadius: 999, background: '#fff', border: `1px solid ${C.line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: C.ink2 }}>−</div>
                <div style={{ fontSize: 13, fontWeight: 700, minWidth: 12, textAlign: 'center' }}>{it.qty}</div>
                <div style={{ width: 22, height: 22, borderRadius: 999, background: C.navy,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.plus(12, '#fff')}</div>
              </div>
              <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 13.5, color: C.ink, minWidth: 60, textAlign: 'right' }}>{it.price}</div>
            </div>
          ))}
        </div>

        {/* Mã vị trí (white-label: Bàn / Phòng / Mã KH) */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink2 }}>Mã vị trí</div>
            <div style={{ fontSize: 10, color: C.ink3, fontStyle: 'italic' }}>Bàn / Phòng / Mã KH</div>
          </div>
          <div style={{
            background: '#fff', borderRadius: 12, padding: '12px 14px',
            border: `1px solid ${C.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, background: '#E0F6F7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{I.pin(14, C.teal)}</div>
              <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 16, color: C.navy }}>[Mã vị trí]</div>
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: C.teal,
              background: '#E0F6F7', padding: '4px 8px', borderRadius: 999 }}>Tự động · QR</div>
          </div>
        </div>

        {/* Note */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink2 }}>Ghi chú thêm</div>
            <div style={{ fontSize: 11, color: C.ink3 }}>Tuỳ chọn</div>
          </div>
          <div style={{
            background: '#fff', borderRadius: 12, padding: '12px 14px',
            border: `1px solid ${C.line}`, minHeight: 64,
            fontSize: 13, color: C.ink3,
          }}>
            Ghi chú thêm cho đơn hàng...
          </div>
        </div>

        {/* Payment: COD */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink2, marginBottom: 8 }}>Phương thức thanh toán</div>
          <div style={{
            background: '#fff', borderRadius: 12, padding: '14px',
            border: `1.5px solid ${C.teal}`,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9, background: '#E0F6F7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="6" width="18" height="13" rx="2" stroke={C.teal} strokeWidth="1.8"/>
                <circle cx="12" cy="12.5" r="2.5" stroke={C.teal} strokeWidth="1.8"/>
                <path d="M3 10h18" stroke={C.teal} strokeWidth="1.8"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 14, color: C.ink }}>Tiền mặt khi nhận hàng (COD)</div>
              <div style={{ fontSize: 11.5, color: C.ink2, marginTop: 2 }}>Thanh toán trực tiếp khi nhận</div>
            </div>
            <div style={{
              width: 22, height: 22, borderRadius: 999, background: C.teal,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{I.check(13)}</div>
          </div>
        </div>

        {/* Summary */}
        <div style={{
          marginTop: 16, background: '#fff', borderRadius: 16, padding: '14px 16px',
          border: `1px solid ${C.line}`,
        }}>
          {[
            ['Tạm tính (3 sản phẩm)', '90.000đ'],
            ['Phí phục vụ', '0đ'],
            ['Khuyến mãi', '−5.000đ', C.teal],
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, color: r[2] || C.ink2 }}>
              <span>{r[0]}</span><span style={{ fontWeight: 600 }}>{r[1]}</span>
            </div>
          ))}
          <div style={{ height: 1, background: C.line, margin: '10px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 13, color: C.ink2 }}>Tổng tiền</span>
            <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 22, color: C.orange }}>85.000đ</span>
          </div>
        </div>

        <div style={{ height: 130 }} />
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: '#fff', borderTop: `1px solid ${C.line}`,
        padding: '12px 16px 30px',
      }}>
        <button style={{
          border: 'none', width: '100%', background: C.navy, color: '#fff',
          padding: '15px', borderRadius: 14, fontFamily: HEAD, fontWeight: 700, fontSize: 15.5,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 10px 24px rgba(1,64,109,0.28)', cursor: 'pointer',
        }}>
          Đặt hàng ngay · 85.000đ {I.arrow(15)}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// S03 — STAFF · ORDERS (white-label)
// ═══════════════════════════════════════════════════════════════
function S03_Staff() {
  const tabs = [
    { l: 'Mới', n: 3, k: 'new' },
    { l: 'Đang xử lý', n: 2, k: 'cooking' },
    { l: 'Hoàn thành', n: 8, k: 'done' },
  ];
  const orders = [
    {
      loc: '[V-12]', time: '2 phút', status: 'new',
      items: [
        ['[Sản phẩm B]', 2, '110.000đ'],
        ['[Sản phẩm C]', 1, '35.000đ'],
      ],
      total: '145.000đ',
      note: 'Khách yêu cầu giao gấp',
    },
    {
      loc: '[V-05]', time: '5 phút', status: 'new',
      items: [
        ['[Sản phẩm A]', 1, '45.000đ'],
        ['[Sản phẩm E]', 1, '25.000đ'],
        ['[Sản phẩm F]', 1, '30.000đ'],
      ],
      total: '100.000đ',
    },
    {
      loc: '[KH-088]', sub: 'A. Hùng', time: '8 phút', status: 'cooking',
      items: [
        ['[Sản phẩm D]', 2, '158.000đ'],
      ],
      total: '158.000đ',
    },
  ];

  return (
    <div style={{ background: C.bg, minHeight: '100%', fontFamily: BODY, color: C.ink }}>
      <div style={{ height: 54 }} />

      <div style={{
        padding: '6px 16px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 11.5, color: C.ink2, fontWeight: 600 }}>Hôm nay · Thứ Bảy</div>
          <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 20, color: C.ink, marginTop: 2,
            display: 'flex', alignItems: 'center', gap: 8 }}>
            Đơn hôm nay
            <span style={{
              fontSize: 11, fontWeight: 700, color: '#fff',
              background: C.orange, padding: '3px 8px', borderRadius: 999,
            }}>3 mới</span>
          </div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: 999, background: '#fff',
          border: `1px solid ${C.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          {I.bell(18, C.ink)}
          <div style={{
            position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: 999,
            background: C.orange, border: '2px solid #fff',
          }} />
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', gap: 8 }}>
        {tabs.map((t, i) => {
          const active = i === 0;
          return (
            <div key={i} style={{
              flex: 1, padding: '10px 8px', borderRadius: 12,
              background: active ? C.navy : '#fff',
              border: active ? 'none' : `1px solid ${C.line}`,
              color: active ? '#fff' : C.ink,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, opacity: active ? 0.75 : 1, color: active ? '#fff' : C.ink2 }}>{t.l}</div>
              <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 18 }}>{t.n}</div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '14px 16px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map((o, i) => {
          const isNew = o.status === 'new';
          return (
            <div key={i} style={{
              background: '#fff', borderRadius: 16, padding: 14,
              border: `1px solid ${C.line}`,
              boxShadow: '0 1px 2px rgba(1,64,109,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 11,
                  background: isNew ? '#FFEFDD' : '#E0F6F7',
                  color: isNew ? C.orange : C.teal,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: HEAD, fontWeight: 700, fontSize: 11,
                }}>
                  {I.pin(20, isNew ? C.orange : C.teal)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 14.5 }}>
                      {o.loc}
                    </div>
                    {o.sub && <div style={{ fontSize: 11.5, color: C.ink2 }}>· {o.sub}</div>}
                  </div>
                  <div style={{ fontSize: 11, color: C.ink2, marginTop: 2 }}>
                    {o.time} trước · {o.items.length} sản phẩm
                  </div>
                </div>
                <div style={{
                  fontSize: 10.5, fontWeight: 700, padding: '4px 9px', borderRadius: 999,
                  ...(isNew
                    ? { background: '#FFEFDD', color: C.orange }
                    : { background: '#E0F6F7', color: C.teal }),
                }}>
                  {isNew ? 'Mới' : 'Đang xử lý'}
                </div>
              </div>

              <div style={{ marginTop: 12, padding: '10px 12px', background: C.bg, borderRadius: 10 }}>
                {o.items.map((it, j) => (
                  <div key={j} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    fontSize: 12.5, padding: '3px 0',
                  }}>
                    <span style={{ color: C.ink }}>
                      <span style={{ fontWeight: 700, fontFamily: 'ui-monospace, Menlo, monospace', color: C.navy, marginRight: 6 }}>×{it[1]}</span>
                      {it[0]}
                    </span>
                    <span style={{ color: C.ink2, fontWeight: 600 }}>{it[2]}</span>
                  </div>
                ))}
              </div>

              {o.note && (
                <div style={{
                  marginTop: 8, fontSize: 11.5, color: C.orange, fontWeight: 600,
                  background: '#FFEFDD', padding: '6px 10px', borderRadius: 8,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontSize: 13 }}>⚠</span> Ghi chú: {o.note}
                </div>
              )}

              <div style={{
                marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                gap: 8,
              }}>
                <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 15, color: C.orange }}>{o.total}</div>
                {isNew ? (
                  <button style={{
                    border: 'none', background: C.teal, color: '#fff',
                    padding: '10px 16px', borderRadius: 10,
                    fontFamily: HEAD, fontWeight: 700, fontSize: 13,
                    display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(1,180,186,0.3)',
                  }}>{I.check(13)} Xác nhận</button>
                ) : (
                  <button style={{
                    border: 'none', background: C.navy, color: '#fff',
                    padding: '10px 16px', borderRadius: 10,
                    fontFamily: HEAD, fontWeight: 700, fontSize: 13,
                    display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(1,64,109,0.25)',
                  }}>{I.check(13)} Hoàn thành</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom nav: Đơn · Danh mục · Tài khoản */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: '#fff', borderTop: `1px solid ${C.line}`,
        padding: '8px 16px 28px',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      }}>
        {[
          { l: 'Đơn', i: I.receipt, active: true, badge: 3 },
          { l: 'Danh mục', i: I.catalog },
          { l: 'Tài khoản', i: I.user },
        ].map((t, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: t.active ? C.navy : C.ink3,
          }}>
            <div style={{ position: 'relative' }}>
              {t.i(22, t.active ? C.navy : C.ink3)}
              {t.badge && (
                <div style={{
                  position: 'absolute', top: -4, right: -8,
                  minWidth: 16, height: 16, borderRadius: 999, background: C.orange,
                  color: '#fff', fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                  border: '2px solid #fff',
                }}>{t.badge}</div>
              )}
            </div>
            <div style={{ fontSize: 10, fontWeight: t.active ? 700 : 600 }}>{t.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// S04 — ADMIN · DASHBOARD (white-label, consistent metrics)
// ═══════════════════════════════════════════════════════════════
function S04_Dashboard() {
  const stats = [
    { label: 'Doanh thu', value: '4.85', unit: 'M đ', sub: '+12% vs hôm qua', tone: 'navy' },
    { label: 'Số đơn', value: '47', unit: '', sub: '+8 đơn', tone: 'teal' },
    { label: 'Bán chạy', value: '24', unit: 'lượt', sub: '[Sản phẩm A]', tone: 'orange' },
  ];
  const days = ['T2','T3','T4','T5','T6','T7','CN'];
  const bars = [
    { v: 62, k: '3.1M' },
    { v: 78, k: '3.9M' },
    { v: 55, k: '2.7M' },
    { v: 84, k: '4.2M' },
    { v: 72, k: '3.6M' },
    { v: 96, k: '4.85M', today: true },
    { v: 0, future: true },
  ];
  const pending = [
    { name: '[Sản phẩm mới · #G]', sub: 'Staff Minh · 55.000đ', ph: 'NEW · G', hue: 0 },
    { name: '[Sản phẩm mới · #H]', sub: 'Staff Lan · 28.000đ', ph: 'NEW · H', hue: 1 },
  ];
  const alerts = [
    { type: 'stock', label: 'Tạm hết hàng', body: '[Sản phẩm B] · còn 2 lượt', tone: 'red' },
    { type: 'flash', label: 'Khuyến mãi sắp hết', body: '[Sản phẩm D] · còn 5 lượt · 14:30', tone: 'orange' },
  ];

  return (
    <div style={{ background: C.bg, minHeight: '100%', fontFamily: BODY, color: C.ink }}>
      <div style={{ height: 54 }} />

      <div style={{
        padding: '6px 16px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 11.5, color: C.ink2, fontWeight: 600 }}>Tổng quan</div>
          <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 18, color: C.ink, marginTop: 2 }}>
            Thứ Bảy · 9/5/2026
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 999,
            background: '#fff', border: `1px solid ${C.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          }}>
            {I.bell(18, C.ink)}
            <div style={{ position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: 999, background: C.orange, border: '2px solid #fff' }} />
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: 999, background: C.navy,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontFamily: HEAD, fontWeight: 700, fontSize: 13,
          }}>AD</div>
        </div>
      </div>

      <div style={{ padding: '0 16px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 10 }}>
          {stats.map((s, i) => {
            const accent = s.tone === 'navy' ? C.navy : s.tone === 'teal' ? C.teal : C.orange;
            const isPrimary = i === 0;
            return (
              <div key={i} style={{
                background: isPrimary ? C.navy : '#fff',
                color: isPrimary ? '#fff' : C.ink,
                borderRadius: 14, padding: '12px',
                border: isPrimary ? 'none' : `1px solid ${C.line}`,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, opacity: isPrimary ? 0.7 : 1, color: isPrimary ? '#fff' : C.ink2 }}>{s.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 6 }}>
                  <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: isPrimary ? 22 : 20, lineHeight: 1, color: isPrimary ? '#fff' : C.ink }}>{s.value}</div>
                  {s.unit && <span style={{ fontSize: 11, opacity: 0.7 }}>{s.unit}</span>}
                </div>
                <div style={{ fontSize: 10, marginTop: 6, color: isPrimary ? 'rgba(255,255,255,0.7)' : accent, fontWeight: 600,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.sub}
                </div>
                {!isPrimary && <div style={{
                  position: 'absolute', top: 12, right: 12, width: 6, height: 6, borderRadius: 999, background: accent,
                }} />}
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: 14, background: '#fff', borderRadius: 16, padding: '14px 14px 10px',
          border: `1px solid ${C.line}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 14 }}>Doanh thu 7 ngày</div>
              <div style={{ fontSize: 11, color: C.ink2, marginTop: 2 }}>6 ngày · <strong style={{ color: C.ink }}>22.40M đ</strong></div>
            </div>
            <div style={{
              fontSize: 11, fontWeight: 600, color: C.teal,
              background: '#E0F6F7', padding: '4px 8px', borderRadius: 999,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              ▲ 18%
            </div>
          </div>

          <div style={{ height: 110, display: 'flex', alignItems: 'flex-end', gap: 8, marginTop: 14, padding: '0 2px' }}>
            {bars.map((b, i) => {
              const c = b.today ? C.orange : b.future ? C.line : C.teal;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: '100%', height: b.future ? '8%' : `${b.v}%`, borderRadius: 6,
                    background: c, opacity: b.today ? 1 : (b.future ? 1 : 0.85),
                    position: 'relative',
                  }}>
                    {b.today && (
                      <div style={{
                        position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
                        background: C.ink, color: '#fff', fontSize: 9.5, fontWeight: 700,
                        padding: '3px 6px', borderRadius: 5, whiteSpace: 'nowrap',
                      }}>{b.k}</div>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: b.today ? C.orange : b.future ? C.ink3 : C.ink2, fontWeight: b.today ? 700 : 600 }}>{days[i]}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 15 }}>
            Sản phẩm chờ duyệt <span style={{ color: C.orange }}>· 2</span>
          </div>
          <div style={{ fontSize: 12, color: C.teal, fontWeight: 600 }}>Xem tất cả</div>
        </div>

        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pending.map((p, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 14, border: `1px solid ${C.line}`,
              padding: 12, display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 52, height: 52, flex: 'none' }}>
                <ItemPh label={p.ph} h={52} hue={p.hue} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, fontFamily: HEAD }}>{p.name}</div>
                <div style={{ fontSize: 11, color: C.ink2, marginTop: 4 }}>{p.sub}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button style={{
                  border: 'none', background: C.teal, color: '#fff',
                  padding: '8px 14px', borderRadius: 10, fontFamily: HEAD, fontWeight: 700, fontSize: 12,
                  display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer',
                }}>{I.check(12)} Duyệt</button>
                <button style={{
                  border: `1px solid ${C.line}`, background: '#fff', color: C.ink2,
                  padding: '6px 14px', borderRadius: 10, fontWeight: 600, fontSize: 11,
                }}>Xem</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 15 }}>
            Cảnh báo <span style={{ color: C.orange }}>· 2</span>
          </div>
        </div>

        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {alerts.map((a, i) => {
            const isRed = a.tone === 'red';
            return (
              <div key={i} style={{
                background: isRed ? C.redBg : '#FFEFDD',
                borderRadius: 12, padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
                border: `1px solid ${isRed ? '#F5C8C8' : '#FFD8B5'}`,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 999,
                  background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flex: 'none',
                }}>
                  {I.warn(15, isRed ? C.red : C.orange)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isRed ? C.red : C.orange, fontFamily: HEAD }}>{a.label}</div>
                  <div style={{ fontSize: 12, color: C.ink, marginTop: 1 }}>{a.body}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: '#fff', borderTop: `1px solid ${C.line}`,
        padding: '8px 16px 28px',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      }}>
        {[
          { l: 'Dashboard', i: I.home, active: true },
          { l: 'Danh mục', i: I.catalog },
          { l: 'Báo cáo', i: I.chart },
          { l: 'Cài đặt', i: I.cog },
        ].map((t, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: t.active ? C.navy : C.ink3,
          }}>
            {t.i(22, t.active ? C.navy : C.ink3)}
            <div style={{ fontSize: 10, fontWeight: t.active ? 700 : 600 }}>{t.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// S05 — ORDER STATUS (white-label, neutral language)
// ═══════════════════════════════════════════════════════════════
function S05_Status() {
  const items = [
    ['[Sản phẩm A]', 1, '45.000đ'],
    ['[Sản phẩm C]', 1, '35.000đ'],
    ['[Sản phẩm F]', 1, '10.000đ'],
  ];
  const steps = [
    { l: 'Đã nhận', sub: '14:02', done: true },
    { l: 'Đang xử lý', sub: 'đang chuẩn bị đơn', current: true },
    { l: 'Hoàn thành', sub: 'sẵn sàng giao', done: false },
  ];

  return (
    <div style={{ background: C.bg, minHeight: '100%', fontFamily: BODY, color: C.ink }}>
      <div style={{ height: 54 }} />

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 14px 12px',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 999, background: '#fff',
          border: `1px solid ${C.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{I.back()}</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 15 }}>Đơn #2042</div>
          <div style={{ fontSize: 10.5, color: C.ink2, marginTop: 1 }}>[Tên Cửa Hàng] · [Mã vị trí]</div>
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={{
          background: C.navy, color: '#fff',
          borderRadius: 18, padding: '20px 18px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(1,180,186,0.15)' }} />
          <div style={{ position: 'absolute', bottom: -30, right: 30, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,122,15,0.1)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(1,180,186,0.25)', color: '#fff',
              fontSize: 10.5, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
              border: '1px solid rgba(1,180,186,0.5)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: C.teal,
                boxShadow: '0 0 0 4px rgba(1,180,186,0.35)' }} />
              ĐANG XỬ LÝ
            </div>
            <div style={{ marginTop: 12, fontFamily: HEAD, fontWeight: 700, fontSize: 22, lineHeight: 1.2 }}>
              Đơn của bạn đang được chuẩn bị
            </div>
            <div style={{ marginTop: 4, fontSize: 12.5, opacity: 0.75 }}>
              Hoàn thành trong khoảng <strong style={{ color: '#fff' }}>~10 phút</strong>
            </div>

            <div style={{ marginTop: 22 }}>
              <div style={{
                position: 'relative', height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 999,
              }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, height: '100%',
                  width: '50%', background: C.teal, borderRadius: 999,
                  boxShadow: '0 0 12px rgba(1,180,186,0.6)',
                }} />
                {[0, 50, 100].map((p, i) => {
                  const done = i === 0;
                  const cur = i === 1;
                  return (
                    <div key={i} style={{
                      position: 'absolute', left: `${p}%`, top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: cur ? 16 : 12, height: cur ? 16 : 12, borderRadius: 999,
                      background: done || cur ? C.teal : 'rgba(255,255,255,0.25)',
                      border: cur ? '3px solid #fff' : 'none',
                      boxShadow: cur ? '0 0 0 4px rgba(1,180,186,0.3)' : 'none',
                    }} />
                  );
                })}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 14, gap: 4 }}>
                {steps.map((st, i) => (
                  <div key={i} style={{
                    textAlign: i === 0 ? 'left' : i === 1 ? 'center' : 'right',
                  }}>
                    <div style={{
                      fontSize: 11, fontWeight: 700,
                      color: st.current ? C.teal : st.done ? '#fff' : 'rgba(255,255,255,0.5)',
                      fontFamily: HEAD,
                    }}>{st.l}</div>
                    <div style={{ fontSize: 9.5, marginTop: 2, color: 'rgba(255,255,255,0.6)' }}>{st.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 14 }}>Sản phẩm trong đơn</div>
          <div style={{ fontSize: 11, color: C.ink3 }}>3 sản phẩm · 90.000đ</div>
        </div>
        <div style={{
          marginTop: 8, background: '#fff', borderRadius: 14,
          border: `1px solid ${C.line}`, padding: '4px 14px',
        }}>
          {items.map((it, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '11px 0', borderTop: i ? `1px solid ${C.line}` : 'none',
              fontSize: 13,
            }}>
              <span>
                <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', color: C.navy, fontWeight: 700, marginRight: 8 }}>×{it[1]}</span>
                {it[0]}
              </span>
              <span style={{ color: C.ink2, fontWeight: 600 }}>{it[2]}</span>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 12, background: '#E0F6F7', borderRadius: 12, padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: C.navy, fontWeight: 600 }}>Thanh toán khi nhận</div>
            <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 16, color: C.navy, marginTop: 2 }}>85.000đ · COD</div>
          </div>
          <div style={{
            fontSize: 10.5, fontWeight: 700, color: C.teal,
            background: '#fff', padding: '5px 10px', borderRadius: 999,
          }}>Tại điểm nhận</div>
        </div>

        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button style={{
            border: `1.5px solid ${C.navy}`, background: '#fff', color: C.navy,
            padding: '13px', borderRadius: 12,
            fontFamily: HEAD, fontWeight: 700, fontSize: 13,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer',
          }}>{I.plus(13, C.navy)} Đặt thêm</button>
          <button style={{
            border: `1.5px solid ${C.teal}`, background: '#fff', color: C.teal,
            padding: '13px', borderRadius: 12,
            fontFamily: HEAD, fontWeight: 700, fontSize: 13,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer',
          }}>{I.msg(13, C.teal)} Liên hệ NV</button>
        </div>

        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}

Object.assign(window, {
  S01_Catalog, S02_Confirm, S03_Staff, S04_Dashboard, S05_Status,
  ZmenuColors: C,
});
