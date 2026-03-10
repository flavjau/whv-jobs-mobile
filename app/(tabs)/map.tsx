import { View, Text, ActivityIndicator } from 'react-native';
import { useAgencies } from '../../hooks/use-agencies';
import { colors, spacing, fontSize } from '../../constants/theme';

export default function MapScreen() {
  const { data: agencies, isLoading } = useAgencies();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const agenciesWithCoords = agencies?.filter(a => a.latitude && a.longitude) ?? [];

  // react-native-maps requires native build (not available in Expo Go on Android)
  // For now, show a placeholder with stats
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.lg }}>
      <Text style={{ fontSize: 64, marginBottom: spacing.md }}>🗺️</Text>
      <Text style={{ fontSize: fontSize.xl, fontWeight: '700', color: colors.text, textAlign: 'center' }}>
        Map View
      </Text>
      <Text style={{ fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }}>
        {agenciesWithCoords.length} employers with location data
      </Text>
      <Text style={{ fontSize: fontSize.sm, color: colors.textTertiary, textAlign: 'center', marginTop: spacing.md }}>
        Map requires a native build.{'\n'}Use the Directory tab to browse employers.
      </Text>
    </View>
  );
}
