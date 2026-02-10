import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  // Title block (matches page: 36px → ~22 in PDF, 20px → 12)
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#101828',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'medium',
    color: '#667085',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '23%',
    padding: 16,
    marginBottom: 12,
    marginRight: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  statCardFull: {
    width: '100%',
    padding: 18,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statCardIconCircle: {
    width: 16,
    height: 16,
    borderRadius: 10,
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCardTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#475467',
  },
  statCardValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  statCardValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#101828',
  },
  statCardUnit: {
    fontSize: 11,
    fontWeight: 'normal',
    color: '#101828',
    marginLeft: 4,
  },
  statCardMeta: {
    fontSize: 8,
    color: '#475467',
    marginTop: 4,
  },
  statCardMeta2: {
    fontSize: 10,
    color: '#475467',
  },
  // Space Utilization
  spaceUtilHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  spaceUtilIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffd6d6',
    marginRight: 8,
  },
  spaceUtilTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#101828',
  },
  spaceUtilPctRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 6,
  },
  spaceUtilPct: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#d92d20',
    marginRight: 4,
  },
  spaceUtilLabel: {
    fontSize: 10,
    color: '#475467',
  },
  spaceUtilBar: {
    height: 10,
    flexDirection: 'row',
    backgroundColor: '#eef2f6',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 6,
  },
  spaceUtilBarBlue: { backgroundColor: '#2970ff' },
  spaceUtilBarRed: { backgroundColor: '#f04438' },
  spaceUtilLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    color: '#475467',
  },
  breakdownCard: {
    marginTop: 8,
    marginBottom: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eaecf0',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  breakdownCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  breakdownCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#101828',
    marginRight: 10,
  },
  breakdownCardTag: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e9d7fe',
    backgroundColor: '#f9f5ff',
  },
  breakdownCardTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6941c6',
  },
  breakdownCardDownloadBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    backgroundColor: '#ffffff',
  },
  breakdownCardDownloadText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#344054',
  },
  breakdownCardDivider: {
    height: 1,
    width: '100%',
    backgroundColor: '#eaecf0',
  },
  breakdownTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaecf0',
    backgroundColor: '#ffffff',
  },
  colRoomType: { flex: 26, fontSize: 10, fontWeight: 'bold', color: '#475467' },
  colSpaceType: { flex: 20, fontSize: 10, fontWeight: 'bold', color: '#475467' },
  colCount: { flex: 14, fontSize: 10, fontWeight: 'bold', color: '#475467' },
  colAreaPerUnit: { flex: 16, fontSize: 10, fontWeight: 'bold', color: '#475467' },
  colTotalArea: { flex: 16, fontSize: 10, fontWeight: 'bold', color: '#475467' },
  groupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaecf0',
  },
  groupHeaderCellRoom: {
    flex: 26,
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupIconCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
    borderWidth: 0.5,
    borderColor: '#ffffff',
  },
  groupHeaderTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#101828',
  },
  groupHeaderCellSpacer: { flex: 20 },
  groupHeaderCellCount: { flex: 14 },
  groupHeaderCellArea: { flex: 16 },
  groupHeaderCellTotal: { flex: 16 },
  groupHeaderSubtotal: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475467',
  },
  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaecf0',
    backgroundColor: '#ffffff',
  },
  tableDataRowAlt: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaecf0',
    backgroundColor: '#fafbfc',
  },
  dataColRoomType: { flex: 26, fontSize: 9, color: '#101828' },
  dataColSpaceType: { flex: 20, fontSize: 9, color: '#475467' },
  dataColCount: { flex: 14, fontSize: 9, color: '#101828' },
  dataColAreaPerUnit: { flex: 16, fontSize: 9, color: '#475467' },
  dataColTotalArea: { flex: 16, fontSize: 9, color: '#475467' },
  grandTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f7f7f7',
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#101828',
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#101828',
    marginRight: 34,
  },
  // Efficiency Opportunities card (right column style)
  efficiencyCard: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#eaecf0',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fafbfc',
  },
  efficiencyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eaecf0',
    backgroundColor: '#fafbfc',
  },
  efficiencyCardIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#f6d67a',
    backgroundColor: '#fff4d6',
    marginRight: 10,
  },
  efficiencyCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#101828',
  },
  opportunityItem: {
    marginHorizontal: 14,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 3,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eaecf0',
    borderRadius: 6,
    marginBottom: 14,
  },
  opportunityItemFirst: {
    marginTop: 14,
  },
  opportunityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  opportunityItemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#101828',
    flex: 1,
  },
  opportunitySaveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e4e9',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  opportunitySaveText: {
    fontSize: 9,
    color: '#12b76a',
    fontWeight: 'bold',
  },
  opportunityBody: {
    fontSize: 9,
    color: '#475467',
    marginBottom: 10,
  },
  applySuggestionBtn: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
    paddingVertical: 10,
  },
  applyAllBtn: {
    width: '100%',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: '#d0d5dd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  applyAllBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#101828',
  },
  // BOQ banner
  boqBanner: {
    marginTop: 24,
    backgroundColor: '#071a2f',
    padding: 20,
    borderRadius: 8,
  },
  boqTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  boqSubtitle: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  boqButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  boqBtnOutline: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  boqBtnOutlineText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  boqBtnPrimary: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#3c4fb7',
  },
  boqBtnPrimaryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

function formatNum(n) {
  return n != null && Number.isFinite(n) ? Number(n).toLocaleString() : '0';
}

function formatSqft(n) {
  const val = n != null && Number.isFinite(n) ? Math.round(Number(n)) : 0;
  return `${val.toLocaleString()} sqft.`;
}

function toGroupLabel(areaGroup) {
  return areaGroup === 'Productivity Area' ? 'Production Area' : (areaGroup ?? '');
}

function getGroupStyle(areaGroup) {
  if (areaGroup === 'Productivity Area') {
    return { rowBg: '#ebfdf5', iconBg: '#10a684' };
  }
  if (areaGroup === 'Utility and Breakout') {
    return { rowBg: '#faf6fe', iconBg: '#7f56d9' };
  }
  return { rowBg: '#fffbeb', iconBg: '#ec620b' };
}

/**
 * PDF document matching the Detailed Space Analysis page layout.
 * Includes: title, stats (with optional Space Utilization), breakdown table,
 * Efficiency Opportunities card, and BOQ banner.
 */
export default function SpaceAnalysisPdfDocument({
  title = 'Your Detailed Space Analysis',
  subtitle = 'Optimise your office space with intelligent recommendations',
  totalSpaceNeeded = 0,
  seatingCapacity = 0,
  spacePerPerson = 0,
  productionArea = 0,
  utilityArea = 0,
  hasAvailableCarpetArea = false,
  availableCarpetArea = 0,
  breakdownRows = [],
  efficiencyOpportunities = [],
}) {
  const needed = Number(totalSpaceNeeded) || 0;
  const available = Number(availableCarpetArea) || 0;
  const isOverCapacity = needed > available;
  const pct = available > 0 ? Math.round((needed / available) * 100) : 0;
  const barBase = Math.max(needed, available, 1);
  const bluePct = Math.min(available / barBase, 1) * 100;
  const redPct = Math.max((needed - available) / barBase, 0) * 100;

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* Title block */}
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Top stats - same order as page */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#E3EBFD' }]}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statCardIconCircle, { backgroundColor: '#3c4fb7' }]} />
              <Text style={styles.statCardTitle}>Total Space Needed</Text>
            </View>
            <View style={styles.statCardValueRow}>
              <Text style={styles.statCardValue}>{formatNum(totalSpaceNeeded)}</Text>
              <Text style={styles.statCardUnit}>sqft.</Text>
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#FEEFDF' }]}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statCardIconCircle, { backgroundColor: '#ec670b' }]} />
              <Text style={styles.statCardTitle}>Seating Capacity</Text>
            </View>
            <View style={styles.statCardValueRow}>
              <Text style={styles.statCardValue}>{formatNum(seatingCapacity)}</Text>
              <Text style={styles.statCardUnit}>sqft.</Text>
            </View>
            <Text style={styles.statCardMeta}>
              {formatNum(spacePerPerson)} sqft. space per person
            </Text>
            <Text style={styles.statCardMeta2} />
          </View>

          {hasAvailableCarpetArea ? (
            <View style={styles.statCardFull}>
              <View style={styles.spaceUtilHeader}>
                <View style={styles.spaceUtilIconCircle} />
                <Text style={styles.spaceUtilTitle}>Space Utilization</Text>
              </View>
              <View style={styles.spaceUtilPctRow}>
                <Text style={styles.spaceUtilPct}>{pct}%</Text>
                <Text style={styles.spaceUtilLabel}>
                  {isOverCapacity ? 'sqft over Capacity' : 'sqft under Capacity'}
                </Text>
              </View>
              <View style={styles.spaceUtilBar}>
                <View style={[styles.spaceUtilBarBlue, { width: `${bluePct}%` }]} />
                {redPct > 0 ? (
                  <View style={[styles.spaceUtilBarRed, { width: `${redPct}%` }]} />
                ) : null}
              </View>
              <View style={styles.spaceUtilLegend}>
                <Text>0 sq ft</Text>
                <Text>{formatNum(available)} sqft</Text>
                <Text>{formatNum(needed)} sqft</Text>
              </View>
            </View>
          ) : (
            <>
              <View style={[styles.statCard, { backgroundColor: '#E4F7F3' }]}>
                <View style={styles.statCardHeader}>
                  <View style={[styles.statCardIconCircle, { backgroundColor: '#10a684' }]} />
                  <Text style={styles.statCardTitle}>Production Area</Text>
                </View>
                <View style={styles.statCardValueRow}>
                  <Text style={styles.statCardValue}>{formatNum(productionArea)}</Text>
                  <Text style={styles.statCardUnit}>sqft.</Text>
                </View>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#F7F1FF' }]}>
                <View style={styles.statCardHeader}>
                  <View style={[styles.statCardIconCircle, { backgroundColor: '#7f56d9' }]} />
                  <Text style={styles.statCardTitle}>Utility and Breakout</Text>
                </View>
                <View style={styles.statCardValueRow}>
                  <Text style={styles.statCardValue}>{formatNum(utilityArea)}</Text>
                  <Text style={styles.statCardUnit}>sqft.</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Breakdown table  */}
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownCardHeader}>
            <View style={styles.breakdownCardTitleRow}>
              <Text style={styles.breakdownCardTitle}>Detailed Space Breakdown</Text>
              <View style={styles.breakdownCardTag}>
                <Text style={styles.breakdownCardTagText}>
                  {efficiencyOpportunities?.length ?? 0} efficiency opportunities
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.breakdownCardDivider} />
          <View style={styles.breakdownTableHeader}>
            <Text style={styles.colRoomType}>Room Type</Text>
            <Text style={styles.colSpaceType}>Space Type</Text>
            <Text style={styles.colCount}>Count</Text>
            <Text style={styles.colAreaPerUnit}>Area Per Unit</Text>
            <Text style={styles.colTotalArea}>Total Area</Text>
          </View>
          {breakdownRows.map((group) => {
            const groupStyle = getGroupStyle(group.areaGroup);
            return (
              <View key={group.areaGroup}>
                <View style={[styles.groupHeaderRow, { backgroundColor: groupStyle.rowBg }]}>
                  <View style={styles.groupHeaderCellRoom}>
                    <View
                      style={[styles.groupIconCircle, { backgroundColor: groupStyle.iconBg }]}
                    />
                    <Text style={styles.groupHeaderTitle}>{toGroupLabel(group.areaGroup)}</Text>
                  </View>
                  <View style={styles.groupHeaderCellSpacer} />
                  <View style={styles.groupHeaderCellCount} />
                  <View style={styles.groupHeaderCellArea} />
                  <View style={styles.groupHeaderCellTotal}>
                    <Text style={styles.groupHeaderSubtotal}>{formatSqft(group.subtotal)}</Text>
                  </View>
                </View>
                {(group.rows || []).map((row, idx) => (
                  <View
                    key={idx}
                    style={idx % 2 === 0 ? styles.tableDataRow : styles.tableDataRowAlt}
                  >
                    <Text style={styles.dataColRoomType}>{row.name ?? ''}</Text>
                    <Text style={styles.dataColSpaceType}>{row.layout ?? ''}</Text>
                    <Text style={styles.dataColCount}>{formatNum(row.count)}</Text>
                    <Text style={styles.dataColAreaPerUnit}>{formatSqft(row.areaPerUnit)}</Text>
                    <Text style={styles.dataColTotalArea}>{formatSqft(row.total)}</Text>
                  </View>
                ))}
              </View>
            );
          })}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>
              {formatSqft(breakdownRows.reduce((acc, g) => acc + (Number(g.subtotal) || 0), 0))}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
