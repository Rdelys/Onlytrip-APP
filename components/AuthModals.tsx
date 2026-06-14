import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export type Profil = 1 | 0; // 1 = voyageur, 0 = local

// ════════════════════════════════════════════════
// SHELL — modal centré, mirrors web .ot-modal
// ════════════════════════════════════════════════
interface ShellProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showClose?: boolean;
}

const ModalShell: React.FC<ShellProps> = ({ visible, onClose, children, showClose = true }) => {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 9, tension: 80 }),
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    } else {
      scale.setValue(0.9);
      opacity.setValue(0);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={s.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.kav}>
          <Animated.View style={[s.card, { opacity, transform: [{ scale }] }]}>
            {showClose && (
              <TouchableOpacity style={s.closeBtn} onPress={onClose} activeOpacity={0.7}>
                <FontAwesome5 name="times" size={13} color="#6b7280" />
              </TouchableOpacity>
            )}
            {children}
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// ════════════════════════════════════════════════
// BOUTON GOOGLE — mirrors .ot-btn-social
// ════════════════════════════════════════════════
const GoogleButton: React.FC<{ onPress?: () => void }> = ({ onPress }) => (
  <TouchableOpacity style={s.socialBtn} onPress={onPress} activeOpacity={0.8}>
    <FontAwesome5 name="google" size={16} color="#ea4335" />
    <Text style={s.socialBtnText}>Continuer avec Google</Text>
  </TouchableOpacity>
);

const Divider: React.FC = () => (
  <View style={s.dividerRow}>
    <View style={s.dividerLine} />
    <Text style={s.dividerText}>ou continuer avec</Text>
    <View style={s.dividerLine} />
  </View>
);

// ════════════════════════════════════════════════
// LOGIN MODAL — mirrors web #loginModal
// ════════════════════════════════════════════════
interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSubmitEmail: (email: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  visible,
  onClose,
  onSwitchToRegister,
  onSubmitEmail,
}) => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!visible) setEmail('');
  }, [visible]);

  return (
    <ModalShell visible={visible} onClose={onClose}>
      <Text style={s.title}>Bon retour !</Text>
      <Text style={s.subtitle}>Connectez-vous avec votre email, nous vous envoyons un code</Text>

      <Text style={s.fieldLabel}>
        <FontAwesome5 name="envelope" size={11} color="#374151" />  Adresse email
      </Text>
      <View style={s.inputBox}>
        <TextInput
          style={s.input}
          placeholder="vous@exemple.com"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <TouchableOpacity
        style={s.primaryBtn}
        activeOpacity={0.85}
        onPress={() => email.trim() && onSubmitEmail(email.trim())}
      >
        <LinearGradient colors={['#1C6BF4', '#1557CC']} style={s.primaryGradient}>
          <FontAwesome5 name="sign-in-alt" size={14} color="#fff" />
          <Text style={s.primaryBtnText}>Recevoir le code</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Divider />
      <GoogleButton />

      <View style={s.footerRow}>
        <Text style={s.footerText}>Pas encore de compte ? </Text>
        <TouchableOpacity onPress={onSwitchToRegister}>
          <Text style={s.footerLink}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </ModalShell>
  );
};

// ════════════════════════════════════════════════
// REGISTER MODAL — mirrors web #registerModal (2 étapes)
// ════════════════════════════════════════════════
interface RegisterModalProps {
  visible: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSubmitEmail: (email: string, profil: Profil) => void;
  /** Si fourni, ouvre directement à l'étape email avec ce profil pré-sélectionné */
  presetProfil?: Profil;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  visible,
  onClose,
  onSwitchToLogin,
  onSubmitEmail,
  presetProfil,
}) => {
  const [step, setStep] = useState<'role' | 'email'>('role');
  const [profil, setProfil] = useState<Profil>(1);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (visible) {
      if (presetProfil !== undefined) {
        setProfil(presetProfil);
        setStep('email');
      } else {
        setStep('role');
      }
      setEmail('');
    }
  }, [visible, presetProfil]);

  const selectRole = (p: Profil) => {
    setProfil(p);
    setStep('email');
  };

  return (
    <ModalShell visible={visible} onClose={onClose}>
      {step === 'role' ? (
        <>
          <Text style={s.title}>Rejoindre OnlyTrip</Text>
          <Text style={s.subtitle}>Vous êtes…</Text>

          <View style={s.roleGrid}>
            <TouchableOpacity style={s.roleCard} onPress={() => selectRole(1)} activeOpacity={0.85}>
              <FontAwesome5 name="plane-departure" size={26} color="#1C6BF4" style={s.roleIcon} />
              <Text style={s.roleName}>Voyageur</Text>
              <Text style={s.roleDesc}>Je cherche des expériences locales authentiques</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.roleCard} onPress={() => selectRole(0)} activeOpacity={0.85}>
              <FontAwesome5 name="home" size={26} color="#16a34a" style={s.roleIcon} />
              <Text style={s.roleName}>Local</Text>
              <Text style={s.roleDesc}>Je propose mes services aux voyageurs</Text>
            </TouchableOpacity>
          </View>

          <Divider />
          <GoogleButton />
        </>
      ) : (
        <>
          <TouchableOpacity style={s.backRow} onPress={() => setStep('role')} activeOpacity={0.7}>
            <FontAwesome5 name="arrow-left" size={12} color="#6b7280" />
            <Text style={s.backText}> Retour</Text>
          </TouchableOpacity>

          {profil === 1 ? (
            <View style={[s.badge, s.badgeVoyageur]}>
              <FontAwesome5 name="plane-departure" size={11} color="#1d4ed8" />
              <Text style={[s.badgeText, { color: '#1d4ed8' }]}> Voyageur</Text>
            </View>
          ) : (
            <View style={[s.badge, s.badgeLocal]}>
              <FontAwesome5 name="home" size={11} color="#15803d" />
              <Text style={[s.badgeText, { color: '#15803d' }]}> Local</Text>
            </View>
          )}

          <Text style={s.title}>Créer mon compte</Text>
          <Text style={s.subtitle}>Entrez votre email pour recevoir un code de vérification</Text>

          <Text style={s.fieldLabel}>
            <FontAwesome5 name="envelope" size={11} color="#374151" />  Adresse email
          </Text>
          <View style={s.inputBox}>
            <TextInput
              style={s.input}
              placeholder="vous@exemple.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <TouchableOpacity
            style={s.primaryBtn}
            activeOpacity={0.85}
            onPress={() => email.trim() && onSubmitEmail(email.trim(), profil)}
          >
            <LinearGradient colors={['#1C6BF4', '#1557CC']} style={s.primaryGradient}>
              <FontAwesome5 name="user-plus" size={14} color="#fff" />
              <Text style={s.primaryBtnText}>Recevoir le code</Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}

      <View style={s.footerRow}>
        <Text style={s.footerText}>Déjà un compte ? </Text>
        <TouchableOpacity onPress={onSwitchToLogin}>
          <Text style={s.footerLink}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </ModalShell>
  );
};

// ════════════════════════════════════════════════
// OTP MODAL — mirrors web #otpModal
// ════════════════════════════════════════════════
interface OtpModalProps {
  visible: boolean;
  onClose: () => void;
  email: string;
  onVerify: (code: string) => void;
}

export const OtpModal: React.FC<OtpModalProps> = ({ visible, onClose, email, onVerify }) => {
  const [code, setCode] = useState('');

  useEffect(() => {
    if (!visible) setCode('');
  }, [visible]);

  return (
    <ModalShell visible={visible} onClose={onClose}>
      <Text style={s.title}>Vérification</Text>
      <Text style={s.subtitle}>
        Un code à 6 chiffres a été envoyé à{'\n'}
        <Text style={{ fontWeight: '800', color: '#0a0a0f' }}>{email}</Text>
      </Text>

      <Text style={s.fieldLabel}>
        <FontAwesome5 name="key" size={11} color="#374151" />  Code de vérification
      </Text>
      <View style={s.inputBox}>
        <TextInput
          style={[s.input, s.otpInput]}
          placeholder="------"
          placeholderTextColor="#9ca3af"
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={setCode}
        />
      </View>

      <TouchableOpacity
        style={s.primaryBtn}
        activeOpacity={0.85}
        onPress={() => code.length === 6 && onVerify(code)}
      >
        <LinearGradient colors={['#1C6BF4', '#1557CC']} style={s.primaryGradient}>
          <FontAwesome5 name="check-circle" size={14} color="#fff" />
          <Text style={s.primaryBtnText}>Vérifier</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ModalShell>
  );
};

// ════════════════════════════════════════════════
// STYLES — mirrors web .ot-* classes
// ════════════════════════════════════════════════
const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,10,15,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  kav: { width: '100%', maxWidth: 420, alignItems: 'center' },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  title: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0a0a0f',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },

  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  inputBox: {
    backgroundColor: '#f9fafb',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  input: {
    fontSize: 15,
    color: '#0a0a0f',
    paddingVertical: 12,
  },
  otpInput: {
    textAlign: 'center',
    letterSpacing: 10,
    fontSize: 20,
    fontWeight: '800',
  },

  primaryBtn: {
    borderRadius: 100,
    overflow: 'hidden',
    marginTop: 4,
    shadowColor: '#1C6BF4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  primaryBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  dividerText: { fontSize: 12, color: '#9ca3af' },

  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 13,
    backgroundColor: '#fff',
  },
  socialBtnText: { fontSize: 14, fontWeight: '600', color: '#374151' },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  footerText: { fontSize: 12.5, color: '#6b7280' },
  footerLink: { fontSize: 12.5, color: '#1C6BF4', fontWeight: '700' },

  // Étape rôle
  roleGrid: { flexDirection: 'row', gap: 12, marginBottom: 6 },
  roleCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  roleIcon: { marginBottom: 10 },
  roleName: { fontSize: 14, fontWeight: '800', color: '#0a0a0f', marginBottom: 4 },
  roleDesc: { fontSize: 11, color: '#6b7280', textAlign: 'center', lineHeight: 15 },

  // Étape email
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backText: { fontSize: 12.5, fontWeight: '600', color: '#6b7280' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 10,
    borderWidth: 1,
  },
  badgeVoyageur: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' },
  badgeLocal: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  badgeText: { fontSize: 11, fontWeight: '700' },
});