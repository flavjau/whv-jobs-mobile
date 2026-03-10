import { useState } from 'react';
import React from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../lib/auth-context';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = React.use(AuthContext);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);

    const { error } = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          padding: spacing.lg,
          justifyContent: 'center',
          minHeight: '100%',
          gap: spacing.lg,
        }}
      >
        {/* Header */}
        <View style={{ alignItems: 'center', gap: spacing.sm }}>
          <Text style={{ fontSize: 48 }}>🎒</Text>
          <Text style={{ fontSize: fontSize.xxl, fontWeight: '800', color: colors.text }}>WHV Jobs</Text>
          <Text style={{ fontSize: fontSize.md, color: colors.textSecondary }}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: spacing.md }}>
          <TextInput
            style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              fontSize: fontSize.md,
              color: colors.text,
              borderWidth: 1,
              borderColor: colors.border,
            }}
            placeholder="Email"
            placeholderTextColor={colors.textTertiary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <TextInput
            style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              fontSize: fontSize.md,
              color: colors.text,
              borderWidth: 1,
              borderColor: colors.border,
            }}
            placeholder="Password"
            placeholderTextColor={colors.textTertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType={isSignUp ? 'newPassword' : 'password'}
          />

          {error ? (
            <Text style={{ color: colors.error, fontSize: fontSize.sm, textAlign: 'center' }}>{error}</Text>
          ) : null}

          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: loading ? colors.textTertiary : colors.primary,
              padding: spacing.md,
              borderRadius: borderRadius.md,
              alignItems: 'center',
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontSize: fontSize.md, fontWeight: '700' }}>
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Text>
            )}
          </Pressable>
        </View>

        {/* Toggle */}
        <Pressable onPress={() => { setIsSignUp(!isSignUp); setError(''); }} style={{ alignItems: 'center' }}>
          <Text style={{ color: colors.primary, fontSize: fontSize.sm }}>
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
