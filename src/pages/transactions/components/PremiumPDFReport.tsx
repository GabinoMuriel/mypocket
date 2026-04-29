import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import i18n from "@/locales/i18n";

// Use the exact colors from your Tailwind configuration
const COLORS = {
  primary: "#2B5897", // Shield Blue
  income: "#31A354", // Infinity Green
  expense: "#D62728", // Infinity Red
  text: "#333333",
  border: "#E5E7EB",
  background: "#F9FAFB",
};

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    borderBottom: `2px solid ${COLORS.primary}`,
    paddingBottom: 10,
  },
  logo: { width: 40, height: 40, objectFit: "contain" },
  titleContainer: { alignItems: "flex-end" },
  title: { fontSize: 24, fontWeight: "bold", color: COLORS.primary },
  subtitle: { fontSize: 12, color: "#666666", marginTop: 4 },

  // Summary Section
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    border: `1px solid ${COLORS.border}`,
  },
  cardLabel: {
    fontSize: 10,
    color: "#666666",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  cardValue: { fontSize: 18, fontWeight: "bold" },
  incomeText: { color: COLORS.income },
  expenseText: { color: COLORS.expense },
  balanceText: { color: COLORS.primary },

  // Native Graphs Section
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 15,
    borderBottom: `1px solid ${COLORS.border}`,
    paddingBottom: 5,
  },
  graphRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  graphLabel: { width: 100, fontSize: 10, color: COLORS.text },
  barContainer: {
    flex: 1,
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
    marginRight: 10,
  },
  barFill: { height: "100%", borderRadius: 6 },
  graphValue: {
    width: 60,
    fontSize: 10,
    textAlign: "right",
    color: COLORS.text,
  },
  footer: {
    position: "absolute",
    bottom: 30, // Separación desde el borde inferior de la hoja
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: `1px solid ${COLORS.border}`,
    paddingTop: 10,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerLogo: {
    width: 18,
    height: 18,
    objectFit: "contain",
  },
  footerText: {
    fontSize: 10,
    color: "#888888",
  },
  footerTextBold: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: "bold",
  },
});

export interface ReportData {
  monthName: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categories: {
    name: string;
    amount: number;
    percentage: number;
    type: "income" | "expense";
  }[];
  logoUrl?: string;
  userEmail?: string;
  generationDate?: string;
}

interface MyDedicatedPDFProps {
  data: ReportData;
}

export const PremiumPDFReport = ({ data }: MyDedicatedPDFProps) => {
  // Safe formatting function adhering to your Spanish UI rules
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(i18n.language === "en" ? "en-US" : "es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER: Logo & Title */}
        <View style={styles.header}>
          {data.logoUrl ? (
            <Image src={data.logoUrl} style={styles.logo} />
          ) : (
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: COLORS.primary,
              }}
            >
              MyPocket
            </Text>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{i18n.t('PREMIUM_PDF_REPORT.FINANCIAL_REPORT')}</Text>
            <Text style={styles.subtitle}>{data.monthName}</Text>
          </View>
        </View>

        {/* SUMMARY CARDS: Income, Expense, Balance */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.cardLabel}>{i18n.t('PREMIUM_PDF_REPORT.TOTAL_INCOME')}</Text>
            <Text style={[styles.cardValue, styles.incomeText]}>
              {formatCurrency(data.totalIncome)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.cardLabel}>{i18n.t('PREMIUM_PDF_REPORT.TOTAL_EXPENSE')}</Text>
            <Text style={[styles.cardValue, styles.expenseText]}>
              {formatCurrency(data.totalExpense)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.cardLabel}>{i18n.t('PREMIUM_PDF_REPORT.NET_BALANCE')}</Text>
            <Text
              style={[
                styles.cardValue,
                {
                  color:
                    data.balance > 0
                      ? COLORS.income
                      : data.balance < 0
                        ? COLORS.expense
                        : COLORS.primary,
                },
              ]}
            >
              {formatCurrency(data.balance)}
            </Text>
          </View>
        </View>

        {/* NATIVE PDF GRAPH: Income  */}
        <View style={{ marginTop: 10 }}>
          <Text style={styles.sectionTitle}>
            {i18n.t('PREMIUM_PDF_REPORT.INCOME_BREAKDOWN')}
          </Text>
          {data.categories
            .filter((c) => c.type === "income")
            .map((category, index) => (
              <View key={`income-${index}`} style={styles.graphRow}>
                <Text style={styles.graphLabel}>{category.name}</Text>

                {/* Income Bar Chart */}
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${category.percentage}%`,
                        backgroundColor: COLORS.income,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.graphValue}>
                  {formatCurrency(category.amount)}
                </Text>
              </View>
            ))}
        </View>

        {/* NATIVE PDF GRAPH: Category Breakdown */}
        <View style={{ marginTop: 10 }}>
          <Text style={styles.sectionTitle}>
            {i18n.t('PREMIUM_PDF_REPORT.EXPENSE_BREAKDOWN')}
          </Text>
          {data.categories
            .filter((c) => c.type === "expense")
            .map((category, index) => (
              <View key={index} style={styles.graphRow}>
                <Text style={styles.graphLabel}>{category.name}</Text>

                {/* This acts as a horizontal bar chart */}
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${category.percentage}%`,
                        backgroundColor: COLORS.expense,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.graphValue}>
                  {formatCurrency(category.amount)}
                </Text>
              </View>
            ))}
        </View>
        <View style={styles.footer} fixed>
          {/* Lado izquierdo: Logo y Nombre */}
          <View style={styles.footerLeft}>
            {data.logoUrl && (
              <Image src={data.logoUrl} style={styles.footerLogo} />
            )}
            <Text style={styles.footerTextBold}>MyPocket</Text>
          </View>

          {/* Lado derecho: Email y Fecha de Generación */}
          <View style={{ alignItems: "flex-end", gap: 4 }}>
            {data.userEmail && (
              <Text style={styles.footerText}>{data.userEmail}</Text>
            )}
            {data.generationDate && (
              <Text style={styles.footerText}>
                {i18n.t('PREMIUM_PDF_REPORT.GENERATED_ON')} {data.generationDate}
              </Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};
