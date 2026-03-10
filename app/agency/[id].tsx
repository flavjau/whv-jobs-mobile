import { View, Text, ScrollView, Pressable, Linking, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useAgency } from '../../hooks/use-agencies';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';

function InfoRow({ label, value, blur = false }: { label: string; value: string | null; blur?: boolean }) {
  if (!value) return null;
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm }}>
      <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, flex: 1 }}>{label}</Text>
      <Text
        selectable={!blur}
        style={{
          fontSize: fontSize.sm,
          color: blur ? 'transparent' : colors.text,
          fontWeight: '500',
          flex: 2,
          textAlign: 'right',
          textShadowColor: blur ? colors.textTertiary : 'transparent',
          textShadowRadius: blur ? 8 : 0,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

export default function AgencyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: agency, isLoading, error } = useAgency(id);

  // TODO: check user subscription tier
  const isPremium = false;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !agency) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.error }}>Failed to load employer</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
    >
      <Stack.Screen options={{ headerTitle: agency.name }} />

      {/* Header */}
      <View style={{ gap: spacing.xs }}>
        <Text style={{ fontSize: fontSize.xxl, fontWeight: '800', color: colors.text }}>{agency.name}</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>📍 {agency.state}{agency.city ? `, ${agency.city}` : ''}</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>🏢 {agency.category}</Text>
        </View>
        {agency.is88DaysEligible && (
          <View style={{
            backgroundColor: '#dcfce7',
            paddingHorizontal: spacing.sm,
            paddingVertical: 4,
            borderRadius: borderRadius.full,
            alignSelf: 'flex-start',
          }}>
            <Text style={{ fontSize: fontSize.sm, color: '#16a34a', fontWeight: '600' }}>✅ 88 Days Eligible</Text>
          </View>
        )}
        {agency.googleRating && (
          <Text style={{ fontSize: fontSize.md, color: colors.secondary }}>
            ⭐ {agency.googleRating.toFixed(1)} ({agency.googleReviewCount} reviews)
          </Text>
        )}
      </View>

      {/* Contact Info */}
      <View style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
      }}>
        <Text style={{ fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.sm }}>
          Contact Information
        </Text>
        <InfoRow label="Phone" value={agency.phonePrimary} blur={!isPremium} />
        <InfoRow label="Email" value={agency.emailGeneral} blur={!isPremium} />
        <InfoRow label="Website" value={agency.website} blur={!isPremium} />
        <InfoRow label="Address" value={agency.address} blur={!isPremium} />

        {!isPremium && (
          <Pressable style={{
            backgroundColor: colors.premium,
            padding: spacing.md,
            borderRadius: borderRadius.sm,
            alignItems: 'center',
            marginTop: spacing.sm,
          }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: fontSize.md }}>
              🔓 Unlock Contact Info — $19 AUD
            </Text>
          </Pressable>
        )}

        {isPremium && agency.phonePrimary && (
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
            <Pressable
              onPress={() => Linking.openURL(`tel:${agency.phonePrimary}`)}
              style={{
                flex: 1,
                backgroundColor: colors.success,
                padding: spacing.sm,
                borderRadius: borderRadius.sm,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>📞 Call</Text>
            </Pressable>
            {agency.emailGeneral && (
              <Pressable
                onPress={() => Linking.openURL(`mailto:${agency.emailGeneral}`)}
                style={{
                  flex: 1,
                  backgroundColor: colors.primary,
                  padding: spacing.sm,
                  borderRadius: borderRadius.sm,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>✉️ Email</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>

      {/* Details */}
      <View style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
      }}>
        <Text style={{ fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.sm }}>
          Details
        </Text>
        <InfoRow label="ABN" value={agency.abn} />
        <InfoRow label="Type" value={agency.contactType} />
        <InfoRow label="Confidence" value={`${Math.round(agency.confidenceScore * 100)}%`} />
        {agency.salaryMin && agency.salaryMax && (
          <InfoRow label="Salary Range" value={`$${agency.salaryMin} - $${agency.salaryMax} / ${agency.salaryUnit}`} />
        )}
      </View>
    </ScrollView>
  );
}
