import type { BrandRecord, BrandStatus, CompanyCode } from './types'

export const STATUS_META: Record<
  BrandStatus,
  { label: string; shortLabel: string; tone: string }
> = {
  granted: {
    label: 'Cấp bằng (hiệu lực)',
    shortLabel: 'Cấp bằng',
    tone: 'bg-status-green-bg text-status-green border-status-green/35',
  },
  expired: {
    label: 'Cấp bằng + Hết hạn',
    shortLabel: 'Hết hạn',
    tone: 'bg-status-amber-bg text-status-amber border-status-amber/35',
  },
  pending: {
    label: 'Đang giải quyết',
    shortLabel: 'Đang xử lý',
    tone: 'bg-status-blue-bg text-status-blue border-status-blue/35',
  },
  rejected: {
    label: 'Từ chối / Không theo đuổi',
    shortLabel: 'Từ chối',
    tone: 'bg-status-red-bg text-status-red border-status-red/35',
  },
}

export const COMPANY_ORDER: CompanyCode[] = ['TNHH', 'SGAT', 'DTPT', 'SXTM']

export const COMPANY_LABEL: Record<CompanyCode, string> = {
  TNHH: 'CTY TNHH An Thái',
  SGAT: 'CTY CP Sài Gòn An Thái',
  DTPT: 'CTY CP ĐT & PT An Thái',
  SXTM: 'CTY CP SX TM An Thái Việt Nam',
}

type BrandSeed = [
  CompanyCode,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  BrandStatus,
  string,
]

const rows: Omit<
  BrandRecord,
  'id' | 'note' | 'logo' | 'isCustom' | 'assumption' | 'assumptionNote' | 'attachments'
>[] = ([
  ['TNHH', 'ANTHAIGROUP (chữ + hình, có yếu tố cờ Trung Quốc)', 'Text+Logo', '30', '4-2011-23306', '211656', '', '02/11/2031', '', 'granted', 'Ban Ca'],
  ['TNHH', 'Hình (biểu tượng đôi ủng)', 'Visual', '30', '4-2008-01941', '130157', '', '25/01/2028', '', 'granted', 'Ban Ca'],
  ['TNHH', 'Logo chữ "A" trong khung tròn', 'Logo', '30', '4-2000-48279', '39486', '', '24/08/2030', '', 'granted', 'Ban Ca'],
  ['TNHH', 'An Thái Café (chữ ký cách điệu)', 'Text', '30', '4-2000-48280', '39487', '', '24/8/2030', '', 'granted', 'Ban Ca'],
  ['TNHH', 'An Thái Café (có yếu tố cờ Trung Quốc)', 'Text', '30', '1106180', '1106180', '', '11/11/2031', '', 'granted', 'Ban Ca'],
  ['TNHH', 'Dance (logo vàng)', 'Logo+Text+Tagline', '30, 35, 43', '4-2018-27973', '396992', '', '17/8/2028', '', 'granted', 'Ban Ca'],
  ['TNHH', 'Hình (yếu tố cờ Trung Quốc + biểu tượng ủng)', 'Visual', '30', '11512295', '11512295', '', '27/02/2024', 'Đã hết hạn, cần rà soát gia hạn', 'expired', 'Ban Ca'],
  ['TNHH', 'An Thái Café (chữ ký)', 'Text', '35', '4-2015-06873', '270215', '', '27/03/2025', 'Đã hết hạn, cần rà soát gia hạn', 'expired', 'Ban Ca'],
  ['TNHH', 'ANTHAIGROUP (chữ + hình)', 'Text+Logo', '30', 'Đơn 1: 11499628 / Đơn 2: 40619473', '', '17/09/2012 & 27/08/2019', '', 'KHÔNG TIẾP TỤC THEO ĐUỔI', 'rejected', 'Ban Ca'],
  ['TNHH', 'TITA Coffee', 'Logo+Text+Tagline', '30, 35, 43', '4-2018-27974', '', '17/08/2018', '', 'KHÔNG TIẾP TỤC THEO ĐUỔI', 'rejected', 'Ban Ca'],
  ['TNHH', 'AN THÁI - An Thai Coffee (có yếu tố cờ Trung Quốc)', 'Logo+Text', '30', '', '', '24/12/2019', '', 'KHÔNG TIẾP TỤC THEO ĐUỔI', 'rejected', 'Ban Ca'],
  ['TNHH', '[Chưa xác định — hồ sơ thứ 4 trong nhóm "Từ chối"]', '', '', '', '', '', '', 'KHÔNG TIẾP TỤC THEO ĐUỔI (giả định)', 'rejected', 'Ban Ca'],
  ['SGAT', 'AN THÁI ViNa', 'Logo', '30, 35', '4-2019-51128', '4-0568445-000', '', '15/12/2029', '', 'granted', 'Ban Ca'],
  ['SGAT', 'AN THÁI ViNa', 'Logo', '30, 35', '4-2019-51129', '4-0577512-000', '', '15/12/2029', '', 'granted', 'Ban Ca'],
  ['SGAT', 'ORe Coffee', 'Logo', '30', '4-2022-30809', '4-0498926-000', '', '31/07/2032', '', 'granted', 'Ban Ca'],
  ['SGAT', 'Logo hoa văn trừu tượng', 'Logo', '30, 35, 43', '4-2024-08301', '4-0575264-000', '', '04/03/2034', '', 'granted', 'Ban Ca'],
  ['SGAT', 'Logo hoa (đỏ)', 'Logo', '30, 35, 43', '4-2024-24203', '', '30/05/2024', '', 'Thông báo dự định cấp văn bằng, đang nộp phí/lệ phí', 'pending', 'Cty Luật TNHH Tư vấn Quốc tế (Indochine Counsel)'],
  ['SGAT', 'Logo hoa (đỏ đậm)', 'Logo', '30, 35, 43', '4-2024-08302', '', '05/03/2024', '', 'Thông báo dự định cấp văn bằng, đang nộp phí/lệ phí', 'pending', 'Ban Ca'],
  ['SGAT', 'TITA Coffee (logo)', 'Logo', '30, 43', '4-2025-54466', '', '23/10/2025', '', 'Đang thẩm định', 'pending', 'Cty CP SHTT Bross và Cộng sự'],
  ['SGAT', 'Sài Gòn An Thái (logo)', 'Logo', '31, 32', '4-2025-56856', '', '05/11/2025', '', 'Đang thẩm định', 'pending', 'Cty Luật Thịnh Hải'],
  ['SGAT', 'Sài Gòn An Thái (logo)', 'Logo', '30, 35', '4-2025-56857', '', '05/11/2025', '', 'Đang thẩm định', 'pending', 'Cty Luật Thịnh Hải'],
  ['SGAT', 'AN THÁI Việt Nam', 'Logo+Text', '30, 35, 43', '4-2018-27971', '', '17/08/2018', '', 'Nộp hồ sơ + chờ KQ từ Cục SHTT', 'rejected', 'Ban Ca'],
  ['SGAT', 'AN THÁI Việt Nam', 'Logo+Text', '30, 35, 43', '4-2018-27972', '', '17/08/2018', '', 'Nộp hồ sơ + chờ KQ từ Cục SHTT', 'rejected', 'Ban Ca'],
  ['SGAT', 'TITA Coffee (mờ)', 'Text', '30, 35, 43', '4-2020-42296', '', '14/10/2020', '', '', 'rejected', 'Ban Ca'],
  ['SGAT', 'Logo hoa văn trừu tượng (đen trắng)', 'Visual', '30, 35', '4-2021-14889', '', '4/19/2021', '', 'Trong quá trình thẩm định nội dung', 'rejected', 'Ban Ca'],
  ['SGAT', 'Ảnh chân dung (photo mark)', 'Visual', '30, 35', '4-2023-36889', '', '18/08/2023', '', 'Trong quá trình thẩm định nội dung', 'rejected', 'Ban Ca'],
  ['DTPT', 'HiUp Coffee', 'Logo', '29, 31, 32', '4-2016-10203', '328574', '', '13/04/2026', '', 'granted', 'Ban Ca'],
  ['DTPT', 'HiUp Coffee', 'Logo', '30, 43', '4-2022-30810', '4-0498927-000', '', '31/07/2032', '', 'granted', 'Ban Ca'],
  ['DTPT', 'ANTHAI GLOBAL', 'Logo', '11, 32', '4-2022-47307', '586612', '', '09/11/2032', '', 'granted', 'Ban Ca'],
  ['DTPT', 'Instant Coffee', 'Logo', '30', '4-2021-44523', '4-0472826-000', '', '14/11/2031', '', 'granted', ''],
  ['DTPT', 'HiUp Coffee', 'Logo', '43', '4-2017-33798', '4-0338268-000', '', '17/10/2027', '', 'granted', ''],
  ['DTPT', 'HiUp Coffee', 'Logo', '30', '4-2016-08342', '314172', '', '30/03/2026', 'Sắp hết hạn, cần rà soát gia hạn', 'expired', 'Ban Ca'],
  ['DTPT', 'ANTHAI GLOBAL', 'Logo', '36, 39', '4-2025-50459', '', '11/9/2022', '', 'Đã đồng ý VBBH, đợi văn bằng bản cứng', 'pending', 'Ban Ca'],
  ['SXTM', 'AN THÁI Việt Nam', 'Text', '29', '4-2025-40533', '', '12/08/2025', '', 'Đang thẩm định', 'pending', 'Asoka Law & Partners'],
  ['SXTM', 'Logo chữ ký cách điệu "AT"', 'Logo', '30', '4-2025-38967', '', '05/08/2025', '', 'Đang thẩm định', 'pending', 'Asoka Law & Partners'],
  ['SXTM', 'AN THÁI VIETNAM (logo)', 'Logo', '29', '4-2025-33024', '', '08/07/2025', '', 'Đang thẩm định', 'pending', 'Cty Luật TNHH Bản quyền Quốc tế'],
  ['SXTM', 'Logo chữ "A" mũi tên cam', 'Logo', '29', '4-2025-33024', '', '08/07/2025', '', 'Đang thẩm định', 'pending', 'Cty Luật TNHH Bản quyền Quốc tế'],
] satisfies BrandSeed[]).map(
  ([
    company,
    mark,
    type,
    groups,
    appNo,
    certNo,
    filedDate,
    expiryDate,
    detail,
    status,
    agency,
  ]) => ({
    company,
    mark,
    type,
    groups,
    appNo,
    certNo,
    filedDate,
    expiryDate,
    detail,
    status,
    agency,
  }),
)

export const mockBrands: BrandRecord[] = rows.map((row, index) => ({
  ...row,
  id: index + 1,
  note: '',
  logo: '',
  isCustom: false,
  assumption: index === 11 || index === 29 || index === 30,
  assumptionNote:
    index === 11
      ? 'Sơ đồ gốc ghi "Từ chối (4)" nhưng chỉ thể hiện rõ 3 hồ sơ. Đây là hồ sơ placeholder cần xác nhận thêm.'
      : index === 29 || index === 30
        ? 'Đơn vị đại diện không hiển thị rõ trong nguồn, cần xác nhận trước khi dùng làm dữ liệu pháp lý chính thức.'
        : '',
  attachments: [],
}))
