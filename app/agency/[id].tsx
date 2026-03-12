import { View, Text, ScrollView, Pressable, Linking, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAgency } from '../../hooks/use-agencies';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';

function InfoRow({ label, value, blur = false }: { label: string; value: string | null; blur?: boolean }) {
  if (!value) return null;
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
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

function formatLabel(str: string | null): string {
  if (!str) return '';
  return str.replace(/-|_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatConfidence(score: number): string {
  if (score > 1) return `${Math.round(score)}%`;
  return `${Math.round(score * 100)}%`;
}

export default function AgencyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: agency, isLoading, error } = useAgency(id);

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
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={{ color: colors.error, marginTop: spacing.sm }}>Failed to load employer</Text>
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
        <View style={{ flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
              {agency.city ? `${agency.city}, ` : ''}{agency.state}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="business-outline" size={16} color={colors.textSecondary} />
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{formatLabel(agency.category)}</Text>
          </View>
        </View>

        {/* Tags */}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: spacing.xs, flexWrap: 'wrap' }}>
          {agency.eligible88Days && (
            <View style={{
              backgroundColor: '#dcfce7',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: borderRadius.full,
            }}>
              <Text style={{ fontSize: 12, color: '#16a34a', fontWeight: '600' }}>88 Days — Visa 417</Text>
            </View>
          )}
          {agency.eligible88Days462 && (
            <View style={{
              backgroundColor: '#fef3c7',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: borderRadius.full,
            }}>
              <Text style={{ fontSize: 12, color: '#d97706', fontWeight: '600' }}>88 Days — Visa 462</Text>
            </View>
          )}
          {agency.isActivelyRecruiting && (
            <View style={{
              backgroundColor: '#dbeafe',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: borderRadius.full,
            }}>
              <Text style={{ fontSize: 12, color: '#2563eb', fontWeight: '600' }}>Currently Hiring</Text>
            </View>
          )}
          {agency.googleRating != null && agency.googleRating > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="star" size={16} color="#f59e0b" />
              <Text style={{ fontSize: fontSize.sm, color: colors.text, fontWeight: '600' }}>
                {agency.googleRating.toFixed(1)}
              </Text>
              {agency.googleReviewsCount != null && (
                <Text style={{ fontSize: 12, color: colors.textTertiary }}>
                  ({agency.googleReviewsCount})
                </Text>
              )}
            </View>
          )}
        </View>
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
        <InfoRow label="Phone" value={agency.phone} blur={!isPremium} />
        <InfoRow label="Email" value={agency.email} blur={!isPremium} />
        <InfoRow label="Website" value={agency.website} blur={!isPremium} />
        <InfoRow label="Address" value={agency.address} blur={!isPremium} />

        {!isPremium && (
          <Pressable style={{
            backgroundColor: colors.premium,
            padding: spacing.md,
            borderRadius: borderRadius.sm,
            alignItems: 'center',
            marginTop: spacing.md,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
          }}>
            <Ionicons name="lock-closed" size={18} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: fontSize.md }}>
              Unlock Contact Info — $19 AUD
            </Text>
          </Pressable>
        )}

        {isPremium && agency.phone && (
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
            <Pressable
              onPress={() => Linking.openURL(`tel:${agency.phone}`)}
              style={{
                flex: 1,
                backgroundColor: colors.success,
                padding: spacing.sm,
                borderRadius: borderRadius.sm,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Ionicons name="call" size={16} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '600' }}>Call</Text>
            </Pressable>
            {agency.email && (
              <Pressable
                onPress={() => Linking.openURL(`mailto:${agency.email}`)}
                style={{
                  flex: 1,
                  backgroundColor: colors.primary,
                  padding: spacing.sm,
                  borderRadius: borderRadius.sm,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Ionicons name="mail" size={16} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '600' }}>Email</Text>
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
        <InfoRow label="Type" value={formatLabel(agency.contactType)} />
      </View>
    </ScrollView>
  );
}
