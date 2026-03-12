import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Agency } from '../lib/types';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

function formatCategory(cat: string): string {
  return cat.replace(/-|_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

const TYPE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  direct_employer: { label: 'Direct Employer', color: '#0369a1', bg: '#e0f2fe' },
  traffic_control_company: { label: 'TC Company', color: '#7c3aed', bg: '#ede9fe' },
  tc_company: { label: 'TC Company', color: '#7c3aed', bg: '#ede9fe' },
  recruitment_agency: { label: 'Recruiter', color: '#be185d', bg: '#fce7f3' },
  client_contractor: { label: 'Contractor', color: '#92400e', bg: '#fef3c7' },
  contractor: { label: 'Contractor', color: '#92400e', bg: '#fef3c7' },
  labour_hire: { label: 'Labour Hire', color: '#9333ea', bg: '#f3e8ff' },
};

export function AgencyCard({ agency }: { agency: Agency }) {
  const router = useRouter();
  const typeInfo = agency.contactType ? TYPE_LABELS[agency.contactType] : null;

  return (
    <Pressable
      onPress={() => router.push(`/agency/${agency.id}`)}
      style={({ pressed }) => ({
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: pressed ? colors.primary : colors.border,
        opacity: pressed ? 0.95 : 1,
      })}
    >
      {/* Header row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, marginRight: spacing.sm }}>
          <Text
            style={{ fontSize: fontSize.md, fontWeight: '700', color: colors.text }}
            numberOfLines={1}
          >
            {agency.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
              {agency.city ? `${agency.city}, ` : ''}{agency.state}
            </Text>
          </View>
        </View>
        {agency.googleRating != null && agency.googleRating > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="star" size={14} color="#f59e0b" />
            <Text style={{ fontSize: fontSize.sm, fontWeight: '600', color: colors.text }}>
              {agency.googleRating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Tags row */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.sm }}>
        {typeInfo && (
          <View style={{
            backgroundColor: typeInfo.bg,
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: borderRadius.full,
          }}>
            <Text style={{ fontSize: 11, color: typeInfo.color, fontWeight: '600' }}>
              {typeInfo.label}
            </Text>
          </View>
        )}

        <View style={{
          backgroundColor: colors.surfaceSecondary,
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: borderRadius.full,
        }}>
          <Text style={{ fontSize: 11, color: colors.textSecondary, fontWeight: '500' }}>
            {formatCategory(agency.category)}
          </Text>
        </View>

        {agency.eligible88Days && (
          <View style={{
            backgroundColor: '#dcfce7',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: borderRadius.full,
          }}>
            <Text style={{ fontSize: 11, color: '#16a34a', fontWeight: '600' }}>
              Visa 417
            </Text>
          </View>
        )}

        {agency.eligible88Days462 && (
          <View style={{
            backgroundColor: '#fef3c7',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: borderRadius.full,
          }}>
            <Text style={{ fontSize: 11, color: '#d97706', fontWeight: '600' }}>
              Visa 462
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: spacing.sm }}>
        <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
      </View>
    </Pressable>
  );
}
